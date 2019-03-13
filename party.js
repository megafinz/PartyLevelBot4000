const REACTION_IMG_OVERRIDE_TIMEOUT_MS = 5000;
const JOHN_CENA_ENABLED = true;

const THRESHOLDS = [
    { amp: 0.15, gifs: [ '0.gif' ] },
    { amp: 0.30, gifs: [ '1.gif' ] },
    { amp: 0.45, gifs: [ '2.gif' ] },
    { amp: 0.60, gifs: [ '3.gif' ] },
    { amp: 0.75, gifs: [ '4.gif' ] },
    { amp: 0.90, gifs: [ '5.gif' ] },
    { amp: Number.MAX_VALUE, gifs: [ '6.gif' ] }
]

var _reactionImgOverrideTimeout;

_maxAmpChangedCallback = amp => updateReaction(getNormalizedAmp(amp));

const socket = io();

setCurrentAmp(0.0);

socket.on('amplitude out', amp => setCurrentAmp(smoothenAmp(amp)));

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
    clearTimeout(_reactionImgOverrideTimeout);
    _reactionImgOverrideTimeout = setTimeout(() => {
        imgBody.classList.remove('hide');
        overrideImgBody.classList.add('hide');
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
