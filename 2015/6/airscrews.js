var fs = require('fs');

var DATA = [];
var RESULTS;
var ROWS;

var initializeResult = function() {
    RESULTS = [];
    ROWS = [];
};

var getResult = function(x, y, size) {
    if (RESULTS[x]) {
        return RESULTS[x][y];
    } else {
        return undefined;
    }
};

var setResult = function(x, y, size, value) {
    if (!RESULTS[x]) {
        RESULTS[x] = [];
    }

    RESULTS[x][y] = value;
};

var getRow = function(x, y, size) {
    if (ROWS[x] && ROWS[x][y]) {
        return ROWS[x][y];
    } else {
        var sum = 0;
        for (var l = x; l < x + size; l++) {
            sum += DATA[y][l];
        }
        if (!ROWS[x]) {
            ROWS[x] = [];
        }
        ROWS[x][y] = sum;
        return sum;
    }
};

var toInt = function(e) {
    return parseInt(e);
};

var calculatePart = function(x, y, size) {
    var sum = 0;
    var part = getResult(x, y, size);
    if (part !== undefined) {
        sum = part;
    } else {
        part = getResult(x - 1, y, size);
        if (part !== undefined) {
            x1 = x - 1;
            x2 = x1 + size;
            sum = part;
            for (var k = y; k < y + size; k++) {
                sum -= DATA[k][x1];
                sum += DATA[k][x2];
            }
            setResult(x, y, size, sum);
        } else {
            part = getResult(x, y - 1, size);
            if (part !== undefined) {
                y1 = y - 1;
                y2 = y1 + size;
                sum = part;
                sum += getRow(x, y2, size);
                sum -= getRow(x, y1, size);
                setResult(x, y, size, sum);
            } else {
                for (var k = y; k < y + size; k++) {
                    sum += getRow(x, k, size);
                }
                setResult(x, y, size, sum);
            }
        }
    }
    return sum;
};

var calculateValue = function(x, y, size) {
    return calculatePart(x, y, size) + calculatePart(x + size + 1, y + size + 1, size);
};

var printAirscrew = function(index, myCase) {
    var y0 = myCase[0];
    var x0 = myCase[1];
    var y1 = myCase[2];
    var x1 = myCase[3];
    var partSize = myCase[4];
    var totalSize = 2 * partSize + 1;

    var max = 0;
    initializeResult();
    for (var i = x0; i <= x1 - totalSize + 1; i++) {
        for (var j = y0; j <= y1 - totalSize + 1; j++) {
            var sum = calculateValue(i, j, partSize);
            if (sum > max) {
                max = sum;
            }
        }
    }
    console.log('Case %d: %d', index, max);
};

var main = function() {
    var inputFile = process.argv[2] || 'testInput';

    var input = fs.readFileSync(inputFile).toString().split('\n');
    var dataInput = fs.readFileSync('sheet.data').toString().split('\n');

    var dataLines = parseInt(dataInput[0].split(' ')[0]);
    for(var i = 1; i <= dataLines; i++) {
        var line = dataInput[i].split(' ').map(toInt);
        DATA.push(line);
    }

    var cases = parseInt(input[0]);

    for(var i = 1; i <= cases; i++) {
        var myCase = input[i].split(' ').map(toInt);
        printAirscrew(i, myCase);
    }
};

main();
