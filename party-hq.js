currentAmpChangedCallback = function(amp) {
    setMeter('current-meter', Math.round(amp * 100));
    setMeter('current-meter-normalized', Math.round(getNormalizedAmp(amp) * 100));
}

maxAmpChangedCallback = function(amp) {
    setMeter('max-meter', Math.round(amp * 100));
    setMeter('max-meter-normalized', Math.round(getNormalizedAmp(amp) * 100));
}

const socket = io();

socket.on('amplitude out', amp => setCurrentAmp(smoothenAmp(amp)));

function toggleLvl(lvl) {
    socket.emit('hq toggle lvl', lvl);
}
