const REACTION_IMG_OVERRIDE_TIMEOUT_MS = 5000;
const JOHN_CENA_ENABLED = true;

const THRESHOLDS = [
    { amp: 0.20, gifs: [ '1-1.gif', '1-2.gif' ] },
    { amp: 0.40, gifs: [ '2-1.gif', '2-2.gif' ] },
    { amp: 0.60, gifs: [ '3-1.gif', '3-2.gif' ] },
    { amp: 0.80, gifs: [ '4-1.gif', '4-2.gif' ] },
    { amp: Number.MAX_VALUE, gifs: [ '5-1.gif', '5-2.gif' ] }
]

// const THRESHOLDS = [
//     { amp: 0.10, gifs: [ '1-1.gif' ] },
//     { amp: 0.20, gifs: [ '1-2.gif' ] },
//     { amp: 0.30, gifs: [ '2-1.gif' ] },
//     { amp: 0.40, gifs: [ '2-2.gif' ] },
//     { amp: 0.50, gifs: [ '3-1.gif' ] },
//     { amp: 0.60, gifs: [ '3-2.gif' ] },
//     { amp: 0.70, gifs: [ '4-1.gif' ] },
//     { amp: 0.80, gifs: [ '4-2.gif' ] },
//     { amp: 0.90, gifs: [ '5-1.gif' ] },
//     { amp: Number.MAX_VALUE, gifs: [ '5-2.gif' ] }
// ]

var _reactionImgOverrideTimeout;

_maxAmpChangedCallback = amp => updateReaction(getNormalizedAmp(amp));

const socket = io();

setCurrentAmp(0.0);

socket.on('hq init cfg', cfg => _cfg = cfg);

socket.on('hq cfg updated min amp threshold', value => _cfg.MinAmpThreshold = value);
socket.on('hq cfg updated max amp threshold', value => _cfg.MaxAmpThreshold = value);
socket.on('hq cfg updated moving average window size', value => _cfg.MovingAverageWindowSize = value);
socket.on('hq cfg updated gif timeout', value => _cfg.GifTimeoutMs = value);

socket.on('amplitude out', amp => setCurrentAmp(smoothenAmp(amp)));

socket.on('hq toggle lvl', lvl => {
    const imgBody = document.getElementById('reaction');
    const overrideImg = document.getElementById('reaction-img-override');
    const overrideImgBody = document.getElementById('reaction-override');
    let { gif, isJohnCena } = getGifForLvl(lvl);
    imgBody.classList.add('invisible');
    overrideImgBody.classList.remove('invisible');
    overrideImg.src = gif;
    toggleElementJohnCena(overrideImg, isJohnCena);
    toggleBodyJohnCena(overrideImgBody, isJohnCena);
    clearTimeout(_reactionImgOverrideTimeout);
    _reactionImgOverrideTimeout = setTimeout(() => {
        imgBody.classList.remove('invisible');
        overrideImgBody.classList.add('invisible');
    }, REACTION_IMG_OVERRIDE_TIMEOUT_MS);
});

function updateReaction(amp) {
    let elem = document.getElementById('reaction-img');
    let body = document.getElementById('reaction');
    let { gif, isJohnCena } = getGif(amp);
    elem.src = gif;
    toggleElementJohnCena(elem, isJohnCena);
    toggleBodyJohnCena(body, isJohnCena);
}

function getGif(amp) {
    if (amp === 0.0) {
        return { gif: '', isJohnCena: false };
    }
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
