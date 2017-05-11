var fs = require('fs');

var getBestShortcut = function (currentFloor, shortcuts, fastestPaths) {
    var bestShortcut;
    var bestTime = currentFloor + (fastestPaths[currentFloor] || 0);
    var nextFloor = currentFloor + 1;
    for (var i = 0; i < shortcuts.length; i++) {
        var shortcut = shortcuts[i];
        // If shortcut end in next floor
        if (shortcut[1] === nextFloor) {
            var currentTime = fastestPaths[shortcut[0]] + shortcut[2];
            if (!bestTime || bestTime > currentTime) {
                bestTime = currentTime;
                bestShortcut = shortcut;
            }
        }
    }

    return bestShortcut;
};

var printSolution = function (caseNumber, numberOfFloors, shortcuts) {
    var years = 0;
    var currentFloor = 1;
    var fastestPaths = [null, 0];
    while(currentFloor < numberOfFloors) {
        var shortcut = getBestShortcut(currentFloor, shortcuts, fastestPaths);
        if (shortcut) {
            years = fastestPaths[shortcut[0]] + shortcut[2]; // Adds the test time for the shortcut
            currentFloor = shortcut[1];
            fastestPaths[currentFloor] = years;
            var b = currentFloor - 1;
            while (b > 0 && fastestPaths[b] > years) {
                fastestPaths[b] = years;
                b--;
            }
        } else {
            years += currentFloor;
            currentFloor++;
            fastestPaths[currentFloor] = years;
        }
    }
    console.log('Case #%d: %d', caseNumber, years);
};

var main = function() {
    var inputFile = process.argv[2] || 'testInput';

    var lines = fs.readFileSync(inputFile).toString().split('\n');
    var numberOfCases = parseInt(lines[0]);
    var currentCase = 1;
    var currentLine = 1;

    while(currentCase <= numberOfCases) {
        var floorsAndShortcuts = lines[currentLine].split(' ').map(function(e) {
            return parseInt(e);
        });
        currentLine++;

        var shortcuts = [];
        for(var i = 0; i < floorsAndShortcuts[1]; i++) {
            var shortcut = lines[currentLine].split(' ').map(function(e) {
                return parseInt(e);
            });
            shortcuts.push(shortcut);
            currentLine++;
        }
        printSolution(currentCase, floorsAndShortcuts[0], shortcuts);
        currentCase++;
    }
};

main();
