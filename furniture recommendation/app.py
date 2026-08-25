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

# Load the ResNet50 feature extraction model
base_model = ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
base_model.trainable = False
model = tf.keras.models.Sequential([base_model, GlobalMaxPool2D()])

# Global variables for catalog index
catalog_items = []
catalog_features = None
catalog_nn = None

PUBLIC_IMAGES_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'public', 'images'))
CATALOG_FEAT_FILE = os.path.join(os.path.dirname(__file__), 'catalog_features.pkl')
CATALOG_ITEMS_FILE = os.path.join(os.path.dirname(__file__), 'catalog_items.pkl')

def extract_features_from_images(image_path, model):
    img = image.load_img(image_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_expand_dim = np.expand_dims(img_array, axis=0)
    img_preprocess = preprocess_input(img_expand_dim)
    result = model.predict(img_preprocess, verbose=0).flatten()
    norm_result = result / norm(result)
    return norm_result

def sync_catalog_embeddings():
    global catalog_items, catalog_features, catalog_nn

    # 1. Try loading cached catalog embeddings
    if os.path.exists(CATALOG_FEAT_FILE) and os.path.exists(CATALOG_ITEMS_FILE):
        try:
            with open(CATALOG_FEAT_FILE, 'rb') as f:
                catalog_features = pkl.load(f)
            with open(CATALOG_ITEMS_FILE, 'rb') as f:
                catalog_items = pkl.load(f)
            
            catalog_nn = NearestNeighbors(n_neighbors=min(12, len(catalog_features)), algorithm='brute', metric='cosine')
            catalog_nn.fit(catalog_features)
            print(f"[AI Recommendation] Loaded {len(catalog_items)} verified catalog embeddings from cache.")
            return
        except Exception as e:
            print(f"[AI Recommendation] Failed loading cached embeddings: {e}")

    # 2. Extract freshly from frontend/public/images/
    print("[AI Recommendation] Extracting fresh catalog embeddings from frontend/public/images...")
    try:
        res = requests.get('http://localhost:5000/api/product/list', timeout=4)
        products = res.json().get('products', [])
    except Exception:
        products = []

    items = []
    features = []

    for p in products:
        img_rel = p.get('image', [''])[0]
        fname = os.path.basename(img_rel)
        fpath = os.path.join(PUBLIC_IMAGES_DIR, fname)
        if os.path.exists(fpath):
            try:
                feat = extract_features_from_images(fpath, model)
                items.append({
                    '_id': p['_id'],
                    'name': p['name'],
                    'category': p['category'],
                    'description': p.get('description', ''),
                    'price': p['price'],
                    'image': p['image'],
                    'filename': fname
                })
                features.append(feat)
            except Exception as err:
                print(f"Error processing {fpath}: {err}")

    if len(items) > 0:
        catalog_items = items
        catalog_features = np.array(features)
        catalog_nn = NearestNeighbors(n_neighbors=min(12, len(catalog_features)), algorithm='brute', metric='cosine')
        catalog_nn.fit(catalog_features)

        # Cache to disk
        with open(CATALOG_FEAT_FILE, 'wb') as f:
            pkl.dump(catalog_features, f)
        with open(CATALOG_ITEMS_FILE, 'wb') as f:
            pkl.dump(catalog_items, f)
        print(f"[AI Recommendation] Successfully indexed {len(catalog_items)} products.")

# Initialize index
sync_catalog_embeddings()

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

    if catalog_nn is not None and len(catalog_items) > 0:
        dists, indices = catalog_nn.kneighbors(query_feat)
        for d, idx in zip(dists[0], indices[0]):
            item = catalog_items[idx]
            prod_id = item['_id']
            if prod_id not in seen_prod_ids:
                seen_prod_ids.add(prod_id)
                # Compute visual similarity percentage
                sim_pct = max(10, min(100, round((1.0 - float(d)) * 100, 1)))
                
                prod_copy = dict(item)
                prod_copy['similarity'] = sim_pct
                prod_copy['isCatalogMatch'] = True
                recommended_products.append(prod_copy)
                recommended_image_paths.append(f"images/{item['filename']}")

            if len(recommended_products) >= 6:
                break

    return jsonify({
        'success': True,
        'recommendations': recommended_image_paths[:6],
        'products': recommended_products[:6]
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=False)
