var fs = require('fs');

var inputFile = process.argv[2] || 'testInput';

var lines = fs.readFileSync(inputFile).toString().split('\n');

var numberOfCases = lines[0];

var getFirstDivisor = function(number) {
    for (var i = 2; i <= Math.sqrt(number); i++) {
        if (number % i === 0) {
            return i;
        }
    }
    return undefined;
};

var isAlmostPrime = function(number) {
    var firstDivisor = getFirstDivisor(number);
    if (firstDivisor === undefined) {
        return false;
    }

    var secondDivisor = getFirstDivisor(number / firstDivisor);
    return secondDivisor === undefined;
};

var printAlmostPrimeNumbers = function(first, last) {
    var almostPrimeNumbers = 0;
    for (var j = first; j <= last; j++) {
        if (isAlmostPrime(j)) {
            almostPrimeNumbers++;
        }
    }
    console.log(almostPrimeNumbers);
};

var main = function() {
    for(var i = 1; i <= numberOfCases; i++) {
        var line = lines[i].split(' ');
        printAlmostPrimeNumbers(parseInt(line[0]), parseInt(line[1]));
    }
};

main();