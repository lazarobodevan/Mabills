const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjId = Schema.ObjectId;

const Category = new Schema({
    id: ObjId,
    name: String,
    icon: String
});

module.exports = Category;