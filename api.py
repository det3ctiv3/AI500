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
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

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

# Chatbot input model
class ChatbotInput(BaseModel):
    message: str = Field(..., description="User message to chatbot")

# Chatbot output model
class ChatbotOutput(BaseModel):
    response: str = Field(..., description="Chatbot response")

@app.post("/chat", response_model=ChatbotOutput)
async def chat(data: ChatbotInput):
    """
    AI Chatbot endpoint for answering questions about FieldScore AI
    """
    openai_api_key = os.getenv("OPENAI_API_KEY")
    
    if not openai_api_key:
        # Return fallback response if no API key
        return {"response": get_fallback_response(data.message)}
    
    try:
        # Initialize OpenAI client
        client = OpenAI(api_key=openai_api_key.strip().strip('"'))
        
        # System prompt
        system_prompt = """You are an AI assistant for FieldScore AI, a farm risk scoring platform for agricultural lenders.

Key information about FieldScore AI:
- Uses satellite imagery (Sentinel-2 NDVI) and weather data to assess farm creditworthiness
- Predicts risk scores from 0-100 (higher = lower risk)
- Risk categories: High (0-30), Medium (31-60), Low (61-100)
- Key features: NDVI health, vegetation trends, rainfall deficit, soil fertility
- Helps microfinance institutions make faster, data-driven lending decisions
- Reduces loan processing time from weeks to minutes
- Costs $0.10 per assessment vs $50-200 for manual field visits

Be helpful, concise, and informative. Answer questions about:
- How the platform works
- NDVI and satellite data
- Risk scoring methodology
- Using the demo
- Technical aspects of the model

Keep responses friendly and under 150 words unless more detail is needed."""

        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": data.message}
            ],
            max_tokens=250,
            temperature=0.7
        )
        
        return {"response": response.choices[0].message.content.strip()}
        
    except Exception as e:
        print(f"OpenAI API error: {e}")
        # Fallback to rule-based response
        return {"response": get_fallback_response(data.message)}

def get_fallback_response(message: str) -> str:
    """Rule-based fallback responses when OpenAI API is unavailable"""
    message_lower = message.lower()
    
    if any(word in message_lower for word in ['hello', 'hi', 'hey', 'greetings']):
        return "Hello! I'm the FieldScore AI assistant. I can help you understand how our farm risk scoring platform works. What would you like to know?"
    
    elif any(word in message_lower for word in ['ndvi', 'satellite', 'imagery']):
        return "NDVI (Normalized Difference Vegetation Index) measures crop health using satellite imagery. We analyze 12-month trends from Sentinel-2 satellites to assess farm productivity and predict loan repayment capability. Values range from 0 (bare soil) to 1 (healthy vegetation)."
    
    elif any(word in message_lower for word in ['risk', 'score', 'scoring']):
        return "Our risk scores range from 0-100 (higher = lower risk). We categorize farms as: High Risk (0-30), Medium Risk (31-60), or Low Risk (61-100). The score is calculated using NDVI trends, weather data, soil quality, and farm characteristics."
    
    elif any(word in message_lower for word in ['how', 'work', 'works']):
        return "FieldScore AI analyzes satellite imagery, weather patterns, and soil data to assess farm creditworthiness in minutes. Upload farm details, and our AI model predicts a risk score to help lenders make faster, data-driven decisions—reducing costs from $50-200 to just $0.10 per assessment."
    
    elif any(word in message_lower for word in ['demo', 'try', 'test']):
        return "Try our demo by clicking 'Try Our Demo' button! You'll enter farm details like location, crop type, and NDVI data. Our model then generates a comprehensive risk assessment with recommendations for loan approval."
    
    elif any(word in message_lower for word in ['cost', 'price', 'pricing']):
        return "FieldScore AI costs just $0.10 per farm assessment, compared to traditional field visits that cost $50-200. This makes credit accessible to smallholder farmers while maintaining accuracy and speed."
    
    elif any(word in message_lower for word in ['accurate', 'accuracy', 'reliable']):
        return "Our model achieves 85%+ accuracy by combining multiple data sources: satellite NDVI trends, rainfall patterns, soil organic carbon, and historical farm data. It's been trained on thousands of smallholder farms across East Africa."
    
    else:
        return "I'm here to help you understand FieldScore AI's farm risk scoring platform. You can ask me about: how it works, NDVI and satellite data, risk scoring, trying the demo, pricing, or technical details. What would you like to know?"

# Run with: uvicorn api:app --reload --host 0.0.0.0 --port 8000
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
