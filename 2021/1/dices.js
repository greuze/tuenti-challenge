const fs = require('fs');

const printSolution = function (caseNumber, dices) {
    const sum = dices[0] + dices[1] + 1;
    let solucion;
    if (sum > 12) {
        solution = '-';
    } else {
        solution = '' + sum;
    }
    console.log('Case #%s: %s', caseNumber, solution);
};

const main = function() {
    const inputFile = process.argv[2] || 'testInput';

    const lines = fs.readFileSync(inputFile).toString().split('\n');
    const numberOfCases = lines[0];

    for(let i = 1; i <= numberOfCases; i++) {
        const dices = lines[i].split(':').map(e => parseInt(e));

        printSolution(i, dices);
    }
};

main();
