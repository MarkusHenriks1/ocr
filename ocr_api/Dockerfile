# Use the jitesoft image as the base
FROM jitesoft/tesseract-ocr:latest

# Switch to root to install dependencies 
USER root

# The jitesoft latest image is Ubuntu based. Install Python and Pip.
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv

# Set up a virtual environment and install Flask
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install flask werkzeug

# Copy the API script into the container
WORKDIR /app
COPY app.py .

# Override the original Tesseract entrypoint so the container stays alive serving the API
ENTRYPOINT ["python3", "app.py"]
