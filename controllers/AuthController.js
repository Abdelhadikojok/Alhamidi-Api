const UserModel = require("../Models/UserModel");
const jwt = require("jsonwebtoken");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const customError = require("../utils/custumeError");
const User = require("../Models/UserModel");
const CustomError = require("../utils/custumeError");

const generateToken = (id) => {
  return jwt.sign({ userId: id }, "yourSecretKey", { expiresIn: "200h" });
};

exports.addUser = async (req, res) => {
  try {
    // Extract the role from the request body
    const { role, ...userData } = req.body;

    // Create a new user instance with the extracted data
    const newUser = await UserModel.create(userData);

    // Hash the password (assuming you have a pre-save middleware for hashing)
    // ...

    // Set the user's role
    newUser.rolee = role;

    // Save the user to the database
    await newUser.save();

    // Generate JWT
    const token = generateToken(newUser._id);

    res.status(201).json({
      user: {
        email: newUser.email,
        _id: newUser._id,
      },
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find the user by email
    const user = await UserModel.findOne({ email: email });
    console.log(user);
    console.log("---------------------------------------*******", password);
    console.log(
      "---------------------------------------*******",
      user.password
    );

    // If the user is not found
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the provided password with the hashed password in the database using the model method
    const passwordMatch = await user.comparePassword(password, user.password);

    console.log("-------------------------", passwordMatch);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, "yourSecretKey", {
      expiresIn: "200h",
    });

    res.status(200).json({
      user: {
        email: user.email,
        _id: user._id,
      },
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.protect = asyncErrorHandler(async (req, res, next) => {
  // 1- check user avaliability
  const testtoken = req.headers.authorization;
  let token;
  if (testtoken && testtoken.startsWith("Bearer")) {
    token = testtoken.split(" ")[1];
  }
  if (!token) {
    return next(new customError("your not loggedin!", 401));
  }

  // 2- validate token

  const decodedjwt = jwt.verify(token, "yourSecretKey");

  console.log(decodedjwt);

  const user = await User.findById("***", decodedjwt.id);

  // if (user.rolee != "Admin") {
  //   const error = new CustomError("Un Autherized to acces this route", 401);
  //   return next(error);
  // }

  console.log(user);
  if (!user) {
    const error = new CustomError("this user does not exist", 401);
    return next(error);
  }

  // 3 -allow acess
  next();
});
