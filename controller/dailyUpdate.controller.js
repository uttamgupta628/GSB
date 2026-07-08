const DailyUpdate = require("../models/dailyUpdate");
const { uploadOnCloudinary } = require("../utils/cloudinary");

const dailyUpdateRoute = async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  try {
    const { title, description, userId } = req.body;

    const missingFields = [];
    if (!title) missingFields.push("title");
    if (!description) missingFields.push("description");
    if (!userId) missingFields.push("userId");

    if (missingFields.length > 0) {
      return res
        .status(400)
        .json({ message: `Missing fields: ${missingFields.join(", ")}` });
    }

    const updatedImgPath = req.file.path;

    if (!updatedImgPath) {
      return res.status(400).json({ message: "Image is required" });
    }

    const uploadResponse = await uploadOnCloudinary(updatedImgPath);

    if (!uploadResponse) {
      return res.status(400).json({ message: "Image upload failed" });
    }

    const dailyUpdate = await DailyUpdate.create({
      title,
      description,
      userId,
      updateImg: {
        public_id: uploadResponse.public_id,
        secure_url: uploadResponse.secure_url,
      },
    });

    res.status(200).json(dailyUpdate);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getUserDailyUpdateByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const dailyUpdates = await DailyUpdate.find({ userId });

    res.status(200).json(dailyUpdates);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getAllDailyUpdates = async (req, res) => {
  try {
    const dailyUpdates = await DailyUpdate.find();

    res.status(200).json(dailyUpdates);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteUserDailyUpdateById = async (req, res) => {
  try {
    const { id } = req.params;

    const dailyUpdate = await DailyUpdate.findByIdAndDelete(id);

    if (!dailyUpdate) {
      return res.status(404).json({ message: "Daily update not found" });
    }

    res.status(200).json({ message: "Daily update deleted" });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  dailyUpdateRoute,
  getUserDailyUpdateByUserId,
  getAllDailyUpdates,
  deleteUserDailyUpdateById,
};
