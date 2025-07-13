const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the MonthlyOfferings schema
const OfferingsSchema = new Schema({
  category: {
    type: String,
  },
  member_id: {
    type: String,
  },
  member_name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
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
const Offerings = mongoose.model('Offerings', OfferingsSchema);

module.exports = Offerings;
