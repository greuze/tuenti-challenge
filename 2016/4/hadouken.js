var fs = require('fs');

var COMBOS = {
    combo1: ['L', 'LD', 'D', 'RD', 'R', 'P'],
    combo2: ['D', 'RD', 'R', 'P'],
    combo3: ['R', 'D', 'RD', 'P'],
    combo4: ['D', 'LD', 'L', 'K'],
    combo5: ['R', 'RD', 'D', 'LD', 'L', 'K']
};

var printSolution = function(caseNumber, moves) {
    var fails = 0;
    var currentCombos = [];
    for (var i = 0; i < moves.length; i++) {
        var newCombos = [];
        var failedWithThisMove = false;
        // Check current combos to remove uncomplete
        for (var j = 0; j < currentCombos.length; j++) {
            var currentCombo = currentCombos[j];
            if (COMBOS[currentCombo.name][currentCombo.moves] === moves[i]) {
                // Current move is correct for this combo
                currentCombo.moves++;
                // Stop all current combos if combo is completed
                if (COMBOS[currentCombo.name].length === currentCombo.moves) {
                    currentCombos = [];
                    break;
                } else {
                    newCombos.push(currentCombo);
                }
            } else if (COMBOS[currentCombo.name].length === (currentCombo.moves + 1)) {
                // Current combo failed in last move
                if (!failedWithThisMove) {
                    failedWithThisMove = true;
                    fails++;
                }
            } else {
                // Combo failed not in last move
            }
        }
        // Add new combos
        for (var combo in COMBOS) {
            if (COMBOS[combo][0] === moves[i]) {
                newCombos.push({name: combo, moves: 1});
            }
        }
        currentCombos = newCombos;
    }
    // Add combos missing one move
    for (var l = 0; l < currentCombos.length; l++) {
        var currentCombo = currentCombos[l];
        if (COMBOS[currentCombo.name].length === (currentCombo.moves + 1)) {
            // Current combo failed in last move
            fails++;
            break;
        }
    }
    console.log('Case #%d: %d', caseNumber, fails);
};

var main = function() {
    var inputFile = process.argv[2] || 'testInput';

    var lines = fs.readFileSync(inputFile).toString().split('\n');
    var numberOfCases = lines[0];

    for(var i = 1; i <= numberOfCases; i++) {
        var line = lines[i].split('-');
        printSolution(i, line);
    }
};

main();
