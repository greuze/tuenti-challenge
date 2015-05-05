var fs = require('fs');

var DATA = [];

var toInt = function(e) {
    return parseInt(e);
};

var printAirscrew = function(index, myCase) {
    var y0 = myCase[0];
    var x0 = myCase[1];
    var y1 = myCase[2];
    var x1 = myCase[3];
    var partSize = myCase[4];
    var totalSize = 2 * partSize + 1;

    var max = 0;
    for (var i = y0; i <= y1 - totalSize + 1; i++) {
        for (var j = x0; j <= x1 - totalSize + 1; j++) {
            var sum = 0;
            for (var k = i; k < i + partSize; k++) {
                for (var l = j; l < j + partSize; l++) {
                    sum += DATA[k][l]; // first part
                    sum += DATA[k + partSize + 1][l + partSize + 1]; // second part
                }
            }
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
