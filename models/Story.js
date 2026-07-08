const mongoose = require("mongoose");

const StorySchema = new mongoose.Schema(
  {
    beforeStoryImg: { type: String },
    afterStoryImg: { type: String },
    title: { type: String },
    description: { type: String },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    showInHome: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Story", StorySchema);
