var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var _cfg = {
    MinAmpThreshold: 0.4,
    MaxAmpThreshold: 0.65,
    MovingAverageWindowSize: 3
}

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
    socket.on('hq toggle lvl', lvl => {
        socket.broadcast.emit('hq toggle lvl', lvl);
        console.log('PARTY LEVEL OVERRIDE: ' + lvl);
    });
    socket.on('hq cfg update min amp threshold', value => {
        _cfg.MinAmpThreshold = value;
        socket.broadcast.emit('hq cfg updated min amp threshold', value);
        console.log('Updated MIN THRESHOLD to ' + value);
    });
    socket.on('hq cfg update max amp threshold', value => {
        _cfg.MaxAmpThreshold = value;
        socket.broadcast.emit('hq cfg updated max amp threshold', value);
        console.log('Updated MAX THRESHOLD to ' + value);
    });
    socket.on('hq cfg update moving average window size', value => {
        _cfg.MovingAverageWindowSize = value;
        socket.broadcast.emit('hq cfg updated moving average window size', value);
        console.log('Updated MOVING AVERAGE WINDOW SIZE to ' + value);
    });
    socket.emit('hq init cfg', _cfg);
});

http.listen(7090, () => console.log('Listening on 7090'));
