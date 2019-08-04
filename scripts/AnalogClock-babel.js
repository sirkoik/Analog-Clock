function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// AnalogClock class
class AnalogClock {
  // second and minute hands move in intervals instead of smoothly.
  constructor(args) {
    _defineProperty(this, "running", false);

    _defineProperty(this, "directDrive", false);

    _defineProperty(this, "numberType", -1);

    _defineProperty(this, "clockMath", void 0);

    if (args) {
      if (args.directDrive) this.directDrive = args.directDrive;
    }

    this.clockMath = new ClockMath(args); // get parameters from query string.

    const params = new URLSearchParams(location.search);
    var type = parseInt(params.get('mode'));
    var foreColor = params.get('fg');
    var backColor = params.get('bg');
    var showHint = params.get('showHint');
    
    if (showHint === 'false') document.querySelector('.hint').style.display = 'none';

    if (this.isNumeric(type)) {
      if (type < 0) type = 0;
      this.numberType = type;
      this.clockMath.numberType = type;
      this.setNumbers(type);
    } else {
      this.setNumbersRand();
    }

    if (this.isNumeric(backColor) && this.isNumeric(foreColor)) {
      this.setColors(foreColor, backColor);
    } else {
      this.setColorsRand();
    }

    document.onclick = () => {
      this.setNumbersRand();
      this.setColorsRand();
    };
  } // runClock: get the clock started.


  runClock() {
    this.running = true;
    this.setTime();
    window.requestAnimationFrame(() => this.setTime());
  } // setTime: The animation function.
  // note on es6 classes and requestAnimationFrame https://stackoverflow.com/questions/49197700/es6-class-this-in-callback-of-requestanimationframe


  setTime() {
    if (!this.running) return false;
    var t = this.clockMath.getHMS(); // position hands.

    document.querySelector('.hand-hour').style.transform = 'rotate(' + t.hrRotation + 'deg)';
    document.querySelector('.hand-minute').style.transform = 'rotate(' + t.minRotation + 'deg)';
    document.querySelector('.hand-second').style.transform = 'rotate(' + t.secRotation + 'deg)'; // add text to hands.

    var hNum = this.clockMath.numOnHands(t.hr, t.min, t.sec);
    document.querySelector('.hand-hour').textContent = hNum[0];
    document.querySelector('.hand-minute').textContent = hNum[1];
    document.querySelector('.hand-second').textContent = hNum[2];
    window.requestAnimationFrame(() => this.setTime());
  }

  fillNumbers(numbers) {
    var squares = document.querySelectorAll('.square'); // squares.length - 1 avoids overwriting the 'hub' square with its link

    for (var x = 0; x < squares.length - 1; x++) {
      squares[x].textContent = numbers[x];
    }
  }

  setNumbers(number) {
    const numbers = this.clockMath.getFaceNumbers(number);
    this.numberType = this.clockMath.numberType;
    this.fillNumbers(numbers);
  }

  setNumbersRand() {
    const numbers = this.clockMath.getFaceNumbersRand();
    this.numberType = this.clockMath.numberType;
    this.fillNumbers(numbers);
  } // setColors: Color watch face and hands.


  setColors(foreColor, backColor) {
    var squares = document.querySelectorAll('.square');

    for (var square of squares) {
      square.style.backgroundColor = 'hsl(' + foreColor + ',50%,50%)';
    }

    var hands = document.querySelectorAll('.hand');

    for (var hand of hands) {
      hand.style.backgroundColor = 'hsl(' + foreColor + ',20%,50%)';
    }

    var backColorFlr = Math.floor(backColor);
    document.body.style.backgroundImage = 'linear-gradient(to bottom right, hsl(' + backColorFlr + ',50%,80%), hsl(' + backColorFlr + ',50%,50%))';
    this.replaceHistState(foreColor, backColor, this.numberType);
  } // setColorsRand: Color watch face and hands with random colors
  // that are reasonably complimentary.


  setColorsRand() {
    var foreColor = 0,
        backColor = 0;

    while (Math.abs(foreColor - backColor) < 10) {
      foreColor = Math.floor(Math.random() * 255);
      backColor = Math.floor(Math.random() * 255);
    }

    this.setColors(foreColor, backColor);
  } // replaceHistState: save the clock state into the URL query string.


  replaceHistState(foreColor, backColor, numberType) {
    const params = new URLSearchParams();
    params.set('fg', foreColor);
    params.set('bg', backColor);
    params.set('mode', numberType);
    params.set('showHint', false);
    window.history.replaceState({}, '', '?' + params.toString());
  } // isNumeric: qualify input for numeric


  isNumeric(num) {
    return !isNaN(num) && num !== undefined && num !== null;
  }

}