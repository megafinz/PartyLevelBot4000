const MAX_AMP_REFRESH_INTERVAL_MS = 5000;
const CURRENT_AMP_IDLE_RESET_INTERVAL_MS = 1000;
var AMP_BUF_MAX_SIZE = 3;
var MIN_AMP = 0.4;
var MAX_AMP = 0.65;

var _ampBuf = [];
var _currentAmp = -1;
var _maxAmp = -1;

var _resetCurrentAmpTimeout;
var _refreshMaxAmpTimeout;

var _currentAmpChangedCallback;
var _maxAmpChangedCallback;

setCurrentAmp(0.0);

function smoothenAmp(amp) {
    _ampBuf.push(Number(amp));
    while (_ampBuf.length > AMP_BUF_MAX_SIZE) {
        _ampBuf.shift();
    }
    return _ampBuf.reduce((a, b) => a + b) / _ampBuf.length;
}

function setCurrentAmp(amp) {
    _currentAmp = amp;
    if (_maxAmp < amp) {
        setMaxAmp(amp);
    }
    clearTimeout(_resetCurrentAmpTimeout);
    _resetCurrentAmpTimeout = setTimeout(() => setCurrentAmp(0), CURRENT_AMP_IDLE_RESET_INTERVAL_MS);
    if (_currentAmpChangedCallback) {
        _currentAmpChangedCallback(amp);
    }
}

function setMaxAmp(amp) {
    _maxAmp = amp;
    clearTimeout(_refreshMaxAmpTimeout);
    _refreshMaxAmpTimeout = setTimeout(() => setMaxAmp(_currentAmp), MAX_AMP_REFRESH_INTERVAL_MS);
    if (_maxAmpChangedCallback) {
        _maxAmpChangedCallback(amp);
    }
}

function setMeter(id, value) {
    let elem = document.getElementById(id);
    elem.style.width = value + '%';
    elem.innerHTML = value * 1 + '%';
}

function getNormalizedAmp(amp) {
    return clamp((amp - MIN_AMP) / (MAX_AMP - MIN_AMP), 0.0, 1.0);
}

// Utils.

function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
}

function rand(items) {
    return items[Math.floor(Math.random() * items.length)];
}
