# 🎭 DeepDetect – AI-Powered Deepfake Detection System

DeepDetect is an AI-powered web application that detects manipulated (deepfake) images and videos using deep learning techniques. The system leverages a fine-tuned **ResNet18** model to classify media as **Real** or **Fake** and provides confidence scores along with visual explanations.

---

## 🚀 Features

### 🖼️ Image Deepfake Detection
- Upload images and detect whether they are Real or Fake.
- Supports JPG, JPEG, and PNG formats.
- Displays:
  - Prediction Result
  - Confidence Score
  - Real vs Fake Probability
  - Detection Metadata

### 🎥 Video Deepfake Detection
- Upload MP4 videos for deepfake analysis.
- Extracts key frames from the video.
- Performs frame-level classification using a trained CNN model.
- Aggregates frame predictions to generate a final video-level result.

### 📊 Visual Explanations
- Grad-CAM Heatmaps
- FFT Frequency Analysis
- Face Manipulation Heatmaps
- Probability Distribution Charts
- Confidence Gauges

### 📄 Report Generation
- Download detailed analysis reports.
- Includes prediction summary, confidence scores, and visual explanations.

---

## 🛠️ Tech Stack

### Frontend
- React.js
- CSS3
- Chart.js

### Backend
- FastAPI
- Python

### Deep Learning
- PyTorch
- ResNet18
- OpenCV
- NumPy
- Pillow

### Dataset
- Celeb-DF v2
- Custom Deepfake Image Dataset

---

## 🏗️ System Architecture

```text
Frontend (React)
        │
        ▼
FastAPI Backend
        │
        ▼
ResNet18 Deepfake Model
        │
        ├── Image Detection
        ├── Video Frame Extraction
        ├── Frame Classification
        └── Result Aggregation
```

---

## 📂 Project Structure

```text
DeepDetect/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── main.py
│   ├── model.py
│   ├── predict_utils.py
│   ├── best_resnet_model_3class.pth
│   └── results.json
│
├── datasets/
├── reports/
└── README.md
```

---

## ⚙️ Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/deepdetect.git
cd deepdetect
```

### 2️⃣ Backend Setup

```bash
cd backend

pip install -r requirements.txt

uvicorn main:app --reload
```

Backend runs on:

```text
http://localhost:8000
```

### 3️⃣ Frontend Setup

```bash
cd frontend

npm install

npm start
```

Frontend runs on:

```text
http://localhost:3000
```

---

## 🎯 Model Details

### ResNet18 Architecture

The project uses a fine-tuned ResNet18 convolutional neural network trained on deepfake datasets.

### Classification Classes

| Class | Label |
|---------|---------|
| 0 | Fake |
| 1 | Real |
| 2 | Synthetic |

For final binary classification:

```text
Fake Probability = Fake + Synthetic
Real Probability = Real
```

---

## 📈 Performance

### Image Detection

- High classification accuracy on seen and unseen datasets.
- Robust performance across multiple manipulation techniques.

### Video Detection

- Key-frame extraction based approach.
- Frame-level inference using ResNet18.
- Aggregated predictions for final video classification.

---

## 🔬 Methodology

### Image Detection Pipeline

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

### Video Detection Pipeline

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
Final Video Prediction
```

---

## 🎓 Academic Project

This project was developed as a **Mini Project for Mumbai University (Computer Engineering)** to explore the application of Deep Learning and Computer Vision techniques in multimedia forensics and deepfake detection.

---

## 👩‍💻 Author

**Deepti**  
**Tejal**
**Nandini**
**Saloni**

---
