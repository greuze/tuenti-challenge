var fs = require('fs');
var logic = require('./game-logic.js');

var GIRLS = [];
var RELS = [];


var main = function() {
    var inputFile = process.argv[2] || 'testInput';

    var lines = fs.readFileSync(inputFile).toString().split('\n');

    var firstLine = lines[0].split(' ');
    var numberOfGirls = parseInt(firstLine[0]);
    var numberOfFriendships = parseInt(firstLine[1]);

    var i;
    for(i = 1; i <= numberOfGirls; i++) {
        var girl = lines[i].split(' ');
        girl = {
            name: girl[0],
            answers: [
                girl[1] === 'Y',
                girl[2] === 'Y',
                girl[3] === 'Y',
                girl[4] === 'Y',
                girl[5] === 'Y'
            ],
            points: 0
        };
        GIRLS.push(girl);
    }

    for(i = numberOfGirls + 1; i <= numberOfGirls + numberOfFriendships; i++) {
        var rel = lines[i].split(' ');
        RELS.push(rel);
    }
    var game = new logic.Game(GIRLS, RELS);
    game.printPerfectLarryMatchingAlgorithm();
};

main();
