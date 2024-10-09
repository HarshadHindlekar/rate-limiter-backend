const express = require('express');
const apiController = require('../controllers/ApiController');
const rateLimiter = require('../middleware/rateLimiter');

const router = express.Router();

// POST /api/send-sms route with rate limiting middleware
router.post('/send-sms', rateLimiter, apiController.getData);

module.exports = router;
