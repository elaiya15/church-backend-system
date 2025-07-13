const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const auth = require("./models/auth");
const path = require("path");
const fs = require("fs");
const login = require("./router/loginRoutes");
const member_register = require("./router/registerRoutes");
const member = require("./router/memberRouter");
const family_member = require("./router/familyRouter");
const offering = require("./router/offeringsRouter");
const pastor = require("./router/pastorMemberRoutes");
const bagOfferings = require("./router/bagofferingRouter");
const expense = require("./router/expenseRouter");
const reports = require("./router/reportRouter");
const app = express();
const uploadDir = path.join(__dirname, "uploads/expense");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
const PORT = process.env.PORT || 5001;
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DataBase Connected"))
  .catch((err) => {
    console.log(err);
  });

// ✅ Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

// app.use(cors());
app.get("/", (req, res) => {
  res.send(" Server Running ");
});
app.use("/api/reports", reports);
app.use("/api/pastor", pastor);

app.use("/api", login);
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/", auth.authenticateUser);
app.use("/api/member", member);
app.use("/api/family", family_member);
app.use("/api/offerings", offering);
app.use("/api/expense", expense);
app.use("/api/bagOfferings", bagOfferings);

// Connect to MongoDB
app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
