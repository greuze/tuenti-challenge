const fs = require('fs');

const parseValues = function(rawValues) {
    const values = {};
    if (rawValues.charAt(0) === '{') {
        // dictionary: {'a': 2/3, 'e': 4, 'h': 3, 'l': 5, 'o': 1, 't': 6, 'v': 0}
        rawValues.slice(1, -1).split(/\s*,\s*/).forEach(v => {
            const e = v.split(/\s*:\s*/);
            values[e[0].trim().slice(1, -1)] = eval(e[1]);
        });
    } else if (rawValues.charAt(0) === '[') {
        // tuples: [('a', 2/3), ('e', 4), ('h', 3), ('l', 5), ('o', 1), ('t', 6), ('v', 0)]
        rawValues.slice(1, -1).trim().slice(1, -1).trim().split(/\s*\)\s*,\s*\(\s*/).forEach(v => {
            const e = v.split(/\s*,\s*/);
            values[e[0].trim().slice(1, -1)] = eval(e[1]);
        });
    } else {
        // assignments: a=2/3,e=4,h=3,l=5,o=1,t=6,v=0
        rawValues.split(/\s*,\s*/).forEach(v => {
            const e = v.split(/\s*=\s*/);
            values[e[0]] = eval(e[1]);
        });
    }
    return values;
}

const getValue = function(word, values) {
    let sum = 0;
    for (let i = 0; i < word.length; i++) {
        sum += values[word[i]];
    }
    return sum;
}

const printSolution = function (caseNumber, words, rawValues) {
    const values = parseValues(rawValues);
    const sum1 = getValue(words[0], values);
    const sum2 = getValue(words[1], values);
    const diff = sum1 - sum2;

    let sol;
    if (sum1 > sum2) {
        sol = words[0];
    } else if (sum1 < sum2) {
        sol = words[1];
    } else {
        sol = '-';
    }

    // Security check, just in case there is a possible precission risk, when handling fractions
    if (sum1 !== sum2 && Math.abs(sum1 - sum2) < 0.01) {
        console.log('WARNING, precission risk', sum1, sum2);
    }

    console.log('Case #%s: %s', caseNumber, sol);
};

const main = function() {
    const inputFile = process.argv[2] || 'testInput';

    const lines = fs.readFileSync(inputFile).toString().split('\n');
    const numberOfCases = lines[0];

    for(let i = 1; i <= numberOfCases; i++) {
        const data = lines[i].split(/\s*\|\s*/);

        printSolution(i, data[0].split(/\s*\-\s*/), data[1].trim());
    }
};

main();
