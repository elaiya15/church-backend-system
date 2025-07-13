const Offerings = require('../Schema/offerSchema');
const Member = require("../Schema/memberSchema");
const Family = require("../Schema/familySchema");

// Controller functions
const addOffering = async (req, res) => {
  try {
    const { category, member_id, member_name, date, amount, description } = req.body;
    // console.log(req.body);

    let memberData = null; // Declare memberData at the top

    // Fetch member data separately if category is not "NO_Name_Offerings"
    if (category !== "NO_Name_Offerings") {
      // console.log("memberData enter");

      memberData = await Member.findOne({ member_id }).select('member_photo').lean();
      // console.log(memberData);

      if (!memberData) {
        return res.status(404).json({ message: 'Member not found' });
      }
    }

    const newOffering = new Offerings({ category, member_id, member_name, date, amount, description });
    await newOffering.save();

    // Construct the response object
    let offeringWithPhoto;
    if (category !== "NO_Name_Offerings") {
      offeringWithPhoto = {
        ...newOffering.toObject(), // Convert Mongoose document to plain object
        member_photo: memberData.member_photo, // Only include member_photo if memberData exists
      };
    } else {
      offeringWithPhoto = {
        ...newOffering.toObject(), // Convert Mongoose document to plain object
      };
    }

    // Respond with the modified object
    return res.status(201).json({ message: 'Offering added successfully', offering: offeringWithPhoto });
  } catch (error) {
    // console.log({ error: error.message, error });
    res.status(400).json({ error: error.message });
  }
};


// const getDistinctCategories = async (req, res) => {
//   try {
//     const categories = await Offerings.distinct('category');
//     res.status(200).json(categories);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const getDistinctCategories = async (req, res) => {
  // category: { $ne: "MarriageOfferings" } // Exclude 'Furniture' category

  try {
    const categories = await Offerings.distinct('category', {
      category: { $ne: "MarriageOfferings"} // Exclude 'Furniture' category
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getMonthlyTotals = async (req, res) => {
  const { year } = req.query;
// console.log(req.query.year);
  if (!year) {
    return res.status(400).json({ message: 'Year is required' });
  }

  try {
    const pipeline = [
      {
        $match: {
          date: {
            $gte: new Date(year, 0, 1),
            $lt: new Date(Number(year) + 1, 0, 1),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$date' },
          totalAmount: { $sum: '$amount' },
        },
      },
    ];
    
    const expenses = await Offerings.aggregate(pipeline);

    // Create an array to hold the monthly totals
    const monthlyTotals = Array.from({ length: 12 }, (_, i) => ({ month: new Date(year, i, 1).toLocaleString('default', { month: 'short' }), amount: 0 }));

    // Update the monthlyTotals array with aggregated data
    expenses.forEach(expense => {
      const monthIndex = expense._id - 1; // MongoDB months are 1-based
      monthlyTotals[monthIndex].amount = expense.totalAmount;
    });

    res.status(200).json({chartData:monthlyTotals});
  } catch (error) {
    console.error('Failed to fetch expenses:', error);
    res.status(500).json({ message: 'Failed to fetch expenses', error: error.message });
  }
};


// Controller function to verify a member
const verifyMember = async (req, res) => {
  try {
    const {id} = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Member ID is required' });
    }

    const member = await Member.findOne({member_id:id}).select("member_id member_photo member_name").lean();

    if (!member) {
      return res.status(404).json({ message: 'Member not found or details do not match' });
    }

    res.status(200).json({ message: 'Member verified successfully', member });
  } catch (error) {
    res.status(500).json({ message: 'Failed to verify member', error: error.message });
  }
};


const getOfferingsByCategoryAndDate = async (req, res) => {
  try {
    const { category, fromdate, todate, page = 1, limit = 10, search = "", download } = req.query;

    const query = {}; 
    // Filtering by category
    if (category) query.category = category;

    // Filtering by date range
    if (fromdate) query.date = { ...query.date, $gte: new Date(fromdate) };
    if (todate) query.date = { ...query.date, $lte: new Date(todate) };

    const skip = (page - 1) * limit;

    // Get total count of offerings before pagination
    const totalData = await Offerings.countDocuments(query);

    // Query for offerings with sorting
    let offeringsQuery = Offerings.find(query).sort({ createdAt: -1 });

    // If not downloading, apply pagination
    if (!download) {
      offeringsQuery = offeringsQuery.skip(skip).limit(parseInt(limit));
    }

    // Fetch offerings
    let offerings = await offeringsQuery.lean();

    // **Calculate totalAmount for all offerings matching the category (without pagination or search)**
    const totalAmount = await Offerings.aggregate([
      { $match: query }, // Match the same query (category and date range)
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } }, // Group and sum up the amounts
    ]).then(result => (result[0] ? result[0].totalAmount : 0)); // Get totalAmount or default to 0

    // Apply search on the fetched data
    if (search) {
      const searchNormalized = search.replace(/\s+/g, '').toLowerCase();

      offerings = offerings.filter(item => {
        const memberNameNormalized = item.member_name?.replace(/\s+/g, '').toLowerCase() || "";
        const memberIdNormalized = item.member_id?.toLowerCase() || "";

        return (
          memberIdNormalized.includes(searchNormalized) || 
          memberNameNormalized.includes(searchNormalized)
        );
      });
    }

    // Count total after search
    const total = offerings.length;

    // Adjust pagination based on filtered results
    if (!download) {
      offerings = offerings.slice(0, limit); // Always return the first `limit` items from filtered results
    }

    // Calculate total pages based on `totalData`
    const totalPages = download ? 1 : Math.ceil(totalData / limit);

    // Return the response
    res.status(200).json({
      offerings,
      total, // Total offerings after search
      totalData, // Total offerings before search
      totalAmount, // Total amount for all offerings matching the category
      currentPage: download ? 1 : parseInt(page),
      totalPages
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




const getMarriageOfferingsByCategoryAndDate = async (req, res) => {
  try {
    const { category, fromdate, todate, page = 1, limit = 10, search = "", download } = req.query;

    const query = {}; 

    // Filtering by category
    if (category) query.category = category;

    // Filtering by date range
    if (fromdate) query.date = { ...query.date, $gte: new Date(fromdate) };
    if (todate) query.date = { ...query.date, $lte: new Date(todate) };

    const skip = (page - 1) * limit;

    // Get total count of offerings before pagination
    const totalData = await Offerings.countDocuments(query);

    // Query for offerings with sorting
    let offeringsQuery = Offerings.find(query).sort({ createdAt: -1 });

    // If not downloading, apply pagination
    if (!download) {
      offeringsQuery = offeringsQuery.skip(skip).limit(parseInt(limit));
    }

    // Fetch offerings
    let offerings = await offeringsQuery.lean();

    // **Find and add the wife’s name for each offering**
    for (let offering of offerings) {
      const family = await Family.findOne({ head: offering.member_id });

      if (family) {
        const wife = family.members.find(member => member.relationship_with_family_head === "Wife");

        if (wife) {
          const wifeDetails = await Member.findOne({ member_id: wife.ref_id });

          if (wifeDetails) {
            offering.member_wife = wifeDetails.member_name; // Add wife's name to the offering
          }
        }
      }
    }

    // **Calculate totalAmount for all offerings matching the category (without pagination or search)**
    const totalAmount = await Offerings.aggregate([
      { $match: query }, // Match the same query (category and date range)
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } }, // Sum up the amounts
    ]).then(result => (result[0] ? result[0].totalAmount : 0)); // Get totalAmount or default to 0

    // Apply search on the fetched data
    if (search) {
      const searchNormalized = search.replace(/\s+/g, '').toLowerCase();

      offerings = offerings.filter(item => {
        const memberNameNormalized = item.member_name?.replace(/\s+/g, '').toLowerCase() || "";
        const memberIdNormalized = item.member_id?.toLowerCase() || "";

        return (
          memberIdNormalized.includes(searchNormalized) || 
          memberNameNormalized.includes(searchNormalized)
        );
      });
    }

    // Count total after search
    const total = offerings.length;

    // Adjust pagination based on filtered results
    if (!download) {
      offerings = offerings.slice(0, limit); // Always return the first `limit` items from filtered results
    }

    // Calculate total pages based on `totalData`
    const totalPages = download ? 1 : Math.ceil(totalData / limit);

    // Return the response
    res.status(200).json({
      offerings,
      total, // Total offerings after search
      totalData, // Total offerings before search
      totalAmount, // Total amount for all offerings matching the category
      currentPage: download ? 1 : parseInt(page),
      totalPages
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  addOffering,
  getMonthlyTotals,
  getDistinctCategories,
  // getOfferingsByCategory,
  // getOfferingsByDateRange,
  // getAll,
  getMarriageOfferingsByCategoryAndDate,
  verifyMember,
  getOfferingsByCategoryAndDate,

};