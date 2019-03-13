const AMP_BUF_MAX_SIZE = 2;
const MAX_AMP_REFRESH_INTERVAL_MS = 5000;
const CURRENT_AMP_IDLE_RESET_INTERVAL_MS = 1000;
const MIN_AMP = 0.4;
const MAX_AMP = 0.65;

var ampBuf = [];
var currentAmp = -1;
var maxAmp = -1;

var resetCurrentAmpTimeout;
var refreshMaxAmpTimeout;

var currentAmpChangedCallback;
var maxAmpChangedCallback;

setCurrentAmp(0.0);

function smoothenAmp(amp) {
    ampBuf.push(Number(amp));
    while (ampBuf.length > AMP_BUF_MAX_SIZE) {
        ampBuf.shift();
    }
    return ampBuf.reduce((a, b) => a + b) / ampBuf.length;
}

function setCurrentAmp(amp) {
    currentAmp = amp;
    if (maxAmp < amp) {
        setMaxAmp(amp);
    }
    clearTimeout(resetCurrentAmpTimeout);
    resetCurrentAmpTimeout = setTimeout(() => setCurrentAmp(0), CURRENT_AMP_IDLE_RESET_INTERVAL_MS);
    if (currentAmpChangedCallback) {
        currentAmpChangedCallback(currentAmp);
    }
}

function setMaxAmp(amp) {
    maxAmp = amp;
    clearTimeout(refreshMaxAmpTimeout);
    refreshMaxAmpTimeout = setTimeout(() => setMaxAmp(currentAmp), MAX_AMP_REFRESH_INTERVAL_MS);
    if (maxAmpChangedCallback) {
        maxAmpChangedCallback(maxAmp);
    }
}

function setMeter(id, value) {
    let elem = document.getElementById(id);
    elem.style.width = value + '%';
    elem.innerHTML = value * 1 + '%';
}

function getNormalizedAmp(amp) {
    if (amp < MIN_AMP) {
        return 0.0;
    }
    if (amp >= MAX_AMP) {
        return 1.0;
    }
    return (amp - MIN_AMP) / MAX_AMP;
}

// Utils.

function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
}

function rand(items) {
    return items[Math.floor(Math.random() * items.length)];
}
