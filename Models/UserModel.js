const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: [true, "email is required"],
    lowercase: true,
    validate: [validator.isEmail, "please enter a valid email"],
  },
  password: {
    type: String,
    require: [true, "password is required"],
    minlength: 8,
  },
  rolee: {
    type: String,
    default: "Admin",
  },
  confirmpassword: {
    type: String,
    require: [true, "ConfirmPassword is required"],
  },
});

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }

    this.password = await bcrypt.hash(this.password, 12);

    this.confirmpassword = undefined;

    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.comparePassword = async function (
  candidatePassword,
  passdb
) {
  try {
    return await bcrypt.compare(candidatePassword, passdb);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model("Users", userSchema, "Users");

module.exports = User;
