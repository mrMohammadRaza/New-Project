# ml-service/main.py
"""
AgriFlow AI Microservice - SIH20676
Crop Disease Diagnosis Engine using FastAPI
"""

import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import datetime

app = FastAPI(
    title="AgriFlow Crop Disease AI Microservice",
    description="Microservice providing computer vision diagnosis for crop diseases (SIH20676)",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DiagnosisResponse(BaseModel):
    disease: str = Field(..., description="Identified agricultural pathogen or disease")
    pathogen_type: str = Field(default="Fungal", description="Category of pathogen")
    scientific_name: str = Field(default="Puccinia triticina / Puccinia striiformis")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Inference confidence probability score")
    status: str = Field(default="DETECTED")
    severity: str = Field(default="HIGH")
    treatment_plan: str = Field(..., description="Actionable cure and remediation instructions for farmer")
    preventative_measures: List[str] = Field(default_factory=list)
    timestamp: str = Field(default_factory=lambda: datetime.datetime.utcnow().isoformat())

@app.get("/")
def read_root():
    return {
        "service": "AgriFlow Disease Detection AI Microservice",
        "status": "active",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "fastapi_crop_ai",
        "supported_models": ["VisionTransformer-PlantVillage", "ResNet50-RustSpecialized"],
        "timestamp": datetime.datetime.utcnow().isoformat()
    }

@app.post(
    "/predict",
    response_model=DiagnosisResponse,
    status_code=status.HTTP_200_OK,
    summary="Diagnose crop leaf disease from uploaded image"
)
async def predict_crop_disease(file: UploadFile = File(...)):
    # 1. Validate file existence and MIME type
    if not file:
        raise HTTPException(status_code=400, detail="No file received.")
    
    allowed_types = ["image/jpeg", "image/png", "image/webp", "image/jpg", "application/octet-stream"]
    if file.content_type and file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported format '{file.content_type}'. Please upload JPEG, PNG or WebP images."
        )

    # 2. Read bytes for image preprocessing
    image_bytes = await file.read()
    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    # 3. Simulate Machine Learning Model Inference (Plant Pathology Vision Pipeline)
    # Returns "Leaf Rust" diagnosis and prescriptive agronomic treatment
    treatment_text = (
        "1. Fungicide Spray: Immediately apply Propiconazole 25% EC (1.0 ml per liter of water) or Tebuconazole 250 EC.\n"
        "2. Organic / Biological Control: Spray 5% Neem Seed Kernel Extract (NSKE) or Trichoderma viride bio-agent.\n"
        "3. Water Management: Cease overhead sprinkler irrigation to reduce leaf wetness period. Irrigate via drip/furrow.\n"
        "4. Sanitation: Manually excise and safely dispose of severely blistered lower leaves to curtail spore dispersal."
    )

    prevention_list = [
        "Maintain adequate plant spacing (20-25 cm) to optimize internal canopy airflow.",
        "Avoid excessive nitrogenous fertilizer application which fosters soft vegetative tissue vulnerable to rust.",
        "Utilize certified rust-resistant seed cultivars (e.g., HD-2967, DBW-187) in subsequent crop cycles."
    ]

    return DiagnosisResponse(
        disease="Leaf Rust",
        pathogen_type="Fungal (Basidiomycota)",
        scientific_name="Puccinia triticina",
        confidence=0.948,
        status="DETECTED",
        severity="HIGH",
        treatment_plan=treatment_text,
        preventative_measures=prevention_list
    )

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
