const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    _id : {
        type: mongoose.Schema.Types.UUID
    },
    
    name : {
        type : String,
        maxLength : 32,
        required : true
    },

    username : {
        type : String,
        required : true,
        unique : true
    },

    email : {
        type: String,
        required: true,
        unique: true
    },

    password : {
        type: String,
        required: true,
        unique: true
    },

    gender : {
        type : String,
        required : false,
        maxLength : 200
    },

    dob : {
        type : Date,
        required : true
    },

    country : {
        type: String,
        required: true
    }
},
{
    timestamps : true
});

const Users = mongoose.model("User",UserSchema);
module.exports = { Users };