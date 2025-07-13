const BagOfferings = require('../Schema/bagofferingSchema');

// Create a new Bag Offering
exports.createBagOffering = async (req, res) => {
    try {
        const { category, date, amount, description } = req.body;
        const newOffering = new BagOfferings({ category, date, amount, description });
        await newOffering.save();
        res.status(201).json(newOffering);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all Bag category
exports.getDistinctCategories = async (req, res) => {
  try {
    const categories = await BagOfferings.distinct('category');
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all Bag Offerings
// exports.getAllBagOfferings = async (req, res) => {
//     try {
//         const offerings = await BagOfferings.find();
//         res.status(200).json(offerings);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };


exports.getAllBagOfferingsByCategoryAndDate = async (req, res) => {
    try {
      const { category, fromdate, todate, page = 1, limit = 10, download } = req.query;
  
      const query = {}; 
      // Filtering by category
      if (category) query.category = category;
  
      // Filtering by date range
      if (fromdate || todate) {
        query.date = {};
        if (fromdate) query.date.$gte = new Date(fromdate);
        if (todate) query.date.$lte = new Date(todate);
      }
  
      const skip = (page - 1) * limit;
  
      // Get total count of offerings before pagination
      const totalData = await BagOfferings.countDocuments(query);
  
      // Query for BagOfferings with sorting
      let bagOfferingsQuery = BagOfferings.find(query).sort({ createdAt: -1 });
  
      // If not downloading, apply pagination
      if (!download) {
        bagOfferingsQuery = bagOfferingsQuery.skip(skip).limit(parseInt(limit));
      }
  
      // Fetch BagOfferings
      let bagOfferings = await bagOfferingsQuery.lean();
  
      // **Calculate totalAmount for all BagOfferings matching the category (without pagination)**
      const totalAmount = await BagOfferings.aggregate([
        { $match: query }, // Match the same query (category and date range)
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } }, // Group and sum up the amounts
      ]).then(result => (result[0] ? result[0].totalAmount : 0)); // Get totalAmount or default to 0
  
      // Count total (after pagination)
      const total = bagOfferings.length;
  
      // Adjust pagination based on filtered results
      if (!download) {
        bagOfferings = bagOfferings.slice(0, limit); // Always return the first `limit` items from filtered results
      }
  
      // Calculate total pages based on `totalData`
      const totalPages = download ? 1 : Math.ceil(totalData / limit);
  
      // Return the response
      res.status(200).json({
        bagOfferings, // Updated variable name to lowercase
        total, // Total BagOfferings after pagination
        totalData, // Total BagOfferings before pagination
        totalAmount, // Total amount for all BagOfferings matching the category
        currentPage: download ? 1 : parseInt(page),
        totalPages
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

// Get a single Bag Offering by ID



exports.getBagOfferingById = async (req, res) => {
    try {
        const offering = await BagBagOfferings.findById(req.params.id);
        if (!offering) {
            return res.status(404).json({ message: 'Bag Offering not found' });
        }
        res.status(200).json(offering);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a Bag Offering by ID
exports.updateBagOffering = async (req, res) => {
    try {
        const { category, date, amount, description } = req.body;
        const updatedOffering = await BagOfferings.findByIdAndUpdate(
            req.params.id,
            { category, date, amount, description },
            { new: true, runValidators: true }
        );

        if (!updatedOffering) {
            return res.status(404).json({ message: 'Bag Offering not found' });
        }
        res.status(200).json(updatedOffering);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a Bag Offering by ID
exports.deleteBagOffering = async (req, res) => {
    try {
        const deletedOffering = await BagOfferings.findByIdAndDelete(req.params.id);
        if (!deletedOffering) {
            return res.status(404).json({ message: 'Bag Offering not found' });
        }
        res.status(200).json({ message: 'Bag Offering deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
