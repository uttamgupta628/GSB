const mongoose = require("mongoose");

const DepressionQuestionSchema = new mongoose.Schema(
  {
    questionText: { type: String, required: true },
    options: { type: [String], required: true },
    isMultipleChoice: { type: Boolean, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DepressionQuestion", DepressionQuestionSchema);
