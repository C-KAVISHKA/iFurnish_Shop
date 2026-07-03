import os
import numpy as np
import pickle as pkl
import tensorflow as tf
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
from tensorflow.keras.preprocessing import image
from tensorflow.keras.layers import GlobalMaxPool2D
from numpy.linalg import norm
import time

# List of all dataset directories
DATA_DIRS = ['images', 'almirah_dataset', 'fridge dataset', 'table dataset', 'tv dataset']

def get_all_image_paths():
    image_paths = []
    for d in DATA_DIRS:
        if not os.path.exists(d):
            print(f"Warning: Directory '{d}' not found.")
            continue
            
        print(f"Scanning directory: {d}")
        # Support deep traversal or shallow traversal depending on structure
        for root, dirs, files in os.walk(d):
            for file in files:
                if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                    path = os.path.join(root, file)
                    image_paths.append(path)
                    
    return image_paths

def main():
    print("Gathering all image paths...")
    image_paths = get_all_image_paths()
    print(f"Total images found: {len(image_paths)}")
    
    if len(image_paths) == 0:
        print("No images found! Exiting.")
        return

    # Load ResNet50 model
    print("Loading pre-trained ResNet50 model...")
    base_model = ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
    base_model.trainable = False
    
    # Add GlobalMaxPool2D layer as in app.py
    model = tf.keras.models.Sequential([
        base_model,
        GlobalMaxPool2D()
    ])
    
    print("Starting feature extraction (this will take several minutes)...")
    features_list = []
    processed_paths = []
    
    start_time = time.time()
    batch_size = 32
    
    # Process sequentially in batches to monitor progress
    for i in range(0, len(image_paths), batch_size):
        batch_paths = image_paths[i:i+batch_size]
        batch_images = []
        valid_paths = []
        
        for path in batch_paths:
            try:
                img = image.load_img(path, target_size=(224, 224))
                img_array = image.img_to_array(img)
                img_expand = np.expand_dims(img_array, axis=0)
                img_preprocess = preprocess_input(img_expand)
                batch_images.append(img_preprocess[0])
                valid_paths.append(path)
            except Exception as e:
                print(f"\nError processing image {path}: {e}")
                
        if len(batch_images) == 0:
            continue
            
        batch_images_array = np.array(batch_images)
        batch_features = model.predict(batch_images_array, verbose=0)
        
        for idx in range(len(batch_features)):
            feat = batch_features[idx].flatten()
            norm_feat = feat / norm(feat)
            features_list.append(norm_feat)
            processed_paths.append(valid_paths[idx])
            
        if (i + batch_size) % 320 == 0 or i + batch_size >= len(image_paths):
            elapsed = time.time() - start_time
            print(f"Processed {len(processed_paths)}/{len(image_paths)} images in {elapsed:.1f}s")

    print(f"Successfully extracted features for {len(features_list)} images.")
    
    # Save to PKL
    print("Saving features to Image_features.pkl and filenames.pkl...")
    with open('Image_features.pkl', 'wb') as f:
        pkl.dump(features_list, f)
        
    with open('filenames.pkl', 'wb') as f:
        pkl.dump(processed_paths, f)
        
    print("Done! Feature extraction complete.")

if __name__ == '__main__':
    main()
