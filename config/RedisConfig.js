const redis = require('redis');

const client = redis.createClient({
  url: 'redis://localhost:6379', // Ensure this is correct
});

client.on('error', (err) => console.error('Redis Client Error', err));

module.exports = client;
