# AI-Based Phishing URL Detection System

A full-stack AI-powered web application that detects whether a URL is **phishing** or **legitimate** using Machine Learning models and real-time feature extraction techniques.

---

## 🚀 Project Overview

The **AI-Based Phishing URL Detection System** is designed to help users identify malicious websites before visiting them.  
The system extracts important URL-based features, applies trained Machine Learning models, and predicts whether the given URL is safe or phishing.

The project follows a **three-tier architecture**:

- **Frontend:** React.js
- **Backend API:** Node.js + Express.js
- **ML Service:** Flask + Python
- **Database:** MongoDB

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS / Bootstrap
- Axios

### Backend
- Node.js
- Express.js

### Machine Learning
- Python
- Flask
- Scikit-learn
- XGBoost
- Pandas
- NumPy

### Database
- MongoDB

### Tools
- Git & GitHub
- Postman
- VS Code

---

## ✨ Features

- 🔍 Real-time phishing URL detection
- 🤖 Machine Learning-based prediction
- 📊 Feature extraction from URLs
- ⚡ Fast API communication
- 🧠 Multiple ML model evaluation
- 📁 Prediction log storage using MongoDB
- 📱 Responsive user interface

---

## 🧠 Machine Learning Models Used

The following models were trained and evaluated:

- Logistic Regression
- Support Vector Machine (SVM)
- Random Forest
- XGBoost ✅ (Selected Best Model)

### Evaluation Metrics
- Accuracy
- Precision
- Recall
- F1-Score

---

## 📂 Project Structure

```bash
Phishing-URL-Detection-System/
│
├── client/                 # React Frontend
│
├── server/                 # Node.js Backend
│
├── ml-service/             # Flask ML API
│   ├── model/
│   ├── app.py
│   └── feature_extraction.py
│
├── database/
│
├── screenshots/
│
├── README.md
│
└── requirements.txt
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/phishing-url-detection.git
cd phishing-url-detection
```

---

## 🔧 Backend Setup

```bash
cd server
npm install
npm start
```

---

## 🎨 Frontend Setup

```bash
cd client
npm install
npm start
```

---

## 🧠 ML Service Setup

```bash
cd ml-service

pip install -r requirements.txt

python app.py
```

---

## 🌐 API Flow

```text
React Frontend
      ↓
Node.js Backend API
      ↓
Flask ML Service
      ↓
ML Model Prediction
      ↓
Response to Frontend
```

---

## 📊 How It Works

1. User enters a URL
2. System extracts URL features
3. Features are sent to ML model
4. Model predicts:
   - Legitimate URL
   - Phishing URL
5. Result is displayed instantly

---

## 🔐 Example URL Features Extracted

- URL Length
- Presence of HTTPS
- Number of Dots
- Special Characters
- IP Address Usage
- Suspicious Keywords
- Domain Length
- Redirection Symbols

---

## ⭐ If you like this project

Give this repository a ⭐ on GitHub and support the project!
