var Router = require('router')();
var bodyParser = require('body-parser');
var response = require('response');
var db = require('diskdb');
var path = require('path');

db.connect(path.resolve(__dirname + '/../localDb'), ['users', 'tasks']);
Router.use(bodyParser.json());

Router.get('/ping', function (req, res) {
    response
        .json({message: "OK"})
        .status(200)
        .pipe(res);
});

Router.post('/api/auth/signin', function (req, res) {

});

Router.post('/api/auth/logout', function (req, res) {

});

Router.post('/api/worker/createTask', function (req, res) {

});

Router.get('/api/worker/status', function (req, res) {

});


Router.get('/api/tasks/completed', function (req, res) {
    var tasks = db.tasks.find();
    response
        .json({data: tasks})
        .status(200)
        .pipe(res);
});


module.exports = Router;