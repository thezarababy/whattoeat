const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  Fullname: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
  },
  Password: {
    type: String,
    required: true,
  },
});
const UserModel = new mongoose.model("Users", UserSchema);
module.exports = UserModel;
