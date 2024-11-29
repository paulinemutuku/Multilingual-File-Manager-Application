const Queue = require('bull');
const fileQueue = new Queue('fileQueue', 'redis://127.0.0.1:6379');

fileQueue.process(async (job) => {
  // Handle the asynchronous task here
});

module.exports = fileQueue;
