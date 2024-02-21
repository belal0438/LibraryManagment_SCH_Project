const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asynHandler");
const uploadOnCloudinary = require("../services/cloudinary");
const Book = require("../models/bookModel");
const User = require("../models/userModel");

const addBooks = asyncHandler(async (req, res) => {
  const { title, description, quantity } = req.body;
  if (req.user.role !== "admin") {
    throw new ApiError(400, "Only admin Can add books");
  }

  if ([title, description, quantity].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const bookImgLocalPath = req.files?.bookImage[0]?.path;
  if (!bookImgLocalPath) {
    throw new ApiError(400, "Book Image is required");
  }

  const bookImg = await uploadOnCloudinary(bookImgLocalPath);
  //   console.log("booksUrl", bookImg.url);
  const book = await Book.create({
    title,
    description,
    bookImage: bookImg.url,
    quantity,
  });

  const creatBook = await Book.findById(book._id);
  if (!creatBook) {
    throw new ApiError(500, "Somthing went wrong while adding the book");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, creatBook, "Book Added successfully"));
});

const updateBooksDetails = asyncHandler(async (req, res) => {
  const booksId = req.params.bookId;
  const { title, description, quantity } = req.body;
  if (req.user.role !== "admin") {
    throw new ApiError(400, "Only admin Can update books");
  }

  if ([title, description, quantity].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const bookImgLocalPath = req.files?.bookImage[0]?.path;
  if (!bookImgLocalPath) {
    throw new ApiError(400, "Book Image is required");
  }

  const bookImg = await uploadOnCloudinary(bookImgLocalPath);
  // console.log("booksUrl", bookImg.url);
  const updatedBook = await Book.findByIdAndUpdate(
    booksId,
    {
      $set: {
        title,
        description,
        bookImage: bookImg.url,
        quantity,
      },
    },
    { new: true }
  );
  return res
    .status(201)
    .json(new ApiResponse(200, updatedBook, "Book updated successfully"));
});

module.exports = { addBooks, updateBooksDetails };
