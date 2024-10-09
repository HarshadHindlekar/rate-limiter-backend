const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/ApiRoutes');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json()); // For parsing JSON requests

// API routes
app.use('/api', apiRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
