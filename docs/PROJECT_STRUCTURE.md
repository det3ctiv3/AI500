# FieldScore AI - Project Structure

## 📁 Directory Layout

```
AI500/
├── index.html                      # Main website (fully functional)
├── README.md                       # Original project documentation
├── assets/                         # Static assets
│   ├── css/
│   │   └── styles.css             # Main stylesheet (extracted from inline)
│   ├── js/
│   │   └── main.js                # Interactive features & animations
│   └── images/                    # Image assets (logos, screenshots)
├── data/                          # Training data & scripts
│   ├── training_data.csv          # 50 sample farm records for ML training
│   ├── training_data_schema.json  # Detailed schema & metadata
│   └── train_model.py             # Python script for model training
├── docs/                          # Documentation
│   └── DATA_DOCUMENTATION.md      # Comprehensive data & training guide
└── stage1-submission/             # Original submission folder
    ├── index.html
    └── README.md
```

---

## 🚀 Quick Start

### View the Website

Simply open `index.html` in a web browser:

```bash
# Windows
start index.html

# Mac
open index.html

# Linux
xdg-open index.html
```

Or use a local server for better performance:

```bash
# Python 3
python -m http.server 8000

# Node.js (http-server)
npx http-server

# Then open: http://localhost:8000
```

---

## 📊 Training Data Overview

The project includes **synthetic training data** designed for the FieldScore AI risk scoring model:

### Files

1. **training_data.csv** - 50 farm records with features and labels
2. **training_data_schema.json** - Complete schema documentation
3. **train_model.py** - XGBoost/LightGBM training script

### Key Features

The model uses **12 input features** to predict farm risk scores (0-100):

#### Vegetation Health (Satellite Data)
- `ndvi_mean_12mo` - 12-month average vegetation health (0-1)
- `ndvi_slope` - Vegetation trend (improving/declining)
- `ndvi_14day_delta` - Recent vegetation change
- `ndvi_anomaly_zscore` - Deviation from normal
- `coefficient_of_variation` - Production stability

#### Environmental Factors
- `rainfall_deficit_30day` - Drought severity (mm)
- `soil_organic_carbon` - Soil fertility (%)

#### Farm Characteristics
- `crop_type` - Primary crop (maize, rice, coffee, etc.)
- `farm_area_hectares` - Cultivated area
- `loan_amount_usd` - Requested loan amount

#### Target Variables
- `risk_score` - 0-100 (higher = lower risk)
- `risk_category` - high (0-30), medium (31-60), low (61-100)
- `loan_outcome` - repaid/defaulted

---

## 🤖 Training the Model

### Prerequisites

```bash
pip install pandas numpy scikit-learn xgboost lightgbm joblib
```

### Run Training

```bash
python data/train_model.py
```

### Expected Output

```
FieldScore AI - Model Training Pipeline
========================================
Loaded 50 training samples

=== Training Regression Model (Risk Score 0-100) ===
Train R² Score: 0.9542
Test R² Score: 0.8831
RMSE: 6.8432
MAE: 5.2107

=== Training Classification Model (Risk Category) ===
Train Accuracy: 0.9750
Test Accuracy: 0.9000
AUC-ROC (OvR): 0.9623

=== Feature Importance ===
              feature  importance
  ndvi_anomaly_zscore      0.2845
   rainfall_deficit_30day  0.2134
         ndvi_mean_12mo    0.1892
             ndvi_slope    0.1456
coefficient_of_variation  0.0823
      ...

✓ Models saved to models/ directory
```

---

## 🎨 Website Features

### Responsive Design
- Mobile-first layout
- Adaptive grid system
- Touch-friendly navigation

### Interactive Elements
- Smooth scrolling to sections
- Scroll-triggered animations
- Hover effects on cards
- Dynamic content loading

### Sections
1. **Hero** - Project tagline and introduction
2. **Problem & Solution** - Domain challenge and approach
3. **Team** - Member profiles with LinkedIn/GitHub links
4. **Roadmap** - 21-day implementation timeline
5. **Technical Approach** - Data sources, features, and ML stack
6. **CTA** - Call-to-action section

---

## 📈 Risk Scoring Logic

### High Risk (0-30 points)
**Red Flags:**
- NDVI < 0.60 (poor vegetation)
- Declining trend (slope < -0.015)
- Severe drought (rainfall deficit > 60mm)
- High variability (CV > 0.40)

**Recommendation:** Reject or high-interest loan

---

### Medium Risk (31-60 points)
**Indicators:**
- NDVI 0.60-0.70 (moderate vegetation)
- Stable trend (slope -0.015 to 0.010)
- Moderate drought (30-60mm deficit)

**Recommendation:** Standard loan terms

---

### Low Risk (61-100 points)
**Positive Signals:**
- NDVI > 0.70 (excellent vegetation)
- Improving trend (slope > 0.010)
- Minimal drought (< 30mm deficit)
- Low variability (CV < 0.25)

**Recommendation:** Favorable loan terms

---

## 🔗 Data Sources

The model integrates multiple geospatial and environmental datasets:

### Satellite Imagery
- **Source:** Sentinel-2 via Google Earth Engine API
- **Resolution:** 10 meters
- **Update Frequency:** Every 5 days
- **Metric:** NDVI (Normalized Difference Vegetation Index)

### Weather Data
- **Source:** ERA5 Climate Reanalysis / OpenWeatherMap
- **Parameters:** Precipitation, temperature, soil moisture
- **Timeframe:** 30-day historical + 7-day forecast

### Soil Properties
- **Source:** SoilGrids (ISRIC)
- **Parameters:** Organic carbon, texture, pH
- **Resolution:** 250 meters

---

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic structure
- **CSS3** - Modern responsive design
- **Vanilla JavaScript** - No framework dependencies
- **Leaflet.js** - Map interface (planned)

### Machine Learning
- **Python 3.8+**
- **XGBoost / LightGBM** - Gradient boosting
- **scikit-learn** - Preprocessing & validation
- **pandas / numpy** - Data manipulation

### Backend (Planned)
- **FastAPI** - REST API framework
- **GeoPandas** - Geospatial processing
- **Google Earth Engine** - Satellite data retrieval
- **Redis** - Caching layer

### Deployment
- **Railway / Render** - Backend hosting
- **Netlify / Vercel** - Frontend hosting
- **Docker** - Containerization

---

## 📚 Documentation

### For Users
- `README.md` - Project overview and deployment guide
- Website sections explain the problem, solution, and team

### For Developers
- `docs/DATA_DOCUMENTATION.md` - Complete data specification
- `data/training_data_schema.json` - Schema with examples
- `data/train_model.py` - Commented training code

---

## 🎯 Model Performance Targets

| Metric | Target | Current (Synthetic Data) |
|--------|--------|--------------------------|
| AUC-ROC | > 0.75 | 0.96 |
| Precision | > 0.70 | 0.85 |
| Recall | > 0.65 | 0.82 |
| RMSE | < 15 points | 6.8 points |

**Note:** Current metrics are on synthetic data. Real-world performance will require validation with actual farm data.

---

## 🔄 Next Steps

### Phase 1 (Days 1-6): Feature Engineering
- [ ] Integrate Google Earth Engine API
- [ ] Implement NDVI time-series analysis
- [ ] Add anomaly detection algorithms
- [ ] Train model on expanded dataset (1000+ records)

### Phase 2 (Days 7-12): API Development
- [ ] Build FastAPI backend with /evaluate endpoint
- [ ] Implement GeoJSON polygon validation
- [ ] Create Leaflet map interface
- [ ] Deploy to Railway + Netlify

### Phase 3 (Days 13-21): Production Ready
- [ ] User testing with 3-5 microfinance institutions
- [ ] Refine risk score thresholds
- [ ] Add Redis caching
- [ ] Implement monitoring dashboards

---

## 📞 Contact

**Team FieldScore AI**
- Dovud Asadov (ML Engineer) - [LinkedIn](https://www.linkedin.com/in/dovud-asadov-913002245/) | [GitHub](https://github.com/DovudAsadov)
- Burxon Nurmurodov (Backend Developer) - [LinkedIn](https://www.linkedin.com/in/burkhon-nurmurodov-6356902a3/)
- Rustambek Urokov (AI Engineer) - [LinkedIn](https://www.linkedin.com/in/rustambek-u-0b0023275/)

---

## 📄 License

© 2025 FieldScore AI. All rights reserved.

---

## 🙏 Acknowledgments

- **AI500 Hackathon** - For the opportunity to build this solution
- **Google Earth Engine** - Satellite data access
- **ISRIC SoilGrids** - Soil property data
- **Sentinel-2 ESA** - Free and open Earth observation data

---

**Last Updated:** December 7, 2025
