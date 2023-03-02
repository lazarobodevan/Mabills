const mongoose = require('mongoose');
const {Category} = require('./CategoryModel');

const Schema = mongoose.Schema;
const ObjId = Schema.ObjectId;

const UserSchema = new Schema({
    id: ObjId,
    email: String,
    password: String,
    name: String,
    ownCategories: [Category]
});

const UserModel = mongoose.model('users', UserSchema)

module.exports = UserModel;