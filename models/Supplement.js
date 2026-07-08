const mongoose = require("mongoose");

const SupplementSchema = new mongoose.Schema(
  {
    productImg: { type: String },
    name: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Supplement", SupplementSchema);
