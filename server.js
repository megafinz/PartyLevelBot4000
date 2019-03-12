var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname));

app.get('/party', (_, res) => {
    res.sendFile(__dirname + '/party.html');
});

app.get('/party-emitter', (_, res) => {
    res.sendFile(__dirname + '/party-emitter.html');
});

app.get('/party-hq', (_, res) => {
    res.sendFile(__dirname + '/party-hq.html');
});

io.on('connection', socket => {
    console.log('OH WOW A CONNECTION');
    socket.on('disconnect', () => {
        console.log('oh wow a disconnection');
    })
    socket.on('amplitude in', amp => socket.broadcast.emit('amplitude out', amp));
    socket.on('hq toggle lvl', lvl => socket.broadcast.emit('hq toggle lvl', lvl));
});

http.listen(7090, () => console.log('Listening on 7090'));
