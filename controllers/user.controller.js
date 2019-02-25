const {userModel} = require('../models/user.model.js');
 const Joi = require('joi');
var status = require('../modules/status');
const md5 = require('md5');
const passportGooglePlusToken = require('passport-google-plus-token');
var commFunc = require('../modules/commonFunction');

// Create and Save a new User
exports.create = (req, res) => {
	
if(!req.body) {
        return res.status(400).send({
            message: "User Data can not be empty"
        });
    }

	
// Create a User
	 const schema = Joi.object().keys({
        mobile_number: Joi.string().optional().error(e => 'Mobile number required.'),
        name: Joi.string().required().error(e => 'Name is required'),
        email: Joi.string().email({ minDomainAtoms: 2 }).required().error(e => 'Email is\'nt in correct formet.'),
        password: Joi.string().required(),
        device_token: Joi.string().required(),
        device_type: Joi.number().required(),
        latitude: Joi.string(),
        longitude: Joi.string(),
    })
	
	 const result = Joi.validate(req.body, schema, { abortEarly: true });
    if (result.error) {
        if (result.error.details && result.error.details[0].message) {
            res.status(status.BAD_REQUEST).json({ message: result.error.details[0].message });
        } else {
            res.status(status.BAD_REQUEST).json({ message: result.error.message });
        }
        return;
    }
	

// Check existing data 	
	var { email, mobile_number, name, password,device_token, created_on, modified_on, device_type, latitude, longitude, access_token, verification_code} = req.body;
    userModel.findOne({ $or: [{ 'email': email }, { 'mobile_number': mobile_number }] })
        .then(userResult => {
            console.log(userResult)
            if (userResult) {
                if (userResult.get('email') == email) {
                    res.status(status.ALREADY_EXIST).json({ message: 'Your email is already registered with us.' });
                } else {
                    res.status(status.ALREADY_EXIST).json({ message: 'Your mobile number is already registered with us.' });
                }
            } 
			else {
                var access_token = md5(new Date());
                var created_on = new Date().getTime();
                var modified_on = new Date().getTime();
                password = md5(password);
                var upData = { email, mobile_number, name, password, created_on, modified_on, access_token, device_token, created_on, modified_on, device_type, latitude, longitude, access_token, verification_code};

                const user = new userModel(upData);
                user.save(upData)
                    .then((upData) => {
	
        res.send(upData);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the User."
        });
    });
    }
});
};




exports.manual_login = (req, res) => {
	
    const schema = Joi.object().keys({
        email: Joi.string().email({ minDomainAtoms: 2 }).required().error(e => 'Email is\'nt in correct formet.'),
        password: Joi.string().required(),
        device_token: Joi.string().required(),
        device_type: Joi.number().required(),
        latitude: Joi.string(),
        longitude: Joi.string()
   })

    const result = Joi.validate(req.body, schema, { abortEarly: true });
    if (result.error) {
        if (result.error.details && result.error.details[0].message) {
            res.status(status.BAD_REQUEST).json({ message: result.error.details[0].message });
        } else {
            res.status(status.BAD_REQUEST).json({ message: result.error.message });
        }
        return;
    }
    var { email, password, device_type, device_token, langitude, latitude} = req.body;
    userModel.findOne({ email })
        .then(userData => {
            if (userData) {
                if (userData.get('password') == md5(password)) {
                    var access_token = md5(new Date());
                   var updateData = { access_token, device_type, device_token, langitude, latitude };
                    userModel.findByIdAndUpdate(userData.get('_id'), { $set: updateData }, { new: true })
                    .then(userResult => {
                        res.status(status.SUCCESS_STATUS).json({ message: "Login successfully.", response: userResult })
                    }).catch(err => responses.sendError(err.message, res))
                     } else {
                    res.status(status.INVALID_CREDENTIAL).json({ message: 'Either email or password is incorrect' });
                }
            } else {
                res.status(status.INVALID_CREDENTIAL).json({ message: 'This email is not registered with us' });
            }
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while Login the User."
        });
    });

};

exports.social_signup = (req, res) => {
    let { email,is_email_verify, name, social_type, social_id, device_token, device_type, latitude, longitude } = req.body
    userModel.findOne({$and :[
                        {$or:[{'gl_ social_id': social_id},{'fb_social_id' : social_id}]},
                        {"social_type" : social_type}
                    ]})
    .then(userResult => {
        if (userResult) {
                let access_token = md5(new Date());
                let updateData = { device_token, is_email_verify, device_type, latitude, longitude, access_token };
                userModel.findByIdAndUpdate(userResult.get('_id'), { $set: updateData }, { new: true })
                .then(userResult => {
                    res.status(200).json({ message: "Welcome! You are now Login", response: userResult })
                }).catch(err => responses.sendError(err.message, res))
        } else {
            userModel.findOne({ 'email': email })
            .then(userResult => {
                if (userResult) {
                    if (is_email_verify == 0) {
                        if(userResult.is_email_verify==0)
                        {
                            res.status(status.INVALID_CREDENTIAL).json({ message: 'Email is sent' });
                            let fb_social_id, gl_social_id
                        let updateData = {};
                        if(social_type == "2") {
                            gl_social_id = social_id;
                            updateData = {gl_social_id, is_email_verify, social_type, device_token, device_type, latitude, longitude};
                        } else {
                            fb_social_id = social_id;
                            updateData = {fb_social_id, is_email_verify, social_type, device_token, device_type, latitude, longitude};
                        }
                        
                        userModel.findByIdAndUpdate(userResult._id, {$set : updateData}, {new:true})
                        .then(userData => {
                            if(userData.is_email_verify){
                                res.status(status.SUCCESS_STATUS).json({ message: "Login successfully now.", response: userData })    
                            } 
                            
                        }).catch(err => responses.sendError(err.message, res))
                    

                        }
                    
                    
                    
                        } else {
                        let fb_social_id, gl_social_id
                        let updateData = {};
                        if(social_type == "2") {
                            gl_social_id = social_id;
                            updateData = {gl_social_id, is_email_verify, social_type, device_token, device_type, latitude, longitude};
                        } else {
                            fb_social_id = social_id;
                            updateData = {fb_social_id, is_email_verify, social_type, device_token, device_type, latitude, longitude};
                        }
                        
                        userModel.findByIdAndUpdate(userResult._id, {$set : updateData}, {new:true})
                        .then(userData => {
                            if(userData.is_email_verify){
                                res.status(200).json({ message: "Login successfully.", response: userData })    
                            } 
                            
                        }).catch(err => responses.sendError(err.message, res))
                    }
                } else {
                   
                    let access_token = md5(new Date());
                    var created_on = new Date().getTime();
                    var modified_on = new Date().getTime();
                    let fb_social_id , gl_social_id;
                        if(social_type == 2) {
                            gl_social_id = social_id;
                        } else {
                            fb_social_id = social_id;
                        }
                    let updateData = { email, social_type, gl_social_id, fb_social_id, name, access_token, created_on, device_token, modified_on, device_type, latitude, longitude, is_email_verify }
                    let user = new userModel(updateData)
                    user.save(updateData)
                    .then((userData) => {
                        if(userData.is_email_verify) {
                            res.status(status.SUCCESS_STATUS).json({ message: "Signup successfully.", response: userData })
                        } else {
                            res.status(status.INVALID_CREDENTIAL).json({ message: 'Verification link sent to your mail.' });
                        }
                        
                    })
                    .catch(err => { console.log(err); responses.sendError(err.message, res) }) 
                }
            }).catch(err => { console.log(err); responses.sendError(err.message, res) })

        }
    })
};

//forget Password

exports.forgetpassword = (req, res) => {
    const schema = Joi.object().keys({
        email: Joi.string().email({ minDomainAtoms: 2 }).required().error(e => 'Email is\'nt in correct formet.'),
    })

    const result = Joi.validate(req.body, schema, { abortEarly: true });
    if (result.error) {
        if (result.error.details && result.error.details[0].message) {
            res.status(status.BAD_REQUEST).json({ message: result.error.details[0].message });
        } else {
            res.status(status.BAD_REQUEST).json({ message: result.error.message });
        }
        return;
    }
    var { email } = req.body;
    userModel.findOne({ email })
        .then(userResult => {
            if (userResult) {
                let _id = userResult.get('_id')
                let verification_code = commFunc.generateRandomString();
                let forgetPasswordValidation = md5(new Date());
                userModel.findByIdAndUpdate(_id, { $set: { verification_code, forgetPasswordValidation } }, { new: true })
                    .then(userData => {
                        //send mail


                        res.status(200).json({ message: "Verification code has been sent to your Mobile."+userData.mobile_number, response: userData })
                    }).catch(err => { console.log(err); responses.sendError(err.message, res) })
            } else {
                res.status(status.INVALID_CREDENTIAL).json({ message: 'email is not exist' });
            }
        }).catch(err => { console.log(err); responses.sendError(err.message, res) })
}

//Verify otp

exports.varify_otp = (req, res) => {
    const schema = Joi.object().keys({
        email: Joi.string().email({ minDomainAtoms: 2 }).required().error(e => 'Email is\'nt in correct formet.'),
        verification_code: Joi.string().required()
    })

    const result = Joi.validate(req.body, schema, { abortEarly: true });
    if (result.error) {
        if (result.error.details && result.error.details[0].message) {
            res.status(status.BAD_REQUEST).json({ message: result.error.details[0].message });
        } else {
            res.status(status.BAD_REQUEST).json({ message: result.error.message });
        }
        return;
    }
    let { email, verification_code } = req.body;
    userModel.findOne({ email })
        .then(userResult => {
            if (userResult) {
                if (userResult.get('verification_code') == verification_code) {
                    let _id = userResult.get('_id')
                    verification_code = '';
                    userModel.findByIdAndUpdate(_id, { $set: { verification_code } }, { new: true })
                        .then(userData => {
                            //send mail
                            res.status(200).json({ message: "Verification successful.", response: userData })
                        }).catch(err => { console.log(err); responses.sendError(err.message, res) })
                } else {
                    res.status(status.INVALID_CREDENTIAL).json({ message: 'verification code is not correct.' });
                }
            } else {
                res.status(status.INVALID_CREDENTIAL).json({ message: 'email is not exist.' });
            }
        }).catch(err => { console.log(err); responses.sendError(err.message, res) })
}

//reset password

exports.reset_password = (req, res) => {


    const schema = Joi.object().keys({
        email: Joi.string().email({ minDomainAtoms: 2 }).required().error(e => 'Email is\'nt in correct formet.'),
        password: Joi.string().required()
    });

    const result = Joi.validate(req.body, schema, { abortEarly: true });
    if (result.error) {
        if (result.error.details && result.error.details[0].message) {
            res.status(status.BAD_REQUEST).json({ message: result.error.details[0].message });
        } else {
            res.status(status.BAD_REQUEST).json({ message: result.error.message });
        }
        return;
    }
    let { password, email } = req.body;
    userModel.findOne({ email })
        .then(userResult => {
            if (userResult) {
                let _id = userResult.get('_id')
                password = md5(password);
                let updateData = { password };
                userModel.findByIdAndUpdate(_id, { $set: updateData }, { new: true }) .then(userData => {
                    //send mail
                    res.status(status.SUCCESS_STATUS).json({ message: "Password Reset Successfully", response: userData })
                }).catch(err => { console.log(err); responses.sendError(err.message, res) })
               
            }
            });         
}

//logout




exports.logout = (req, res) => {


    const schema = Joi.object().keys({
        access_token: Joi.string().required()
    });

    const result = Joi.validate(req.body, schema, { abortEarly: true });
    if (result.error) {
        if (result.error.details && result.error.details[0].message) {
            res.status(status.BAD_REQUEST).json({ message: result.error.details[0].message });
        } else {
            res.status(status.BAD_REQUEST).json({ message: result.error.message });
        }
        return;
    }
    let { access_token, device_token,device_type } = req.body;
    userModel.findOne({access_token})
        .then(userResult => {
            if (userResult) {
               
                access_token = '';
                let updateData = { access_token , device_token, device_type};
                userModel.findByIdAndUpdate(userResult._id, { $set: updateData }, { new: true }) .then(userData => {
                    //send mail
                    res.status(status.SUCCESS_STATUS).json({ message: "Logout out Successfully", response: userData })
                }).catch(err => { console.log(err); responses.sendError(err.message, res) })
               
            }
            });         
}


