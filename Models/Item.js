// models/itemModel.js
const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true }, //عجين بلحمة
  type: { type: String, required: true }, // دزينة
  price: { type: Number, required: true }, // 12000
  size: { type: String, required: true }, // صغير
  description: { type: String, required: true }, // لحمة,عجين رقاقات,حجم صغير,دزينة
  productImage: { type: String, required: true }, //
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
});

const Item = mongoose.model("Item", ItemSchema, "Item");

module.exports = Item;
