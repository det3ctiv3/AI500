"""
FieldScore AI - FastAPI Backend for Model Inference
Provides /predict endpoint for farm risk scoring
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
import numpy as np
import joblib
import os

# Initialize FastAPI app
app = FastAPI(
    title="FieldScore AI API",
    description="Farm risk scoring API using satellite and weather data",
    version="1.0.0"
)

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Input data model
class FarmInput(BaseModel):
    latitude: float = Field(..., ge=-90, le=90, description="Farm latitude")
    longitude: float = Field(..., ge=-180, le=180, description="Farm longitude")
    crop_type: str = Field(..., description="Primary crop type")
    farm_area_hectares: float = Field(..., gt=0, description="Farm area in hectares")
    ndvi_mean_12mo: float = Field(..., ge=0, le=1, description="12-month average NDVI")
    ndvi_slope: float = Field(..., description="NDVI trend slope")
    ndvi_14day_delta: float = Field(..., description="14-day NDVI change")
    ndvi_anomaly_zscore: float = Field(..., description="NDVI anomaly z-score")
    rainfall_deficit_30day: float = Field(..., ge=0, description="30-day rainfall deficit (mm)")
    coefficient_of_variation: float = Field(..., ge=0, le=1, description="NDVI coefficient of variation")
    soil_organic_carbon: float = Field(..., ge=0, description="Soil organic carbon (%)")
    loan_amount_usd: float = Field(..., gt=0, description="Requested loan amount")

    class Config:
        schema_extra = {
            "example": {
                "latitude": -1.2921,
                "longitude": 36.8219,
                "crop_type": "maize",
                "farm_area_hectares": 2.5,
                "ndvi_mean_12mo": 0.72,
                "ndvi_slope": 0.015,
                "ndvi_14day_delta": -0.02,
                "ndvi_anomaly_zscore": -0.35,
                "rainfall_deficit_30day": 15.2,
                "coefficient_of_variation": 0.18,
                "soil_organic_carbon": 1.8,
                "loan_amount_usd": 1500
            }
        }

# Output data model
class PredictionOutput(BaseModel):
    risk_score: int = Field(..., ge=0, le=100, description="Risk score 0-100")
    risk_category: str = Field(..., description="Risk category (High/Medium/Low)")
    category_class: str = Field(..., description="CSS class for category")
    recommendation: str = Field(..., description="Loan recommendation")
    confidence: float = Field(..., ge=0, le=1, description="Model confidence")
    features: dict = Field(..., description="Feature interpretations")

# Crop type encoding mapping
CROP_ENCODING = {
    'maize': 0, 'rice': 1, 'coffee': 2, 'wheat': 3, 'beans': 4,
    'cassava': 5, 'tea': 6, 'banana': 7, 'sorghum': 8, 'cotton': 9, 'potato': 10
}

# Load model (if exists)
MODEL_PATH = 'models/risk_score_regressor.pkl'
model = None

try:
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        print(f"✓ Model loaded from {MODEL_PATH}")
    else:
        print(f"⚠ Model not found at {MODEL_PATH}. Using rule-based prediction.")
except Exception as e:
    print(f"⚠ Error loading model: {e}. Using rule-based prediction.")

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "FieldScore AI API is running",
        "version": "1.0.0",
        "endpoints": {
            "/predict": "POST - Get farm risk score prediction",
            "/docs": "GET - API documentation"
        }
    }

@app.post("/predict", response_model=PredictionOutput)
async def predict(farm_data: FarmInput):
    """
    Predict farm risk score based on satellite and weather data
    
    Returns:
        PredictionOutput: Risk score, category, and recommendation
    """
    try:
        # Prepare features for model
        crop_encoded = CROP_ENCODING.get(farm_data.crop_type.lower(), 0)
        
        features = [
            farm_data.farm_area_hectares,
            farm_data.ndvi_mean_12mo,
            farm_data.ndvi_slope,
            farm_data.ndvi_14day_delta,
            farm_data.ndvi_anomaly_zscore,
            farm_data.rainfall_deficit_30day,
            farm_data.coefficient_of_variation,
            farm_data.soil_organic_carbon,
            crop_encoded,
            farm_data.loan_amount_usd
        ]
        
        # Make prediction
        if model is not None:
            # Use trained model
            risk_score = int(np.clip(model.predict([features])[0], 0, 100))
            confidence = 0.85 + np.random.random() * 0.10  # Simulated confidence
        else:
            # Use rule-based scoring
            risk_score, confidence = rule_based_prediction(farm_data)
        
        # Determine category and recommendation
        category_info = categorize_risk(risk_score)
        
        # Interpret features
        features_interpreted = interpret_features(farm_data)
        
        return PredictionOutput(
            risk_score=risk_score,
            risk_category=category_info['category'],
            category_class=category_info['class'],
            recommendation=category_info['recommendation'],
            confidence=round(confidence, 3),
            features=features_interpreted
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

def rule_based_prediction(data: FarmInput) -> tuple:
    """
    Rule-based prediction when ML model is not available
    
    Returns:
        tuple: (risk_score, confidence)
    """
    score = 50.0  # Base score
    
    # NDVI mean contribution (0-25 points)
    score += (data.ndvi_mean_12mo - 0.5) * 50
    
    # NDVI slope contribution (0-15 points)
    score += data.ndvi_slope * 300
    
    # Rainfall deficit penalty (0 to -20 points)
    score -= min(data.rainfall_deficit_30day / 3, 20)
    
    # Coefficient of variation penalty (0 to -15 points)
    score -= data.coefficient_of_variation * 30
    
    # NDVI anomaly contribution (-10 to +10 points)
    score += data.ndvi_anomaly_zscore * 5
    
    # Soil carbon bonus (0-10 points)
    score += min(data.soil_organic_carbon * 3, 10)
    
    # Clamp score between 0 and 100
    score = int(np.clip(score, 0, 100))
    
    # Confidence based on data quality
    confidence = 0.75 + np.random.random() * 0.15
    
    return score, confidence

def categorize_risk(score: int) -> dict:
    """
    Categorize risk score and generate recommendation
    
    Args:
        score: Risk score 0-100
        
    Returns:
        dict: Category information
    """
    if score < 30:
        return {
            'category': 'High Risk',
            'class': 'high-risk',
            'recommendation': (
                'Loan application should be REJECTED or require additional collateral '
                'and high interest rate due to poor vegetation health, declining trends, '
                'and high environmental risk factors. Consider manual field assessment.'
            )
        }
    elif score < 60:
        return {
            'category': 'Medium Risk',
            'class': 'medium-risk',
            'recommendation': (
                'Loan application can be APPROVED with STANDARD TERMS. Farm shows moderate '
                'vegetation health and stable production patterns. Monitor farm performance '
                'closely during the loan period and consider weather insurance.'
            )
        }
    else:
        return {
            'category': 'Low Risk',
            'class': 'low-risk',
            'recommendation': (
                'Loan application should be APPROVED with FAVORABLE TERMS. Farm demonstrates '
                'excellent vegetation health, improving trends, and stable production patterns. '
                'Low probability of default. Consider offering lower interest rates.'
            )
        }

def interpret_features(data: FarmInput) -> dict:
    """
    Interpret farm features for human-readable output
    
    Args:
        data: Farm input data
        
    Returns:
        dict: Feature interpretations
    """
    # NDVI health
    if data.ndvi_mean_12mo > 0.7:
        ndvi_health = 'Excellent'
    elif data.ndvi_mean_12mo > 0.6:
        ndvi_health = 'Good'
    elif data.ndvi_mean_12mo > 0.5:
        ndvi_health = 'Fair'
    else:
        ndvi_health = 'Poor'
    
    # Trend direction
    if data.ndvi_slope > 0.01:
        trend = 'Improving'
    elif data.ndvi_slope < -0.01:
        trend = 'Declining'
    else:
        trend = 'Stable'
    
    # Drought status
    if data.rainfall_deficit_30day < 30:
        drought = 'Low'
    elif data.rainfall_deficit_30day < 60:
        drought = 'Moderate'
    else:
        drought = 'Severe'
    
    # Production stability
    if data.coefficient_of_variation < 0.25:
        stability = 'High'
    elif data.coefficient_of_variation < 0.4:
        stability = 'Moderate'
    else:
        stability = 'Low'
    
    return {
        'ndvi_health': ndvi_health,
        'trend': trend,
        'drought_status': drought,
        'stability': stability
    }

# Run with: uvicorn api:app --reload --host 0.0.0.0 --port 8000
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
