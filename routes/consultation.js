const express = require("express");
const router = express.Router();
const {
  verifyToken,
  verifyTokenandAuthorization,
  verifyTokenandAdmin,
} = require("../middlewares/verifyToken");
const Consultation = require("../models/Consultation");

// Route to create a new consultation
router.post("/", verifyToken, async (req, res) => {
  const newConsultation = new Consultation(req.body);
  try {
    const savedConsultation = await newConsultation.save();
    res.status(200).json(savedConsultation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to get all consultations
router.get("/", verifyToken, async (req, res) => {
  try {
    const consultations = await Consultation.find();
    res.status(200).json(consultations);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to update a consultation by ID
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updatedConsultation = await Consultation.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedConsultation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to delete a consultation by ID
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Consultation.findByIdAndDelete(req.params.id);
    res.status(200).json("Consultation has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
