const { CategoryModel } = require("../models/CategoryModel");

const createCategory = async (req, res) =>{
    try{
        const {name, icon} = req.body;
        const loggedUser = req.user;

        const newCategory = await CategoryModel.create({
            userId: loggedUser._id,
            name,
            icon
        });

        return res.status(200).json(newCategory);
    }catch(e){
        console.log(e);
        return res.status(500).json({message:"Internal server error"});
    }
}

module.exports = {
    createCategory
}