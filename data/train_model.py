"""
FieldScore AI - Model Training Script
Example implementation for training the gradient boosting risk scoring model
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import roc_auc_score, classification_report, confusion_matrix
import xgboost as xgb
import joblib
import json

def load_and_preprocess_data(csv_path='data/training_data.csv'):
    """
    Load and preprocess the training data
    """
    df = pd.read_csv(csv_path)
    
    # Encode categorical variables
    le_crop = LabelEncoder()
    df['crop_type_encoded'] = le_crop.fit_transform(df['crop_type'])
    
    le_outcome = LabelEncoder()
    df['loan_outcome_encoded'] = le_outcome.fit_transform(df['loan_outcome'])
    
    print(f"Loaded {len(df)} training samples")
    print(f"Features: {df.columns.tolist()}")
    
    return df, le_crop, le_outcome

def prepare_features_target(df):
    """
    Separate features and target variable
    """
    # Feature columns for model training
    feature_cols = [
        'farm_area_hectares',
        'ndvi_mean_12mo',
        'ndvi_slope',
        'ndvi_14day_delta',
        'ndvi_anomaly_zscore',
        'rainfall_deficit_30day',
        'coefficient_of_variation',
        'soil_organic_carbon',
        'crop_type_encoded',
        'loan_amount_usd'
    ]
    
    X = df[feature_cols]
    y = df['risk_score']  # Continuous target (0-100)
    
    # For classification, convert to risk categories
    y_category = df['risk_category'].map({'high': 0, 'medium': 1, 'low': 2})
    
    return X, y, y_category, feature_cols

def train_regression_model(X, y):
    """
    Train XGBoost regression model for risk score prediction
    """
    print("\n=== Training Regression Model (Risk Score 0-100) ===")
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # XGBoost Regressor
    model = xgb.XGBRegressor(
        n_estimators=100,
        max_depth=6,
        learning_rate=0.1,
        min_child_weight=1,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        objective='reg:squarederror'
    )
    
    # Train model
    model.fit(
        X_train, y_train,
        eval_set=[(X_test, y_test)],
        early_stopping_rounds=10,
        verbose=False
    )
    
    # Evaluate
    train_score = model.score(X_train, y_train)
    test_score = model.score(X_test, y_test)
    
    predictions = model.predict(X_test)
    rmse = np.sqrt(np.mean((predictions - y_test) ** 2))
    mae = np.mean(np.abs(predictions - y_test))
    
    print(f"Train R² Score: {train_score:.4f}")
    print(f"Test R² Score: {test_score:.4f}")
    print(f"RMSE: {rmse:.4f}")
    print(f"MAE: {mae:.4f}")
    
    return model, X_test, y_test, predictions

def train_classification_model(X, y_category):
    """
    Train XGBoost classifier for risk category prediction
    """
    print("\n=== Training Classification Model (Risk Category) ===")
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_category, test_size=0.2, random_state=42, stratify=y_category
    )
    
    # XGBoost Classifier
    model = xgb.XGBClassifier(
        n_estimators=100,
        max_depth=6,
        learning_rate=0.1,
        min_child_weight=1,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        objective='multi:softprob',
        num_class=3
    )
    
    # Train model
    model.fit(
        X_train, y_train,
        eval_set=[(X_test, y_test)],
        early_stopping_rounds=10,
        verbose=False
    )
    
    # Evaluate
    train_score = model.score(X_train, y_train)
    test_score = model.score(X_test, y_test)
    
    predictions = model.predict(X_test)
    pred_proba = model.predict_proba(X_test)
    
    # Calculate AUC (one-vs-rest for multiclass)
    from sklearn.preprocessing import label_binarize
    y_test_bin = label_binarize(y_test, classes=[0, 1, 2])
    auc_score = roc_auc_score(y_test_bin, pred_proba, multi_class='ovr')
    
    print(f"Train Accuracy: {train_score:.4f}")
    print(f"Test Accuracy: {test_score:.4f}")
    print(f"AUC-ROC (OvR): {auc_score:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, predictions, target_names=['High Risk', 'Medium Risk', 'Low Risk']))
    
    return model, X_test, y_test, predictions, pred_proba

def get_feature_importance(model, feature_names):
    """
    Extract and display feature importance
    """
    importance = model.feature_importances_
    feature_importance = pd.DataFrame({
        'feature': feature_names,
        'importance': importance
    }).sort_values('importance', ascending=False)
    
    print("\n=== Feature Importance ===")
    print(feature_importance.to_string(index=False))
    
    return feature_importance

def save_model(model, model_path='models/fieldscore_model.pkl'):
    """
    Save trained model to disk
    """
    import os
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    joblib.dump(model, model_path)
    print(f"\nModel saved to: {model_path}")

def predict_risk_score(model, sample_features):
    """
    Example prediction function
    """
    prediction = model.predict(sample_features)
    
    # Convert to risk category
    if prediction[0] < 30:
        category = "High Risk"
        recommendation = "Reject or require additional collateral"
    elif prediction[0] < 60:
        category = "Medium Risk"
        recommendation = "Approve with standard terms"
    else:
        category = "Low Risk"
        recommendation = "Approve with favorable terms"
    
    return {
        'risk_score': float(prediction[0]),
        'risk_category': category,
        'recommendation': recommendation
    }

if __name__ == "__main__":
    print("FieldScore AI - Model Training Pipeline\n")
    print("=" * 60)
    
    # Load data
    df, le_crop, le_outcome = load_and_preprocess_data()
    
    # Prepare features and targets
    X, y, y_category, feature_cols = prepare_features_target(df)
    
    # Train regression model (for continuous risk score)
    reg_model, X_test_reg, y_test_reg, pred_reg = train_regression_model(X, y)
    
    # Train classification model (for risk categories)
    clf_model, X_test_clf, y_test_clf, pred_clf, pred_proba = train_classification_model(X, y_category)
    
    # Feature importance
    importance_df = get_feature_importance(reg_model, feature_cols)
    
    # Save models
    save_model(reg_model, 'models/risk_score_regressor.pkl')
    save_model(clf_model, 'models/risk_category_classifier.pkl')
    
    # Save label encoders
    joblib.dump(le_crop, 'models/crop_encoder.pkl')
    
    # Example prediction
    print("\n" + "=" * 60)
    print("Example Prediction:")
    print("=" * 60)
    
    sample = X.iloc[0:1]
    result = predict_risk_score(reg_model, sample)
    
    print(f"Risk Score: {result['risk_score']:.2f}")
    print(f"Risk Category: {result['risk_category']}")
    print(f"Recommendation: {result['recommendation']}")
    
    print("\n✓ Training complete!")
