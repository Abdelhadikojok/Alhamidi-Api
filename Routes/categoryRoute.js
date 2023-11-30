const express = require("express");
const Item = require("../Models/Item");
const Categorey = require("../Models/categoryModel");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.get("/categories", async (req, res) => {
  try {
    const categories = await Categorey.find();
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

router.post(
  "/addCategorey",
  upload.single("categoreyImage"),
  async (req, res) => {
    try {
      const newItem = new Categorey({
        name: req.body.name,
        categoreyImage: req.file.filename, // Save the filename instead of the buffer
      });

      await newItem.save();
      res.status(201).json(newItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = router;
