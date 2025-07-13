const express = require('express');
const router = express.Router();
const Reports = require('../controllers/Reports');

// Define routes for Reports
router.get('/birthday', Reports.getBirthdayByCategoryAndDate );
router.get('/marriage', Reports.getMarriageByCategoryAndDate );
router.get('/baptism', Reports.getBaptismByCategoryAndDate );
router.get('/communion', Reports.getCommunionByCategoryAndDate );                                                                           
router.get('/inactive', Reports.getInactiveByCategoryAndDate );
router.get('/rejoining', Reports.getRejoiningByCategoryAndDate );                                                                           
router.get('/birthday_reminders', Reports.birthday_reminders );                                                                           
router.get('/marriage_reminders', Reports.marriage_reminders );                                                                           
                                                                      
// http://localhost:5000/api/reports/birthday?status=active&fromdate=2022-01-01&todate=2024-12-31&page=1&limit=5
// http://localhost:5000/api/reports/birthday?status=active&search=s.%20John%20c&page=1&limit=5
module.exports = router;