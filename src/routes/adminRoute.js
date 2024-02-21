const express = require("express");
const router = express.Router();
const {
  addBooks,
  updateBooksDetails,
} = require("../controllers/adminController");
const upload = require("../middlewares/multerMiddleware");
const verfyJwt = require("../middlewares/authMiddleware");

router.route("/add").post(
  verfyJwt,
  upload.fields([
    {
      name: "bookImage",
      maxCount: 1,
    },
  ]),
  addBooks
);

router.route("/:bookId").put(
  verfyJwt,
  upload.fields([
    {
      name: "bookImage",
      maxCount: 1,
    },
  ]),
  updateBooksDetails
);

module.exports = router;
