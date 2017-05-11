var fs = require('fs');

var printSolution = function (caseNumber, slices) {
    var sum = slices.reduce(function(a, b) { return a + b; }, 0);
    console.log('Case #%s: %s', caseNumber, Math.ceil(sum / 8));
};

var main = function() {
    var inputFile = process.argv[2] || 'testInput';

    var lines = fs.readFileSync(inputFile).toString().split('\n');
    var numberOfCases = lines[0];

    for(var i = 1; i <= numberOfCases; i++) {
        var line = lines[i*2].split(' ').map(function(e) {
            return parseInt(e);
        });
        printSolution(i, line);
    }
};


main();
