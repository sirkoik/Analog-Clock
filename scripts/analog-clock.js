const VERSION = '0.0.2';

var running = true;
var roundedMinSec = false;

//var tickTime = 200;
//window.onload = () => setInterval(() => tick(), tickTime);

window.onload = () => colorize();

function tick() {
    if (!running) return false;
    var midnight = new Date();
    midnight.setHours(0,0,0,0);
    var ts = new Date().getTime() - midnight.getTime();
    var pct = ts / 86400000;
    var hr = pct * 24;
    var rotation = (720 * pct) - 90;
    
    var min = ts / 1000 / 60 % 60;
    if (roundedMinSec) min = Math.floor(min);
    var minRotation = 360 * (min / 60) - 90;
    
    var sec = ts % 60000 / 1000;
    if (roundedMinSec) sec = Math.floor(sec);
    var secRotation = 360 * (sec / 60) - 90;
    
    document.querySelector('.hand-hour').style.transform = 'rotate('+rotation+'deg)';
    document.querySelector('.hand-minute').style.transform = 'rotate('+minRotation+'deg)';
    document.querySelector('.hand-second').style.transform = 'rotate('+secRotation+'deg)';
    
    // text on hands.
    document.querySelector('.hand-hour').textContent = sig3(Math.round(hr * 1000) / 1000);
    document.querySelector('.hand-minute').textContent = sig3(Math.round(min * 1000) / 1000);
    document.querySelector('.hand-second').textContent = sig3(sec);
    window.requestAnimationFrame(tick);
}

// sig3: keep the number of digits constant so that the numbers don't jump around
// addLeadingZero: add a zero to all single-digit leading numbers
var addLeadingZero = false;
function sig3(num) {
    num = num + '';
    var str = ''; // 00.000
    var numArr = num.split('.');
    str = numArr[0].length <= 1 && addLeadingZero? '0' + numArr[0] : numArr[0];
    str = str + '.';

    for (var x = 0; x < 3; x++) {
        try {
        numEl = numArr[1] === undefined? 0 : numArr[1][x];
        str = numEl? str + '' + numEl : str + '0';
        }catch(e) {
            console.log(numArr);
        }
    }

    return str;

}

window.requestAnimationFrame(tick);

document.onclick = () => {
    //roundedMinSec = !roundedMinSec;
    //toggleStyle();
    colorize();
}

document.title += ' v' + VERSION;


// toggleStyle: toggle between black/white style (disabled since 0.0.2)
var ssHrefs = ['bg-white.css', 'bg-black.css'];
var styleIndex = 0;
function toggleStyle() {
    styleIndex = styleIndex >= 1? 0 : 1
    document.getElementById('colors').href = 'styles/' + ssHrefs[styleIndex];
}

// colorize: Give the watch face, hands and random colors that aren't too close to one another.
function colorize() {
    var foreColor = 0;
    var backColor = 0;

    while(Math.abs(foreColor - backColor) < 10) {
        foreColor = Math.random() * 255;
        backColor = Math.random() * 255;
    }

    var squares = document.querySelectorAll('.square');
    for (square of squares) {
        square.style.backgroundColor = 'hsl('+foreColor+',50%,50%)';
    }

    var hands = document.querySelectorAll('.hand');
    for (hand of hands) {
        hand.style.backgroundColor = 'hsl('+foreColor+',20%,50%)';
    }

    backColor = Math.floor(backColor);
    document.body.style.backgroundImage = 'linear-gradient(to bottom right, hsl('+backColor+',50%,80%), hsl('+backColor+',50%,50%))';
}
