// models/CategoreyModel.js
const mongoose = require("mongoose");

const CategoreySchema = new mongoose.Schema({
  name: String,
  categoreyImage: String,
});

const Categorey = mongoose.model("categories", CategoreySchema, "categories");

module.exports = Categorey;
