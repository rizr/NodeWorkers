var cluster = require('cluster');
var cpuNum = require('os').cpus().length;
var http = require('http');
var url = require('url');
var finalhandler = require('finalhandler');
var Router = require('./routes/routes');

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

    /*        if (url.pathname == '/api/worker/createTask' && request.method == 'POST') {

     response.writeHead(200, {"Content-Type": "text/plain"});
     cluster.workers[1].send({data: {task: 'function sum(a,b){ return a + b;}; sum(19,3)'}});
     response.end();
     }

     if (url.pathname == '/api/worker/') {
     response.writeHead(200, {"Content-Type": "text/plain"});
     response.end();
     }

     if (url.pathname == '/api/auth') {
     response.writeHead(200, {"Content-Type": "text/plain"});
     response.end();
     }

     })*/

}
else {
    process.on('message', function (message) {
        console.log(message);
        process.send('worker with id: ' + process.pid + ' calculated data: ' + eval(message.task));
    });
}
