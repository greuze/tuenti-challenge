var fs = require('fs');

var PRIMES = [
     2,  3,  5,  7, 11,
    13, 17, 19, 23, 29,
    31, 37, 41, 43, 47,
    53, 59, 61, 67, 71,
    73, 79, 83, 89, 97
];

var numbers;

var alreadyCalculated = [];

var bigModulus = function(divident, divisor) {
    var partLength = 10;

    while (divident.length > partLength) {
        var part = divident.substring(0, partLength);
        divident = (part % divisor) + divident.substring(partLength);
    }

    return divident % divisor;
};

// Return as much zeroes as needed
var getLeadingZeroes = function(number, divisor, remainder) {
    var leadingZeroes = '';

    for (var i = remainder.length + 1; i <= number.length; i++) {
        if (parseInt(number.substring(0, i)) >= divisor) {
            break;
        } else {
            leadingZeroes += '0';
        }
    }
    return leadingZeroes;
};

var bigDiv = function(divident, divisor) {
    var partLength = 10;
    var partResult = '';
    var remainder = '';

    var leadingZeroes;
    var intPartResult;

    while (divident.length > partLength) {
        var part = divident.substring(0, partLength);
        leadingZeroes = getLeadingZeroes(part, divisor, remainder);
        intPartResult = Math.floor(part / divisor);

        partResult += leadingZeroes + ((intPartResult === 0) ? '' : '' + intPartResult);

        var intRemainder = part % divisor;
        remainder = (intRemainder === 0) ? '' : '' + intRemainder;

        divident = remainder + divident.substring(partLength);
    }

    leadingZeroes = getLeadingZeroes(divident, divisor, remainder);
    intPartResult = divident / divisor;

    var result = partResult + leadingZeroes + ((intPartResult === 0) ? '' : '' + intPartResult);
    return result.replace(/^0+/, '');
};

var getFirstPrimeDivisor = function(number) {
    for (var j = 0; j < PRIMES.length; j++) {
        if (bigModulus(number, PRIMES[j]) === 0) {
            return j;
        }
    }
    throw Error('Unexpected case: ' + number);
};

var printFavouritePrimeNumbers = function(first, last) {
    var results = [
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0
    ];

    for (var i = first; i < last; i++) {
        if (alreadyCalculated[i] === undefined) {
            var product = numbers[i];
            var singleResults = [
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0
            ];
            do {
                var firstPrime = getFirstPrimeDivisor(product);
                results[firstPrime] += 1;
                singleResults[firstPrime] += 1; // To save time in next iterations
                product = bigDiv(product, PRIMES[firstPrime]);
            } while (product > 1);
            alreadyCalculated[i] = singleResults;
//            console.log('Calculados resultados[%d] = %s del numero %s es %s', i, singleResults, numbers[i], results);
        } else {
            for (var j = 0; j < alreadyCalculated[i].length; j++) {
                results[j] += alreadyCalculated[i][j];
            }
//            console.log('Procesados resultados[%d] = %s del numero %s es %s', i, alreadyCalculated[i], numbers[i], results);
        }
    }

    var max = Math.max.apply(null, results);
    var maxPrimes = [];
    results.forEach(function(element, index, array) {
        if (element === max) {
            maxPrimes.push(PRIMES[index]);
        }
    });
    console.log('%d %s', max, maxPrimes.join(' '));
};

var main = function() {
    var inputFile = process.argv[2] || 'testInput';

    var lines = fs.readFileSync(inputFile).toString().split('\n');
    var numberOfCases = lines[0];

    numbers = fs.readFileSync('numbers.txt').toString().split('\n');

    for(var i = 1; i <= numberOfCases; i++) {
        var line = lines[i].split(' ');
        printFavouritePrimeNumbers(parseInt(line[0]), parseInt(line[1]));
    }
};

main();
