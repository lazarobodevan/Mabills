const mongoose = require('mongoose');
const Category = require('./CategoryModel');

const Schema = mongoose.Schema;
const ObjId = Schema.ObjectId;

const Transaction = new Schema({
    id: ObjId,
    name: String,
    value: Number,
    date: Date,
    type: String,
    category: Category
});

module.exports = Transaction;