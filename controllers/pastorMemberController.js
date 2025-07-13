const PastorMember = require("../Schema/pastorSchema");
const PastorCodeGenerate = require("../util/pastorMemberCodeGenerate");
const PastorId = require("../util/PastorId");
const path = require("path");
const fs = require("fs");

//  createMember
exports.createMember = async (req, res) => {
  try {
    const code = await PastorCodeGenerate();
    const PastorfamilyId = await PastorId();
    // console.log(PastorfamilyId);
    // console.log(code);
    // return;
    const imagePath = req.file ? `/uploads/pastor/${req.file.filename}` : null;

    if (!req.body.familyId) {
      console.log("if :!req.body.familyhead_id");

      const newMember = new PastorMember({
        familyId: PastorfamilyId,
        familyhead_id: PastorfamilyId,
        member_id: code,
        mobile_number: req.body.mobile_number,
        member_name: req.body.member_name,
        member_tamil_name: req.body.member_tamil_name,
        gender: req.body.gender,
        date_of_birth: req.body.date_of_birth,
        email: req.body.email,
        occupation: req.body.occupation,
        community: req.body.community,
        nationality: req.body.nationality,
        member_photo: imagePath,
        permanent_address: req.body.permanent_address,
        present_address: req.body.present_address,
        joined_date: req.body.joined_date,
        reason_for_inactive: req.body.reason_for_inactive,
        description: req.body.description,
        status: req.body.status,
      });

      await newMember.save();
      res
        .status(201)
        .json({ message: "Member created successfully", newMember });
    } else {
      console.log("else :req.body.familyhead_id");
      const newMember = new PastorMember({
        familyId: req.body.familyId,
        member_id: code,
        mobile_number: req.body.mobile_number,
        member_name: req.body.member_name,
        member_tamil_name: req.body.member_tamil_name,
        gender: req.body.gender,
        date_of_birth: req.body.date_of_birth,
        email: req.body.email,
        occupation: req.body.occupation,
        community: req.body.community,
        nationality: req.body.nationality,
        member_photo: imagePath,
        permanent_address: req.body.permanent_address,
        present_address: req.body.present_address,
        joined_date: req.body.joined_date,
        reason_for_inactive: req.body.reason_for_inactive,
        description: req.body.description,
        status: req.body.status,
      });

      await newMember.save();
      res
        .status(201)
        .json({ message: "Member created successfully", newMember });
    }
  } catch (error) {
    // If an image was uploaded, delete it since an error occurred
    if (req.file) {
      const imagePath = path.join(
        __dirname,
        "..",
        `uploads/pastor/${req.file.filename}`
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    res.status(400).json({ error: error.message });
  }
};

// Get all members

exports.getAllMembers = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 15, status } = req.query;
    const query = {};

    // Filter by status if provided
    if (status && status !== "All") {
      query.status = status;
    }

    // Filter by search term (searching in member_name and family_head_name)
    if (search) {
      query.$or = [
        { member_name: { $regex: search, $options: "i" } }, // Case-insensitive search
        { member_id: { $regex: search, $options: "i" } }, // Case-insensitive search
        { family_head_name: { $regex: search, $options: "i" } },
        { familyId: { $regex: search, $options: "i" } },
      ];
    }

    const totalMembers = await PastorMember.countDocuments(query);
    const totalPages = Math.ceil(totalMembers / limit);

    const members = await PastorMember.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      RegisteredData: members,
      TotalPages: totalPages,
      CurrentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single member by member_id
exports.getMemberById = async (req, res) => {
  try {
    const member = await PastorMember.findOne({
      member_id: req.params.id,
    }).select("-createdAt  -updatedAt  -__v");
    if (!member) return res.status(404).json({ message: "Member not found" });

    // console.log(member);

    // return;
    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a member (delete old image and upload new one)

exports.updateMember = async (req, res) => {
  try {
    // const Data = req.body;
    // console.log("req.body:", Data);
    // // return;
    // Find member by `member_id`
    const member = await PastorMember.findOne({ member_id: req.params.id });

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    let imagePath = member.member_photo;

    // ✅ Handle Image Upload: Delete old image if a new one is uploaded
    if (req.file) {
      if (
        member.member_photo &&
        member.member_photo.startsWith("/uploads/pastor/")
      ) {
        const oldImagePath = path.join(__dirname, "..", member.member_photo);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imagePath = `/uploads/pastor/${req.file.filename}`;
    } else if (req.body.member_photo) {
      imagePath = req.body.member_photo; // Use new path if provided
    }

    // ✅ Convert `permanent_address` and `present_address` to JSON (if sent as string)
    let permanentAddress = req.body.permanent_address;
    let presentAddress = req.body.present_address;

    if (typeof permanentAddress === "string") {
      try {
        permanentAddress = JSON.parse(permanentAddress);
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Invalid permanent_address format" });
      }
    }

    if (typeof presentAddress === "string") {
      try {
        presentAddress = JSON.parse(presentAddress);
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Invalid present_address format" });
      }
    }

    // ✅ Remove `familyhead_id` if it exists (to avoid duplicate key error)
    if ("familyhead_id" in req.body) {
      delete req.body.familyhead_id;
    }

    // ✅ Update member details in DB
    const updatedMember = await PastorMember.findOneAndUpdate(
      { member_id: req.params.id }, // Find by `member_id`
      {
        ...req.body, // Spread req.body fields
        member_photo: imagePath, // Updated image path
        permanent_address: permanentAddress, // Store as object
        present_address: presentAddress, // Store as object
      },
      { new: true, runValidators: true } // Return updated doc & validate fields
    );

    res.status(200).json({
      message: "Member updated successfully",
      updatedMember,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete a member (also delete the image)
exports.deleteMember = async (req, res) => {
  try {
    const member = await PastorMember.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });

    // Delete the image file if it exists
    if (member.member_photo) {
      const imagePath = path.join(__dirname, "..", member.member_photo);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await PastorMember.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Member deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// family data

exports.getFamilyData = async (req, res) => {
  try {
    const { familyId } = req.params; // Extract familyId from request params

    if (!familyId) {
      return res.status(400).json({ message: "Family ID is required" });
    }

    // Fetch matching records and count total records
    const familyData = await PastorMember.find({ familyId }).select(
      "familyId member_id member_name status"
    );
    const totalRecords = await PastorMember.countDocuments({ familyId });

    if (!familyData.length) {
      return res.status(404).json({ message: "No matching family data found" });
    }

    res.status(200).json({
      success: true,
      totalRecords, // Include total record count
      data: familyData,
    });
  } catch (error) {
    console.error("Error fetching family data:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get all member by familyId

exports.getMembersWithFamilyHeadId = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query; // Get query params

    // Base Query: Find all members where `familyhead_id` exists
    let query = { familyhead_id: { $exists: true, $ne: null } };

    // If search is provided, apply search filter
    if (search) {
      query.$or = [
        { familyId: { $regex: search, $options: "i" } }, // Search by familyId
        { member_id: { $regex: search, $options: "i" } }, // Search by member_id
        { member_name: { $regex: search, $options: "i" } }, // Search by member_name
      ];
    }

    // Count total matching documents
    const totalMembers = await PastorMember.countDocuments(query);

    // Fetch filtered & paginated results
    const members = await PastorMember.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      totalMembers,
      TotalPages: Math.ceil(totalMembers / limit),
      currentPage: parseInt(page),
      membersPerPage: members.length,
      members,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
