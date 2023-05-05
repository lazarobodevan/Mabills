const { CategoryModel } = require("../models/CategoryModel");
const TransactionModel = require('../models/TransactionModel');
const createCategory = async(userId, name, color) =>{
    return await CategoryModel.create({
        userId,
        name,
        color
    });
}

const findByIdAndUpdate = async(userId, category) => {
    return await CategoryModel.findByIdAndUpdate(userId, category, {new: true});
}

const findCategories = async(userId) =>{
    return await CategoryModel.find({userId});
}

const findCategoryDependecy = async(categoryId) =>{
    return await(TransactionModel.find({}).where({categoryId}).then(obj => {return obj;}))
}

const findByIdAndDelete = async(categoryId) =>{
    return await CategoryModel.findByIdAndDelete(categoryId)
}

module.exports = {
    createCategory,
    findByIdAndUpdate,
    findCategories,
    findCategoryDependecy,
    findByIdAndDelete
}