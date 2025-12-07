# FieldScore AI - Training Data Documentation

## Overview

This document describes the data structure, features, and requirements for training the FieldScore AI risk scoring model. The model predicts farm-level credit risk (0-100 score) for smallholder agricultural loans using satellite imagery, weather data, and farm characteristics.

---

## Dataset Structure

### Files Included

1. **training_data.csv** - Main training dataset (50 sample records)
2. **training_data_schema.json** - Detailed schema with metadata and examples
3. **train_model.py** - Python script for model training

### Data Sources

The training data combines multiple data sources:

- **Sentinel-2 Satellite Imagery**: 10m resolution NDVI (Normalized Difference Vegetation Index) time series
- **ERA5 Climate Reanalysis**: Historical weather data (precipitation, temperature)
- **SoilGrids**: Soil property data (organic carbon, texture)
- **Loan Performance Records**: Historical loan outcomes (repaid/defaulted)

---

## Feature Descriptions

### 1. Identification & Location

| Feature | Type | Description | Example |
|---------|------|-------------|---------|
| `farm_id` | string | Unique farm identifier | F001 |
| `latitude` | float | Farm location latitude (decimal degrees) | -1.2921 |
| `longitude` | float | Farm location longitude (decimal degrees) | 36.8219 |

### 2. Farm Characteristics

| Feature | Type | Description | Range |
|---------|------|-------------|-------|
| `crop_type` | categorical | Primary crop cultivated | maize, rice, coffee, wheat, beans, cassava, tea, banana, sorghum, cotton, potato |
| `farm_area_hectares` | float | Total cultivated area | 1.0 - 10.0 ha |

### 3. Vegetation Indicators (NDVI-based)

| Feature | Type | Description | Range | Interpretation |
|---------|------|-------------|-------|----------------|
| `ndvi_mean_12mo` | float | 12-month average NDVI | 0.0 - 1.0 | Higher = healthier vegetation |
| `ndvi_slope` | float | Trend in NDVI over time | -0.05 to 0.05 | Positive = improving, Negative = declining |
| `ndvi_14day_delta` | float | NDVI change in past 14 days | -0.15 to 0.15 | Short-term health indicator |
| `ndvi_anomaly_zscore` | float | Deviation from historical mean | -4.0 to 4.0 | Standard deviations from normal |
| `coefficient_of_variation` | float | NDVI variability measure | 0.0 - 1.0 | Lower = more stable production |

**NDVI Calculation:**
```
NDVI = (NIR - Red) / (NIR + Red)
```
Where NIR = Near-Infrared band, Red = Red band from Sentinel-2

### 4. Environmental Factors

| Feature | Type | Description | Range | Interpretation |
|---------|------|-------------|-------|----------------|
| `rainfall_deficit_30day` | float | Rainfall shortfall (mm) in 30 days | 0 - 100+ mm | Higher = more severe drought |
| `soil_organic_carbon` | float | Soil organic carbon percentage | 0.5 - 3.0% | Higher = better soil fertility |

**Rainfall Deficit Calculation:**
```
Deficit = Expected_Rainfall - Actual_Rainfall
Expected = Historical 30-year average for location & season
```

### 5. Loan Information

| Feature | Type | Description | Range |
|---------|------|-------------|-------|
| `loan_amount_usd` | float | Loan amount in USD | 1000 - 5000 |
| `loan_outcome` | categorical | Historical performance | repaid, defaulted |

### 6. Target Variables

| Feature | Type | Description | Range |
|---------|------|-------------|-------|
| `risk_score` | integer | Model output risk score | 0 - 100 (higher = lower risk) |
| `risk_category` | categorical | Risk classification | high (0-30), medium (31-60), low (61-100) |

---

## Risk Scoring Logic

### High Risk (0-30 points)
**Characteristics:**
- NDVI mean < 0.60 (poor vegetation health)
- Negative NDVI slope < -0.015 (declining trend)
- NDVI anomaly z-score < -2.0 (significant deviation)
- Rainfall deficit > 60mm (severe drought)
- Coefficient of variation > 0.40 (unstable)

**Loan Recommendation:** Reject or require additional collateral + high interest

### Medium Risk (31-60 points)
**Characteristics:**
- NDVI mean 0.60-0.70 (moderate health)
- NDVI slope -0.015 to 0.010 (stable)
- NDVI anomaly z-score -2.0 to 0.0
- Rainfall deficit 30-60mm (moderate drought)
- Coefficient of variation 0.25-0.40

**Loan Recommendation:** Approve with standard terms

### Low Risk (61-100 points)
**Characteristics:**
- NDVI mean > 0.70 (excellent health)
- Positive NDVI slope > 0.010 (improving)
- NDVI anomaly z-score > 0.0 (above normal)
- Rainfall deficit < 30mm (adequate water)
- Coefficient of variation < 0.25 (stable)

**Loan Recommendation:** Approve with favorable terms

---

## Model Training Requirements

### Algorithm
**Gradient Boosting** (XGBoost or LightGBM)

### Recommended Hyperparameters

```python
{
    'n_estimators': 100,
    'max_depth': 6,
    'learning_rate': 0.1,
    'min_child_weight': 1,
    'subsample': 0.8,
    'colsample_bytree': 0.8
}
```

### Validation Strategy

- **Method**: 5-fold cross-validation
- **Train/Test Split**: 80/20
- **Stratification**: By risk_category

### Target Performance Metrics

| Metric | Target | Purpose |
|--------|--------|---------|
| AUC-ROC | > 0.75 | Overall discrimination ability |
| Precision | > 0.70 | Minimize false positives (wrongly approved high-risk) |
| Recall | > 0.65 | Minimize false negatives (wrongly rejected low-risk) |
| F1-Score | > 0.67 | Balance precision and recall |
| RMSE | < 15 points | Continuous score accuracy |

---

## Data Collection Workflow

### Step 1: Location Input
- Farmer provides GPS coordinates or draws polygon on Leaflet.js map
- System validates GeoJSON format

### Step 2: Satellite Data Retrieval
- Fetch 12 months of Sentinel-2 NDVI using Google Earth Engine API
- Resolution: 10m
- Update frequency: Every 5 days
- Processing: Cloud masking, atmospheric correction

### Step 3: Weather Data Retrieval
- Fetch 30-day historical precipitation and temperature
- API: ERA5 Climate Reanalysis or OpenWeatherMap
- Calculate rainfall deficit vs. historical average

### Step 4: Feature Engineering
- Calculate NDVI statistics (mean, slope, delta)
- Compute anomaly detection (z-scores)
- Derive coefficient of variation
- Integrate soil data from SoilGrids

### Step 5: Model Inference
- Run trained model on engineered features
- Generate 0-100 risk score with confidence level
- Map to risk category and loan recommendation

---

## Sample Data Examples

### Low Risk Farm (Score: 85)
```json
{
  "farm_id": "F004",
  "location": {"latitude": 1.3733, "longitude": 32.2903},
  "crop_type": "rice",
  "farm_area_hectares": 3.8,
  "ndvi_mean_12mo": 0.78,
  "ndvi_slope": 0.022,
  "ndvi_14day_delta": 0.05,
  "ndvi_anomaly_zscore": 0.8,
  "rainfall_deficit_30day": 8.3,
  "coefficient_of_variation": 0.12,
  "soil_organic_carbon": 2.5,
  "loan_amount_usd": 2000,
  "loan_outcome": "repaid",
  "risk_score": 85,
  "risk_category": "low"
}
```

**Interpretation:** Excellent vegetation health (NDVI 0.78), improving trend (+0.022 slope), minimal drought (8.3mm deficit), stable production (CV 0.12). **Approve with favorable terms.**

---

### High Risk Farm (Score: 25)
```json
{
  "farm_id": "F003",
  "location": {"latitude": -3.3731, "longitude": 36.2821},
  "crop_type": "wheat",
  "farm_area_hectares": 5.0,
  "ndvi_mean_12mo": 0.55,
  "ndvi_slope": -0.025,
  "ndvi_14day_delta": -0.08,
  "ndvi_anomaly_zscore": -2.5,
  "rainfall_deficit_30day": 78.5,
  "coefficient_of_variation": 0.45,
  "soil_organic_carbon": 1.2,
  "loan_amount_usd": 3000,
  "loan_outcome": "defaulted",
  "risk_score": 25,
  "risk_category": "high"
}
```

**Interpretation:** Poor vegetation health (NDVI 0.55), declining trend (-0.025 slope), severe drought (78.5mm deficit), unstable production (CV 0.45). **Reject or require additional collateral.**

---

## Data Expansion Strategies

To improve model performance with real-world data:

### 1. Increase Dataset Size
- Target: 5,000-10,000 farm records
- Include multiple growing seasons (2-3 years)
- Cover diverse geographic regions

### 2. Add Temporal Features
- Multi-year NDVI trends
- Seasonal patterns
- Historical yield data (if available)

### 3. Incorporate External Data
- Crop insurance claims
- Market price volatility
- Distance to markets/roads
- Farm management practices

### 4. Handle Class Imbalance
- Use SMOTE for minority class oversampling
- Adjust class weights in model training
- Collect more high-risk examples

### 5. Feature Engineering
- Interaction terms (e.g., NDVI × Rainfall)
- Polynomial features for non-linear relationships
- Time-lagged features (NDVI 1 month ago, 2 months ago)

---

## Dependencies for Training

```bash
pip install pandas numpy scikit-learn xgboost lightgbm
pip install matplotlib seaborn  # For visualization
pip install geopandas rasterio  # For geospatial processing
```

---

## Running the Training Script

```bash
python data/train_model.py
```

**Output:**
- Trained model saved to `models/risk_score_regressor.pkl`
- Classification model saved to `models/risk_category_classifier.pkl`
- Feature importance analysis
- Performance metrics (R², RMSE, AUC, Precision, Recall)

---

## API Integration

Once trained, the model can be deployed via FastAPI:

```python
@app.post("/evaluate")
async def evaluate_farm(farm_data: FarmInput):
    # Load model
    model = joblib.load('models/risk_score_regressor.pkl')
    
    # Fetch satellite & weather data
    ndvi_data = fetch_sentinel2_ndvi(farm_data.coordinates)
    weather_data = fetch_weather(farm_data.coordinates)
    
    # Engineer features
    features = engineer_features(ndvi_data, weather_data, farm_data)
    
    # Predict risk score
    risk_score = model.predict([features])[0]
    
    return {
        "risk_score": risk_score,
        "risk_category": categorize_risk(risk_score),
        "recommendation": generate_recommendation(risk_score)
    }
```

---

## Questions & Support

For questions about the data or model training:
- Email: dovudasadov@example.com
- GitHub: https://github.com/DovudAsadov
- Documentation: See README.md

---

**Last Updated:** December 7, 2025  
**Version:** 1.0
