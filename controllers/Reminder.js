const Member = require("../Schema/memberSchema");
const Family = require("../Schema/familySchema");


app.get('/marriages', async (req, res) => {
    try {
      // Get the week offset from query parameters, default is 0 (current week)
      const weekOffset = parseInt(req.query.offset) || 0;
      
      // Calculate the start and end dates of the week based on the offset
      const today = moment();
      const startOfWeek = today.clone().startOf('week').add(weekOffset * 7, 'days');
      const endOfWeek = startOfWeek.clone().endOf('week');
  
      // Format dates to MM/DD/YYYY
      const startDate = startOfWeek.format('MM/DD/YYYY');
      const endDate = endOfWeek.format('MM/DD/YYYY');
  
      // Query the database for marriages between startDate and endDate
      const marriages = await Family.find({
        marriageDate: {
          $gte: startDate,
          $lte: endDate
        }
      });
  
      // Return the marriages that fall within the specified week
      res.json({
        startDate,
        endDate,
        marriages
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  