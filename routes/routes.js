var Router = require('router')();
var bodyParser = require('body-parser');
var response = require('response');
var db = require('diskdb');
var path = require('path');
var cluster = require('cluster');
var jwt = require('jwt-simple');
var middleware = require('./middleware');

db.connect(path.resolve(__dirname + '/../localDb'), ['users', 'tasks']);
Router.use(bodyParser.json());
Router.use(bodyParser.text());
Router.use(bodyParser.urlencoded());

Router.get('/ping', function (req, res) {

    response
        .json({message: "OK"})
        .status(200)
        .pipe(res);
});

Router.post('/api/auth/signin', function (req, res) {

    var user = db.users.findOne({
        login: req.body.login,
        password: req.body.password
    });

    if (user) {

        user.token = jwt.encode({id: user.id}, 'sugar');

        response
            .json(user)
            .status(200)
            .pipe(res);
    } else {

        response
            .json({message: "User not found"})
            .status(403)
            .pipe(res);
    }
});

Router.post('/api/worker/createTask', middleware.Auth, function (req, res) {

    cluster.workers[1].send(req.body);

    response
        .json({message: "OK"})
        .status(200)
        .pipe(res);
});

Router.get('/api/worker/status', middleware.Auth, function (req, res) {

    var workers = [];

    for (var key in cluster.workers) {
        workers.push({
            num: key,
            state: cluster.workers[key].state,
            process_pid: cluster.workers[key].process.pid
        })
    }

    response
        .json(workers)
        .status(200)
        .pipe(res);
});

Router.get('/api/tasks/completed', middleware.Auth, function (req, res) {

    var tasks = db.tasks.find();

    response
        .json({data: tasks})
        .status(200)
        .pipe(res);
});

module.exports = Router;