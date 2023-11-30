// app.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const itemRoutes = require("./Routes/itemRoute");
const categoreyRoutes = require("./Routes/categoryRoute");
const userRoutes = require("./Routes/userRoute");
const CustomError = require("./utils/custumeError");

const errorController = require("./controllers/errorController");
const { protect } = require("./controllers/AuthController");

require("dotenv").config();

const mongodbenv = process.env.MONGODB_URI; // Update the variable name

const app = express();
const PORT = process.env.PORT || 3004;

mongoose.connect(mongodbenv, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var db = mongoose.connection;

db.on("error", () => {
  console.log("Connection failed");
});

db.once("open", () => {
  console.log("Connected successfully");
});

app.use(cors());

app.use("/api", express.static("uploads"));

app.use(express.json());
app.use(categoreyRoutes);
app.use(itemRoutes);
app.use("/users", userRoutes);

app.all("*", (req, res, next) => {
  const error = new CustomError("Can't find this URL on the server", 404);
  next(error);
});

app.use((error, req, res, next) => {
  errorController(error, req, res, next);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
