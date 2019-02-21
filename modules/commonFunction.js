var responses  = require( '../modules/responses');
var UserModal   = require('../models/userModels');
var constants  = require( './constant');
var config  = require( '../config/development');
var twilio  = require( 'twilio')
var async  = require( 'async');
var _  = require( 'lodash');
var nodeMailerModule =  require('nodemailer');
var nodemailer = nodeMailerModule; 
var smtpTransport = require("nodemailer-smtp-transport");

/*
 * -----------------------
 * GENERATE RANDOM STRING
 * -----------------------
 */
 exports.generateRandomString = () => {
	// let text = "";
	// let possible = "123456789";

	// for (var i = 0; i < 4; i++)
	// 	text += possible.charAt(Math.floor(Math.random() * possible.length));

	return '1234';
};

/*
 * -----------------------------------------------
 * CHECK EACH ELEMENT OF ARRAY FOR BLANK AND Key
 * -----------------------------------------------
 */

exports.checkKeyExist = (req, arr) => {
	return new Promise((resolve, reject) => {
		var array = [];
		_.map(arr, (item) => {
			if(req.hasOwnProperty(item)) {
				var value = req[item];
				if( value == '' || value == undefined ) { 
					array.push(item+" can not be empty");
				}
				resolve(array);
			} else {
				array.push(item+" key is missing");
				resolve(array);
			}
		});
	}); 
};



// exports.sendotp = (verification_code,sendTo) => {
	
// 	var client = new twilio(config.accountSid, config.authToken);
// 	client.messages.create({
// 	    body: "your one time password(OTP) is  "  +verification_code+  "  valid for 3 minutes do not disclose it" ,
// 	    to: '+918562938348',  // Text this number
// 	    from: '(912) 244-7559' // From a valid Twilio number
// 	})
// 	.then((message) => console.log(message.sid))
// 	.catch((err) => console.log(err));
// };

//--------------------------------------//
//-------verify data--------------------//

exports.verifyData = (data = {}) => {
    var result = {};
    var count = 0;
    _.map(data, (val, key) => {
        if (val && val.length || _.isInteger(val)) {
            result[key] = val;
        }
    })
    return result;
}


exports.sendmail = function(to, subject, html) {
    var config = {
        "SMTP_HOST": "smtp.sendgrid.net",
        "SMTP_PORT": 25,
        "SMTP_USER": "apikey", //default
        "SMTP_PASS": "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"
        //"SMTP_PASS" : config.SMTP_PASS
    }
    var mailer = nodemailer.createTransport(smtpTransport({
        host :config.SMTP_HOST ,
        port: config.SMTP_PORT,
        auth: {
            user: config.SMTP_USER,
            pass: config.SMTP_PASS
        }
    }));
    mailer.sendMail({
        from: "legendtaxi@gmail.com",
        to: to,
        // cc: "vishalims095@gmail.com",
        subject: subject,
        // template: "text",
        html: html
    }, (error, response) => {
        if (error) {
            console.log(error);
            // resolve({ message: "Email not send " });
        } else {
            console.log(response);
            // resolve({ message: "Email send successfully" });
        }
        mailer.close();
        //res.send("Response send successfully");
    });
}


