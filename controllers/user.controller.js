const {userModel} = require('../models/user.model.js');
 const Joi = require('joi');
var status = require('../modules/status');
const md5 = require('md5');
const passportGooglePlusToken = require('passport-google-plus-token');

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
        password: Joi.string().required()
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
	var { email, mobile_number, name, password} = req.body;
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
                var upData = { email, mobile_number, name, password, created_on, modified_on, access_token};

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
    var { email, password} = req.body;
    userModel.findOne({ email })
        .then(userData => {
            if (userData) {
                if (userData.get('password') == md5(password)) {
                    var access_token = md5(new Date());
                   var updateData = { access_token};
                    userModel.findByIdAndUpdate(userData.get('_id'), { $set: updateData }, { new: true }, function(err, updateData){
                        if(err){
                            return err;
                        }
                        res.send("logged in");
                    })
                        .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while Login the User."
        }); 
    });
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




