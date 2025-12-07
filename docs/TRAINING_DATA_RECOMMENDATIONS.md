# Training Data Recommendations for FieldScore AI

## Executive Summary

Based on the FieldScore AI website content, this document provides recommendations for the **training data structure** needed to build the farm risk scoring model described in the project.

---

## 🎯 Model Objective

**Primary Goal:** Predict farm-level credit risk scores (0-100) for smallholder agricultural loans

**Use Case:** Help microfinance institutions and agricultural lenders assess loan applications without expensive manual field visits

---

## 📊 Required Data Structure

### 1. Core Input Features (12 Features)

#### A. Geospatial & Farm Characteristics
```
- farm_id: Unique identifier (string)
- latitude: Farm location in decimal degrees (float)
- longitude: Farm location in decimal degrees (float)
- crop_type: Primary crop cultivated (categorical)
  Options: maize, rice, coffee, wheat, beans, cassava, tea, banana, sorghum, cotton, potato
- farm_area_hectares: Cultivated area in hectares (float, 0.5-10.0)
```

#### B. Vegetation Health Indicators (from Sentinel-2 Satellite)
```
- ndvi_mean_12mo: 12-month average NDVI (float, 0.0-1.0)
  Higher values = healthier vegetation
  
- ndvi_slope: Trend over time (float, -0.05 to 0.05)
  Positive = improving, Negative = declining
  
- ndvi_14day_delta: Recent change (float, -0.2 to 0.2)
  Short-term health indicator
  
- ndvi_anomaly_zscore: Deviation from historical mean (float, -4.0 to 4.0)
  Standard deviations from normal
  
- coefficient_of_variation: Stability measure (float, 0.0-1.0)
  Lower = more stable production
```

#### C. Environmental Factors
```
- rainfall_deficit_30day: 30-day rainfall shortfall in mm (float, 0-150)
  Higher = more severe drought
  
- soil_organic_carbon: Soil fertility percentage (float, 0.5-3.5%)
  Higher = better soil quality
```

#### D. Loan Information
```
- loan_amount_usd: Requested loan amount (float, 500-5000)
```

### 2. Target Variables

```
- risk_score: Model output (integer, 0-100)
  Higher score = Lower risk = Better creditworthiness
  
- risk_category: Classification (categorical)
  - "high": 0-30 points (reject or high interest)
  - "medium": 31-60 points (standard terms)
  - "low": 61-100 points (favorable terms)
  
- loan_outcome: Historical performance (categorical)
  - "repaid": Loan paid back successfully
  - "defaulted": Loan not repaid
```

---

## 📋 Sample Data Format

### CSV Format (training_data.csv)

```csv
farm_id,latitude,longitude,crop_type,farm_area_hectares,ndvi_mean_12mo,ndvi_slope,ndvi_14day_delta,ndvi_anomaly_zscore,rainfall_deficit_30day,coefficient_of_variation,soil_organic_carbon,loan_amount_usd,loan_outcome,risk_score,risk_category
F001,-1.2921,36.8219,maize,2.5,0.72,0.015,-0.02,-0.35,15.2,0.18,1.8,1500,repaid,75,low
F002,0.3476,32.5825,coffee,1.2,0.68,-0.008,0.03,-1.2,45.8,0.32,2.1,2500,repaid,65,low
F003,-3.3731,36.2821,wheat,5.0,0.55,-0.025,-0.08,-2.5,78.5,0.45,1.2,3000,defaulted,25,high
```

### JSON Format (training_data_schema.json)

```json
{
  "farm_id": "F001",
  "location": {
    "latitude": -1.2921,
    "longitude": 36.8219
  },
  "farm_characteristics": {
    "crop_type": "maize",
    "farm_area_hectares": 2.5
  },
  "vegetation_indicators": {
    "ndvi_mean_12mo": 0.72,
    "ndvi_slope": 0.015,
    "ndvi_14day_delta": -0.02,
    "ndvi_anomaly_zscore": -0.35,
    "coefficient_of_variation": 0.18
  },
  "environmental_factors": {
    "rainfall_deficit_30day": 15.2,
    "soil_organic_carbon": 1.8
  },
  "loan_data": {
    "loan_amount_usd": 1500,
    "loan_outcome": "repaid"
  },
  "model_output": {
    "risk_score": 75,
    "risk_category": "low"
  }
}
```

---

## 🔢 Data Collection Methods

### Satellite Data (NDVI)
**Source:** Sentinel-2 via Google Earth Engine API
- **Resolution:** 10 meters
- **Frequency:** Every 5 days
- **Timeframe:** 12 months historical
- **Processing:** Cloud masking, atmospheric correction
- **Formula:** NDVI = (NIR - Red) / (NIR + Red)

### Weather Data
**Source:** ERA5 Climate Reanalysis or OpenWeatherMap API
- **Parameters:** Precipitation, temperature, soil moisture
- **Timeframe:** 30-day historical + 7-day forecast
- **Calculation:** Rainfall deficit = Expected - Actual

### Soil Data
**Source:** ISRIC SoilGrids (global database)
- **Resolution:** 250 meters
- **Parameters:** Organic carbon, pH, texture
- **Access:** REST API or downloadable rasters

### Farm Information
**Source:** Farmer input via web form or mobile app
- Farm location (GPS or map drawing)
- Crop type selection
- Farm area estimation

### Loan History
**Source:** Microfinance institution records
- Historical loan applications
- Repayment outcomes
- Default records

---

## 📈 Risk Scoring Formula

### High Risk Indicators (Score: 0-30)
✗ NDVI mean < 0.60  
✗ NDVI slope < -0.015 (declining)  
✗ NDVI anomaly z-score < -2.0  
✗ Rainfall deficit > 60mm  
✗ Coefficient of variation > 0.40  

**Interpretation:** Poor vegetation, declining trend, severe drought  
**Recommendation:** Reject or high-interest loan

---

### Medium Risk Indicators (Score: 31-60)
○ NDVI mean 0.60-0.70  
○ NDVI slope -0.015 to 0.010  
○ NDVI anomaly -2.0 to 0.0  
○ Rainfall deficit 30-60mm  
○ CV 0.25-0.40  

**Interpretation:** Moderate health, stable or slight decline  
**Recommendation:** Standard loan terms

---

### Low Risk Indicators (Score: 61-100)
✓ NDVI mean > 0.70  
✓ NDVI slope > 0.010 (improving)  
✓ NDVI anomaly > 0.0  
✓ Rainfall deficit < 30mm  
✓ CV < 0.25  

**Interpretation:** Excellent vegetation, improving trend, adequate water  
**Recommendation:** Favorable loan terms

---

## 🤖 Machine Learning Model

### Algorithm
**Gradient Boosting** (XGBoost or LightGBM)

### Hyperparameters
```python
{
    'n_estimators': 100,
    'max_depth': 6,
    'learning_rate': 0.1,
    'min_child_weight': 1,
    'subsample': 0.8,
    'colsample_bytree': 0.8,
    'objective': 'reg:squarederror'  # For regression
}
```

### Training Strategy
- **Split:** 80% train, 20% test
- **Validation:** 5-fold cross-validation
- **Stratification:** By risk_category
- **Target Metric:** AUC-ROC > 0.75

---

## 📦 Dataset Size Requirements

### Minimum Viable Dataset
- **Records:** 1,000 farms minimum
- **Geographic Coverage:** Multiple regions (diverse climates)
- **Temporal Coverage:** At least 1 growing season (6-12 months)
- **Class Balance:** 
  - High risk: 20-30% of samples
  - Medium risk: 30-40%
  - Low risk: 30-40%

### Production-Ready Dataset
- **Records:** 5,000-10,000 farms
- **Geographic Coverage:** Multiple countries/climate zones
- **Temporal Coverage:** 2-3 years (multiple seasons)
- **Real Outcomes:** 50%+ with actual loan repayment data

---

## 🛠️ Data Pipeline Workflow

```
1. Farm Location Input
   ↓ (Farmer provides GPS or map polygon)
   
2. Satellite Data Retrieval
   ↓ (Fetch 12 months Sentinel-2 NDVI via Google Earth Engine)
   
3. Weather Data Retrieval
   ↓ (Fetch 30-day precipitation via ERA5/OpenWeatherMap)
   
4. Soil Data Retrieval
   ↓ (Query SoilGrids for organic carbon)
   
5. Feature Engineering
   ↓ (Calculate NDVI stats, anomalies, rainfall deficit, CV)
   
6. Model Inference
   ↓ (Run XGBoost model)
   
7. Risk Score Output
   ↓ (0-100 score + category + recommendation)
```

---

## 📊 Feature Importance (Expected)

Based on agricultural risk assessment principles:

1. **ndvi_anomaly_zscore** (~28%) - Strongest indicator of abnormal conditions
2. **rainfall_deficit_30day** (~21%) - Drought is major risk factor
3. **ndvi_mean_12mo** (~19%) - Overall productivity baseline
4. **ndvi_slope** (~15%) - Trend direction matters
5. **coefficient_of_variation** (~8%) - Stability indicator
6. **soil_organic_carbon** (~5%) - Soil fertility
7. **Other features** (~4%) - Crop type, area, loan amount

---

## 🎯 Model Performance Targets

| Metric | Target | Purpose |
|--------|--------|---------|
| **AUC-ROC** | > 0.75 | Overall discrimination |
| **Precision** | > 0.70 | Minimize false approvals |
| **Recall** | > 0.65 | Catch true high-risk cases |
| **F1-Score** | > 0.67 | Balance precision/recall |
| **RMSE** | < 15 points | Continuous score accuracy |

---

## 💡 Key Recommendations

### 1. Start with Synthetic Data
- Use the provided `training_data.csv` (50 samples) for prototyping
- Validate model architecture and API integration
- Test end-to-end pipeline

### 2. Collect Real Data
- Partner with 3-5 microfinance institutions
- Retrospectively collect historical loan data
- Match loans to satellite imagery dates
- Aim for 1,000+ real farm records

### 3. Expand Gradually
- Add more geographic regions (different climates)
- Include multiple crop types
- Extend temporal coverage (2-3 years)
- Target 5,000-10,000 farms for production model

### 4. Enhance Features
- Add time-series forecasting (LSTM for future NDVI)
- Include distance to markets/roads
- Incorporate farm management practices
- Add crop insurance claims data

### 5. Handle Edge Cases
- Clouds obscuring satellite data → Use interpolation or last valid observation
- New farms with no history → Use regional averages
- Uncommon crops → Group into categories (cereals, legumes, cash crops)

---

## 📚 Resources

### APIs & Data Sources
- **Google Earth Engine:** https://earthengine.google.com/
- **Sentinel-2 Data:** https://scihub.copernicus.eu/
- **ERA5 Weather:** https://cds.climate.copernicus.eu/
- **SoilGrids:** https://soilgrids.org/

### Code Examples
- **Training Script:** `data/train_model.py`
- **Schema Documentation:** `data/training_data_schema.json`
- **Full Documentation:** `docs/DATA_DOCUMENTATION.md`

---

## ✅ Quick Checklist

- [x] Understand 12 input features required
- [x] Know 3 target variables (risk_score, risk_category, loan_outcome)
- [x] Review sample CSV data format
- [x] Understand risk scoring logic (high/medium/low)
- [x] Learn data collection methods (satellite, weather, soil)
- [x] Set model performance targets (AUC > 0.75)
- [ ] Collect real farm loan data (1,000+ records)
- [ ] Train production model with real data
- [ ] Validate with microfinance institutions

---

**Last Updated:** December 7, 2025  
**Author:** FieldScore AI Team  
**Contact:** See PROJECT_STRUCTURE.md for team details
