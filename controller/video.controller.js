const Video = require("../models/Video");

const {
  uploadOnCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinary");

const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find();

    if (!videos) {
      return res.status(404).json({ message: "No videos found" });
    }

    videos.sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createVideo = async (req, res) => {
  console.log(req.files?.videoFile[0]?.path);
  try {
    const { title, description, category } = req.body;
    const videoUrl = req.files?.videoFile[0]?.path;
    const thumbnail = req.files?.thumbnail ? req.files?.thumbnail[0].path : "";
    const requiredFields = { title, description, category, videoUrl };
    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value) {
        return res.status(400).json({
          message: `${
            field.charAt(0).toUpperCase() + field.slice(1)
          } is required`,
        });
      }
    }
    const result = await uploadOnCloudinary(videoUrl);
    console.log(result);
    let thumbnailResult;
    if (thumbnail) {
      thumbnailResult = await uploadOnCloudinary(thumbnail);
    }

    if (!result) {
      return res
        .status(400)
        .json({ message: "Error while uploading file on cloudinary" });
    }

    const video = await Video.create({
      title,
      description,
      videoUrl: result.url,
      thumbnail: thumbnailResult?.url || "",
      category,
    });

    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const editVideo = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const videoUrl = req.files?.videoFile[0]?.path;
    const thumbnail = req.files?.thumbnail[0].path;

    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    let result, thumbnailResult;
    if (videoUrl) {
      result = await uploadOnCloudinary(videoUrl);
      if (!result) {
        return res
          .status(400)
          .json({ message: "Error while uploading file on cloudinary" });
      }
    }

    if (thumbnail) {
      thumbnailResult = await uploadOnCloudinary(thumbnail);
      if (!thumbnailResult) {
        return res
          .status(400)
          .json({ message: "Error while uploading file on cloudinary" });
      }
    }

    if (videoUrl) {
      await deleteFromCloudinary(video.videoUrl);
    }

    if (thumbnail) {
      await deleteFromCloudinary(video.thumbnail);
    }

    if (videoUrl) {
      video.videoUrl = result.url;
    }

    if (thumbnail) {
      video.thumbnail = thumbnailResult.url;
    }

    if (title) {
      video.title = title;
    }

    if (description) {
      video.description = description;
    }

    if (category) {
      video.category = category;
    }

    video.markModified("videoUrl");
    await video.save();
    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    await deleteFromCloudinary(video.videoUrl);
    await deleteFromCloudinary(video.thumbnail);
    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllVideos,
  getVideoById,
  createVideo,
  editVideo,
  deleteVideo,
};
