module.exports = (app) => {
    const users = require('../controllers/user.controller.js');

    // Create a new User
    app.post('/users', users.create);

    

    // Retrieve a single Note with noteId
	
    app.post('/users/manual_login', users.manual_login);
	
	// Social SignUp
	
	
	app.post('/users/social_signup', users.social_signup);


	//forget password
    app.post('/users/forgetpassword', users.forgetpassword);


	//verify otp

	app.post('/users/varify_otp', users.varify_otp);
	
	//reset password

	app.post('/users/reset_password', users.reset_password);


	//logout 
    app.post('/users/logout', users.logout);
	
}