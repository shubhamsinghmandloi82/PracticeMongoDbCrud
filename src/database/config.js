const mongoose = require('mongoose');

let connection = mongoose.connect("mongodb://localhost:27017/practiceMongoCrud", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(connection => {
    console.log("Mongo Db Connected Successfully");
  }).catch(error => {
    console.log(error.message);
  }).catch(err => {
    console.log(err.message);
  })