const VERSION = '0.0.3';

var running = true;
var roundedMinSec = false;
var numberType = -1;        // type of numbers used in face. default is none.

//var tickTime = 200;
//window.onload = () => setInterval(() => tick(), tickTime);

window.onload = () => {
    colorize()
    numberFill();
};

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

    var hNum = numOnHands(hr, min, sec);
    document.querySelector('.hand-hour').textContent = hNum[0];
    document.querySelector('.hand-minute').textContent = hNum[1];
    document.querySelector('.hand-second').textContent = hNum[2];
    window.requestAnimationFrame(tick);
}

function numOnHands(hr, min, sec) {
    switch(numberType) {
        case 1: return [
            sig3(Math.round(hr * 1000) / 1000),
            sig3(Math.round(min * 1000) / 1000),
            sig3(sec)
        ];
        case 2: return [decToRoman(hr), decToRoman(min), decToRoman(sec)];
        case 3: return [decToBin(hr), decToBin(min), decToBin(sec)];

        default: return ['', '', ''];
    }
}

// decToRoman: convert a decimal to a roman numeral, up to 60.
// first number is empty because roman numerals do not have a concept of zero.
function decToRoman(num) {
    var romans = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV', 'XXVI', 'XXVII', 'XXVIII', 'XXIX', 'XXX', 'XXXI', 'XXXII', 'XXXIII', 'XXXIV', 'XXXV', 'XXXVI', 'XXXVII', 'XXXVIII', 'XXXIX', 'XL', 'XLI', 'XLII', 'XLIII', 'XLIV', 'XLV', 'XLVI', 'XLVII', 'XLVIII', 'XLIX', 'L', 'LI', 'LII', 'LIII', 'LIV', 'LV', 'LVI', 'LVII', 'LVIII', 'LIX', 'LX'];
    return romans[Math.floor(num)];
}

// decToBin: convert a decimal to a binary string.
// courtesy https://stackoverflow.com/questions/9939760/how-do-i-convert-an-integer-to-binary-in-javascript#16155417
function decToBin(num) {
    return (num >>> 0).toString(2);
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
    numberFill();

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

// numberFill: Place numbers into the clock squares based on a random selection.
// note - one option has no numbers on the clock squares.
var prevNumber = -1;
function numberFill() {
    numbers = [
        ['', '', '', '', '', '', '', '', '', '', '', ''],
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'],
        ['1', '10', '11', '100', '101', '110', '111', '1000', '1001', '1100', '1101', '1110']
    ];

    while (numberType == prevNumber) numberType = Math.floor(Math.random() * numbers.length);

    var squares = document.querySelectorAll('.square');
    for (var x = 0; x < squares.length; x++) {
        squares[x].textContent = numbers[numberType][x];
    }
    prevNumber = numberType;
}