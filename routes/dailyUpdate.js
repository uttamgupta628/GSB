const {
  getUserDailyUpdateByUserId,
  dailyUpdateRoute,
  getAllDailyUpdates,
  deleteUserDailyUpdateById,
} = require("../controller/dailyUpdate.controller");
const upload = require("../middlewares/multer.middleware");

const router = require("express").Router();

router.get("/:userId", getUserDailyUpdateByUserId);

router.get("/", getAllDailyUpdates);

router.post("/", upload.single("file"), dailyUpdateRoute);

router.delete("/:id", deleteUserDailyUpdateById);

module.exports = router;
