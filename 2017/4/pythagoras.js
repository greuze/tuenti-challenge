var fs = require('fs');

var findShortestTriangle = function (sides) {
    var shortest = Number.MAX_VALUE;
    for(var i = 0; i < sides.length - 2; i++) {
        if (sides[i] > shortest) {
            break; // Break loop i, as this side is longer than other perimeters
        }
        for(var j = i + 1; j < sides.length - 1; j++) {
            if ((sides[i] + sides[j]) > shortest) {
                break; // Break loop j, as this 2 sides are longer than shorter perimeter
            }
            for(var k = j + 1; k < sides.length; k++) {
                if ((sides[i] + sides[j]) > sides[k] && (sides[i] + sides[k]) > sides[j] && (sides[j] + sides[k]) > sides[i]) {
                    var perimeter = sides[i] + sides[j] + sides[k];
                    if (perimeter < shortest) {
                        shortest = perimeter;
                        break; // Break loop k, as following sides will be longer
                    }
                }
            }
        }
    }

    return shortest < Number.MAX_VALUE ? shortest : 'IMPOSSIBLE';
};

var printSolution = function (caseNumber, numberOfSides, sides) {
    var sortedSides = sides.sort(function (a, b) {  return a - b;  });
    console.log('Case #%s: %s', caseNumber, findShortestTriangle(sortedSides));
};

var main = function() {
    var inputFile = process.argv[2] || 'testInput';

    var lines = fs.readFileSync(inputFile).toString().split('\n');
    var numberOfCases = lines[0];

    for(var i = 1; i <= numberOfCases; i++) {
        var numbers = lines[i].split(' ').map(function(e) {
            return parseInt(e);
        });
        var numberOfSides = numbers.shift();

        printSolution(i, numberOfSides, numbers);
    }
};


main();
