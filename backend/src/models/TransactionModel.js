const mongoose = require('mongoose');
const {Category, CategoryModel} = require('./CategoryModel');

const Schema = mongoose.Schema;
const ObjId = Schema.ObjectId;

const Transaction = new Schema({
    id: ObjId,
    userId: ObjId,
    name: String,
    value: Number,
    date: Date,
    type: String,
    categoryId: {type: ObjId, ref: 'categories'}
});

const TransactionModel = mongoose.model('transactions', Transaction);
module.exports = TransactionModel;