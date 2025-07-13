  
  
  
  
  
  const express = require("express");
  const router = express.Router();
  const Expense = require("../controllers/Expense");
  const multer = require("multer");
  const path = require("path");
  const fs = require("fs");
  
  // Ensure the 'upload/expense' directory exists, if not create it
  const uploadDir = path.join(__dirname, "../uploads/expense");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  // Multer disk storage configuration
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Store the uploaded files in the 'upload/expense' folder
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      // Generate a unique filename using the current timestamp and random number
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  });
  
  // File filter to only accept certain image types (optional)
  const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type, only JPG, JPEG, and PNG are allowed"), false);
    }
    cb(null, true);
  };
  
  // Multer upload instance with file filter and storage
  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
  });
  
  // Define routes for Expense
  // Route for adding an expense with image upload
  router.post(
    "/add",
    upload.single("image"), // Handle a single image upload
    Expense.addExpense
  );
  
  // Route for getting expenses by category and date
  router.get("/category", Expense.getExpenseByCategoryAndDate);
  
  // Route for getting all distinct categories
  router.get("/categories", Expense.getDistinctCategories);
  
  // Route for getting a single expense by ID
  router.get("/:id", Expense.getSingleExpense);
  
  // Route for verifying a member by ID
  router.get("/member/verify/:id", Expense.verifyMember);
  
  module.exports = router;
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  // const express = require("express");
// const router = express.Router();
// const Expense = require("../controllers/Expense");
// const multer = require("multer");
// const path = require("path");

// // Configure multer to store files in the upload/expense folder
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, "../upload/expense")); // Directory to store images
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + "-" + file.originalname); // Save with unique name
//   },
// });

// // Multer upload configuration
// const upload = multer({ storage: storage });

// // Define routes for Expense
// router.post(
//   "/add",
//   upload.single("image"), // Handle a single image upload
//   Expense.addExpense
// );
// router.get('/category', Expense.getExpenseByCategoryAndDate);
// router.get("/categories", Expense.getDistinctCategories);
// router.get("/:id", Expense.getSingleExpense);
// router.get('/member/verify/:id', Expense.verifyMember);



// module.exports = router;
