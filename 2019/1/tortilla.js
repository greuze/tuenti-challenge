const fs = require('fs');

const printSolution = function (caseNumber, line) {
    const sum = Math.ceil(line[0] / 2) + Math.ceil(line[1] / 2);
    console.log('Case #%s: %s', caseNumber, sum);
};

const main = function() {
    const inputFile = process.argv[2] || 'testInput';

    const lines = fs.readFileSync(inputFile).toString().split('\n');
    const numberOfCases = parseInt(lines[0]);

    for(let i = 1; i <= numberOfCases; i++) {
        let line = lines[i].split(' ').map(e => parseInt(e));
        printSolution(i, line);
    }
};

main();
