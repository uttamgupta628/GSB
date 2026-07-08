const express = require("express");
const router = express.Router();
const {
  verifyToken,
  verifyTokenandAdmin,
} = require("../middlewares/verifyToken");
const Story = require("../models/Story");
const upload = require("../middlewares/multer.middleware");
const {
  uploadStory,
  getStoryByUserId,
  getAllStories,
  deleteStory,
  updateShowStoryOnHome,
  homeStories,
} = require("../controller/story.controller");

router.get("/homeStories", homeStories);

router.post(
  "/",
  // verifyToken,
  upload.fields([
    { name: "beforeStoryImg", maxCount: 1 },
    { name: "afterStoryImg", maxCount: 1 },
  ]),
  uploadStory
);

router.get("/:userId", getStoryByUserId);
// Route to get all stories
router.get("/", verifyToken, getAllStories);

router.put("/:id", verifyToken, updateShowStoryOnHome);

// Route to update a story by ID
router.put("/:id", verifyTokenandAdmin, async (req, res) => {
  try {
    const updatedStory = await Story.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedStory);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to delete a story by ID
router.delete("/:id", verifyToken, deleteStory);

module.exports = router;
