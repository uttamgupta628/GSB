const express = require("express");
const router = express.Router();
const {
  verifyToken,
  verifyTokenandAdmin,
} = require("../middlewares/verifyToken");
const Supplement = require("../models/Supplement");

router.post("/", verifyToken, async (req, res) => {
  const newSupplement = new Supplement(req.body);
  try {
    const savedSupplement = await newSupplement.save();
    res.status(200).json(savedSupplement);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to get all supplements
router.get("/", verifyToken, async (req, res) => {
  try {
    const supplements = await Supplement.find();
    res.status(200).json(supplements);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to update a supplement by ID
router.put("/:id", verifyTokenandAdmin, async (req, res) => {
  try {
    const updatedSupplement = await Supplement.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedSupplement);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to delete a supplement by ID
router.delete("/:id", verifyTokenandAdmin, async (req, res) => {
  try {
    await Supplement.findByIdAndDelete(req.params.id);
    res.status(200).json("Supplement has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
