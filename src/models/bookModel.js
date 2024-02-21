const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bookSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
      lowercase: true,
    },
    description: {
      type: String,
      require: true,
      trim: true,
    },
    bookImage: {
      type: String,
      require: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
