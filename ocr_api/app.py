from flask import Flask, request, jsonify
import subprocess
import os
import uuid

app = Flask(__name__)


@app.route("/ocr", methods=["POST"])
def process_image():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]

    # Save the incoming image to a temporary file
    input_path = f"/tmp/{uuid.uuid4().hex}.png"
    file.save(input_path)

    try:
        # Call the Tesseract CLI installed in the Docker image
        # Using 'stdout' tells Tesseract to return text directly rather than saving to a file
        result = subprocess.run(
            ["tesseract", input_path, "stdout"],
            capture_output=True,
            text=True,
            check=True,
        )
        return jsonify({"text": result.stdout.strip()})

    except subprocess.CalledProcessError as e:
        return jsonify({"error": "OCR failed", "details": e.stderr}), 500
    finally:
        # Clean up the temporary file
        if os.path.exists(input_path):
            os.remove(input_path)


if __name__ == "__main__":
    # Run the server on all network interfaces
    app.run(host="0.0.0.0", port=5000)
