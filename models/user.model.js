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
    is_email_verify: {
        type: Number,
        default : 0 // 0 = unverified 1 = verified
    },
    verification_code: {
        type: String
    },
    forgetPasswordValidation:String,
    password: {
        type: String
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
    device_token: {
        type: String
    },
    device_type: {
        type: Number
    },
    user_id: {
        type: String
    },
    latitude: {
        type: String
    },
    longitude: {
        type: String
    },
    access_token: {
        type: String
    }, 
    social_type: {
        type: String
    },
    gl_social_id: {
        type: String
    },
    fb_social_id: {
        type: String
    },
});
exports.userModel = conn.model('User', UserSchema );
