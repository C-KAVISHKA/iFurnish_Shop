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

app = Flask(__name__)
from flask_cors import CORS
CORS(app)

# Load pre-trained data
Image_features = pkl.load(open('Image_features.pkl', 'rb'))
filenames = pkl.load(open('filenames.pkl', 'rb'))

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

# Set up the NearestNeighbors algorithm
neighbors = NearestNeighbors(n_neighbors=6, algorithm='brute', metric='euclidean')
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

    # Avoid duplicates in the recommendation list
    unique_recommended_images = []
    seen = set()
    for idx in indices[0]:
        if filenames[idx] not in seen:
            seen.add(filenames[idx])
            unique_recommended_images.append(filenames[idx])

    # Remove the query image itself from recommendations if present
    if file_path in unique_recommended_images:
        unique_recommended_images.remove(file_path)

    return jsonify({'recommendations': unique_recommended_images})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=False)

