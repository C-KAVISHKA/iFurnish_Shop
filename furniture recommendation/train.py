import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.metrics import precision_score, recall_score, f1_score
import pickle as pkl

import tensorflow as tf
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
from tensorflow.keras.preprocessing.image import ImageDataGenerator, load_img, img_to_array
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau

from sklearn.neighbors import NearestNeighbors
from numpy.linalg import norm
from sklearn.manifold import TSNE

# Configuration
IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 20
LEARNING_RATE = 0.0001
DATA_DIR = 'images'  # Change this to your dataset directory

# ============================
# 1. Data Preparation
# ============================

def create_dataset(data_dir):
    """
    Create a dataset from a directory structure where each subdirectory is a class
    Returns paths and labels
    """
    image_paths = []
    labels = []
    
    # Iterate through each class directory
    for label, class_name in enumerate(sorted(os.listdir(data_dir))):
        class_dir = os.path.join(data_dir, class_name)
        if not os.path.isdir(class_dir):
            continue
            
        # Iterate through each image in the class directory
        for image_name in os.listdir(class_dir):
            image_path = os.path.join(class_dir, image_name)
            if os.path.isfile(image_path) and image_path.lower().endswith(('.png', '.jpg', '.jpeg')):
                try:
                    # Verify the image can be opened
                    img = load_img(image_path, target_size=IMAGE_SIZE)
                    image_paths.append(image_path)
                    labels.append(label)
                except Exception as e:
                    print(f"Error processing image {image_path}: {e}")
    
    return np.array(image_paths), np.array(labels)

# Create train/validation/test splits
def prepare_data_splits(image_paths, labels):
    # Split into train+val and test (80/20)
    X_train_val, X_test, y_train_val, y_test = train_test_split(
        image_paths, labels, test_size=0.2, stratify=labels, random_state=42)
    
    # Split train+val into train and val (80/20 of the 80% = 64/16)
    X_train, X_val, y_train, y_val = train_test_split(
        X_train_val, y_train_val, test_size=0.2, stratify=y_train_val, random_state=42)
    
    return X_train, y_train, X_val, y_val, X_test, y_test

# Data generators for training
def create_data_generators():
    # Training data augmentation
    train_datagen = ImageDataGenerator(
        preprocessing_function=preprocess_input,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        fill_mode='nearest'
    )
    
    # Validation/test data (no augmentation, just preprocessing)
    val_datagen = ImageDataGenerator(
        preprocessing_function=preprocess_input
    )
    
    return train_datagen, val_datagen

# ============================
# 2. Model Building
# ============================

def build_model(num_classes):
    """
    Build a fine-tunable model based on ResNet50
    """
    # Load the pre-trained model
    base_model = ResNet50(weights='imagenet', include_top=False, input_shape=(*IMAGE_SIZE, 3))
    
    # Freeze the base model layers
    for layer in base_model.layers:
        layer.trainable = False
    
    # Add custom layers on top
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(1024, activation='relu')(x)
    x = Dropout(0.5)(x)
    x = Dense(512, activation='relu')(x)
    x = Dropout(0.3)(x)
    predictions = Dense(num_classes, activation='softmax')(x)
    
    # Create the model
    model = Model(inputs=base_model.input, outputs=predictions)
    
    # Compile the model
    model.compile(
        optimizer=Adam(learning_rate=LEARNING_RATE),
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model, base_model

# ============================
# 3. Feature Extraction
# ============================

def extract_features(model, image_paths):
    """
    Extract features using the feature extraction part of the model
    """
    features = []
    # Create a feature extractor model (remove the classification head)
    feature_model = Model(inputs=model.input, outputs=model.layers[-3].output)  # Get the 512-neuron dense layer
    
    # Process images in batches
    for i in range(0, len(image_paths), BATCH_SIZE):
        batch_paths = image_paths[i:i+BATCH_SIZE]
        batch_images = []
        
        for path in batch_paths:
            try:
                img = load_img(path, target_size=IMAGE_SIZE)
                img_array = img_to_array(img)
                img_array = np.expand_dims(img_array, axis=0)
                img_array = preprocess_input(img_array)
                batch_images.append(img_array[0])
            except Exception as e:
                print(f"Error extracting features from {path}: {e}")
                # Add a placeholder of zeros if image can't be processed
                batch_images.append(np.zeros((*IMAGE_SIZE, 3)))
        
        batch_images = np.array(batch_images)
        batch_features = feature_model.predict(batch_images)
        
        # Normalize each feature vector
        for j in range(len(batch_features)):
            norm_feature = batch_features[j] / norm(batch_features[j])
            features.append(norm_feature)
        
        print(f"Processed {min(i+BATCH_SIZE, len(image_paths))}/{len(image_paths)} images")
    
    return np.array(features)

# ============================
# 4. Training
# ============================

def train_model(model, X_train, y_train, X_val, y_val):
    """
    Train the model with callbacks for best performance
    """
    # Setup the data generators
    train_datagen, val_datagen = create_data_generators()
    
    # Create training generator
    train_generator = train_datagen.flow_from_directory(
        directory=os.path.dirname(DATA_DIR),
        classes=[os.path.basename(DATA_DIR)],
        target_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='sparse',
        subset='training'
    )
    
    # Create validation generator
    val_generator = val_datagen.flow_from_directory(
        directory=os.path.dirname(DATA_DIR),
        classes=[os.path.basename(DATA_DIR)],
        target_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='sparse',
        subset='validation'
    )
    
    # Set up callbacks
    checkpoint = ModelCheckpoint(
        'best_model.h5',
        monitor='val_accuracy',
        save_best_only=True,
        mode='max',
        verbose=1
    )
    
    early_stopping = EarlyStopping(
        monitor='val_loss',
        patience=5,
        restore_best_weights=True,
        verbose=1
    )
    
    reduce_lr = ReduceLROnPlateau(
        monitor='val_loss',
        factor=0.2,
        patience=3,
        min_lr=0.00001,
        verbose=1
    )
    
    # Train the model
    history = model.fit(
        train_generator,
        steps_per_epoch=len(X_train) // BATCH_SIZE,
        epochs=EPOCHS,
        validation_data=val_generator,
        validation_steps=len(X_val) // BATCH_SIZE,
        callbacks=[checkpoint, early_stopping, reduce_lr]
    )
    
    return model, history

# ============================
# 5. Evaluation
# ============================

def evaluate_model(model, X_test, y_test):
    """
    Evaluate the model on test data
    """
    val_datagen = ImageDataGenerator(preprocessing_function=preprocess_input)
    
    test_generator = val_datagen.flow_from_directory(
        directory=os.path.dirname(DATA_DIR),
        classes=[os.path.basename(DATA_DIR)],
        target_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='sparse',
        shuffle=False
    )
    
    # Evaluate the model
    test_loss, test_acc = model.evaluate(test_generator, steps=len(X_test) // BATCH_SIZE)
    print(f"Test accuracy: {test_acc:.4f}")
    
    # Get predictions
    predictions = model.predict(test_generator, steps=len(X_test) // BATCH_SIZE)
    predicted_classes = np.argmax(predictions, axis=1)
    
    # Calculate metrics
    precision = precision_score(y_test[:len(predicted_classes)], predicted_classes, average='weighted')
    recall = recall_score(y_test[:len(predicted_classes)], predicted_classes, average='weighted')
    f1 = f1_score(y_test[:len(predicted_classes)], predicted_classes, average='weighted')
    
    print(f"Precision: {precision:.4f}")
    print(f"Recall: {recall:.4f}")
    print(f"F1 Score: {f1:.4f}")
    
    return precision, recall, f1

# ============================
# 6. Recommendation System
# ============================

def build_recommendation_system(features, image_paths, n_neighbors=5):
    """
    Build a recommendation system using the extracted features
    """
    # Initialize and fit NearestNeighbors
    neighbors = NearestNeighbors(n_neighbors=n_neighbors+1, algorithm='brute', metric='euclidean')
    neighbors.fit(features)
    
    # Save the model and data
    with open('recommendation_data.pkl', 'wb') as f:
        pkl.dump({
            'features': features,
            'image_paths': image_paths,
            'neighbors': neighbors
        }, f)
    
    return neighbors

def recommend_images(query_image_path, model, neighbors, image_paths):
    """
    Recommend similar images to the query image
    """
    # Extract features from the query image
    try:
        img = load_img(query_image_path, target_size=IMAGE_SIZE)
        img_array = img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = preprocess_input(img_array)
        
        feature_model = Model(inputs=model.input, outputs=model.layers[-3].output)
        query_features = feature_model.predict(img_array)[0]
        query_features = query_features / norm(query_features)
        
        # Find nearest neighbors
        distances, indices = neighbors.kneighbors([query_features])
        
        # Get the recommended images (exclude the first one if it's the query image)
        recommended_paths = [image_paths[idx] for idx in indices[0][1:]]
        return recommended_paths, distances[0][1:]
    
    except Exception as e:
        print(f"Error processing query image: {e}")
        return [], []

# ============================
# 7. Visualization (t-SNE)
# ============================

def visualize_tsne(features, labels, title="t-SNE Visualization of Image Features"):
    """
    Visualize the features using t-SNE
    """
    # Apply t-SNE
    tsne = TSNE(n_components=2, random_state=42, perplexity=30, n_iter=1000)
    tsne_results = tsne.fit_transform(features)
    
    # Plot the results
    plt.figure(figsize=(12, 10))
    scatter = plt.scatter(tsne_results[:, 0], tsne_results[:, 1], c=labels, cmap='viridis', alpha=0.7)
    plt.colorbar(scatter, label='Class')
    plt.title(title)
    plt.xlabel("t-SNE Component 1")
    plt.ylabel("t-SNE Component 2")
    plt.savefig('tsne_visualization.png')
    plt.show()
    
    return tsne_results

# ============================
# Main Execution
# ============================

def main():
    # 1. Prepare data
    print("Preparing dataset...")
    image_paths, labels = create_dataset(DATA_DIR)
    X_train, y_train, X_val, y_val, X_test, y_test = prepare_data_splits(image_paths, labels)
    
    # Get number of classes
    num_classes = len(np.unique(labels))
    print(f"Dataset prepared: {len(image_paths)} images, {num_classes} classes")
    
    # 2. Build model
    print("Building model...")
    model, base_model = build_model(num_classes)
    
    # 3. Train model
    print("Training model...")
    trained_model, history = train_model(model, X_train, y_train, X_val, y_val)
    
    # 4. Save the trained model
    trained_model.save('image_recommendation_model.h5')
    
    # 5. Extract features from all images for recommendation
    print("Extracting features for recommendation system...")
    features = extract_features(trained_model, image_paths)
    
    # 6. Save features and filenames
    with open('Image_features.pkl', 'wb') as f:
        pkl.dump(features, f)
    
    with open('filenames.pkl', 'wb') as f:
        pkl.dump(image_paths, f)
    
    # 7. Build recommendation system
    print("Building recommendation system...")
    neighbors = build_recommendation_system(features, image_paths)
    
    # 8. Evaluate model
    print("Evaluating model...")
    precision, recall, f1 = evaluate_model(trained_model, X_test, y_test)
    
    # 9. Visualize with t-SNE
    print("Creating t-SNE visualization...")
    tsne_results = visualize_tsne(features, labels)
    
    print("Training and setup completed!")
    return trained_model, features, image_paths, neighbors

if __name__ == "__main__":
    trained_model, features, image_paths, neighbors = main()