const mongoose = require("mongoose");

const dailyUpdateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    updateImg: {
      public_id: { type: String },
      secure_url: { type: String },
    },

    description: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DailyUpdate", dailyUpdateSchema);
