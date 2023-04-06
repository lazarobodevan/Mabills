const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjId = Schema.ObjectId;

const Category = new Schema({
    id: ObjId,
    userId: ObjId,
    name: String,
    color: String
});

const CategoryModel = mongoose.model('categories', Category);

module.exports = {
    Category,
    CategoryModel
};