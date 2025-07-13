const mongoose = require("mongoose");

const familyMemberSchema = new mongoose.Schema(
  {
    primary_family_id: {
      type: String,
      ref: "Family"
    },
    secondary_family_id: {
      type: String,
      default: null
    },
    member_id: {
      type: String,
      unique: true
    },
    assigned_member_id: {
      type: String
    },
    mobile_number: {
      type: String
    },
    member_name: {
      type: String
    },
    member_tamil_name: {
      type: String
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"]
    },
    date_of_birth: {
      type: Date
    },
    email: {
      type: String,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."]
    },
    occupation: {
      type: String
    },
    community: {
      type: String
    },
    nationality: {
      type: String
    },
    member_photo: {
      type: String
    },
    permanent_address: {},
    present_address: {},
    baptized_date: {
      type: Date
    },
    communion_date: {
      type: Date
    },
    marriage_date: {
      type: Date,
      default: null
    },
    joined_date: {
      type: Date
    },
    left_date: {
      type: Date
    },
    reason_for_inactive: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: null
    },
    rejoining_date: {
      type: String,
      default: null
    },
    reason_for_rejoining: {
      type: String,
      default: null
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active"
    }
  },
  { timestamps: true }
);

const Member = mongoose.model("Member", familyMemberSchema);

module.exports = Member;
