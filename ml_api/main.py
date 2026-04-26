from fastapi import FastAPI
import joblib
import pandas as pd
import re
import math
import os
from urllib.parse import urlparse

app = FastAPI()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load everything
# model = joblib.load("model/xgboost_model.pkl")
# scaler = joblib.load("model/scaler.pkl")
# feature_names = joblib.load("model/feature_names.pkl")
print("Starting app...")

scaler = joblib.load(os.path.join(BASE_DIR, "model", "scaler.pkl"))
print("Scaler loaded")
model = joblib.load(os.path.join(BASE_DIR, "model", "xgboost_model.pkl"))
print("Model loaded")
feature_names = joblib.load(os.path.join(BASE_DIR, "model", "feature_names.pkl"))

def clean_url(url):
    url = url.lower()
    url = re.sub(r"http[s]?://", "", url)  # remove http/https
    url = re.sub(r"www\.", "", url)        # remove www
    return url

def extract_features(url):
    features = {}

    features["url_length"] = len(url)
    features["num_dots"] = url.count(".")
    features["num_hyphens"] = url.count("-")
    features["num_underscore"] = url.count("_")
    features["num_slash"] = url.count("/")
    features["num_questionmark"] = url.count("?")
    features["num_equal"] = url.count("=")
    features["num_at"] = url.count("@")
    features["num_digits"] = sum(c.isdigit() for c in url)

    features["has_https"] = 1 if "https" in url else 0
    features["has_ip"] = 1 if re.search(r"\d+\.\d+\.\d+\.\d+", url) else 0
    features["has_shortening"] = 1 if any(x in url for x in ["bit.ly","tinyurl","goo.gl"]) else 0

    # Domain
    parsed = urlparse("http://" + url)
    domain = parsed.netloc

    features["domain_length"] = len(domain)
    features["num_subdomains"] = domain.count(".")
    features["has_suspicious_words"] = int(any(word in url for word in ["login","secure","bank","verify","update"]))

    # Suspicious
    features["has_double_slash"] = int("//" in url)
    features["has_prefix_suffix"] = int("-" in url.split(".")[0])
    features["has_long_url"] = int(len(url) > 75)
    features["has_many_digits"] = int(sum(c.isdigit() for c in url) > 5)

    # Advanced
    prob = [url.count(c)/len(url) for c in set(url)]
    features["url_entropy"] = -sum(p * math.log2(p) for p in prob)

    features["digit_ratio"] = features["num_digits"] / features["url_length"]
    features["special_char_ratio"] = (features["num_dots"] + features["num_hyphens"]) / features["url_length"]

    return features

# -------- API -------- #

@app.post("/predict")
def predict(url: str):
    url = clean_url(url)
    features = extract_features(url)

    # Create DataFrame
    df = pd.DataFrame([features])

     # Ensure correct feature order
    df = df[feature_names]

    # Scale features
    df_scaled = scaler.transform(df)
    
    flags = []
    if features["has_ip"] == 1:
        flags.append("Uses IP address instead of domain")

    if features["has_https"] == 0:
        flags.append("Does not use HTTPS")

    if features["has_suspicious_words"] == 1:
        flags.append("Contains suspicious words like login/verify")

    if features["has_long_url"] == 1:
        flags.append("URL is unusually long")

    if features["has_many_digits"] == 1:
        flags.append("Too many digits in URL")

    if features["has_shortening"] == 1:
        flags.append("Uses URL shortening service")

    # Predict
    prediction = model.predict(df_scaled)[0]
    proba = model.predict_proba(df)[0][1]

    return {
        "prediction": "Phishing" if prediction == 1 else "Legitimate",
        "probability": float(proba),
        "flags": flags
    }