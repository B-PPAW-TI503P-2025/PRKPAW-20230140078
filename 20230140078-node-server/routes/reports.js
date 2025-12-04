const reportController = require('../controllers/reportController');
const { authenticateToken, isAdmin } = require('../middleware/permissionMiddleware'); 
const express = require('express');
const router = express.Router();

router.get('/daily', 
    authenticateToken, 
    isAdmin,           
    reportController.getDailyReport
);

module.exports = router;