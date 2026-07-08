const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema(
    {
        title: { type: String },
        description: { type: String },
        videoUrl: { type: String },
        thumbnail: { type: String },
        category: { type: String },
        likes: { type: Number, default: 0 },
        dislikes: { type: Number, default: 0 },
        views: { type: Number, default: 0 },
    },
    { timestamps: true }
);


module.exports = mongoose.model("Video", VideoSchema);