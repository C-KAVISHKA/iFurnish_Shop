import os
import numpy as np
import pickle as pkl
import matplotlib.pyplot as plt
from sklearn.manifold import TSNE
from sklearn.neighbors import NearestNeighbors
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
from tensorflow.keras.preprocessing import image
from tensorflow.keras.layers import GlobalMaxPooling2D
import tensorflow as tf

# Load the saved image features and filenames
image_features = pkl.load(open('Image_features.pkl', 'rb'))
filenames = pkl.load(open('filenames.pkl', 'rb'))

# Convert image_features to a NumPy array
image_features_array = np.array(image_features)

# Ensure the shape is valid for TSNE
if len(image_features_array.shape) == 1:
    image_features_array = image_features_array.reshape(-1, 1)

# Load the trained model
model = ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
model.trainable = False
model = tf.keras.Sequential([model, GlobalMaxPooling2D()])

# Function to extract features from an image
def extract_features_from_images(image_path, model):
    img = image.load_img(image_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_expand_dim = np.expand_dims(img_array, axis=0)
    img_preprocessed = preprocess_input(img_expand_dim)
    result = model.predict(img_preprocessed).flatten()
    norm_result = result / np.linalg.norm(result)
    return norm_result

# Finding similar images
neighbors = NearestNeighbors(n_neighbors=6, algorithm='brute', metric='euclidean')
neighbors.fit(image_features_array)

# Function to calculate Precision@K
def precision_at_k(query_image_path, model, k=5):
    query_features = extract_features_from_images(query_image_path, model)
    distances, indices = neighbors.kneighbors([query_features])
    retrieved_images = [filenames[idx] for idx in indices[0][:k]]
    
    query_image_name = os.path.basename(query_image_path)
    
    # Extract category from filename (assuming folder structure contains category)
    try:
        query_category = query_image_path.split('/')[-2]
        correct_matches = sum(1 for img in retrieved_images if img.split('/')[-2] == query_category)
        return correct_matches / k
    except IndexError:
        print(f"Error processing image: {query_image_path}")
        return 0.0

# Test Precision@K
query_images = ['chair3.jpg', 'chair1.jpg', 'chair5.jpg']  # Replace with actual image paths
precision_scores = [precision_at_k(img, model, k=5) for img in query_images]

# Print results
print(f"Precision@5 Scores: {precision_scores}")
print(f"Average Precision@5: {np.mean(precision_scores):.2f}")

# Visualizing features with TSNE
tsne = TSNE(n_components=2, perplexity=5, random_state=42)  # Lower perplexity if dataset is small
image_features_2D = tsne.fit_transform(image_features_array)

# Plot TSNE visualization
plt.figure(figsize=(10, 6))
plt.scatter(image_features_2D[:, 0], image_features_2D[:, 1], alpha=0.5)
plt.title("TSNE Visualization of Image Features")
plt.xlabel("TSNE Component 1")
plt.ylabel("TSNE Component 2")
plt.show()
