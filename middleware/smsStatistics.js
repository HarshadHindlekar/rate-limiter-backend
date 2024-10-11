const client = require('../config/RedisConfig');
const logMessage = require('../logs/Logging');

// Middleware to get SMS usage statistics for a specific phone number
const getSMSUsageStatistics = async (req, res) => {
    const { phoneNumber } = req.params;
  
    if (!client.isOpen) {
      try {
        await client.connect();
      } catch (error) {
        logMessage(null, phoneNumber, 500, 'Could not connect to Redis');
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  
    try {
      const messages = await client.LRANGE(`${phoneNumber}:messages`, 0, -1); // Get all messages
      const minuteKeys = await client.keys(`*:${phoneNumber}:minute`); // Fetch all minute keys for the phone number across IPs
      const dayKeys = await client.keys(`*:${phoneNumber}:day`); // Fetch all day keys for the phone number across IPs
  
      // Aggregate counts
      let minuteCount = 0;
      let dayCount = 0;
  
      // Sum up all counts across different IPs
      for (const minuteKey of minuteKeys) {
        minuteCount += parseInt(await client.get(minuteKey)) || 0;
      }
  
      for (const dayKey of dayKeys) {
        dayCount += parseInt(await client.get(dayKey)) || 0;
      }
  
      res.json({
        phoneNumber,
        minuteCount, // Total count for minute limit across all IPs
        dayCount, // Total count for day limit across all IPs
        messages
      });
    } catch (err) {
      logMessage(null, phoneNumber, 500, err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  
  

// Middleware to get the list of phone numbers that violated rate limits
const getViolatingPhoneNumbers = async (req, res) => {
    const violatingPhoneNumbers = [];
  
    if (!client.isOpen) {
      try {
        await client.connect();
      } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  
    try {
      const keys = await client.keys('*:day'); // Get all day keys, which include both IP and phone numbers
  
      for (const key of keys) {
        const dayCount = await client.get(key);
        if (dayCount > 10) {
            const parts = key.split(':');
            const daySuffix = parts.pop(); // Removes and returns the 'day' part
            const phoneNumber = parts.pop(); // Removes and returns the phone number part (which is next to 'day')
    
            violatingPhoneNumbers.push(phoneNumber);
        }
      }
  
      res.json({ violatingPhoneNumbers });
    } catch (err) {
      logMessage(null, null, 500, err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  
module.exports = {
  getSMSUsageStatistics,
  getViolatingPhoneNumbers
};
