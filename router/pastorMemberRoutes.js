const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pastorMemberController = require("../controllers/pastorMemberController");

// Ensure "uploads/pastor" folder exists
const uploadDir = path.join(__dirname, "../uploads/pastor");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `img_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Routes
router.post(
  "/",
  upload.single("member_photo"),
  pastorMemberController.createMember
);
router.put(
  "/:id",
  upload.single("member_photo"),
  pastorMemberController.updateMember
);

router.get("/list", pastorMemberController.getAllMembers);
router.get("/familymembers", pastorMemberController.getMembersWithFamilyHeadId);
router.get("/family/:familyId", pastorMemberController.getFamilyData);
router.get("/:id", pastorMemberController.getMemberById);
router.delete("/:id", pastorMemberController.deleteMember);
module.exports = router;
