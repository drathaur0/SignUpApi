// var connection = require ('./connection');
var responses = require ('./responses');
var {UserModel} = require('../models/userModels');
var {DriverModel} =  require ('../models/driverModel');


exports.requiresLogin = (req, res, next) => {
    console.log ("auth");
    let { access_token } = req.headers;
    if (access_token) {
        UserModel.findOne({access_token})
        .then(result => {
            if (result.length == 0) {
                responses.authenticationErrorResponse(res);
            } else {
                console.log(result);
                 req.user = result;
                 next();
            }
        }).catch(err => {console.log(err);responses.sendError(err.message, res)})
    } else {
        (responses.parameterMissingResponse(res));
        return ;
    }
}

exports.requiresLoginDriver = (req, res, next) => {
    let { access_token } = req.headers;
    console.log('inside AUTH')
    console.log(access_token)
    if (access_token) {
        DriverModel.findOne({access_token})
        .then(result => {
            console.log(result)
            if (!result) {
                responses.authenticationErrorResponse(res);
            } else {
                console.log(result);
                 req.driver = result;
                 next();
            }
        }).catch(err => {console.log(err);responses.sendError(err.message, res)})
    } else {
        (responses.parameterMissingResponse(res));
        return ;
    }
}

// exports.requiresLogin_admin = (req, res, next) => {
//     let { access_token } = req.headers;
//     if (access_token) {
//         let sql = "SELECT * FROM `tb_admin` WHERE `access_token`=?";
//         connection.query(sql, [access_token], (err, result) => {
//             if (err) {
//                 responses.sendError(err.message, res);
//             } else if (result.length == 0) {
//                 responses.authenticationErrorResponse(res);
//             } else {
//                  req.admin = result[0];
//                  next();
//             }
//         });
//     } else {
//         next(responses.parameterMissingResponse(res));
//     }
// }

// exports.requiresLogin_college = (req, res, next) => {
//     let { access_token } = req.headers;
//     if (access_token) {
//         let sql = "SELECT * FROM `tb_college_pivot` WHERE `access_token`=?";
//         connection.query(sql, [access_token], (err, result) => {
//             if (err) {
//                 next(responses.sendError(err.message, res));
//             } else if (result.length == 0) {
//                 responses.authenticationErrorResponse(res);
//             } else {
//                  req.college = result[0];
//                  next();
//             }
//         });
//     } else {
//         next(responses.parameterMissingResponse(res));
//     }
// }
