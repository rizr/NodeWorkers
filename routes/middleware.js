var response = require('response');
var jwt = require('jwt-simple');
var db = require('diskdb');
var path = require('path');

db.connect(path.resolve(__dirname + '/../localDb'), ['users']);

function isAuth(req, res, next) {
    if (req.headers.authorization) {
        var jwtReq = req.headers.authorization;
        var id = jwt.decode(jwtReq, 'sugar');
        var user = db.users.findOne(id);

        if (user) {
            req.user = user;
            next();
        } else {
            response
                .json({message: "please, login"})
                .status(403)
                .pipe(res);
        }
    } else {
        response
            .json({message: "provide token"})
            .status(403)
            .pipe(res);
    }
}

module.exports = {
    Auth: isAuth
};