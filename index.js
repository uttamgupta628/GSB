const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const consultationRoute = require("./routes/consultation");
const supplementRoute = require("./routes/supplement");
const storyRoute = require("./routes/story");
const orderRoute = require("./routes/order");
const videoRoute = require("./routes/video");
const dailyUpdateRoute = require("./routes/dailyUpdate");
const ibsQuestionRoute = require("./routes/ibsQuestion");
const diabetesQuestionsRoute = require("./routes/diabetesQuestions");
const depressionQuestionsRoute = require("./routes/DepressionQuestion");

const PORT = process.env.PORT || 5001;

//databse connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB connection successfull!");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.urlencoded({ extended: true }));
//allow to send json
app.use(express.json());
app.use(express.static("public"));
app.use(cors());


app.get("/", (req, res) => {
  res.json({ message: "GSB API is running 🚀" });
});
//routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/consultation", consultationRoute);
app.use("/api/supplement", supplementRoute);
app.use("/api/story", storyRoute);
app.use("/api/order", orderRoute);
app.use("/api/video", videoRoute);
app.use("/api/update", dailyUpdateRoute);
app.use("/api/IBSquestions", ibsQuestionRoute);
app.use("/api/diabetesQuestion", diabetesQuestionsRoute);
app.use("/api/depressionQuestions", depressionQuestionsRoute);

app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
