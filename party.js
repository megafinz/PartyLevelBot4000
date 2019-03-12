const MAX_AMP_REFRESH_INTERVAL_MS = 5000;
const CURRENT_AMP_IDLE_RESET_INTERVAL_MS = 1000;
const REACTION_IMG_OVERRIDE_TIMEOUT_MS = 5000;
const JOHN_CENA_ENABLED = true;

const THRESHOLDS = [
    { amp: 0.1, gifs: [ '0.gif' ] },
    { amp: 0.2, gifs: [ '1.gif' ] },
    { amp: 0.3, gifs: [ '2.gif' ] },
    { amp: 0.4, gifs: [ '3.gif' ] },
    { amp: 0.5, gifs: [ '4.gif' ] },
    { amp: 0.6, gifs: [ '5.gif' ] },
    { amp: Number.MAX_VALUE, gifs: [ '6.gif' ] }
]

var currentAmp = -1;
var maxAmp = -1;
var resetCurrentAmpTimeout;
var refreshMaxAmpTimeout;
var reactionImgOverrideTimeout;

const socket = io();

setCurrentAmp(0);

socket.on('amplitude out', amp => {
    setCurrentAmp(amp);
    clearTimeout(resetCurrentAmpTimeout);
    resetCurrentAmpTimeout = setTimeout(() => setCurrentAmp(0), CURRENT_AMP_IDLE_RESET_INTERVAL_MS);
});

socket.on('hq toggle lvl', lvl => {
    const imgBody = document.getElementById('reaction');
    const overrideImg = document.getElementById('reaction-img-override');
    const overrideImgBody = document.getElementById('reaction-override');
    let { gif, isJohnCena } = getGifForLvl(lvl);
    imgBody.classList.add('hide');
    overrideImgBody.classList.remove('hide');
    overrideImg.src = gif;
    toggleElementJohnCena(overrideImg, isJohnCena);
    toggleBodyJohnCena(overrideImgBody, isJohnCena);
    clearTimeout(reactionImgOverrideTimeout);
    reactionImgOverrideTimeout = setTimeout(() => {
        imgBody.classList.remove('hide');
        overrideImgBody.classList.add('hide');
    }, REACTION_IMG_OVERRIDE_TIMEOUT_MS);
});

function setCurrentAmp(amp) {
    currentAmp = amp;
    setMeter('current-meter', Math.round(amp * 100));
    if (maxAmp < amp) {
        setMaxAmp(amp);
    }
}

function setMaxAmp(amp) {
    maxAmp = amp;
    setMeter('max-meter', Math.round(maxAmp * 100));
    updateReaction(maxAmp);
    clearTimeout(refreshMaxAmpTimeout);
    refreshMaxAmpTimeout = setTimeout(() => setMaxAmp(currentAmp), MAX_AMP_REFRESH_INTERVAL_MS);
}

function setMeter(id, value) {
    let elem = document.getElementById(id);
    elem.style.width = value + '%';
    elem.innerHTML = value * 1 + '%';
}

function updateReaction(amp) {
    let elem = document.getElementById('reaction-img');
    let body = document.getElementById('reaction');
    let { gif, isJohnCena } = getGif(amp);
    elem.src = gif;
    toggleElementJohnCena(elem, isJohnCena);
    toggleBodyJohnCena(body, isJohnCena);
}

function getGif(amp) {
    let minT = THRESHOLDS[0];
    let maxT = THRESHOLDS[THRESHOLDS.length - 1];
    if (amp < minT.amp) {
        result = minT;
    } else if (amp >= maxT.amp) {
        result = maxT;
    } else {
        result = THRESHOLDS.find(t => t.amp > amp);
    }
    return { gif: rand(result.gifs), isJohnCena: result === maxT };
}

function getGifForLvl(lvl) {
    let maxT = THRESHOLDS[THRESHOLDS.length - 1];
    lvl = clamp(lvl, 0, THRESHOLDS.length - 1);
    let result = THRESHOLDS[lvl];
    return { gif: rand(result.gifs), isJohnCena: result === maxT };
}

function toggleElementJohnCena(elem, enable) {
    if (JOHN_CENA_ENABLED && enable) {
        elem.classList.add('JOHN_CENA');
    } else {
        elem.classList.remove('JOHN_CENA');
    }
}

function toggleBodyJohnCena(elem, enable) {
    if (JOHN_CENA_ENABLED && enable) {
        elem.classList.add('JOHN_CENA_BODY');
    } else {
        elem.classList.remove('JOHN_CENA_BODY');
    }
}

// Utils.

function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}

function rand(items) {
    return items[Math.floor(Math.random() * items.length)];
}
