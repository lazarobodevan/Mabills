const { CategoryModel } = require("../models/CategoryModel");
const TransactionModel = require('../models/TransactionModel');

const createCategory = async (req, res) =>{
    try{
        const {name, icon, color} = req.body;
        const loggedUser = req.user;

        const newCategory = await CategoryModel.create({
            userId: loggedUser._id,
            name,
            icon,
            color
        });

        return res.status(200).json(newCategory);
    }catch(e){
        console.log(e);
        return res.status(500).json({message:"Internal server error"});
    }
}

const editCategory = async (req, res) =>{
    try{
        const {id} = req.params;
        const updatedCategory = await CategoryModel.findByIdAndUpdate(id, req.body, {new: true});
        return res.status(200).json(updatedCategory);
    }catch(e){
        console.log(e);
        return res.status(500).json({message: "Internal server error"});
    }
}

const getCategories = async (req, res) =>{
    const {user} = req;
    const categories = await CategoryModel.find({userId: user._id});

    return res.status(200).json(categories);
}

const deleteCategory = async (req, res) =>{
    const {id} = req.params;
    try{
        const relatedExpenses = await(TransactionModel.find({}).where({categoryId: id}).then(obj => {return obj;}));
        if(relatedExpenses.length){
            return res.status(400).json({message: 'Cannot delete category that is related to any transaction.'});
        }
        await CategoryModel.findByIdAndDelete(id)
        return res.status(200).json({message: 'Category deleted'});
    }catch(e){
        console.log(e);
        return res.status(500).json({message: 'Internal server error'});
    }
}

module.exports = {
    createCategory,
    editCategory,
    getCategories,
    deleteCategory
}