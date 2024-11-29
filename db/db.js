
const mongoose = require("mongoose");
require("dotenv").config();


const url = process.env.MONGODB_URL;


let dbConnection;


module.exports = {
  connectToDb: (cb) => {
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, dbName: "multilingualFilesManager",retryWrites: true, w: "majority" })
      .then(() => {
        dbConnection = mongoose.connection;
        console.log("Successfully connected to MongoDB.");
        cb(); 
      })
      .catch(err => {
        console.log(err);
        cb(err); 
      });
  },

  
  getDb: () => dbConnection
};