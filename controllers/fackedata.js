[
    { "familyId": "BIL202401", "husband": "David", "wife": "Reenu", "marriageDate": "09/01/2024" },
    { "familyId": "BIL202402", "husband": "Joseph", "wife": "Rani", "marriageDate": "09/02/2024" },
    { "familyId": "BIL202403", "husband": "John", "wife": "Mary", "marriageDate": "09/03/2024" },
    { "familyId": "BIL202404", "husband": "Samuel", "wife": "Anna", "marriageDate": "09/04/2024" },
    { "familyId": "BIL202405", "husband": "Mark", "wife": "Sophia", "marriageDate": "09/05/2024" },
    { "familyId": "BIL202406", "husband": "Peter", "wife": "Lily", "marriageDate": "09/06/2024" },
    { "familyId": "BIL202407", "husband": "Paul", "wife": "Grace", "marriageDate": "09/07/2024" },
    { "familyId": "BIL202408", "husband": "Michael", "wife": "Olivia", "marriageDate": "09/08/2024" },
    { "familyId": "BIL202409", "husband": "James", "wife": "Emily", "marriageDate": "09/09/2024" },
    { "familyId": "BIL202410", "husband": "Andrew", "wife": "Isabella", "marriageDate": "09/10/2024" },
    { "familyId": "BIL202411", "husband": "Henry", "wife": "Amelia", "marriageDate": "09/11/2024" },
    { "familyId": "BIL202412", "husband": "Robert", "wife": "Charlotte", "marriageDate": "09/12/2024" },
    { "familyId": "BIL202413", "husband": "William", "wife": "Evelyn", "marriageDate": "09/13/2024" },
    { "familyId": "BIL202414", "husband": "Thomas", "wife": "Harper", "marriageDate": "09/14/2024" },
    { "familyId": "BIL202415", "husband": "George", "wife": "Ella", "marriageDate": "09/15/2024" },
    { "familyId": "BIL202416", "husband": "Daniel", "wife": "Ava", "marriageDate": "09/16/2024" },
    { "familyId": "BIL202417", "husband": "Matthew", "wife": "Mia", "marriageDate": "09/17/2024" },
    { "familyId": "BIL202418", "husband": "Lucas", "wife": "Luna", "marriageDate": "09/18/2024" },
    { "familyId": "BIL202419", "husband": "Oliver", "wife": "Zoe", "marriageDate": "09/19/2024" },
    { "familyId": "BIL202420", "husband": "Jack", "wife": "Nora", "marriageDate": "09/20/2024" },
    { "familyId": "BIL202421", "husband": "Charlie", "wife": "Scarlett", "marriageDate": "09/21/2024" },
    { "familyId": "BIL202422", "husband": "Jacob", "wife": "Lily", "marriageDate": "09/22/2024" },
    { "familyId": "BIL202423", "husband": "Ethan", "wife": "Violet", "marriageDate": "09/23/2024" },
    { "familyId": "BIL202424", "husband": "Alexander", "wife": "Hazel", "marriageDate": "09/24/2024" },
    { "familyId": "BIL202425", "husband": "Benjamin", "wife": "Ellie", "marriageDate": "09/25/2024" },
    { "familyId": "BIL202426", "husband": "Owen", "wife": "Aurora", "marriageDate": "09/26/2024" },
    { "familyId": "BIL202427", "husband": "Elijah", "wife": "Savannah", "marriageDate": "09/27/2024" },
    { "familyId": "BIL202428", "husband": "Ryan", "wife": "Abigail", "marriageDate": "09/28/2024" },
    { "familyId": "BIL202429", "husband": "Noah", "wife": "Hannah", "marriageDate": "09/29/2024" },
    { "familyId": "BIL202430", "husband": "Liam", "wife": "Sofia", "marriageDate": "09/30/2024" }
  ]
 







  const Member = require("../Schema/memberSchema");
const moment = require('moment'); // For date manipulation

const ReminderBirthdayDate = async (req, res) => {
  try {
    // Get the week offset from query parameters, default is 0 (current week)
    // const weekOffset = parseInt(req.query.offset) || 0;
    const offset=0
    const weekOffset = parseInt(offset) || 0;
    
    // Calculate the start and end dates of the week based on the offset
    const today = moment();
    const startOfWeek = today.clone().startOf('week').add(weekOffset * 7, 'days');
    const endOfWeek = startOfWeek.clone().endOf('week');

    // Format start and end of the week to compare dates
    const startDate = startOfWeek.format('YYYY-MM-DD');
    const endDate = endOfWeek.format('YYYY-MM-DD');

    // Find members with birthdays within the week
    const BirthDayReminder = await Member.aggregate([
      {
        $project: {
          member_id: 1,
          member_name: 1,
          date_of_birth: 1,
          month: { $month: "$date_of_birth" },
          day: { $dayOfMonth: "$date_of_birth" }
        }
      },
      {
        $match: {
          $expr: {
            $and: [
              { $gte: [ { $dateFromParts: { year: { $year: startOfWeek.toDate() }, month: "$month", day: "$day" } }, startOfWeek.toDate() ] },
              { $lte: [ { $dateFromParts: { year: { $year: endOfWeek.toDate() }, month: "$month", day: "$day" } }, endOfWeek.toDate() ] }
            ]
          }
        }
      }
    ]);

    // Return the birthdays that fall within the specified week
    console.log("startDate:", startDate);
    console.log("BirthDayReminder:", BirthDayReminder);
    console.log("endDate:", endDate);

    // res.json({
    //   startDate,
    //   endDate,
    //   BirthDayReminder
    // });
  } catch (err) {
    console.error(err);
    // res.status(500).json({ message: 'Server error' });
  }
};

// Example usage (replace with an actual request handler)
ReminderBirthdayDate();











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




