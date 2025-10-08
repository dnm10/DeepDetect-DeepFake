# backend/main.py
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from torchvision import transforms
from PIL import Image
import io
import torch
import torch.nn.functional as F
from model import load_model

app = FastAPI()

# CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # your React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = load_model("best_deepfake_model.pth", device)
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225]),
])

@app.post("/predict/")
async def predict_image(file: UploadFile = File(...)):
    """
    Accepts an uploaded image from React frontend,
    returns prediction (Real/Fake) and confidence (%).
    """
    try:
      
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img_t = transform(image).unsqueeze(0).to(device)

       
        model.eval()

        
        with torch.no_grad():
            output = model(img_t)

            
            temperature = 10.0  
            probs = F.softmax(output / temperature, dim=1).cpu().numpy()[0]
            # -----------------------------

        
        pred_idx = int(probs.argmax())
        confidence = float(probs[pred_idx]) * 100
        confidence = round(confidence, 2)
        label = "Real" if pred_idx == 0 else "Fake"

        
        print("Raw model output:", output)
        print("Softmax probs:", probs)

        return {"prediction": label, "confidence": confidence}

    except Exception as e:
        print("Error:", e)
        return {"error": f"Prediction failed: {str(e)}"}
