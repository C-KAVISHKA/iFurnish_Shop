import os
import random
import json
import nltk
nltk.download('punkt', quiet=True)
import torch

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(BASE_DIR, ".env"))
    load_dotenv()
except ImportError:
    pass

from model import NeuralNet
from nltk_utils import bag_of_words, tokenize

# --- Fallback PyTorch Model Setup ---
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

intents = None
model = None
all_words = []
tags = []

try:
    intents_path = os.path.join(BASE_DIR, 'intents.json')
    with open(intents_path, 'r') as json_data:
        intents = json.load(json_data)

    FILE = os.path.join(BASE_DIR, "data.pth")
    if os.path.exists(FILE):
        data = torch.load(FILE, map_location=device)
        input_size = data["input_size"]
        hidden_size = data["hidden_size"]
        output_size = data["output_size"]
        all_words = data['all_words']
        tags = data['tags']
        model_state = data["model_state"]

        model = NeuralNet(input_size, hidden_size, output_size).to(device)
        model.load_state_dict(model_state)
        model.eval()
except Exception as e:
    print(f"Notice: PyTorch fallback model initialization skipped: {e}")

import base64

# --- Google Gemini LLM Setup ---
DEFAULT_KEY_B64 = "QVEuQWI4Uk42TGFrSmhtdGVKdEpkT1F2OFc1QUQyQ09WdzNjVnh0TGw1dXNseENRckxWaUE="
gemini_client = None
gemini_model_name = "gemini-3.6-flash"
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

if not GEMINI_API_KEY:
    try:
        GEMINI_API_KEY = base64.b64decode(DEFAULT_KEY_B64).decode("utf-8")
    except Exception:
        GEMINI_API_KEY = ""

SYSTEM_INSTRUCTION = """You are 'Furnior', the friendly, elegant, and expert AI Assistant for iFurnish Shop (an online modern furniture store).

About iFurnish Shop:
- Products: Modern sofas, armchairs, dining tables, beds, office chairs, minimalist storage, and home decor.
- 3D AR Feature: Customers can click 'View in 3D AR' on product pages to place and view real-scale 3D furniture models inside their room using their phone's camera.
- AI Visual Search: Customers can upload a photo of any furniture they like on the 'Recommendation' page, and our AI will find similar products from our catalog.
- Shipping & Delivery: Standard delivery takes 2 to 4 business days.
- Payments: Accepts Visa, Mastercard, and Cash on Delivery (COD). COD rule: 50% advance deposit, remaining balance on delivery.
- Customization: Custom dimensions, fabrics (velvet, boucle, leather), and wood finishes (walnut, oak, teak) are available upon request.
- Contact: Email support@ifurnishshop.gmail.com | Phone/WhatsApp: +94 7762572982.

Guidelines:
- Provide helpful, friendly, and concise answers (usually 2 to 4 sentences or brief bullet points).
- Act as an interior design consultant when asked about matching colors, styles (Scandinavian, Mid-Century, Minimalist, Japandi, Industrial), and room planning.
- Answer questions in any language the user speaks.
"""

if GEMINI_API_KEY:
    try:
        from google import genai
        gemini_client = genai.Client(api_key=GEMINI_API_KEY)
        print(f"[OK] Google Gemini ({gemini_model_name}) client initialized successfully!")
    except Exception as e:
        print(f"Warning: Could not initialize Gemini client: {e}")
        gemini_client = None


def get_response_from_pytorch(msg):
    """Fallback response generator using local PyTorch intent classifier."""
    if not model or not intents:
        return "Hello! I'm your iFurnish Assistant. How can I help you furnish your home today?"

    try:
        sentence = tokenize(msg)
        X = bag_of_words(sentence, all_words)
        X = X.reshape(1, X.shape[0])
        X = torch.from_numpy(X).to(device)

        output = model(X)
        _, predicted = torch.max(output, dim=1)
        tag = tags[predicted.item()]

        probs = torch.softmax(output, dim=1)
        prob = probs[0][predicted.item()]
        if prob.item() > 0.75:
            for intent in intents['intents']:
                if tag == intent["tag"]:
                    return random.choice(intent['responses'])
    except Exception as err:
        print(f"Error in PyTorch inference: {err}")

    return "I'm here to help with all your furniture shopping, 3D AR visualization, and delivery questions. Feel free to ask me anything!"


def get_response(msg):
    """Primary response handler: tries Google Gemini first, falls back to PyTorch."""
    if not msg or not msg.strip():
        return "How can I assist you with your furniture search today?"

    # 1. Try Google Gemini
    if gemini_client:
        models_to_try = [gemini_model_name, "gemini-3.7-flash", "gemini-3.8-flash", "gemini-flash-latest"]
        for m_name in models_to_try:
            try:
                response = gemini_client.models.generate_content(
                    model=m_name,
                    contents=msg,
                    config={
                        "system_instruction": SYSTEM_INSTRUCTION,
                    }
                )
                if response and response.text:
                    return response.text.strip()
            except Exception as e:
                print(f"Gemini API attempt with {m_name} failed: {e}")
                continue

    # 2. Fallback to PyTorch
    return get_response_from_pytorch(msg)


if __name__ == "__main__":
    print("Let's chat! (type 'quit' to exit)")
    while True:
        sentence = input("You: ")
        if sentence == "quit":
            break
        resp = get_response(sentence)
        print(f"Furnior: {resp}")
