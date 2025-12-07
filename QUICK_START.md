# 🎉 FieldScore AI - Complete Setup Guide

## ✅ What Was Added

Your FieldScore AI website now has:

1. **Navigation Bar** - Fixed top navbar with links to all sections + "Try Our Demo" button
2. **Interactive Demo Form** - Modal popup with comprehensive farm data input
3. **Live Risk Prediction** - Real-time risk scoring with detailed results
4. **FastAPI Backend** - Python API for model inference at `/predict` endpoint

---

## 🚀 Quick Start (3 Steps)

### Step 1: Install API Dependencies

```powershell
pip install fastapi uvicorn pydantic numpy joblib
```

### Step 2: Start the API Server

```powershell
# From project root directory
python api.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### Step 3: Open the Website

```powershell
# Open index.html in your browser
start index.html
```

**That's it!** 🎊

---

## 🎯 Using the Demo

1. **Click "Try Our Demo"** button in the navigation bar
2. **Fill in the form** or click "Fill Sample Data" for quick test
3. **Click "Get Risk Score"** 
4. **View Results** - Risk score (0-100), category, and loan recommendation

---

## 📋 Demo Form Fields

The form collects 12 features for prediction:

### Basic Info
- **Latitude/Longitude** - Farm location
- **Crop Type** - Select from 11 crops
- **Farm Area** - Size in hectares
- **Loan Amount** - Requested USD

### Satellite Data (NDVI)
- **NDVI Mean (12 months)** - Vegetation health (0-1)
- **NDVI Slope** - Trend direction
- **14-day Delta** - Recent change
- **Anomaly Z-Score** - Deviation from normal
- **Coefficient of Variation** - Stability

### Environmental
- **Rainfall Deficit** - 30-day drought (mm)
- **Soil Organic Carbon** - Fertility (%)

---

## 📊 Sample Test Data

Click "Fill Sample Data" to auto-populate:

```
Location: -1.2921, 36.8219 (Central Kenya)
Crop: Maize
Area: 2.5 hectares
NDVI Mean: 0.72 (Good health)
NDVI Slope: 0.015 (Improving)
Rainfall Deficit: 15.2mm (Low drought)
→ Expected Result: Low Risk (Score ~75)
```

---

## 🤖 How the API Works

### Request Flow

```
Frontend Form → POST /predict → API Processing → Risk Score → Display Result
```

### API Endpoint

**URL:** `http://localhost:8000/predict`  
**Method:** POST  
**Content-Type:** application/json

**Request Body:**
```json
{
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
```

**Response:**
```json
{
  "risk_score": 75,
  "risk_category": "Low Risk",
  "category_class": "low-risk",
  "recommendation": "Loan application should be APPROVED...",
  "confidence": 0.892,
  "features": {
    "ndvi_health": "Excellent",
    "trend": "Improving",
    "drought_status": "Low",
    "stability": "High"
  }
}
```

---

## 🎨 Frontend Features

### Navigation Bar
- Fixed at top (scrolls with page)
- Links to all major sections
- Mobile-responsive hamburger menu
- "Try Our Demo" CTA button

### Demo Modal
- Smooth fade-in animation
- Clean, professional design
- Form validation
- Loading spinner during prediction
- Color-coded risk results:
  - 🟢 **Green** - Low Risk (61-100)
  - 🟡 **Yellow** - Medium Risk (31-60)
  - 🔴 **Red** - High Risk (0-30)

---

## 🧠 Prediction Logic

### With Trained Model
If `models/risk_score_regressor.pkl` exists, uses XGBoost model.

### Without Model (Rule-Based)
Uses intelligent scoring algorithm:

```
Base Score: 50
+ NDVI Health (0-25 points)
+ Positive Trend (0-15 points)
+ Soil Fertility (0-10 points)
- Drought Severity (0-20 points)
- Production Instability (0-15 points)
= Final Score (0-100)
```

### Risk Categories

| Score | Category | Recommendation |
|-------|----------|----------------|
| 0-30 | High Risk | Reject or require collateral |
| 31-60 | Medium Risk | Standard terms |
| 61-100 | Low Risk | Favorable terms |

---

## 📁 New Files Created

```
AI500/
├── api.py                    # FastAPI backend (NEW)
├── API_README.md             # API documentation (NEW)
├── QUICK_START.md            # This file (NEW)
├── index.html                # Updated with navbar + modal
├── assets/
│   ├── css/styles.css       # Updated with navbar/modal styles
│   └── js/main.js           # Updated with form handling
└── requirements.txt          # Updated with API dependencies
```

---

## 🔧 Testing the API

### Test with curl (PowerShell)

```powershell
curl -X POST "http://localhost:8000/predict" `
  -H "Content-Type: application/json" `
  -d '{\"latitude\": -1.2921, \"longitude\": 36.8219, \"crop_type\": \"maize\", \"farm_area_hectares\": 2.5, \"ndvi_mean_12mo\": 0.72, \"ndvi_slope\": 0.015, \"ndvi_14day_delta\": -0.02, \"ndvi_anomaly_zscore\": -0.35, \"rainfall_deficit_30day\": 15.2, \"coefficient_of_variation\": 0.18, \"soil_organic_carbon\": 1.8, \"loan_amount_usd\": 1500}'
```

### Test with Python

```python
import requests

response = requests.post(
    "http://localhost:8000/predict",
    json={
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
)

print(response.json())
```

### Interactive API Docs

Visit: **http://localhost:8000/docs**

FastAPI provides automatic interactive documentation where you can test the API directly in your browser!

---

## 🎯 What to Try

### Test Different Scenarios

**Low Risk Farm:**
```
NDVI Mean: 0.80 (Excellent)
NDVI Slope: 0.020 (Improving)
Rainfall Deficit: 10mm (Minimal)
→ Expected: Score 85+ (Low Risk)
```

**High Risk Farm:**
```
NDVI Mean: 0.50 (Poor)
NDVI Slope: -0.030 (Declining)
Rainfall Deficit: 80mm (Severe drought)
→ Expected: Score 25 (High Risk)
```

---

## ⚠️ Troubleshooting

### API not starting?

```powershell
# Check if port 8000 is in use
netstat -ano | findstr :8000

# Kill the process if needed
taskkill /PID <PID> /F
```

### Frontend can't connect to API?

1. Verify API is running: http://localhost:8000
2. Check browser console for errors (F12)
3. Ensure no CORS errors

### "Module not found" error?

```powershell
pip install -r requirements.txt
```

---

## 🚀 Next Steps

### Development
- ✅ Frontend with navbar and demo form
- ✅ Backend API with prediction endpoint
- ✅ Mock prediction working
- ⏭️ Train real ML model with data
- ⏭️ Integrate Google Earth Engine for live satellite data

### Deployment
- ⏭️ Deploy backend to Railway/Render
- ⏭️ Deploy frontend to Netlify/Vercel
- ⏭️ Update API URL in JavaScript
- ⏭️ Add API authentication

---

## 📚 Documentation

- **API Documentation:** `API_README.md`
- **Data Guide:** `docs/DATA_DOCUMENTATION.md`
- **Training Data:** `docs/TRAINING_DATA_RECOMMENDATIONS.md`
- **Project Structure:** `PROJECT_STRUCTURE.md`

---

## 🎉 Success!

You now have a **fully functional** FieldScore AI demo with:
- ✅ Professional website with navigation
- ✅ Interactive demo form
- ✅ Working Python API
- ✅ Real-time risk predictions
- ✅ Beautiful result display

**Try it out now!** 🚀

---

**Created:** December 7, 2025  
**Team:** FieldScore AI
