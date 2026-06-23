# 🎭 DeepDetect-DeepFake

An AI-powered Deepfake Detection System capable of detecting manipulated images and videos using Deep Learning and Computer Vision techniques.

The project uses a fine-tuned ResNet18 model to classify media as **Real** or **Fake** and provides confidence scores along with visual analysis reports.

---

## 🚀 Features

### 🖼️ Image Deepfake Detection
- Detects manipulated and AI-generated images.
- Supports JPG, JPEG and PNG formats.
- Displays prediction confidence and probability scores.
- Generates visual explanations using Grad-CAM and frequency analysis.

### 🎥 Video Deepfake Detection
- Upload MP4 videos for analysis.
- Extracts representative frames from videos.
- Performs frame-level deepfake detection.
- Aggregates predictions for final video classification.

### 📊 Explainable AI Features
- Grad-CAM Visualization
- FFT Frequency Analysis
- Face Heatmaps
- Confidence Gauge
- Probability Distribution Charts

### 📄 Report Generation
- Download detection reports.
- Includes prediction summary and visual analysis.

---

## 🛠️ Tech Stack

### Frontend
- React.js
- CSS3
- JavaScript

### Backend
- FastAPI
- Node.js
- Express.js

### Deep Learning
- PyTorch
- ResNet18
- OpenCV
- NumPy
- Pillow

### Datasets
- Celeb-DF v2
- Custom Deepfake Image Dataset

---

## 📂 Project Structure

```text
DeepDetect-DeepFake/
│
├── backend/
│   ├── main.py
│   ├── model.py
│   ├── predict_utils.py
│   ├── analysis.py
│   ├── server.js
│   ├── results.json
│   ├── best_resnet_model_3class.pth
│   ├── best_deepfake_model.pth
│   └── requirements.txt
│
├── ui_deep/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── package-lock.json
│
├── notebooks/
│   ├── Deepfake_Image_Detection_unseen.ipynb
│   └── Video_detection_deepfake.ipynb
│
├── requirements.txt
├── package.json
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/DeepDetect-DeepFake.git

cd DeepDetect-DeepFake
```

---

## Backend Setup

```bash
cd backend

pip install -r requirements.txt

uvicorn main:app --reload
```

Backend runs on:

```text
http://localhost:8000
```

---

## Frontend Setup

```bash
cd ui_deep

npm install

npm start
```

Frontend runs on:

```text
http://localhost:3000
```

---

## 🎯 Model Architecture

The project uses a fine-tuned ResNet18 architecture trained on deepfake datasets.

### Classes

| Class | Label |
|---------|---------|
| 0 | Fake |
| 1 | Real |
| 2 | Synthetic |

Final binary classification:

```text
Fake Probability = Fake + Synthetic
Real Probability = Real
```

---

## 🔬 Detection Pipeline

### Image Detection

```text
Input Image
      │
      ▼
Preprocessing
      │
      ▼
ResNet18 Model
      │
      ▼
Softmax Probabilities
      │
      ▼
Real / Fake Prediction
```

### Video Detection

```text
Input Video
      │
      ▼
Frame Extraction
      │
      ▼
Frame Preprocessing
      │
      ▼
ResNet18 Inference
      │
      ▼
Frame Predictions
      │
      ▼
Aggregation
      │
      ▼
Final Prediction
```

---

## 📈 Results

### Image Detection
- High accuracy on seen and unseen datasets.
- Comparative analysis performed using:
  - ResNet18
  - EfficientNet
  - MobileNet

### Video Detection
- Tested on Celeb-DF v2 dataset.
- Frame-based classification using ResNet18.
- Aggregated video-level predictions.

---

## 🎓 Academic Project

Developed as a Mini Project for the Computer Engineering curriculum under Mumbai University.

The project explores the use of Deep Learning, Computer Vision, and Explainable AI techniques for multimedia forensics and deepfake detection.

---

## 👩‍💻 Author

**Deepti**
**Tejal**
**Nandini**
**Saloni**



