var fs = require('fs');

var duplicate = function(myInteger) {
    var result = '';
    var plusOne = false;
    for (var i = myInteger.length - 1; i >= 0; i--) {
        var digit = parseInt(myInteger[i]);
        var newDigit = (digit * 2) % 10;
        if (plusOne) {
            newDigit += 1;
        }
        result = newDigit.toString() + result;
        plusOne = (digit >= 5);
    }
    if (plusOne) {
        result = '1' + result;
    }
    return result;
};

var addOne = function(myInteger) {
    var result = '';
    var mustAdd = true;
    for (var i = myInteger.length - 1; i >= 0; i--) {
        var digit = parseInt(myInteger[i]);
        if (mustAdd) {
            if (digit === 9) {
                mustAdd = true;
                digit = 0;
            } else {
                mustAdd = false;
                digit += 1;
            }
        }
        result = digit.toString() + result;
    }
    if (mustAdd) {
        result = '1' + result;
    }
    return result;
};

var bigBinary2BigInteger = function(myBinary) {
    var myInteger = myBinary[0];
    for (var i = 1; i < myBinary.length; i++) {
        myInteger = duplicate(myInteger);
        if (myBinary[i] == '1') {
            myInteger = addOne(myInteger);
        }
    }
    return myInteger;
};

var printBitterDinner = function(cpu, bitSequence) {
    var bits = parseInt(cpu.match(/^[0-9]+/)[0]);
    var littleEndian = /L/i.test(cpu);
    var reverse = /R$/i.test(cpu);

    var myChunk = bitSequence.slice(0, bits);
    bitSequence = bitSequence.slice(bits);
    
    if (littleEndian) {
        var myBigEndianChunk = '';
        while (myChunk.length > 8) {
            myBigEndianChunk = myChunk.slice(0, 8) + myBigEndianChunk;
            myChunk = myChunk.slice(8);
        }
        myChunk = myChunk + myBigEndianChunk;
    }

    if (reverse) {
        myChunk = myChunk.split('').reverse().join('');
    }

    //console.log('%s eat %s = %s', cpu, myChunk, bigBinary2BigInteger(myChunk));
    console.log(bigBinary2BigInteger(myChunk));

    return bitSequence;
};

var main = function() {
    var inputFile = process.argv[2] || 'testInput';

    var lines = fs.readFileSync(inputFile).toString().split('\n');
    var hexSequence = new Buffer(lines[0], 'base64').toString('hex');
    var bitSequence = '';

    for(var i = 0; i < hexSequence.length; i++) {
        binChunk = parseInt(hexSequence[i], 16).toString(2);
        bitSequence += ('0000' + binChunk).slice(-4);
    }

    var numberOfCPUs = lines[1];

    for(var j = 2; j < parseInt(numberOfCPUs) + 2; j++) {
        bitSequence = printBitterDinner(lines[j], bitSequence);
    }
};

main();
