var fs = require('fs');

var printSolution = function (caseNumber, rolls, pins) {
    var frame = 1;
    var framePins = 0;
    var inFirstRoll = true;
    var frameResults = [];
    var score = 0;
    for (var currentRoll = 0; currentRoll < rolls; currentRoll++) {
        // Extra rolls after strike/spare in 10th frame
        if (frame > 10) {
            break;
        }

        var currentPins = pins[currentRoll];
        framePins += currentPins;
        if (inFirstRoll) {
            if (currentPins === 10) {
                // Strike
                score += framePins + pins[currentRoll+1] + pins[currentRoll+2];
                frameResults.push(score);
                frame++;
                framePins = 0;
                inFirstRoll = true;
            } else {
                // Normal
                inFirstRoll = false;
            }
        } else {
            if (framePins === 10) {
                // Spare
                score += framePins + pins[currentRoll+1];
            } else {
                // Normal
                score += framePins;
            }
            frameResults.push(score);
            frame++;
            framePins = 0;
            inFirstRoll = true;
        }
    }
    //var sum = slices.reduce(function(a, b) { return a + b; }, 0);
    console.log('Case #%s: %s', caseNumber, frameResults.join(' '));
};

var main = function() {
    var inputFile = process.argv[2] || 'testInput';

    var lines = fs.readFileSync(inputFile).toString().split('\n');
    var numberOfCases = lines[0];

    for(var i = 1; i <= numberOfCases; i++) {
        var rolls = parseInt(lines[i*2 -1]);
        var pins = lines[i*2].split(' ').map(function(e) {
            return parseInt(e);
        });
        printSolution(i, rolls, pins);
    }
};


main();
