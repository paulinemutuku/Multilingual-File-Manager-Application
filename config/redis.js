const redis = require('redis');

// Create a Redis client and connect to Redis server
const client = redis.createClient({
  host: '127.0.0.1',  // Redis server address (default is local)
  port: 6379          // Default Redis port
});

// Check if the Redis connection is successful
client.on('connect', function() {
  console.log('Connected to Redis...');
});

// Error handling
client.on('error', function(err) {
  console.log('Redis error: ' + err);
});

module.exports = client;
