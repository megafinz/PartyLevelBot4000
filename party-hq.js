_currentAmpChangedCallback = amp => {
    setMeter('current-meter', Math.round(amp * 100));
    setMeter('current-meter-normalized', Math.round(getNormalizedAmp(amp) * 100));
}

_maxAmpChangedCallback = amp => {
    setMeter('max-meter', Math.round(amp * 100));
    setMeter('max-meter-normalized', Math.round(getNormalizedAmp(amp) * 100));
}

const socket = io();

socket.on('amplitude out', amp => setCurrentAmp(smoothenAmp(amp)));

setMinThreshold(MIN_AMP);
setMaxThreshold(MAX_AMP);
setSmoothingWindow(AMP_BUF_MAX_SIZE);

function toggleLvl(lvl) {
    socket.emit('hq toggle lvl', lvl);
}

function setMinThreshold(value) {
    MIN_AMP = value;
    const range = document.getElementById('min-threshold');
    const text = document.getElementById('min-threshold-text');
    range.value = value;
    text.innerHTML = Number(value).toFixed(2);
    if (value > MAX_AMP) {
        setMaxThreshold(value);
    }
    refreshMapAmp();
}

function setMaxThreshold(value) {
    MAX_AMP = value;
    const range = document.getElementById('max-threshold');
    const text = document.getElementById('max-threshold-text');
    range.value = value;
    text.innerHTML = Number(value).toFixed(2);
    if (value < MIN_AMP) {
        setMinThreshold(value);
    }
    refreshMapAmp();
}

function setSmoothingWindow(value) {
    AMP_BUF_MAX_SIZE = value;
    const range = document.getElementById('smoothing-window');
    const text = document.getElementById('smoothing-window-text');
    range.value = value;
    text.innerHTML = value;
}

const onMinThresholdChanged = setMinThreshold;
const onMaxThresholdChanged = setMaxThreshold;
const onSmoothingWindowChanged = setSmoothingWindow;
