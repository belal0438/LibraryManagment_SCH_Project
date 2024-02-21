const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asynHandler");
const User = require("../models/userModel");

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;
  if ([email, username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exist");
  }

  const user = await User.create({ username, email, password, role });
  const creatUser = await User.findById(user._id).select("-password");
  if (!creatUser) {
    throw new ApiError(500, "Somthing went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, creatUser, "User register successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  if (!(email || username)) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }
  const accessToken = user.generateAccessToken();
  const loggedInUser = await User.findById(user._id).select("-password");

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
        },
        "User logged In successfully"
      )
    );
});

const getAllUser = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    throw new ApiError(400, "Only admin Can get users data");
  }
  const users = await User.find().select("-password");
  return res.status(201).json(new ApiResponse(200, users, "All users Data"));
});

const getSpecificeUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  if (req.user.role !== "admin") {
    throw new ApiError(400, "Only admin Can get users data");
  }

  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }
  return res.status(201).json(new ApiResponse(200, user, "All users Data"));
});

module.exports = { registerUser, loginUser, getAllUser, getSpecificeUser };
