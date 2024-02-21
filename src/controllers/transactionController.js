const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asynHandler");
const Transaction = require("../models/transactionModel");
const Book = require("../models/bookModel");

const borrowBook = asyncHandler(async (req, res) => {
  const { bookId, borrowedDate } = req.body;
  if (bookId.trim() === "") {
    throw new ApiError(400, " book Id  is required");
  }

  const checkBook = await Book.findById(bookId);
  //   console.log("checkBook", checkBook.quantity);
  if (checkBook.quantity < 1) {
    throw new ApiError(400, "Book not in Stack");
  }

  await Book.findByIdAndUpdate(bookId, {
    $set: {
      quantity: checkBook.quantity - 1,
    },
  });

  const transaction = await Transaction.create({
    userId: req.user._id,
    bookId: checkBook._id,
    borrowedDate,
  });

  const creatTransaction = await Transaction.findById(transaction._id).select(
    "-returnedDate"
  );
  if (!creatTransaction) {
    throw new ApiError(500, "Somthing went wrong while creat Transaction");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, creatTransaction, "borrowed successfully"));
});

const returnBook = asyncHandler(async (req, res) => {
  const transactionId = req.params.transactionId;
  if (transactionId.trim() === "") {
    throw new ApiError(400, " transaction Id  is required");
  }

  const checkTransaction = await Transaction.findById(transactionId);
  if (!checkTransaction) {
    throw new ApiError(400, "wrong transaction Id");
  }

  const transaction = await Transaction.findByIdAndUpdate(
    transactionId,
    {
      $set: {
        returnedDate: new Date(),
      },
    },
    { new: true }
  );

  return res
    .status(201)
    .json(new ApiResponse(200, transaction, "retured successfully"));
});

const specificUserBorrowBooksDetails = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  if (userId.trim() === "") {
    throw new ApiError(400, " User Id  is required");
  }
  const userTransactions = await Transaction.find({
    userId,
    returnedDate: null,
  })
    .populate({
      path: "bookId",
      select: "title description bookImage",
    })
    .exec();

  return res
    .status(201)
    .json(new ApiResponse(200, userTransactions, " Borrow Book Details"));
});

module.exports = { borrowBook, returnBook, specificUserBorrowBooksDetails };
