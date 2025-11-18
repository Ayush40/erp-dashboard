const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true }
});

module.exports = mongoose.model("Report", ReportSchema);
