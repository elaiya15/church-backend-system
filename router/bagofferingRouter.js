const express = require('express');
const router = express.Router();
const bagOfferingsController = require('../controllers/bagOffering');

// Create a new Bag Offering
router.post('/add', bagOfferingsController.createBagOffering);

// Get all Bag Offerings
router.get('/category', bagOfferingsController.getAllBagOfferingsByCategoryAndDate);

// Get all Bag categories
router.get('/categories', bagOfferingsController.getDistinctCategories);


// Get a single Bag Offering by ID
router.get('/:id', bagOfferingsController.getBagOfferingById);

// Update a Bag Offering by ID
router.put('/:id', bagOfferingsController.updateBagOffering);

// Delete a Bag Offering by ID
router.delete('/:id', bagOfferingsController.deleteBagOffering);

module.exports = router;
