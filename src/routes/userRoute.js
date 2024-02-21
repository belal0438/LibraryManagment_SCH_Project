const express = require("express");
const router = express.Router();
const verfyJwt = require("../middlewares/authMiddleware");
const {
  registerUser,
  loginUser,
  getAllUser,
  getSpecificeUser,
} = require("../controllers/userController");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/").get(verfyJwt, getAllUser);
router.route("/:userId").get(verfyJwt, getSpecificeUser);
module.exports = router;
