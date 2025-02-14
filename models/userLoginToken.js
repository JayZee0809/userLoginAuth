const mongoose = require('mongoose');

const UserLoginTokenSchema = new mongoose.Schema({
    
    user_id : {
        type: mongoose.Schema.Types.UUID,
        required: true
    },

    login_token : {
        type: String,
        required: true
    },

    loginAt: {
        type: String,
        required: true
    }

    // could have device_id in case of multiple signins of the same account from different devices
},
{
    timestamps : true
});

const UserLoginToken = mongoose.model("UserLoginToken", UserLoginTokenSchema);

module.exports = { UserLoginToken };