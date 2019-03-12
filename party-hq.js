const socket = io();

function toggleLvl(lvl) {
    socket.emit('hq toggle lvl', lvl);
}
