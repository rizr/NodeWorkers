var cluster = require('cluster');
var cpuNum = require('os').cpus().length;
var http = require('http');
var url = require('url');
var finalhandler = require('finalhandler');
var Router = require('./routes/routes');
var db = require('diskdb');
var path = require('path');

db.connect(path.resolve(__dirname + '/localDb'), ['tasks']);

if (cluster.isMaster) {

    console.log('Spawn ' + cpuNum + ' workers');

    for (var i = 0; i < cpuNum; i++) {
        var worker = cluster.fork();
        worker.on('message', function (message) {
            console.dir(message);
        });
    }

    cluster.on('online', function (worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
    });

    http.createServer(function (req, res) {
        Router(req, res, finalhandler(req, res));
    }).listen(8888);

}
else {
    process.on('message', function (message) {
        console.log(message);
        var result = eval(message.task);
        process.send('worker with id: ' + process.pid + ' calculated data: ' + result);
        db.tasks.save({
            task: message.task,
            author: message.from,
            result: result,
            createdAt: new Date().toLocaleString()
        });
    });
}
