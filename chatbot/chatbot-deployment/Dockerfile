# Use Python 3.10 as the base image
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Ensure NLTK data directory exists
RUN mkdir -p /root/nltk_data

# Manually download necessary NLTK data
RUN python -m nltk.downloader -d /root/nltk_data punkt punkt_tab

# Copy the rest of the application code
COPY . .

# Expose the port your Flask app will run on
EXPOSE 5000

# Define the command to run your Flask app
CMD ["python", "app.py"]