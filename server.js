var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname));

app.get('/party', function (_, res) {
    res.sendFile(__dirname + '/party.html');
});

app.get('/party-emitter', function (_, res) {
    res.sendFile(__dirname + '/party-emitter.html');
});

io.on('connection', function (socket) {
    console.log('OH WOW A CONNECTION');
    socket.on('disconnect', function () {
        console.log('oh wow a disconnection');
    })
    socket.on('amplitude in', function (amp) {
        socket.broadcast.emit('amplitude out', amp);
    });
});

http.listen(7090, function () {
    console.log('Listening on 7090');
})
