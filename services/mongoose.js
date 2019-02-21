const mongoose = require('mongoose');
// const conn = mongoose.connect('mongodb://localhost/tawltk');
const conn = mongoose.createConnection("mongodb://127.0.0.1:27017/fluper");

exports.mongoose = mongoose;
exports.conn = conn;