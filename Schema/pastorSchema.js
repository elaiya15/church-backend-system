const mongoose = require("mongoose");

const pastorMemberSchema = new mongoose.Schema(
  {
    familyhead_id: { type: String, unique: true, sparse: true },
    familyId: {
      type: String,
      required: true,
    },
    member_id: {
      type: String,
      unique: true,
    },
    mobile_number: {
      type: String,
    },
    member_name: {
      type: String,
    },
    member_tamil_name: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    date_of_birth: {
      type: Date,
    },
    email: {
      type: String,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
    },
    occupation: {
      type: String,
    },
    community: {
      type: String,
    },
    nationality: {
      type: String,
    },
    member_photo: {
      type: String,
    },
    permanent_address: {},
    present_address: {},

    joined_date: {
      type: Date,
    },
    reason_for_inactive: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

const pastorMember = mongoose.model("pastorMember", pastorMemberSchema);

module.exports = pastorMember;
