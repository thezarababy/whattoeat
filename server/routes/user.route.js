const express = require("express");
const router = express.Router();
const { createUser, loginUsers } = require("../controller/user.controller.js");
const authValidator = require("../middleware/authValidator.js");

router.post("/signup", createUser);
router.post("/login", loginUsers);
router.get("/protected", authValidator, (req, res) => {
  res
    .status(200)
    .json({ message: "You have accessed a protected route", user: req.user });
});
module.exports = router;
