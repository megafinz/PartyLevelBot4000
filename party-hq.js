_currentAmpChangedCallback = amp => {
    setMeter('current-meter', Math.round(amp * 100));
    setMeter('current-meter-normalized', Math.round(getNormalizedAmp(amp) * 100));
}

_maxAmpChangedCallback = amp => {
    setMeter('max-meter', Math.round(amp * 100));
    setMeter('max-meter-normalized', Math.round(getNormalizedAmp(amp) * 100));
}

const socket = io();

socket.on('hq init cfg', cfg =>  {
    _cfg = cfg;
    updateCfg();
});

socket.on('hq cfg updated min amp threshold', setMinThreshold);
socket.on('hq cfg updated max amp threshold', setMaxThreshold);
socket.on('hq cfg updated moving average window size', setSmoothingWindow);

socket.on('amplitude out', amp => setCurrentAmp(smoothenAmp(amp)));

function updateCfg() {
    setMinThreshold(_cfg.MinAmpThreshold);
    setMaxThreshold(_cfg.MaxAmpThreshold);
    setSmoothingWindow(_cfg.MovingAverageWindowSize);
}

function toggleLvl(lvl) {
    socket.emit('hq toggle lvl', lvl);
}

function setMinThreshold(value, notify = false) {
    _cfg.MinAmpThreshold = value;
    const range = document.getElementById('min-threshold');
    const text = document.getElementById('min-threshold-text');
    range.value = value;
    text.innerHTML = Number(value).toFixed(2);
    if (value > _cfg.MaxAmpThreshold) {
        setMaxThreshold(value);
    }
    refreshMaxAmp();
    if (notify) {
        socket.emit('hq cfg update min amp threshold', _cfg.MinAmpThreshold);
    }
}

function setMaxThreshold(value, notify = false) {
    _cfg.MaxAmpThreshold = value;
    const range = document.getElementById('max-threshold');
    const text = document.getElementById('max-threshold-text');
    range.value = value;
    text.innerHTML = Number(value).toFixed(2);
    if (value < _cfg.MinAmpThreshold) {
        setMinThreshold(value);
    }
    refreshMaxAmp();
    if (notify) {
        socket.emit('hq cfg update max amp threshold', _cfg.MaxAmpThreshold);
    }
}

function setSmoothingWindow(value, notify = false) {
    _cfg.MovingAverageWindowSize = value;
    const range = document.getElementById('smoothing-window');
    const text = document.getElementById('smoothing-window-text');
    range.value = value;
    text.innerHTML = value;
    if (notify) {
        socket.emit('hq cfg update moving average window size', _cfg.MovingAverageWindowSize);
    }
}

const onMinThresholdChanged = setMinThreshold;
const onMaxThresholdChanged = setMaxThreshold;
const onSmoothingWindowChanged = setSmoothingWindow;
