var fs = require('fs');

var printSolution = function (caseNumber, numberOfFloors, shortcuts) {
    var years = 0;
    var currentFloor = 1;
    var fastestPaths = [null, 0];
    // Sort shortcuts
    shortcuts = shortcuts.sort(function(a, b) {
        var origin = a[0] - b[0];
        if (origin != 0) {
            return origin;
        } else {
            var destiny = a[1] - b[1];
            if (destiny != 0) {
                return destiny;
            } else {
                return a[2] - b[2];
            }
        }
    });
    // Main loop
    var k = 0;
    while(currentFloor < numberOfFloors) {
        // Process shortcuts
        for (var i = k; i < shortcuts.length; i++) {
            var c = shortcuts[i];
            if (c[0] <= currentFloor) {
                if (c[1] < currentFloor && (k === 0 || k === i)) {
                    k = i + 1;
                } else {
                    var shortcutTime = years + c[2];
                    if (fastestPaths[c[1]] === undefined || fastestPaths[c[1]] > shortcutTime) {
                        fastestPaths[c[1]] = years + c[2];
                    }
                }
            } else {
                // They are sorted, break with future shortcuts
                break;
            }
        }
        // Take the fastest path
        if (fastestPaths[currentFloor + 1] < years + currentFloor) {
            years = fastestPaths[currentFloor + 1]
        } else {
            years += currentFloor;
        }
        currentFloor++;
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
