const logMessage = require('../logs/Logging')

const getData = (req, res) => {
    const { phoneNumber } = req.body;

    // Simulated success response
    logMessage(req.ip, req.body.phoneNumber, 200, `SMS sent to ${phoneNumber}`)
    return res.json({ message: `SMS sent to ${phoneNumber}` });
  };
  
  module.exports = { getData };
  