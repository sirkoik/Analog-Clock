const VERSION = '0.0.4';

var running = true;
var roundedMinSec = false;  // "Direct drive" movement of minute and second hands in intervals.
var numberType = -1;        // type of numbers used in face. default is none.

//var tickTime = 200;
//window.onload = () => setInterval(() => tick(), tickTime);

document.title += ' v' + VERSION;

window.onload = () => {
    try {
        console.log('Running...');
        clock1 = new AnalogClock();
        clock1.runClock();
    } catch(e) {
        console.log(e);
        console.log('Running finished');
    }
};

/*
document.onclick = () => {
    //roundedMinSec = !roundedMinSec;
    //toggleStyle();
    numberFill();
    colorize();
    replaceHistState();
}

// toggleStyle: toggle between black/white style (disabled since 0.0.2)
var ssHrefs = ['bg-white.css', 'bg-black.css'];
var styleIndex = 0;
function toggleStyle() {
    styleIndex = styleIndex >= 1? 0 : 1
    document.getElementById('colors').href = 'styles/' + ssHrefs[styleIndex];
}*/


