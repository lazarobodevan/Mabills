const categoryDb = require('../database/categoryDatabase');

const createCategory = async (req, res) =>{
    try{
        const {name, color} = req.body;
        const {_id} = req.user;

        const newCategory = await categoryDb.createCategory(_id, name, color);

        return res.status(200).json(newCategory);
    }catch(e){
        console.log(e);
        return res.status(500).json({message:"Internal server error"});
    }
}

const editCategory = async (req, res) =>{
    try{
        const {id} = req.params;
        const updatedCategory = await categoryDb.findByIdAndUpdate(id, req.body);
        return res.status(200).json(updatedCategory);
    }catch(e){
        console.log(e);
        return res.status(500).json({message: "Internal server error"});
    }
}

const getCategories = async (req, res) =>{
    const {_id} = req.user;
    const categories = await categoryDb.findCategories(_id);

    return res.status(200).json(categories);
}

const deleteCategory = async (req, res) =>{
    const {id} = req.params;
    try{
        const relatedExpenses = await categoryDb.findCategoryDependecy(id);
        if(relatedExpenses.length){
            return res.status(400).json({message: 'Cannot delete category that is related to any transaction.'});
        }
        await categoryDb.findByIdAndDelete(id)
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