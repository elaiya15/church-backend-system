const mongoose = require("mongoose");

const familyListSchema = new mongoose.Schema({

  family_id: {
    type: String,
    unique: true,
  },
  head: {
    type: String,
    required: true
  },
  members: []
}, { timestamps: true });

const FamilyList = mongoose.model("familyList", familyListSchema);

module.exports = FamilyList;
