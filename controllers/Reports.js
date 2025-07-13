const Member = require("../Schema/memberSchema");
const moment = require('moment'); // For date manipulation
const Family = require("../Schema/familySchema");


exports.marriage_reminders = async (req, res) => {
  try {
    const { fromDate, toDate, searchTerm = '', day, page = 1, limit = 15, download } = req.query;
   

    // Find all families
    const families = await Family.find();

    // Filter families where 'relationship_with_family_head' is 'Wife'
    const familiesWithWife = families.filter(family =>
      family.members.some(member => member.relationship_with_family_head === 'Wife')
    );

    // Segregate the relevant data (families with wife) for further use
    const result = familiesWithWife.map(family => {
      const wifeMember = family.members.find(member => member.relationship_with_family_head === 'Wife');
      return {
        family_id: family.family_id,
        husband_id: family.head,
        wife_id: wifeMember.ref_id, // Wife's member ID
      };
    });

    // Prepare the final data array
    let finalData = [];

    // Iterate over the result to find matching husband and wife in the Member schema
    for (let familyData of result) {
      const { husband_id, wife_id, family_id } = familyData;

      // Find husband and wife in Member schema
      const husband = await Member.findOne({ member_id: husband_id, status: 'Active' });
      const wife = await Member.findOne({ member_id: wife_id, status: 'Active' });

      if (!husband || !wife || !husband.marriage_date || !wife.marriage_date) continue;

      // Check if both have the same marriage_date
      if (!moment(husband.marriage_date).isSame(wife.marriage_date, 'day')) continue;

      // Format marriage date and get day of the week
      const marriageDate = moment(husband.marriage_date).format('YYYY-MM-DD');
      const dayOfWeek = moment(husband.marriage_date).format('dddd');

      // Push final data to the array
      finalData.push({
        FamilyID: family_id,
        HusbandName: husband.member_name,
        WifeName: wife.member_name,
        MarriageDate: marriageDate,
        Day: dayOfWeek
      });
    }

    // Filtering based on fromDate and toDate
    if (fromDate && toDate) {
      const [fromMonth, fromDay] = fromDate.split('-').slice(1).map(Number);
      const [toMonth, toDay] = toDate.split('-').slice(1).map(Number);

      const fromMonthDay = moment({ month: fromMonth - 1, day: fromDay }).format('MM-DD');
      const toMonthDay = moment({ month: toMonth - 1, day: toDay }).format('MM-DD');

      finalData = finalData.filter(item => {
        const marriageMonthDay = moment(item.MarriageDate).format('MM-DD');
        return marriageMonthDay >= fromMonthDay && marriageMonthDay <= toMonthDay;
      });
    }

    // Filter data by searchTerm (search in HusbandName or WifeName)
    if (searchTerm) {
      finalData = finalData.filter(item =>
        item.HusbandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.FamilyID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.WifeName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by specific day if provided
    if (day && day !== 'All') {
      finalData = finalData.filter(member => member.Day === day);
    }

    // If download is true, send the full data without pagination
    if (download && download === 'true') {
      return res.status(200).json({
        MarriageData: finalData,
        totalRecords: finalData.length
      });
    }

    // Pagination logic
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedData = finalData.slice(startIndex, endIndex);

    // Output the paginated final data
    res.status(200).json({
      MarriageData: paginatedData,
      totalRecords: finalData.length,
      currentPage: page,
      totalPages: Math.ceil(finalData.length / limit)
    });

  } catch (error) {
    console.error('Error fetching marriage reminders:', error);
    res.status(500).json({ message: 'Server error' });
  }
};





exports.birthday_reminders = async (req, res) => {
  try {
    // Get the fromDate, toDate, searchTerm, day, page, and limit from query parameters
    const { fromDate, toDate, searchTerm = '', day, page = 1, limit = 15,download } = req.query;

    // Default date range if not provided
    const dateRange = fromDate && toDate ? [fromDate, toDate] : null;

    // Accessing the values
    const from = dateRange[0];
    const to = dateRange[1];

    // Split the dates to extract day and month
    const [fromYear, fromMonth, fromDay] = from.split('-').map(Number);
    const [toYear, toMonth, toDay] = to.split('-').map(Number);

    // Set the current year for the comparison
    const currentYear = moment().year();

    // Create date objects for the given range
    const startDate = moment({ year: currentYear, month: fromMonth - 1, day: fromDay }).startOf('day');
    const endDate = moment({ year: currentYear, month: toMonth - 1, day: toDay }).endOf('day');
    
    // Prepare match conditions for search
    const searchCondition = searchTerm
      ? {
          $or: [
            { member_name: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive search
            { family_id: { $regex: searchTerm, $options: 'i' } },
            { member_id: { $regex: searchTerm, $options: 'i' } },
          ],
        }
      : {};

    // Find members with birthdays within the specified range
    const BirthDayReminder = await Member.aggregate([
      {
        $project: {
          member_id: 1,
          member_name: 1,
          date_of_birth: 1,
          primary_family_id: 1,
          secondary_family_id: 1,
          month: { $month: "$date_of_birth" },
          day: { $dayOfMonth: "$date_of_birth" },
        },
      },
      {
        $addFields: {
          family_id: {
            $cond: {
              if: { $eq: ["$secondary_family_id", null] },
              then: "$primary_family_id",
              else: "$secondary_family_id",
            },
          },
        },
      },
      {
        $match: {
          $expr: {
            $and: [
              { $gte: [{ $dateFromParts: { year: currentYear, month: "$month", day: "$day" } }, startDate.toDate()] },
              { $lte: [{ $dateFromParts: { year: currentYear, month: "$month", day: "$day" } }, endDate.toDate()] },
            ],
          },
          ...searchCondition, // Add search condition here
        },
      }
    ]);

    // Apply the day filter to the data if provided
    let filteredData = BirthDayReminder;

    if (day && day !== 'All') {
      filteredData = BirthDayReminder.filter(member => {
        const dayOfWeek = moment(member.date_of_birth).format('dddd');
        return dayOfWeek === day;
      });
    }


    if (download && download === 'true') {
      return res.status(200).json({
        BirthDayReminder: filteredData,
        totalRecords: filteredData.length
      });
    }

    // Calculate total records after day filter
    const totalRecords = filteredData.length;

    // Apply pagination
    const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

    // Transform the day to a string representation
    const transformedReminder = paginatedData.map(member => {
      const dayOfWeek = moment(member.date_of_birth).format('dddd'); // Gets the day of the week
      return {
        _id: member._id,
        member_id: member.member_id,
        member_name: member.member_name,
        family_id: member.family_id,
        date_of_birth: member.date_of_birth,
        day: dayOfWeek,
      };
    });

    // Calculate totalPages
    const totalPages = totalRecords > 0 ? Math.ceil(totalRecords / limit) : 1;

    // Return the data with pagination metadata
    return res.json({
      BirthDayReminder: transformedReminder,
      currentPage: page,
      totalPages,
      totalRecords,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};














// exports.birthday_reminders = async (req, res) => {
//   try {
//     // Get the fromDate, toDate, searchTerm, page, and limit from query parameters
//     const { fromDate, toDate, searchTerm = '', page = 1, limit = 15 } = req.query;

    
//     // Default date range if not provided
//     const dateRange = fromDate && toDate ? [fromDate, toDate] : null;
//     // console.log(dateRange);
    
//     // Accessing the values
//     const from = dateRange[0];
//     const to = dateRange[1];


//     // Split the dates to extract day and month
//     const [fromYear, fromMonth,fromDay] = from.split('-').map(Number);
//     const [toYear, toMonth,toDay] = to.split('-').map(Number);

//     // Set the current year for the comparison
//     const currentYear = moment().year();

//     // Create date objects for the given range
//     const startDate = moment({ year: currentYear, month: fromMonth - 1, day: fromDay }).startOf('day');
//     const endDate = moment({ year: currentYear, month: toMonth - 1, day: toDay }).endOf('day');
// console.log("startDate",startDate);
// console.log("endDate",endDate);

//     // Prepare match conditions for search
//     const searchCondition = searchTerm
//       ? {
//           $or: [
//             { member_name: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive search
//             { family_id: { $regex: searchTerm, $options: 'i' } },
//             { member_id: { $regex: searchTerm, $options: 'i' } },
//           ],
//         }
//       : {};

//     // Find members with birthdays within the specified range
//     const BirthDayReminder = await Member.aggregate([
//       {
//         $project: {
//           member_id: 1,
//           member_name: 1,
//           date_of_birth: 1,
//           primary_family_id: 1,
//           secondary_family_id: 1,
//           month: { $month: "$date_of_birth" },
//           day: { $dayOfMonth: "$date_of_birth" },
//         },
//       },
//       {
//         $addFields: {
//           family_id: {
//             $cond: {
//               if: { $eq: ["$secondary_family_id", null] },
//               then: "$primary_family_id",
//               else: "$secondary_family_id",
//             },
//           },
//         },
//       },
//       {
//         $match: {
//           $expr: {
//             $and: [
//               { $gte: [{ $dateFromParts: { year: currentYear, month: "$month", day: "$day" } }, startDate.toDate()] },
//               { $lte: [{ $dateFromParts: { year: currentYear, month: "$month", day: "$day" } }, endDate.toDate()] },
//             ],
//           },
//           ...searchCondition, // Add search condition here
//         },
//       },
//       {
//         $skip: (page - 1) * limit, // Skip for pagination
//       },
//       {
//         $limit: parseInt(limit, 10), // Limit the number of results per page
//       },
//     ]);

//     // Transform the day to a string representation
//     const transformedReminder = BirthDayReminder.map(member => {
//       const dayOfWeek = moment(member.date_of_birth).format('dddd'); // Gets the day of the week
//       return {
//         _id: member._id,
//         member_id: member.member_id,
//         member_name: member.member_name,
//         family_id: member.family_id,
//         date_of_birth: member.date_of_birth,
//         day: dayOfWeek,
//       };
//     });

//     // Get the total count for pagination metadata
//   // Get the total count for pagination metadata
// const totalRecordsResult = await Member.aggregate([
//   {
//     $project: {
//       month: { $month: "$date_of_birth" },
//       day: { $dayOfMonth: "$date_of_birth" },
//     },
//   },
//   {
//     $match: {
//       $expr: {
//         $and: [
//           { $gte: [{ $dateFromParts: { year: currentYear, month: "$month", day: "$day" } }, startDate.toDate()] },
//           { $lte: [{ $dateFromParts: { year: currentYear, month: "$month", day: "$day" } }, endDate.toDate()] },
//         ],
//       },
//       ...searchCondition,
//     },
//   },
// ]).count("total");

// // Extract the total count from the result
// const totalRecords = totalRecordsResult.length > 0 ? totalRecordsResult[0].total : 0;

// // Calculate totalPages
// const totalPages = totalRecords > 0 ? Math.ceil(totalRecords / limit) : 1;

// // Return the data with pagination metadata
// res.json({
//   startDate: startDate.format('YYYY-MM-DD'),
//   endDate: endDate.format('YYYY-MM-DD'),
//   BirthDayReminder: transformedReminder,
//   currentPage: page,
//   totalPages,
//   totalRecords
// });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };



exports.getBirthdayByCategoryAndDate = async (req, res) => {
  try {
    const {
      status,
      fromdate,
      todate,
      page = 1,
      limit = 10,
      search
    } = req.query;
    const query = {};
    if (status) query.status = { $regex: `^${status}$`, $options: "i" }; // Case-insensitive exact match for status
    if (fromdate)
      query.date_of_birth = {
        ...query.date_of_birth,
        $gte: new Date(fromdate)
      };
    if (todate)
      query.date_of_birth = { ...query.date_of_birth, $lte: new Date(todate) };
    if (search) {
      query.$or = [
        { member_id: { $regex: search, $options: "i" } },
        { member_name: { $regex: search, $options: "i" } },
        { primary_family_id: { $regex: search, $options: "i" } },
        { secondary_family_id: { $regex: search, $options: "i" } }
      ];
    }

    const skip = (page - 1) * limit;

    const Birthday = await Member.find(query)
      .sort({ date_of_birth: 1 })
      .select(
        "member_id member_name date_of_birth primary_family_id secondary_family_id status"
      )
    //   .skip(skip)
    //   .limit(parseInt(limit))
    //   .lean();

    const total = await Member.countDocuments(query);

    res.status(200).json({
      Birthday,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMarriageByCategoryAndDate = async (req, res) => {
  try {
    const {
      status,
      fromdate,
      todate,
      page = 1,
      limit = 10,
      search
    } = req.query;

    //   const query = {};
    const query = {
      marriage_date: { $ne: null }, // Ensure marriage_date is not null
       
    };
    if (status) query.status = { $regex: `^${status}$`, $options: "i" }; // Case-insensitive exact match for status
    if (fromdate)
      query.marriage_date = {
        ...query.marriage_date,
        $gte: new Date(fromdate)
      };
    if (todate)
      query.marriage_date = { ...query.marriage_date, $lte: new Date(todate) };
    if (search) {
      query.$or = [
        { member_id: { $regex: search, $options: "i" } },
        { member_name: { $regex: search, $options: "i" } },
        { primary_family_id: { $regex: search, $options: "i" } },
        { secondary_family_id: { $regex: search, $options: "i" } }
      ];
    }

    const skip = (page - 1) * limit;

    const Marriage = await Member.find(query)
      .sort({ _id: -1 })
      .select(
        "member_id member_name marriage_date primary_family_id secondary_family_id status"
      )
    //   .skip(skip)
    //   .limit(parseInt(limit))
    //   .lean();

    const total = await Member.countDocuments(query);

    res.status(200).json({
      Marriage,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBaptismByCategoryAndDate = async (req, res) => {
  try {
    const {
      status,
      fromdate,
      todate,
      page = 1,
      limit = 10,
      search
    } = req.query;

      const query = {};
    // const query = {
    //   secondary_family_id: { $ne: null } // Ensure marriage_date is not null
    // };
    if (status) query.status = { $regex: `^${status}$`, $options: "i" }; // Case-insensitive exact match for status
    if (fromdate)
      query.communion_date = {
        ...query.baptized_date,
        $gte: new Date(fromdate)
      };
    if (todate)
      query.baptized_date = { ...query.baptized_date, $lte: new Date(todate) };
    if (search) {
      query.$or = [
        { member_id: { $regex: search, $options: "i" } },
        { member_name: { $regex: search, $options: "i" } },
        { primary_family_id: { $regex: search, $options: "i" } },
        { secondary_family_id: { $regex: search, $options: "i" } }
      ];
    }

    const skip = (page - 1) * limit;

    const Baptism = await Member.find(query)
      .sort({ _id: -1 })
      .select(
        "member_id member_name baptized_date primary_family_id secondary_family_id status"
      )
    //   .skip(skip)
    //   .limit(parseInt(limit))
    //   .lean();

    const total = await Member.countDocuments(query);

    res.status(200).json({
      Baptism,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCommunionByCategoryAndDate = async (req, res) => {
  try {
    const {
      status,
      fromdate,
      todate,
      page = 1,
      limit = 10,
      search
    } = req.query;

      const query = {};
    // const query = {
    //   secondary_family_id: { $ne: null } // Ensure marriage_date is not null
    // };
    if (status) query.status = { $regex: `^${status}$`, $options: "i" }; // Case-insensitive exact match for status
    if (fromdate)
      query.communion_date = {
        ...query.communion_date,
        $gte: new Date(fromdate)
      };
    if (todate)
      query.communion_date = {
        ...query.communion_date,
        $lte: new Date(todate)
      };
    if (search) {
      query.$or = [
        { member_id: { $regex: search, $options: "i" } },
        { member_name: { $regex: search, $options: "i" } },
        { primary_family_id: { $regex: search, $options: "i" } },
        { secondary_family_id: { $regex: search, $options: "i" } }
      ];
    }

    const skip = (page - 1) * limit;

    const Communion = await Member.find(query)
      .sort({ _id: -1 })
      .select(
        "member_id member_name communion_date primary_family_id secondary_family_id status"
      )
    //   .skip(skip)
    //   .limit(parseInt(limit))
    //   .lean();

    const total = await Member.countDocuments(query);

    res.status(200).json({
      Communion,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getInactiveByCategoryAndDate = async (req, res) => {
  try {
    const {
      status,
      fromdate,
      todate,
      page = 1,
      limit = 10,
      search
    } = req.query;

    //   const query = {};
    const query = {
      reason_for_inactive: { $ne: null }, // Ensure marriage_date is not null
      left_date: { $ne: null }, // Ensure marriage_date is not null
    };
    if (status) query.reason_for_inactive = { $regex: `^${status}$`, $options: "i" }; // Case-insensitive exact match for status
    if (fromdate)
      query.communion_date = {
        ...query.communion_date,
        $gte: new Date(fromdate)
      };
    if (todate)
      query.communion_date = {
        ...query.communion_date,
        $lte: new Date(todate)
      };
    if (search) {
      query.$or = [
        { member_id: { $regex: search, $options: "i" } },
        { member_name: { $regex: search, $options: "i" } },
        { primary_family_id: { $regex: search, $options: "i" } },
        { secondary_family_id: { $regex: search, $options: "i" } }
      ];
    }

    const skip = (page - 1) * limit;

    const Inactive = await Member.find(query)
      .sort({ _id: -1 })
      .select(
        "member_id member_name left_date reason_for_inactive primary_family_id secondary_family_id status"
      )
    //   .skip(skip)
    //   .limit(parseInt(limit))
    //   .lean();

    const total = await Member.countDocuments(query);

    res.status(200).json({
      Inactive,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getRejoiningByCategoryAndDate = async (req, res) => {
  try {
    const {
      status,
      fromdate,
      todate,
      page = 1,
      limit = 10,
      search
    } = req.query;

    //   const query = {};
    const query = {
      reason_for_rejoining: { $ne: null },
      rejoining_date: { $ne: null } // Ensure marriage_date is not null
    };
    if (status) query.status = { $regex: `^${status}$`, $options: "i" }; // Case-insensitive exact match for status
    if (fromdate)
      query.communion_date = {
        ...query.communion_date,
        $gte: new Date(fromdate)
      };
    if (todate)
      query.communion_date = {
        ...query.communion_date,
        $lte: new Date(todate)
      };
    if (search) {
      query.$or = [
        { member_id: { $regex: search, $options: "i" } },
        { member_name: { $regex: search, $options: "i" } },
        { primary_family_id: { $regex: search, $options: "i" } },
        { secondary_family_id: { $regex: search, $options: "i" } }
      ];
    }

    const skip = (page - 1) * limit;

    const Rejoining = await Member.find(query)
      .sort({ _id: -1 })
      .select(
        "member_id member_name reason_for_rejoining rejoining_date primary_family_id secondary_family_id status"
      )
    //   .skip(skip)
    //   .limit(parseInt(limit))
    //   .lean();

    const total = await Member.countDocuments(query);

    res.status(200).json({
      Rejoining,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// exports.birthday_reminders = async (req, res) => {
//   try {
//     // Get the fromDate, toDate, searchTerm, page, and limit from query parameters
//     const { fromDate, toDate, searchTerm = '', page = 1, limit = 15 } = req.query;

//     // Default date range only if fromDate and toDate are provided
//     const dateRange = fromDate && toDate ? [fromDate, toDate] : null;

//     // Prepare search condition for member
//     const searchCondition = searchTerm
//       ? {
//           $or: [
//             { member_name: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive search
//             { family_id: { $regex: searchTerm, $options: 'i' } },
//             { member_id: { $regex: searchTerm, $options: 'i' } },
//           ],
//         }
//       : {};

//     // Build the date range match condition only if fromDate and toDate are provided
//     let dateMatchCondition = {};

//     if (dateRange) {
//       const from = dateRange[0];
//       const to = dateRange[1];

//       const [fromYear, fromMonth, fromDay] = from.split('-').map(Number);
//       const [toYear, toMonth, toDay] = to.split('-').map(Number);

//       const currentYear = moment().year();

//       const startDate = moment({ year: currentYear, month: fromMonth - 1, day: fromDay }).startOf('day');
//       const endDate = moment({ year: currentYear, month: toMonth - 1, day: toDay }).endOf('day');

//       dateMatchCondition = {
//         $expr: {
//           $and: [
//             { $gte: [{ $dateFromParts: { year: currentYear, month: "$month", day: "$day" } }, startDate.toDate()] },
//             { $lte: [{ $dateFromParts: { year: currentYear, month: "$month", day: "$day" } }, endDate.toDate()] },
//           ],
//         },
//       };
//     }

//     // Find members with birthdays and apply the search and date filters
//     const BirthDayReminder = await Member.aggregate([
//       {
//         $project: {
//           member_id: 1,
//           member_name: 1,
//           date_of_birth: 1,
//           primary_family_id: 1,
//           secondary_family_id: 1,
//           month: { $month: "$date_of_birth" },
//           day: { $dayOfMonth: "$date_of_birth" },
//         },
//       },
//       {
//         $addFields: {
//           family_id: {
//             $cond: {
//               if: { $eq: ["$secondary_family_id", null] },
//               then: "$primary_family_id",
//               else: "$secondary_family_id",
//             },
//           },
//         },
//       },
//       {
//         $match: {
//           ...dateMatchCondition, // Apply date range only if dateRange is provided
//           ...searchCondition,    // Always apply search condition
//         },
//       },
//       {
//         $skip: (page - 1) * limit, // Skip for pagination
//       },
//       {
//         $limit: parseInt(limit, 10), // Limit the number of results per page
//       },
//     ]);

//     // Transform the day to a string representation
//     const transformedReminder = BirthDayReminder.map(member => {
//       const dayOfWeek = moment(member.date_of_birth).format('dddd'); // Gets the day of the week
//       return {
//         _id: member._id,
//         member_id: member.member_id,
//         member_name: member.member_name,
//         family_id: member.family_id,
//         date_of_birth: member.date_of_birth,
//         day: dayOfWeek,
//       };
//     });

//     // Get the total count for pagination metadata
//     const totalRecordsResult = await Member.aggregate([
//       {
//         $project: {
//           month: { $month: "$date_of_birth" },
//           day: { $dayOfMonth: "$date_of_birth" },
//         },
//       },
//       {
//         $match: {
//           ...dateMatchCondition, // Apply date range only if dateRange is provided
//           ...searchCondition,    // Always apply search condition
//         },
//       },
//     ]).count("total");

//     // Extract the total count from the result
//     const totalRecords = totalRecordsResult.length > 0 ? totalRecordsResult[0].total : 0;

//     // Calculate totalPages
//     const totalPages = totalRecords > 0 ? Math.ceil(totalRecords / limit) : 1;

//     // Return the data with pagination metadata
//     res.json({
//       startDate: dateRange ? moment(dateRange[0]).format('YYYY-MM-DD') : null,
//       endDate: dateRange ? moment(dateRange[1]).format('YYYY-MM-DD') : null,
//       BirthDayReminder: transformedReminder,
//       currentPage: page,
//       totalPages,
//       totalRecords
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


