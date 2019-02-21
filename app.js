const express = require('express');
const bodyParser = require('body-parser');

// create express app
const app = express();






// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())




// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to API."});
});

// Require Notes routes
require('./routes/user.routes.js')(app);


// listen for requests
app.listen(4000, () => {
    console.log("Server is listening on port 4000");
});