module.exports = (app) => {
    const users = require('../controllers/user.controller.js');

    // Create a new User
    app.post('/users', users.create);

    

    // Retrieve a single Note with noteId
	
    app.post('/users/manual_login', users.manual_login);
	
}