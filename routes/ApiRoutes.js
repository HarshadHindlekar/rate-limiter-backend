const express = require('express');
const apiController = require('../controllers/ApiController');
const rateLimiter = require('../middleware/rateLimiter');
const { getSMSUsageStatistics, getViolatingPhoneNumbers } = require('../middleware/smsStatistics');

const router = express.Router();

// POST /api/send-sms route with rate limiting middleware
router.post('/send-sms', rateLimiter, apiController.getData);

// GET /api/sms-usage/:phoneNumber route to get SMS usage statistics
router.get('/sms-usage/:phoneNumber', getSMSUsageStatistics);

// GET /api/violating-phone-numbers route to get violating phone numbers
router.get('/violating-phone-numbers', getViolatingPhoneNumbers);

module.exports = router;
