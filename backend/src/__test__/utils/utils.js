const UserModel = require("../../models/UserModel")

const generateDefaultUser = async() => {
    return UserModel.create({
        email:'default@default.com',
        password:'123',
        name: 'default'
    })
}

module.exports = {
    generateDefaultUser
}