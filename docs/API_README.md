# 🚀 FieldScore AI - API Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
pip install fastapi uvicorn pydantic numpy joblib
```

### 2. Run the API Server

```bash
# From the project root directory
python api.py
```

Or using uvicorn directly:

```bash
uvicorn api:app --reload --host 0.0.0.0 --port 8000
```

### 3. Test the API

The API will be running at `http://localhost:8000`

**Access API Documentation:** http://localhost:8000/docs

---

## API Endpoints

### `GET /`
Health check endpoint

**Response:**
```json
{
  "message": "FieldScore AI API is running",
  "version": "1.0.0",
  "endpoints": {
    "/predict": "POST - Get farm risk score prediction",
    "/docs": "GET - API documentation"
  }
}
```

---

### `POST /predict`
Get farm risk score prediction

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
  "recommendation": "Loan application should be APPROVED with FAVORABLE TERMS...",
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

## Testing with curl

```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

---

## Testing with Python

```python
import requests

url = "http://localhost:8000/predict"

data = {
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

response = requests.post(url, json=data)
result = response.json()

print(f"Risk Score: {result['risk_score']}")
print(f"Category: {result['risk_category']}")
print(f"Recommendation: {result['recommendation']}")
```

---

## Using the Frontend

1. **Start the API** (as shown above)
2. **Open `index.html`** in your browser
3. **Click "Try Our Demo"** button in the navigation
4. **Fill in the form** (or click "Fill Sample Data")
5. **Click "Get Risk Score"**

The frontend will automatically call the API at `http://localhost:8000/predict`

---

## Model Integration

### Using Trained Model

If you have a trained model from `train_model.py`:

1. Ensure the model file exists at `models/risk_score_regressor.pkl`
2. The API will automatically load and use it
3. If the model is not found, the API falls back to rule-based prediction

### Rule-Based Prediction

When no trained model is available, the API uses a rule-based scoring system:

- **NDVI mean**: Higher = better (0-25 points)
- **NDVI slope**: Positive trend = bonus (0-15 points)
- **Rainfall deficit**: Higher = penalty (-20 to 0 points)
- **Coefficient of variation**: Higher = penalty (-15 to 0 points)
- **Soil organic carbon**: Higher = bonus (0-10 points)

---

## Deployment

### Local Development
```bash
python api.py
```

### Production with Gunicorn
```bash
pip install gunicorn
gunicorn api:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY api.py .
COPY models/ ./models/

EXPOSE 8000

CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:
```bash
docker build -t fieldscore-api .
docker run -p 8000:8000 fieldscore-api
```

### Deploy to Railway/Render

1. Push code to GitHub
2. Connect repository to Railway/Render
3. Set start command: `uvicorn api:app --host 0.0.0.0 --port $PORT`
4. Update frontend API URL to deployed endpoint

---

## CORS Configuration

The API allows all origins by default for development. For production:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Specify exact origins
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)
```

---

## Error Handling

The API returns appropriate HTTP status codes:

- **200**: Successful prediction
- **422**: Invalid input data (validation error)
- **500**: Internal server error

Example error response:
```json
{
  "detail": "Prediction error: ..."
}
```

---

## Performance

- **Latency**: < 100ms per prediction (rule-based)
- **Throughput**: 1000+ requests/minute (single worker)
- **Model inference**: < 50ms (if using trained model)

---

## Monitoring

Add logging for production:

```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.post("/predict")
async def predict(farm_data: FarmInput):
    logger.info(f"Prediction request: {farm_data.crop_type}")
    # ... rest of code
    logger.info(f"Risk score: {risk_score}")
```

---

## Troubleshooting

### Port already in use
```bash
# Kill process on port 8000 (Windows)
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Kill process on port 8000 (Linux/Mac)
lsof -ti:8000 | xargs kill
```

### Module not found
```bash
pip install -r requirements.txt
```

### CORS errors
- Ensure API is running before opening frontend
- Check browser console for specific CORS error
- Verify API URL in `assets/js/main.js` matches your server

---

## Next Steps

1. ✅ API is running and ready
2. ✅ Frontend can connect and submit predictions
3. ⏭️ Train actual model with real data
4. ⏭️ Deploy to production (Railway, Render, AWS)
5. ⏭️ Add authentication for API access
6. ⏭️ Implement caching (Redis) for repeated queries

---

**Last Updated:** December 7, 2025  
**API Version:** 1.0.0
