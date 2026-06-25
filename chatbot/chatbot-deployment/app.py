from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import nltk
nltk.download('punkt')

from chat import get_response

app = Flask(__name__)
CORS(app)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    message = data.get("message", "")
    response = get_response(message)  
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002)