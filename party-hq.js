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
socket.on('hq cfg updated show volume meter', setShowVolumeMeter);
socket.on('hq cfg updated enable john cena', setEnableJohnCena);
socket.on('hq cfg updated gif timeout', setGifTimeout);
socket.on('hq cfg updated gif override timeout', setGifOverrideTimeout);

socket.on('amplitude out', amp => setCurrentAmp(smoothenAmp(amp)));

function updateCfg() {
    setMinThreshold(_cfg.MinAmpThreshold);
    setMaxThreshold(_cfg.MaxAmpThreshold);
    setSmoothingWindow(_cfg.MovingAverageWindowSize);
    setShowVolumeMeter(_cfg.ShowVolumeMeter);
    setEnableJohnCena(_cfg.EnableJohnCena);
    setGifTimeout(_cfg.GifTimeoutMs / 1000.0);
    setGifOverrideTimeout(_cfg.GifOverrideTimeoutMs / 1000.0);
}

function toggleLvl(lvl) {
    socket.emit('hq toggle lvl', lvl);
}

function setMinThreshold(value, notify = false) {
    _cfg.MinAmpThreshold = value;
    const range = _('min-threshold');
    const text = _('min-threshold-text');
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
    const range = _('max-threshold');
    const text = _('max-threshold-text');
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
    const range = _('smoothing-window');
    const text = _('smoothing-window-text');
    range.value = value;
    text.innerHTML = value;
    if (notify) {
        socket.emit('hq cfg update moving average window size', _cfg.MovingAverageWindowSize);
    }
}

function setShowVolumeMeter(value, notify = false) {
    _cfg.ShowVolumeMeter = value;
    const check = _('show-volume-meter');
    check.checked = value;
    if (notify) {
        socket.emit('hq cfg update show volume meter', _cfg.ShowVolumeMeter);
    }
}

function setEnableJohnCena(value, notify = false) {
    _cfg.EnableJohnCena = value;
    const check = _('enable-john-cena');
    const checkBody = _('enable-john-cena-body');
    const text = _('enable-john-cena-text');
    check.checked = value;
    if (value) {
        text.classList.add('JOHN_CENA');
        checkBody.classList.add('JOHN_CENA_BODY');
    } else {
        text.classList.remove('JOHN_CENA');
        checkBody.classList.remove('JOHN_CENA_BODY');
    }
    if (notify) {
        socket.emit('hq cfg update enable john cena', _cfg.EnableJohnCena);
    }
}

function setGifTimeout(value, notify = false) {
    _cfg.GifTimeoutMs = Number(value) * 1000.0;
    const range = _('gif-timeout');
    const text = _('gif-timeout-text');
    range.value = value;
    text.innerHTML = Number(value).toFixed(2) + ' s';
    if (notify) {
        socket.emit('hq cfg update gif timeout', _cfg.GifTimeoutMs);
    }
}

function setGifOverrideTimeout(value, notify = false) {
    _cfg.GifOverrideTimeoutMs = Number(value) * 1000.0;
    const range = _('gif-override-timeout');
    const text = _('gif-override-timeout-text');
    range.value = value;
    text.innerHTML = Number(value) === 0.0 ? 'NEVER' : Number(value).toFixed(2) + ' s';
    if (notify) {
        socket.emit('hq cfg update gif override timeout', _cfg.GifOverrideTimeoutMs);
    }
}

const onMinThresholdChanged = setMinThreshold;
const onMaxThresholdChanged = setMaxThreshold;
const onSmoothingWindowChanged = setSmoothingWindow;
const onShowVolumeMeterChanged = setShowVolumeMeter;
const onEnableJohnCenaChanged = setEnableJohnCena;
const onGifTimeoutChanged = setGifTimeout;
const onGifOverrideTimeoutChanged = setGifOverrideTimeout;
