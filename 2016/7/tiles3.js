// Run program with:
// node tiles2.js testInput | sort -V

var fs = require('fs');
var cluster = require('cluster');

var VALUES = 'zyxwvutsrqponmlkjihgfedcba.ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var CACHE;

/*
var countCache = function () {
    var count = 0;
    for (var i = 0; i < CACHE.length; i++) {
        if (CACHE[i]) {
            for (var j = 0; j < CACHE[i].length; j++) {
                if (CACHE[i][j]) {
                    for (var k = 0; k < CACHE[i][j].length; k++) {
                        count += CACHE[i][j][k].length;
                    }
                }
            }
        }
    }
    console.log('Cache has %d elements', count);
};
*/

var getFromCache = function (width, height, x, y) {
    // Assume that every result already exist
    return CACHE[width][height][x][y];
};

var addToCache = function (width, height, x, y, result) {
    if (!CACHE[width]) {
        CACHE[width] = [];
        CACHE[width][height] = [];
        CACHE[width][height][x] = [];
        CACHE[width][height][x][y] = result;
    } else if (!CACHE[width][height]) {
        CACHE[width][height] = [];
        CACHE[width][height][x] = [];
        CACHE[width][height][x][y] = result;
    } else if (!CACHE[width][height][x]) {
        CACHE[width][height][x] = [];
        CACHE[width][height][x][y] = result;
    } else {
        CACHE[width][height][x][y] = result;
    }
/*
    console.log('Adding %dx%d (%d, %d)', width, height, x, y);
    countCache();
*/
};

/*
var cleanCache = function (matrix, size) {
    if (size.width === size.height && size.width >= 4) {
        var deleteableDimension = size.width - 2;
        for (var i = 2; i < matrix.length; i++) {
            delete CACHE[deleteableDimension][i];
        }
        for (var j = 2; j < matrix[0].length; j++) {
            delete CACHE[j][deleteableDimension];
        }
    }
};
*/

var cleanCache2 = function (matrix, size) {
    if (size.width === size.height && size.width === 2) {
        delete CACHE[1][1];
//        console.log('Deleting %dx%d', 1, 1);
//        countCache();
    } else if (size.width === size.height && size.width >= 3) {
        var deleteableDimension = size.width - 1;
        for (var i = 2; i < matrix.length; i++) {
            delete CACHE[deleteableDimension][i];
//            console.log('Deleting %dx%d', deleteableDimension, i);
//            countCache();
        }
        for (var j = 2; j < matrix[0].length; j++) {
            delete CACHE[j][deleteableDimension];
//            console.log('Deleting %dx%d', j, deleteableDimension);
//            countCache();
        }
    }
};

var calculateRectangle = function (matrix, size, vertex) {
    var result;

    if (size.width === 1 && size.height === 1) {
        result = matrix[vertex.y][vertex.x];
    } else if (size.width >= size.height) {
        result = getFromCache(size.width - 1, size.height, vertex.x, vertex.y) +
            getFromCache(1, size.height, (vertex.x + size.width - 1) % matrix[0].length, vertex.y);
    } else {
        result = getFromCache(size.width, size.height - 1, vertex.x, vertex.y) +
            getFromCache(size.width, 1, vertex.x, (vertex.y + size.height - 1) % matrix.length);
    }

    addToCache(size.width, size.height, vertex.x, vertex.y, result);
    return result;
}

/*
var getRectangle = function (matrix, size, vertex) {
    var result = 0;

    for (var i = 0; i < size.height; i++) {
        for (var j = 0; j < size.width; j++) {
            result += matrix[(vertex.y + i) % matrix.length][(vertex.x + j) % matrix[0].length];
        }
    }
    return result;
}
*/

var sumBySize = function (matrix, size) {
    var sizeSum = 0;
    if (matrix.length === size.height && matrix[0].length === size.width) {
        var sum = calculateRectangle(matrix, size, {x: 0, y: 0});
        if (sum > 0) {
            return undefined;
        } else {
            return sum;
        }
    } else {
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
    }

    cleanCache2(matrix, size);

    return sizeSum;
};

var calculateSolution = function (matrix) {
    var maxSolution = 0; // 0x0 rectangle
    CACHE = []; // Reset cache
    var maxLength = matrix.length >= matrix[0].length ? matrix.length : matrix[0].length;
    for (var i = 0; i < maxLength; i++) {
        for (var j = i; j < maxLength; j++) {
            var sol;
            if (i < matrix.length && j < matrix[0].length) {
                sol = sumBySize(matrix, {width: j + 1, height: i + 1});
                if ((sol !== undefined) && (i < matrix[0].length) && (i !== j)) {
                    var sol2 = sumBySize(matrix, {width: i + 1, height: j + 1});
                    sol = (sol2 === undefined || sol2 > sol) ? sol2 : sol;
                }
            } else if (i < matrix[0].length && j < matrix.length) {
                sol = sumBySize(matrix, {width: i + 1, height: j + 1});
            }
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

var main = function(workerId, workers) {
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
//        if (i % workers === workerId) {
            printSolution(i, matrix);
//        }
    }
    cluster.worker.kill();
};

var numWorkers = require('os').cpus().length;
if (cluster.isMaster) {
//    for (var i = 0; i < numWorkers; i++) {
    for (var i = 0; i < 1; i++) {
        cluster.fork();
    }
//    cluster.on('exit', function(worker, code) {
//        console.log('Worker ' + worker.id + ' died with code: ' + code);
//    });
} else {
    main(cluster.worker.id % numWorkers, numWorkers);
}
