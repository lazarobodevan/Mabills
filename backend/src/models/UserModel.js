const mongoose = require('mongoose');
const Category = require('./CategoryModel');
const Transaction = require('./TransactionModel');

const Schema = mongoose.Schema;
const ObjId = Schema.ObjectId;

const User = new Schema({
    id: ObjId,
    email: String,
    password: String,
    name: String,
    transactions: [Transaction],
    ownCategories: [Category]
});

module.exports = User;