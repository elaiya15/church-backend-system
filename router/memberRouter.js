const express = require("express");
const register = require("../controllers/Register");
const Member_path = require("../controllers/Member");
const multer = require("multer");
const path = require('path');
// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });
const router = express.Router();

// router.post("/member/add/new", upload.fields([
//     { name: 'member_photo', maxCount: 1 },

// ]), register.signup);
// router.post("/member/add/new", register.signup);

router.get("/list", Member_path.getMembers);
router.get("/download-list", Member_path.downloadMembers);
router.get("/:id", Member_path.SingleGetMemberById);
router.put(
  "/details/update/:id",
  upload.single("member_photo"),
  Member_path.UpdateMemberById
);

module.exports = router;
