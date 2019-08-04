console.log('ClockMath class loaded.');

class ClockMath {
    // addLeadingZero: add a zero to all single-digit leading numbers
    addLeadingZero = false;
    directDrive = false;

    // numberType: Type of clock face.
    numberType = -1;
    prevNumber = -1;

    constructor(args) {
        if (args) {
            if (args.directDrive) this.directDrive = args.directDrive;
        }
    }

    getHMS() {
        var tObj = {
            hr: 0,
            hrRotation: 0,
            min: 0,
            minRotation: 0,
            sec: 0,
            secRotation: 0
        };

        var t0 = new Date();
        t0.setHours(0,0,0,0); // midnight
        var msecs = new Date().getTime() - t0.getTime(); // milliseconds elapsed since midnight.
        var pct = msecs / 86400000;

        // h
        tObj.hr = pct * 24;
        tObj.hrRotation = (720 * pct) - 90;
        
        // m
        tObj.min = msecs / 1000 / 60 % 60;
        if (this.directDrive) tObj.min = Math.floor(tObj.min);
        tObj.minRotation = 360 * (tObj.min / 60) - 90;
        
        // s
        tObj.sec = msecs % 60000 / 1000;
        if (this.directDrive) tObj.sec = Math.floor(tObj.sec);
        tObj.secRotation = 360 * (tObj.sec / 60) - 90;

        return tObj;
    }

    numOnHands(hr, min, sec) {
        switch(this.numberType) {
            case 1: return [
                this.sig3(Math.round(hr * 1000) / 1000),
                this.sig3(Math.round(min * 1000) / 1000),
                this.sig3(sec)
            ];
            case 2: return [this.decToRoman(hr), this.decToRoman(min), this.decToRoman(sec)];
            case 3: return [this.decToBin(hr), this.decToBin(min), this.decToBin(sec)];
    
            default: return ['', '', ''];
        }
    }
    
    // decToRoman: convert a decimal to a roman numeral, up to 60.
    // first number is empty because roman numerals do not have a concept of zero.
    decToRoman(num) {
        const romans = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV', 'XXVI', 'XXVII', 'XXVIII', 'XXIX', 'XXX', 'XXXI', 'XXXII', 'XXXIII', 'XXXIV', 'XXXV', 'XXXVI', 'XXXVII', 'XXXVIII', 'XXXIX', 'XL', 'XLI', 'XLII', 'XLIII', 'XLIV', 'XLV', 'XLVI', 'XLVII', 'XLVIII', 'XLIX', 'L', 'LI', 'LII', 'LIII', 'LIV', 'LV', 'LVI', 'LVII', 'LVIII', 'LIX', 'LX'];
        return romans[Math.floor(num)];
    }
    
    // decToBin: convert a decimal to a binary string.
    // courtesy https://stackoverflow.com/questions/9939760/how-do-i-convert-an-integer-to-binary-in-javascript#16155417
    decToBin(num) {
        return (num >>> 0).toString(2);
    }
    
    // sig3: keep the number of digits constant so that the numbers don't jump around
    sig3(num) {
        num = num + '';
        var str = ''; // 00.000
        var numArr = num.split('.');
        str = numArr[0].length <= 1 && this.addLeadingZero? '0' + numArr[0] : numArr[0];
        str = str + '.';
    
        var numEl;

        for (var x = 0; x < 3; x++) {
            numEl = numArr[1] === undefined? 0 : numArr[1][x];
            str = numEl? str + '' + numEl : str + '0';
            // try {
            //     //numEl = numArr[1] === undefined? 0 : numArr[1][x];
            //     //str = numEl? str + '' + numEl : str + '0';
            // } catch(e) {
            //     console.log(numArr);
            // }
        }
    
        return str;
    
    }

    // getFaceNumbers: Place numbers into the clock squares based on a random selection.
    // @number: which face type to use
    // The first option has no numbers on the clock squares.
    // On clock faces with Roman numerals, IIII is used more commonly than IV. https://www.bernardwatch.com/Glossary-of-Watch-Terms
    // This app uses IIII on the numerals and IV on the hand numbers. 
    
    getFaceNumbers(number) {
        this.numberType = number;

        const numbers = [
            ['', '', '', '', '', '', '', '', '', '', '', ''],
            ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            ['I', 'II', 'III', 'IIII', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'],
            ['1', '10', '11', '100', '101', '110', '111', '1000', '1001', '1100', '1101', '1110']
        ];

        return numbers[this.numberType] !== undefined? numbers[this.numberType] : numbers[0];
    }

    getFaceNumbersRand() {
        while (this.numberType === this.prevNumber) this.numberType = Math.floor(Math.random() * 4);
        
        this.prevNumber = this.numberType;
        return this.getFaceNumbers(this.numberType);
    }
}   