
const ERR_ACCESS_DENIED = {message: 'Access denied'};

const getMessagesFromJoiError = (error) =>{
    return error.details.map(item => {
        return item.message
    })
}

module.exports = {
    ERR_ACCESS_DENIED,
    getMessagesFromJoiError
}