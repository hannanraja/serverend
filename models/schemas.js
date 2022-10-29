const mongoose = require('mongoose')
const schema = mongoose.Schema;

const userentry = new schema({
    username: {
        type: String, required: [true, "Username is required"]
    },
    password: {
        type: String , required : [true ,"password is required"]
    },
    phonenumber: {
        type: Number , required :[true ,"Phone number is required"]
    }   
})

const users = mongoose.model('Users', userentry);
module.exports = users;