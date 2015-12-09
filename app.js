var cluster = require('cluster');
var cpuNum = require('os').cpus().length;
var http = require('http');
var url = require('url');

if (cluster.isMaster) {
    process.on('message', function (msg) {
        console.log(msg);
    });
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
    cluster.workers[1].send({data: {message: 'function sum(a,b){ return a + b;}; sum(19,3)'}});


    http.createServer(function (request, response) {

        if (url.parse(request.url).pathname == '/workers') {
            console.log(url.parse(request.url));
            response.writeHead(200, {"Content-Type": "text/plain"});
            response.end();

        }
    }).listen(8888);

} else {
    process.on('message', function (message) {
        console.log(message);
        process.send('worker with id: ' + process.pid + ' calculated data: ' + eval(message.data.message));
    });
}
