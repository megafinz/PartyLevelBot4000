const MAX_AMP_REFRESH_INTERVAL_MS = 5000;
const CURRENT_AMP_IDLE_RESET_INTERVAL_MS = 1000;

var currentAmp = 0;
var maxAmp = 0;
var resetCurrentAmpTimeout;
var refreshMaxAmpTimeout;

var socket = io();

socket.on('amplitude out', function (amp) {
    setCurrentAmp(amp);
    clearTimeout(resetCurrentAmpTimeout);
    resetCurrentAmpTimeout = setTimeout(function() {
        setCurrentAmp(0);
    }, CURRENT_AMP_IDLE_RESET_INTERVAL_MS)
});

function setCurrentAmp(amp) {
    currentAmp = amp;
    setMeter("current-meter", Math.round(amp * 100));
    if (maxAmp < amp) {
        setMaxAmp(amp);
    }
}

function setMaxAmp(amp) {
    maxAmp = amp;
    setMeter("max-meter", Math.round(maxAmp * 100));
    updateReaction(maxAmp);
    clearTimeout(refreshMaxAmpTimeout);
    refreshMaxAmpTimeout = setTimeout(function() {
        setMaxAmp(currentAmp);
    }, MAX_AMP_REFRESH_INTERVAL_MS);
}

function setMeter(id, value) {
    var elem = document.getElementById(id);
    elem.style.width = value + '%';
    elem.innerHTML = value * 1 + '%';
}

function updateReaction(amp) {
    var elem = document.getElementById("reaction-img");

    if (amp < 0.1) {
        elem.src = "0.gif";
    } else if (amp < 0.2) {
        elem.src = "1.gif";
    } else if (amp < 0.3) {
        elem.src = "3.gif";
    } else if (amp < 0.4) {
        elem.src = "4.gif";
    } else if (amp < 0.5) {
        elem.src = "5.gif";
    } else {
        elem.src = "6.gif";
    }
}
