const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectToDB = require("./config/db.js");
const cors = require("cors");
const userRoutes = require("./routes/user.route.js");
const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

dotenv.config();
connectToDB();

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Server up and running ",
  });
});

const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
