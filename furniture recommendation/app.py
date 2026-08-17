from flask import Flask, request, jsonify
import numpy as np
import pickle as pkl
import tensorflow as tf
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
from tensorflow.keras.preprocessing import image
from tensorflow.keras.layers import GlobalMaxPool2D
from sklearn.neighbors import NearestNeighbors
import os
from numpy.linalg import norm

app = Flask(__name__, static_folder='.', static_url_path='')
from flask_cors import CORS
CORS(app)

# Load pre-trained data
All_Image_features = pkl.load(open('Image_features.pkl', 'rb'))
All_filenames = pkl.load(open('filenames.pkl', 'rb'))

# Match against your store's actual catalog (chairs, tables, sofas, desks)
store_set = set(['chair1.jpg', 'chair2.jpg', 'chair3.jpg', 'chair4.jpg', 'chair5.jpg', 'chair6.jpg'] + [f'image_{i}.jpeg' for i in range(1, 53)])

store_indices = []
filenames = []
for idx, fn in enumerate(All_filenames):
    fn_norm = fn.replace('\\', '/')
    parts = fn_norm.split('/')
    if parts[0] == 'images' and parts[-1] in store_set:
        store_indices.append(idx)
        filenames.append(fn_norm)

if len(store_indices) > 0:
    Image_features = np.array([All_Image_features[i] for i in store_indices])
else:
    Image_features = np.array(All_Image_features)
    filenames = [f.replace('\\', '/') for f in All_filenames]

def extract_features_from_images(image_path, model):
    img = image.load_img(image_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_expand_dim = np.expand_dims(img_array, axis=0)
    img_preprocess = preprocess_input(img_expand_dim)
    result = model.predict(img_preprocess).flatten()
    norm_result = result / norm(result)
    return norm_result

# Load the ResNet50 model
model = ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
model.trainable = False
model = tf.keras.models.Sequential([model, GlobalMaxPool2D()])

# Set up the NearestNeighbors algorithm on store catalog
n_neighbors = min(len(filenames), 15)
neighbors = NearestNeighbors(n_neighbors=n_neighbors, algorithm='brute', metric='euclidean')
neighbors.fit(Image_features)

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

    # Extract features and find recommendations
    input_img_features = extract_features_from_images(file_path, model)
    distances, indices = neighbors.kneighbors([input_img_features])

    # Collect the top unique visual recommendations
    unique_recommended_images = []
    seen_files = set()
    
    for idx, dist in zip(indices[0], distances[0]):
        fn = filenames[idx].replace('\\', '/')
        # Skip if exact duplicate path or already included
        if fn in seen_files:
            continue
        # Skip exact query image if identical distance
        if dist < 0.0001 and len(unique_recommended_images) == 0:
            continue
            
        seen_files.add(fn)
        unique_recommended_images.append(fn)
        
        if len(unique_recommended_images) >= 6:
            break

    return jsonify({'recommendations': unique_recommended_images})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=False)

