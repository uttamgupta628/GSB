const { default: mongoose } = require("mongoose");
const Story = require("../models/Story");
const { uploadOnCloudinary } = require("../utils/cloudinary");

const uploadStory = async (req, res) => {
  try {
    const { title, description, userId } = req.body;

    // Validate input
    if (!title || !description) {
      throw new Error("Title and description are required!");
    }

    const beforeStoryImg = req.files.beforeStoryImg[0]?.path;
    const afterStoryImg = req.files.afterStoryImg[0]?.path;

    // Validate file upload
    if (!beforeStoryImg || !afterStoryImg) {
      throw new Error("Images are required!");
    }

    const beforeStoryImgUrl = await uploadOnCloudinary(beforeStoryImg);
    let afterStoryImgUrl;

    if (beforeStoryImgUrl) {
      afterStoryImgUrl = await uploadOnCloudinary(afterStoryImg);
    }

    if (!beforeStoryImgUrl || !afterStoryImgUrl) {
      throw new Error("Failed to upload images!");
    }

    // Create a new story
    const newStory = await Story.create({
      title,
      description,
      beforeStoryImg: beforeStoryImgUrl?.url,
      afterStoryImg: afterStoryImgUrl?.url,
      userId,
    });

    // console.log(newStory);

    // Send successful response
    res.status(200).json(newStory);
  } catch (error) {
    console.error("Critical error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const getStoryByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const stories = await Story.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          title: 1,
          description: 1,
          beforeStoryImg: 1,
          afterStoryImg: 1,
          user: {
            _id: 1,
            name: 1,
            email: 1,
          },
        },
      },
    ]);

    res.status(200).json(stories);
  } catch (error) {
    console.error("Critical error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const getAllStories = async (req, res) => {
  try {
    const stories = await Story.find();
    res.status(200).json(stories);
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteStory = async (req, res) => {
  try {
    await Story.findByIdAndDelete(req.params.id);
    res.status(200).json("Story has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
};

const updateShowStoryOnHome = async (req, res) => {
  try {
    const { id } = req.params;
    const { showInHome } = req.body;

    const updatedStory = await Story.findByIdAndUpdate(
      id,
      { showInHome },
      { new: true }
    );

    res.status(200).json(updatedStory);
  } catch (err) {
    res.status(500).json(err);
  }
};

const homeStories = async (req, res) => {
  try {
    const stories = await Story.find({
      showInHome: true,
    });
    res.status(200).json(stories);
  } catch (err) {
    console.error("Error fetching stories:", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  uploadStory,
  getStoryByUserId,
  getAllStories,
  deleteStory,
  updateShowStoryOnHome,
  homeStories,
};
