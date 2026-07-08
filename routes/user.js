const { default: phone } = require("phone");
const upload = require("../middlewares/multer.middleware");
const {
  verifyTokenandAuthorization,
  verifyTokenandAdmin,
  verifyToken,
} = require("../middlewares/verifyToken");
const User = require("../models/User");
const { uploadOnCloudinary } = require("../utils/cloudinary");

const router = require("express").Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (error) {}
});

//Update
router.put("/:id", upload.single("file"), async (req, res) => {
  try {
    const updatedUser = await User.findById(req.params.id);

    const {
      name,
      phoneNumber,
      address,
      dob,
      age,
      weight,
      golWeight,
      goalHeight,
      goal,
      ibsQuestions,
      diabetesQuestions,
      depressionQuestions,
      zone,
    } = req.body;

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    let imgPath;
    if (req.file) {
      const uploadedImg = await uploadOnCloudinary(req.file.path);
      if (uploadedImg) {
        imgPath = uploadedImg.url;
      }
    }

    const verifyPhoneNumber = await phone(req.body.phoneNumber, "IN");

    if (!verifyPhoneNumber && req.body.phoneNumber) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    if (name) {
      updatedUser.name = name;
    }

    if (phoneNumber) {
      updatedUser.phoneNumber = phoneNumber;
    }

    if (address) {
      updatedUser.address = address;
    }

    if (dob) {
      updatedUser.dob = dob;
    }

    if (age) {
      updatedUser.age = age;
    }

    if (weight) {
      updatedUser.weight = weight;
    }

    if (golWeight) {
      updatedUser.golWeight = golWeight;
    }

    if (goalHeight) {
      updatedUser.goalHeight = goalHeight;
    }

    if (goal) {
      updatedUser.goal = goal;
    }

    if (imgPath) {
      updatedUser.userImg = imgPath;
    }

    if (Array.isArray(ibsQuestions) && ibsQuestions.length > 0) {
      updatedUser.ibsQuestions = ibsQuestions;
    }

    if (Array.isArray(diabetesQuestions) && diabetesQuestions.length > 0) {
      updatedUser.diabetesQuestions = diabetesQuestions;
    }

    if (Array.isArray(depressionQuestions) && depressionQuestions.length > 0) {
      updatedUser.depressionQuestions = depressionQuestions;
    }

    if (zone) {
      updatedUser.zone = zone;
    }

    updatedUser.markModified("name");

    await updatedUser.save();

    res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//Delete
router.delete("/:id", verifyTokenandAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("Account deleted succesfully...");
  } catch (err) {
    res.status(500).json(err);
  }
});
// Get User
router.get("/find/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
