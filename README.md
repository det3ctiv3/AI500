# FieldScore AI

## Overview

FieldScore AI is an agricultural risk assessment platform that provides credit scoring for smallholder farmers using satellite imagery, weather data, and machine learning.

## Features

- Interactive farm risk assessment demo
- Real-time NDVI satellite data analysis
- Weather and soil condition monitoring
- AI-powered chatbot assistance
- RESTful API for model inference

## Technology Stack

**Frontend**
- HTML5, CSS3, JavaScript
- Responsive design with CSS Grid and Flexbox
- OpenAI API integration for chatbot

**Backend**
- FastAPI with Uvicorn
- Pydantic for data validation
- CORS middleware enabled

**Machine Learning**
- XGBoost/LightGBM gradient boosting
- scikit-learn, pandas, numpy
- Training data: 50 sample farm records

**Data Sources**
- Sentinel-2 satellite NDVI
- ERA5 weather data
- SoilGrids soil properties

## Project Structure

```
AI500/
├── index.html
├── assets/
│   ├── css/styles.css
│   └── js/main.js
├── data/
│   ├── training_data.csv
│   ├── training_data_schema.json
│   └── train_model.py
├── docs/
│   ├── DATA_DOCUMENTATION.md
│   ├── TRAINING_DATA_RECOMMENDATIONS.md
│   └── PROJECT_STRUCTURE.md
├── api.py
├── requirements.txt
├── API_README.md
├── QUICK_START.md
└── CHATBOT_SETUP.md
```

## Installation

1. Install dependencies:
```powershell
pip install fastapi uvicorn pydantic numpy joblib openai scikit-learn xgboost
```

2. Configure OpenAI API key in `assets/js/main.js`:
```javascript
const OPENAI_API_KEY = 'your-api-key-here';
```

3. Start the API server:
```powershell
python api.py
```

4. Open `index.html` in your browser

## API Endpoints

**POST /predict**
- Input: Farm data (12 features including NDVI, weather, soil, loan details)
- Output: Risk score (0-100) and category (High/Medium/Low)

See `API_README.md` for complete documentation.

## Configuration

- API server runs on `http://localhost:8000`
- OpenAI chatbot uses GPT-3.5-turbo model
- Fallback responses available when API unavailable

## Documentation

- `API_README.md` - Complete API documentation
- `QUICK_START.md` - Step-by-step setup guide
- `CHATBOT_SETUP.md` - OpenAI integration guide
- `DATA_DOCUMENTATION.md` - Data specifications and features
- `TRAINING_DATA_RECOMMENDATIONS.md` - Model training guidelines

## Team

- Dovud Asadov - ML Engineer
- Burxon Normurodov - MLOps Engineer
- Rustambek Urokov - Backend Developer

## License

Copyright 2025 FieldScore AI. All rights reserved.
