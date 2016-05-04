var fs = require('fs');

var VALUES = 'zyxwvutsrqponmlkjihgfedcba.ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var CACHE;

var calculateRectangle = function (matrix, size, vertex) {
    var result;

    if (size.width === 1 && size.height === 1) {
        result = matrix[vertex.y][vertex.x];
    } else if (size.width >= size.height) {
        result = CACHE[(size.width - 1) + 'x' + size.height + '(' + vertex.x + ',' + vertex.y + ')'] +
            CACHE['1x' + size.height + '(' + ((vertex.x + size.width - 1) % matrix[0].length) + ',' + vertex.y + ')'];
    } else {
        result = CACHE[size.width + 'x' + (size.height - 1) + '(' + vertex.x + ',' + vertex.y + ')'] +
            CACHE[size.width + 'x1(' + vertex.x + ',' + ((vertex.y + size.height - 1) % matrix.length) + ')'];
    }

    CACHE[size.width + 'x' + size.height + '(' + vertex.x + ',' + vertex.y + ')'] = result;
    return result;
}

var getRectangle = function (matrix, size, vertex) {
    var result = 0;

    for (var i = 0; i < size.height; i++) {
        for (var j = 0; j < size.width; j++) {
            result += matrix[(vertex.y + i) % matrix.length][(vertex.x + j) % matrix[0].length];
        }
    }
    return result;
}

var sumBySize = function (matrix, size) {
    var sizeSum = 0;
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            var sum = calculateRectangle(matrix, size, {x: j, y: i});
            // Check for infinity
            if (sum > 0 && (matrix.length === size.height || matrix[0].length === size.width)) {
                return undefined;
            }
            if (sum > sizeSum) {
                sizeSum = sum;
            }
        }
    }
    return sizeSum;
};

var calculateSolution = function (matrix) {
    var maxSolution = 0; // 0x0 rectangle
    CACHE = {}; // Reset cache
    for (var i = 0; i < matrix.length; i++) {
        var line = matrix[i];
        for (var j = 0; j < line.length; j++) {
            var sol = sumBySize(matrix, {height: i + 1, width: j + 1});
            if (sol === undefined) {
                return 'INFINITY';
            }
            if (sol > maxSolution) {
                maxSolution = sol;
            }
        }
    }
    return maxSolution;
};

var printSolution = function (caseNumber, matrix) {
    console.log('Case #%d: %s', caseNumber, calculateSolution(matrix));
};

var transformValue = function (inputValue) {
    return VALUES.indexOf(inputValue) - 26;
};

var transformValues = function (inputLine) {
    return inputLine.map(transformValue);
};

var main = function() {
    var inputFile = process.argv[2] || 'testInput';

    var lines = fs.readFileSync(inputFile).toString().split('\n');
    var numberOfCases = lines[0];

    var currentLine = 1;
    for(var i = 1; i <= numberOfCases; i++) {
        var dimensions = lines[currentLine].split(' ');
        currentLine++;
        var matrixLines = parseInt(dimensions[0]);
        var matrix = [];
        for(var j = 1; j <= matrixLines; j++) {
            var newLine = transformValues(lines[currentLine].split(''));
            matrix.push(newLine);
            currentLine++;
        }
        printSolution(i, matrix);
    }
};

main();
