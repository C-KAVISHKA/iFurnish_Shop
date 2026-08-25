from flask import Flask, request, jsonify
import numpy as np
import pickle as pkl
import tensorflow as tf
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
from tensorflow.keras.preprocessing import image
from tensorflow.keras.layers import GlobalMaxPool2D
from sklearn.neighbors import NearestNeighbors
import os
import requests
from numpy.linalg import norm
from flask_cors import CORS

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

# Load pre-trained dataset data
Image_features = pkl.load(open('Image_features.pkl', 'rb'))
filenames = pkl.load(open('filenames.pkl', 'rb'))
features_array = np.array(Image_features)

# Load the ResNet50 model
base_model = ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
base_model.trainable = False
model = tf.keras.models.Sequential([base_model, GlobalMaxPool2D()])

# Global nearest neighbors across full dataset
global_neighbors = NearestNeighbors(n_neighbors=60, algorithm='brute', metric='cosine')
global_neighbors.fit(features_array)

# Catalog-specific index
catalog_items = []
catalog_features = []
catalog_neighbors = None

def build_catalog_index():
    global catalog_items, catalog_features, catalog_neighbors
    try:
        res = requests.get('http://localhost:5000/api/product/list', timeout=4)
        if res.status_code == 200 and res.json().get('success'):
            store_prods = res.json().get('products', [])
            items = []
            feats = []
            
            for prod in store_prods:
                for img_path in prod.get('image', []):
                    img_filename = img_path.replace('\\', '/').split('/')[-1].lower()
                    
                    found_idx = None
                    for idx, fn in enumerate(filenames):
                        fn_norm = fn.replace('\\', '/').lower()
                        if fn_norm.endswith('/' + img_filename) or fn_norm.endswith('\\' + img_filename) or fn_norm == img_filename:
                            found_idx = idx
                            break
                    
                    if found_idx is not None:
                        items.append({
                            '_id': prod.get('_id'),
                            'name': prod.get('name'),
                            'category': prod.get('category'),
                            'description': prod.get('description', ''),
                            'price': prod.get('price', 150),
                            'image': prod.get('image', [img_path]),
                            'dataset_path': filenames[found_idx],
                            'feature_index': found_idx
                        })
                        feats.append(features_array[found_idx])
                        break
            
            if len(items) > 0:
                catalog_items = items
                catalog_features = np.array(feats)
                catalog_neighbors = NearestNeighbors(n_neighbors=min(12, len(catalog_features)), algorithm='brute', metric='cosine')
                catalog_neighbors.fit(catalog_features)
                print(f"[AI Recommendation] Catalog index built with {len(catalog_items)} store products.")
    except Exception as e:
        print(f"[AI Recommendation] Catalog auto-sync error (will use global fallback): {e}")

# Build initial index
build_catalog_index()

def extract_features_from_images(image_path, model):
    img = image.load_img(image_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_expand_dim = np.expand_dims(img_array, axis=0)
    img_preprocess = preprocess_input(img_expand_dim)
    result = model.predict(img_preprocess, verbose=0).flatten()
    norm_result = result / norm(result)
    return norm_result

@app.route('/recommend', methods=['POST'])
def recommend():
    if 'image' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    image_file = request.files['image']
    upload_dir = 'uploads'
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)

    file_path = os.path.join(upload_dir, image_file.filename)
    image_file.save(file_path)

    # Extract 2048-D features from user query image
    input_img_features = extract_features_from_images(file_path, model)
    query_feat = input_img_features.reshape(1, -1)

    recommended_products = []
    recommended_image_paths = []
    seen_prod_ids = set()

    # 1. Prioritize real store catalog products
    if catalog_neighbors is not None and len(catalog_items) > 0:
        c_dists, c_indices = catalog_neighbors.kneighbors(query_feat)
        for d, idx in zip(c_dists[0], c_indices[0]):
            item = catalog_items[idx]
            prod_id = item['_id']
            if prod_id not in seen_prod_ids:
                seen_prod_ids.add(prod_id)
                sim_pct = max(10, min(100, round((1.0 - float(d)) * 100, 1)))
                
                prod_copy = dict(item)
                prod_copy['similarity'] = sim_pct
                prod_copy['isCatalogMatch'] = True
                recommended_products.append(prod_copy)
                recommended_image_paths.append(item['dataset_path'])

    # 2. Backfill with global dataset neighbors if needed
    if len(recommended_products) < 6:
        g_dists, g_indices = global_neighbors.kneighbors(query_feat)
        seen_distances = set()
        for d, idx in zip(g_dists[0], g_indices[0]):
            fn = filenames[idx]
            dist_rounded = round(float(d), 4)
            if dist_rounded not in seen_distances and fn != file_path and fn not in recommended_image_paths:
                seen_distances.add(dist_rounded)
                sim_pct = max(10, min(100, round((1.0 - float(d)) * 100, 1)))
                clean_path = fn.replace('\\', '/')
                
                recommended_products.append({
                    '_id': f"rec_{idx}",
                    'name': f"Similar Design {len(recommended_products) + 1}",
                    'category': "Furniture",
                    'description': "AI Visual Match for your uploaded furniture styling.",
                    'price': 160 + (len(recommended_products) * 20),
                    'image': [f"/{clean_path}"],
                    'similarity': sim_pct,
                    'isCatalogMatch': False
                })
                recommended_image_paths.append(fn)

            if len(recommended_products) >= 6:
                break

    return jsonify({
        'success': True,
        'recommendations': recommended_image_paths[:6],
        'products': recommended_products[:6]
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=False)
