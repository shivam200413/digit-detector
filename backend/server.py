from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import torch
import torch.nn as nn
from fastapi.middleware.cors import CORSMiddleware
import json
from model_class import two

class PredictionInput(BaseModel):
    image: List[float] 
    timestamp: str

class FeedbackInput(BaseModel):
    image: List[float]  # Flattened 784 pixel list
    predicted_value: int
    is_correct: bool
    timestamp: str

model = two()
model.load_state_dict(torch.load("digits_predict_best_weights.pth", map_location="cpu"))

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use specific origins in production, e.g. ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def say_hello():
    return {"hello":"hi cvam here"}

@app.post("/predict")
def predict(data: PredictionInput):
    if len(data.image) != 784:
        raise HTTPException(status_code=400, detail="Expected 784 pixels (28x28 image)")

    input_tensor = torch.tensor(data.image, dtype=torch.float32).reshape(1, 28, 28)


    with torch.no_grad():
        pred = model.pred(input_tensor.unsqueeze(dim=1)).argmax(dim=1).item()
        # output = model(input_tensor)
        # prediction = torch.argmax(output, dim=1).item()

    return {"prediction": pred}


@app.post("/feedback")
def submit_feedback(data: FeedbackInput):
    # Validate image shape
    if len(data.image) != 784:
        raise HTTPException(status_code=400, detail="Expected 784 pixel values")

    # Optional: Save feedback data to a file (e.g., JSON log)
    feedback_entry = {
        "image": data.image,
        "predicted_value": data.predicted_value,
        "is_correct": data.is_correct,
        "timestamp": data.timestamp,
    }

    # Save to feedback log file
    feedback_file = "feedback_log.jsonl"
    with open(feedback_file, "a") as f:
        f.write(json.dumps(feedback_entry) + "\n")

    return {"status": "success", "message": "Feedback received"}
