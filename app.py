import os
import joblib
import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing for frontend

MODEL_RF_FILE = "rf_model.pkl"
MODEL_LR_FILE = "logistic_model.pkl"
DATASET_PATH = "Loan_Default_Cleaned.csv"

# Global model variables
rf_pipeline = None
lr_pipeline = None

def train_and_save_models():
    global rf_pipeline, lr_pipeline
    print("Training ML Models (Random Forest & Logistic Regression)...")
    
    if not os.path.exists(DATASET_PATH):
        alt_path = os.path.join(os.path.dirname(__file__), "..", DATASET_PATH)
        if os.path.exists(alt_path):
            df = pd.read_csv(alt_path)
        else:
            raise FileNotFoundError(f"Dataset {DATASET_PATH} not found.")
    else:
        df = pd.read_csv(DATASET_PATH)
        
    if "LoanID" in df.columns:
        df = df.drop(columns=["LoanID"])
        
    X = df.drop(columns=["Default"])
    y = df["Default"]
    
    num_cols = ["Age", "Income", "LoanAmount", "CreditScore", "MonthsEmployed", 
                "NumCreditLines", "InterestRate", "LoanTerm", "DTIRatio"]
    cat_cols = ["Education", "EmploymentType", "MaritalStatus", "HasMortgage", 
                "HasDependents", "LoanPurpose", "HasCoSigner"]
                
    num_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ])
    
    cat_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("encoder", OneHotEncoder(handle_unknown="ignore"))
    ])
    
    preprocessor = ColumnTransformer([
        ("num", num_pipeline, num_cols),
        ("cat", cat_pipeline, cat_cols)
    ])
    
    rf_clf = RandomForestClassifier(n_estimators=100, max_depth=12, random_state=42, n_jobs=-1, class_weight="balanced")
    lr_clf = LogisticRegression(max_iter=1000, random_state=42, class_weight="balanced")
    
    rf_pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("classifier", rf_clf)
    ])
    
    lr_pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("classifier", lr_clf)
    ])
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    rf_pipeline.fit(X_train, y_train)
    lr_pipeline.fit(X_train, y_train)
    
    print(f"Random Forest Test Accuracy: {rf_pipeline.score(X_test, y_test):.4f}")
    print(f"Logistic Regression Test Accuracy: {lr_pipeline.score(X_test, y_test):.4f}")
    
    joblib.dump(rf_pipeline, MODEL_RF_FILE)
    joblib.dump(lr_pipeline, MODEL_LR_FILE)
    print("Models saved successfully.")

def load_or_train_models():
    global rf_pipeline, lr_pipeline
    if os.path.exists(MODEL_RF_FILE) and os.path.exists(MODEL_LR_FILE):
        try:
            print("Loading pre-trained models...")
            rf_pipeline = joblib.load(MODEL_RF_FILE)
            lr_pipeline = joblib.load(MODEL_LR_FILE)
            print("Both ML models loaded successfully!")
        except Exception as e:
            print(f"Failed to load saved models ({e}), retraining...")
            train_and_save_models()
    else:
        train_and_save_models()

@app.route('/', methods=['GET'])
def root():
    return "Loan Default Prediction API is running!"

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "models_loaded": rf_pipeline is not None and lr_pipeline is not None
    })

@app.route('/predict', methods=['POST'])
@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        if not data:
            return jsonify({"success": False, "error": "No JSON payload provided"}), 400

        def to_yes_no(val):
            if isinstance(val, bool):
                return "Yes" if val else "No"
            if str(val).lower() in ["true", "yes", "1"]:
                return "Yes"
            return "No"

        dti_raw = float(data.get("dtiratio", data.get("dtiRatio", data.get("dti", 25))))
        dti_val = dti_raw / 100.0 if dti_raw > 1.0 else dti_raw

        # Standardize Education option string
        edu_input = str(data.get("education", "Bachelor"))
        if edu_input == "Bachelor":
            edu_input = "Bachelor's"
        elif edu_input == "Master":
            edu_input = "Master's"

        input_dict = {
            "Age": [int(data.get("age", 30))],
            "Income": [float(data.get("income", 50000))],
            "LoanAmount": [float(data.get("loanamount", data.get("loanAmount", 10000)))],
            "CreditScore": [int(data.get("creditscore", data.get("creditScore", 650)))],
            "MonthsEmployed": [int(data.get("monthsemployed", data.get("monthsEmployed", 12)))],
            "NumCreditLines": [int(data.get("numcreditlines", data.get("numCreditLines", 3)))],
            "InterestRate": [float(data.get("interestrate", data.get("interestRate", 10.0)))],
            "LoanTerm": [int(data.get("loanterm", data.get("loanTerm", 36)))],
            "DTIRatio": [dti_val],
            "Education": [edu_input],
            "EmploymentType": [str(data.get("employmenttype", data.get("employmentType", "Full-time")))],
            "MaritalStatus": [str(data.get("maritalstatus", data.get("maritalStatus", "Single")))],
            "HasMortgage": [to_yes_no(data.get("hasmortgage", data.get("hasMortgage", False)))],
            "HasDependents": [to_yes_no(data.get("hasdependents", data.get("hasDependents", False)))],
            "LoanPurpose": [str(data.get("loanpurpose", data.get("loanPurpose", "Personal")))],
            "HasCoSigner": [to_yes_no(data.get("hascosigner", data.get("hasCoSigner", False)))]
        }

        input_df = pd.DataFrame(input_dict)

        selected_model = str(data.get("model", "both")).lower()

        # Run Logistic Regression
        lr_proba = lr_pipeline.predict_proba(input_df)[0]
        lr_pred = int(lr_pipeline.predict(input_df)[0])
        lr_prob_val = round(float(lr_proba[1]), 4)
        lr_status = "High Risk (Default)" if lr_pred == 1 else "Low Risk (No Default)"

        # Run Random Forest
        rf_proba = rf_pipeline.predict_proba(input_df)[0]
        rf_pred = int(rf_pipeline.predict(input_df)[0])
        rf_prob_val = round(float(rf_proba[1]), 4)
        rf_status = "High Risk (Default)" if rf_pred == 1 else "Low Risk (No Default)"

        response_body = {
            "success": True,
            "selected_model": selected_model
        }

        if selected_model == "logistic":
            response_body["logistic_regression"] = {
                "name": "Logistic Regression",
                "prediction": lr_pred,
                "probability": lr_prob_val,
                "risk_status": lr_status
            }
            response_body["prediction"] = lr_pred
            response_body["risk_status"] = lr_status
        elif selected_model == "random_forest":
            response_body["random_forest"] = {
                "name": "Random Forest",
                "prediction": rf_pred,
                "probability": rf_prob_val,
                "risk_status": rf_status
            }
            response_body["prediction"] = rf_pred
            response_body["risk_status"] = rf_status
        else: # "both"
            response_body["selected_model"] = "both"
            response_body["logistic_regression"] = {
                "name": "Logistic Regression",
                "prediction": lr_pred,
                "probability": lr_prob_val,
                "risk_status": lr_status
            }
            response_body["random_forest"] = {
                "name": "Random Forest",
                "prediction": rf_pred,
                "probability": rf_prob_val,
                "risk_status": rf_status
            }
            # Overall prediction ensemble (default to RF or max prediction)
            overall_pred = rf_pred if rf_pred == 1 else lr_pred
            response_body["prediction"] = overall_pred
            response_body["risk_status"] = "High Risk (Default)" if overall_pred == 1 else "Low Risk (No Default)"

        return jsonify(response_body)

    except Exception as e:
        print("Prediction Error:", str(e))
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    load_or_train_models()
    print("Starting Flask ML API Server on http://localhost:5000 ...")
    app.run(host='0.0.0.0', port=5000, debug=True)
