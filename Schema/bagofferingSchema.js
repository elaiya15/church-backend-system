const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the MonthlyOfferings schema
const BagOfferingsSchema = new Schema({
  category: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },
  day: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Create the MonthlyOfferings model
const BagOfferings = mongoose.model('BagOfferings', BagOfferingsSchema);

module.exports = BagOfferings;
