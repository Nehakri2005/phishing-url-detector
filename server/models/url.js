const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true },
  prediction: { type: String, required: true },
  probability: { type: Number, default: 0 },
  flags: { type: [String]},
  source:{
    type:String,
    enum:["model","database"],
    default:"model"},
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Url", urlSchema);