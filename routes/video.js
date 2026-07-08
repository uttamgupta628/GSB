const { createVideo, getVideoById, getAllVideos, editVideo, deleteVideo } = require("../controller/video.controller");
const upload = require("../middlewares/multer.middleware");

const router = require("express").Router();

router.get("/", getAllVideos);

router.get("/:id", getVideoById);

router.post("/upload", upload.fields([
    {
        name: "videoFile",
        maxCount: 1,
    },
    {
        name: "thumbnail",
        maxCount: 1,
    },

]), createVideo);

router.put("/:id", upload.fields([
    {
        name: "videoFile",
        maxCount: 1,
    },
    {
        name: "thumbnail",
        maxCount: 1,
    },

]), editVideo);

router.delete("/:id", deleteVideo)

module.exports = router;