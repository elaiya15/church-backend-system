const Member = require("../Schema/memberSchema");
const Family = require("../Schema/familySchema");
const generateMemberCode = require("../util/MemberCodeGenerate");
const generateFamilyCode = require("../util/FamilyId");
const path = require('path');
exports.NewFamily = async (req, res) => {
  // console.log(req.files);
  // const member_photo = req.files?.member_photo?.[0]?.buffer || null;
  const member_photo = req.file ? `/uploads/${req.file.filename}` : '';
  let member_id;
  let family_id;

  member_id = await generateMemberCode();
  // console.log("Generated member_id:", member_id);
  family_id = await generateFamilyCode();
  // console.log("Generated family_id:", family_id);

  req.body.member_id = member_id;
  req.body.member_photo = member_photo;

  const newFamily = new Family({
    family_id: family_id,
    head: req.body.member_id,
    members: [],
  });
  const savedFamily = await newFamily.save();

  req.body.primary_family_id = savedFamily.family_id;
  try {
    const newData = new Member({
      ...req.body,
    });
    const savedMember = await newData.save(); // create the member
    return res
      .status(201)
      .json({ message: "Member Register Success", savedMember });
  } catch (error) {
    console.error("Error saving member:", error.message);
    return res
      .status(500)
      .json({ message: "Failed to register member", error: error.message });
  }
};

exports.NewMember = async (req, res) => {
  // const member_photo = req.files?.member_photo?.[0]?.buffer || null;
  const member_photo = req.file ? `/uploads/${req.file.filename}` : '';

  let member_id;
  const { id } = req.params;
  // family member add here
  if (id) {
    member_id = await generateMemberCode();
    // console.log("Generated member_id:", member_id);
    req.body.member_id = member_id;
    req.body.member_photo = member_photo;

    try {
      const familyList = await Family.find({ family_id: id });
      const family = familyList[0];
      if (family) {
        // If family exists, push the new member to the members array
        family.members.push({
          relationship_with_family_head: req.body.relationship_with_family_head,
          ref_id: member_id,
        });
        await family.save();
        delete req.body.relationship_with_family_head;
        // console.log(family);
        // console.log(typeof family.family_id);

        req.body.primary_family_id = family.family_id;

        const newData = new Member({
          ...req.body,
        });
        const savedMember = await newData.save(); // create the member

        return res
          .status(201)
          .json({ message: "Member Register Success", savedMember });
      } else {
        return res.status(404).json({ message: "Family not found" });
      }
    } catch (error) {
      console.error("Error saving member:", error.message);
      return res
        .status(500)
        .json({ message: "Failed to register member", error: error.message });
    }
  }
};

// exports.signup = async (req, res) => {
//   let member_id;
//   let family_id;
//   // new Family created here
//   if (!req.body.primary_family_id) {
    // console.log("family_id;");
//     member_id = await generateMemberCode();
//     // console.log("Generated member_id:", member_id);
//     family_id = await generateFamilyCode();
//     // console.log("Generated family_id:", family_id);

//     req.body.member_id = member_id;

//     const newFamily = new Family({
//       family_id: family_id,
//       head: req.body.member_id,
//       members: []
//     });
//     const savedFamily = await newFamily.save();

//     req.body.primary_family_id = savedFamily._id
//     try {
//       const newData = new Member({
//         ...req.body
//       });
//       const savedMember = await newData.save(); // create the member
//       return res
//         .status(201)
//         .json({ message: "Member Register Success", savedMember });
//     } catch (error) {
//       console.error("Error saving member:", error.message);
//       return res
//         .status(500)
//         .json({ message: "Failed to register member", error: error.message });
//     }
//   }
// // family member add here
//   if (req.body.primary_family_id) {
//     member_id = await generateMemberCode();
//     console.log("Generated member_id:", member_id);
//     req.body.member_id = member_id;

//     try {
//       const newData = new Member({
//         ...req.body
//       });
//       const savedMember = await newData.save(); // create the member

//       const family = await Family.findById(req.body.primary_family_id);

//       if (family) {
//         // If family exists, push the new member to the members array
//         family.members.push({
//           relationship_with_family_head: req.body.relationship_with_family_head,
//           ref_id: member_id
//         });
//         await family.save();

//         return res
//           .status(201)
//           .json({ message: "Member Register Success", savedMember });
//       } else {
//         return res
//           .status(404)
//           .json({ message: "Family not found" });
//       }
//     } catch (error) {
//       console.error("Error saving member:", error.message);
//       return res
//         .status(500)
//         .json({ message: "Failed to register member", error: error.message });
//     }
//   }
// };

// exports.getMemberById = async (req, res) => {
//   try {
//     const memberId = req.params.id;
//     const member = await Member.find({ member_id: memberId }).select(
//       "name_of_applicant placement_level members"
//     );

//     if (!member) {
//       return res.status(404).json({ message: "Member not found" });
//     }

//     if (member[0].members.length < 5 && member[0].placement_level < 6) {
//       return res
//         .status(200)
//         .json({ message: "Verified Success", Sponsor: member[0] });
//     } else {
//       return res.status(404).json({ message: "Sponsor Tree full" });
//     }
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Server Error", error: error.message });
//   }
// };

// exports.SingleGetMemberById = async (req, res) => {
//   try {
//     const member = await Member.find({ member_id: req.params.id });
//     if (!member) {
//       return res.status(404).json({ message: "Member not found" });
//     }
//     return res.status(200).json(member[0]);
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Failed to fetch member", error: error.message });
//   }
// };

// exports.UpdateMemberById = async (req, res) => {
//   const id = req.params.id;

//   console.log(req.params.id);
//   try {
//     const Update = await Member.findOneAndUpdate({ member_id: id }, req.body, {
//       new: true
//     });
//     if (!Update) {
//       return res.status(404).json({ message: "Member not Update" });
//     }
//     return res.status(200).json({ message: "Updated Successful" });
//     console.log(Update);
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Failed to Update member", error: error.message });
//   }
// };
// exports.StatusUpdateMemberById = async (req, res) => {
//   const id = req.params.id;

//   console.log(req.params.id);
//   try {
//     const Update = await Member.findOneAndUpdate({ member_id: id }, req.body, {
//       new: true
//     });
//     if (!Update) {
//       return res.status(404).json({ message: "Member not Update" });
//     }
//     return res.status(200).json({ message: "Updated Successful" });
//     console.log(Update);
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Failed to Update member", error: error.message });
//   }
// };

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< <RazerPay Payment Gateway >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
