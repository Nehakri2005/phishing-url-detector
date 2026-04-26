const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cors = require("cors");

const Url = require("./models/url");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


const app = express();
app.use(cors());
app.use(express.json());

app.post("/analyze", async (req, res) => {
  try {
    const { url } = req.body;

     if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const existing = await Url.findOne({ url });
    if (existing) {
       console.log(" From DB");
      return res.json({
        source: "database",
        prediction: existing.prediction,
        probability: existing.probability ?? 0,
        flags: existing.flags ?? [],
      });
    }

    const response = await axios.post(
      "https://phishing-url-detector-2-qucz.onrender.com/predict?url=" + url
    );

    await Url.create({
      url,
      prediction: response.data.prediction,
      probability: response.data.probability ?? 0,
      flags: response.data.flags ?? [],
      source: "model"
    });

    
    res.json({
      source: "model",
      prediction: response.data.prediction,
      probability: response.data.probability ?? 0,
      flags: response.data.flags ?? [],
    });
    
  } catch (err) {
    res.status(500).json({ error: "Error analyzing URL" });
  }
});

app.listen(5000, () => console.log("Node server running on port 5000"));