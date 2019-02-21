const {mongoose, conn} = require('../services/mongoose');


const UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        index: {
            unique: true
        }
    },
    
    password: {
        type: String
    },
    mobile_number: {
        type: String,
        index: {
            unique: false
        }
    },
    country_code: {
        type: String, 
        default : null
    },
	
    gender: {
        type: String,
        default : null
    },
    dob: {
        type: String,
        default : null 
    }, // YYYY-MM-DD
     created_on: {
        type: Date
    },
	 modified_on: {
        type: Date
    },
    user_id: {
        type: String
    },
    access_token: {
        type: String
    },
});
exports.userModel = conn.model('User', UserSchema );
