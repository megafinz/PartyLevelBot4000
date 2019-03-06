var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/emitter', function (_, res) {
    res.sendFile(__dirname + '/emitter.html');
});

app.get('/receiver', function (_, res) {
    res.sendFile(__dirname + '/receiver.html');
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
