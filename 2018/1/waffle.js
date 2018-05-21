const fs = require('fs');

const printSolution = function (caseNumber, slices) {
    const sum = (slices[0] - 1) * (slices[1] - 1);
    console.log('Case #%s: %s', caseNumber, sum);
};

const main = function() {
    const inputFile = process.argv[2] || 'testInput.txt';

    const lines = fs.readFileSync(inputFile).toString().split('\n');
    const numberOfCases = parseInt(lines[0]);

    for(let i = 1; i <= numberOfCases; i++) {
        let line = lines[i].split(' ').map(e => parseInt(e));
        printSolution(i, line);
    }
};

main();
