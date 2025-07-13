const Expense = require('../Schema/Expense');
const Member = require("../Schema/memberSchema");

// Controller functions
// exports.addExpense = async (req, res) => {
//   try {
//   const image = req.files?.image?.[0]?.buffer || null;
//   const { category,  date, amount, description } = req.body;
//   const newExpense = new Expense({ category, date, amount, description,image});
//     await newExpense.save();

//     // Respond with the modified object
//     res.status(201).json({ message: 'Expense added successfully', Expense: newExpense });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

exports.addExpense = async (req, res) => {
  try {
    const { category, date, amount, description } = req.body;
    let imageUrl = null;

    if (req.file) {
      // Save the image URL (relative to public folder)
      imageUrl = `/uploads/expense/${req.file.filename}`;
    }

    // Create the expense object
    const newExpense = new Expense({
      category,
      date,
      amount,
      description,
      image: imageUrl, // Save image URL in DB
    });

    // Save the expense to the database
    await newExpense.save();

    res.status(201).json({ message: 'Expense added successfully', expense: newExpense });
  } catch (error) {
    console.error("Error saving expense:", error);
    res.status(400).json({ error: error.message });
  }
};


exports.getDistinctCategories = async (req, res) => {
  try {
    const categories = await Expense.distinct('category');
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





exports.getSingleExpense= async (req, res) => {
  const {id}=req.params
  try {
    const ExpenseSingle = await Expense.findOne({_id:id});
    res.status(200).json(ExpenseSingle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getMonthlyTotals = async (req, res) => {
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

    const expenses = await Expense.aggregate(pipeline);

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
exports.verifyMember = async (req, res) => {
  try {
    const {id} = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Member ID is required' });
    }

    const member = await Member.findOne({member_id:id}).select("member_id").lean();

    if (!member) {
      return res.status(404).json({ message: 'Member not found or details do not match' });
    }

    res.status(200).json({ message: 'Member verified successfully', member });
  } catch (error) {
    res.status(500).json({ message: 'Failed to verify member', error: error.message });
  }
};
// getExpenseByCategory

exports.getExpenseByCategoryAndDate = async (req, res) => {
  try {
    const { category, fromdate, todate, page , limit, search } = req.query;

    const query = {};
    if (category) query.category = category;
    if (fromdate) query.date = { ...query.date, $gte: new Date(fromdate) };
    if (todate) query.date = { ...query.date, $lte: new Date(todate) };
    if (search) {
      query.$or = [
        { description: { $regex: search, $options: 'i' } },
        { amount: parseInt(search) },
        { date: new Date(search) },
      ];
    }

    const skip = (page - 1) * limit;

    const Expenses = await Expense.find(query)
  .sort({ _id: -1 })
  .select('-image') // Exclude the "image" field from the query results
  .skip(skip)
  .limit(parseInt(limit))
  .lean();
  
    const total = await Expense.countDocuments(query);

    const totalAmountResult = await Expense.aggregate([
      { $match: query },
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
    ]);

    const totalAmount = totalAmountResult.length > 0 ? totalAmountResult[0].totalAmount : 0;

    res.status(200).json({
      Expenses,
      total,
      totalAmount,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// exports.getExpenseByCategoryAndDate = async (req, res) => {
//   try {
//     const { category, fromdate, todate, page = 1, limit = 10, search,download } = req.query;

//     const query = {};
//     if (category) query.category = category;
//     if (fromdate) query.date = { ...query.date, $gte: new Date(fromdate) };
//     if (todate) query.date = { ...query.date, $lte: new Date(todate) };
//     if (search) {
//       query.$or = [
//         { description: { $regex: search, $options: 'i' } },
//         { amount: parseInt(search) },
//         { date: new Date(search) },
//       ];
//     }

    
//     const skip = (page - 1) * limit;

//     let Expenses = Expenses.find(query).sort({ createdAt: -1 });

//  if (!download) {
//    Expenses = await Expense.find(query)
//   .sort({ _id: -1 })
//   .select('-image') // Exclude the "image" field from the query results
//   .skip(skip)
//   .limit(parseInt(limit))
//   .lean();
//  }
//     const total = await Expense.countDocuments(query);

//     const totalAmountResult = await Expense.aggregate([
//       { $match: query },
//       { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
//     ]);

//     const totalAmount = totalAmountResult.length > 0 ? totalAmountResult[0].totalAmount : 0;

//     res.status(200).json({
//       Expenses,
//       total,
//       totalAmount,
//       page: parseInt(page),
//       pages: Math.ceil(total / limit)
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
