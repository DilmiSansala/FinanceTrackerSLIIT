const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["expense", "income", "income-vs-expense"],
    required: true,
  },
  
  // Report type
  period: { type: String, required: true }, // Time period (e.g., "2023-09")
  data: { type: Object, required: true }, // Report data (e.g., spending trends, income vs. expenses)
  filters: { type: Object }, // Filters applied (e.g., categories, tags)
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Report", reportSchema);
