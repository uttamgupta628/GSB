const DepressionQuestion = require("../models/DepressionQuestion");

const addNewQuestion = async (req, res) => {
  try {
    const { questionText, options, isMultipleChoice } = req.body;

    // Validate required fields
    if (!questionText || !options || isMultipleChoice === undefined) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        missingFields: {
          questionText: !questionText ? "questionText is required" : undefined,
          options: !options ? "options is required" : undefined,
          isMultipleChoice:
            isMultipleChoice === undefined
              ? "isMultipleChoice is required"
              : undefined,
        },
      });
    }

    const newQuestion = await DepressionQuestion.create({
      questionText,
      options,
      isMultipleChoice,
    });

    if (!newQuestion) {
      return res.status(500).json({
        success: false,
        message: "Failed to add new question",
      });
    }

    res.status(200).json({
      success: true,
      message: "New question added successfully",
      newQuestion,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getQuestions = async (req, res) => {
  try {
    const questions = await DepressionQuestion.find();

    if (!questions) {
      return res.status(404).json({
        success: false,
        message: "No questions found",
      });
    }

    res.status(200).json(questions);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateNewQuestion = async (req, res) => {
  try {
    const { questionText, options, isMultipleChoice } = req.body;

    const { id } = req.params;

    const questionForUpdate = await DepressionQuestion.findById(id);

    if (!questionForUpdate) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    if (questionText) {
      questionForUpdate.questionText = questionText;
    }

    if (options) {
      questionForUpdate.options = options;
    }

    if (isMultipleChoice) {
      questionForUpdate.isMultipleChoice = isMultipleChoice;
    }

    await questionForUpdate.markModified("options");
    await questionForUpdate.save();

    res.status(200).json({
      success: true,
      message: "Question updated successfully",
      questionForUpdate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteQuestionById = async (req, res) => {
  try {
    await DepressionQuestion.findByIdAndDelete(req.params.id);
    res.status(200).json("Question deleted successfully...");
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  getQuestions,
  addNewQuestion,
  updateNewQuestion,
  deleteQuestionById,
};
