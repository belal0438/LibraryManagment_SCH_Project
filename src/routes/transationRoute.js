const express = require("express");
const router = express.Router();
const verfyJwt = require("../middlewares/authMiddleware");
const {
  borrowBook,
  returnBook,
  specificUserBorrowBooksDetails,
} = require("../controllers/transactionController");

router.route("/borrow").post(verfyJwt, borrowBook);
router.route("/return/:transactionId").put(verfyJwt, returnBook);
router.route("/user/:userId").get(verfyJwt, specificUserBorrowBooksDetails);
module.exports = router;
