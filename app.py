from flask import Flask, request, jsonify, render_template
from groq import Groq
import os
import re
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()
    topic = data.get("topic", "")
    prompt = f"Give me ONLY a list of 20 trending and creative hashtags for the topic '{topic}'. No descriptions. Just hashtags separated by spaces."

    response = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=150
    )

    raw_output = response.choices[0].message.content
    hashtags = re.findall(r"#\w+", raw_output)
    return jsonify({"hashtags": hashtags})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
