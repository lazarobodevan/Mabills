const userModel = require('../models/UserModel');

const createUser = async(name, email, password) =>{
    return await userModel.create({
        name, 
        email,
        password
    });
}

const findByIdAndUpdate = async(userId, name, email, password)=>{
    return await userModel.findByIdAndUpdate(userId, 
    {
        name, 
        email, 
        password
    }, {new: true});
}

const findByIdAndDelete = async (userId) =>{
    try{
        return userModel.findByIdAndDelete(userId);
    }catch(e){
        throw e;
    }
}

module.exports={
    createUser,
    findByIdAndUpdate,
    findByIdAndDelete
}