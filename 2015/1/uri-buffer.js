var fs = require('fs');

var inputFile = process.argv[2] || 'testInput';

var lines = fs.readFileSync(inputFile).toString().split('\n');

var numberOfCases = lines[0];

for(var i = 1; i <= numberOfCases; i++) {
    console.log(Math.ceil(lines[i]/2));
}