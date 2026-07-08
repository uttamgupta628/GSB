const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userImg: { type: String },
    email: { type: String, required: true, unique: true },
    verified: { type: Boolean, default: false },
    phoneNumber: { type: String },
    name: { type: String },
    age: { type: Number },
    weight: { type: String },
    golWeight: { type: String },
    goalHeight: { type: String },
    address: { type: String },
    firstTimeLogin: { type: Boolean, default: true },
    dob: { type: String },
    goal: { type: Array },
    zone: { type: String },

    ibsQuestions: {
      type: Array,
    },

    diabetesQuestions: {
      type: Array,
    },

    depressionQuestions: {
      type: Array,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
