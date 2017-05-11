var fs = require('fs');

var printSolution = function (caseNumber, maxScore) {
    var cards;
    if (maxScore === 1) {
        cards = 1;
    } else if (maxScore === 2) {
        cards = 2;
    } else {
        cards = Math.ceil(Math.log2(maxScore));
    }
    console.log('Case #%s: %s', caseNumber, cards);
};

var main = function() {
    var inputFile = process.argv[2] || 'testInput';

    var lines = fs.readFileSync(inputFile).toString().split('\n');
    var numberOfCases = lines[0];

    for(var i = 1; i <= numberOfCases; i++) {
        var maxScore = parseInt(lines[i]);
        printSolution(i, maxScore);
    }
};


main();
