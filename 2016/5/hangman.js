var fs = require('fs');
var net = require('net');

var isSolution = function (data) {
    var lines = data.split('\n');
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (/^[A-Z] [A-Z] [A-Z]( [A-Z])+$/.test(line)) {
            return true;
        }
    }
    return false;
};

var extractWord = function (data) {
    var lines = data.split('\n');
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (/^[A-Z_] [A-Z_] [A-Z_]( [A-Z_])+$/.test(line)) {
            return line.replace(/ /g, '').replace(/_/g, '.');
        }
    }
};

var updateWords = function (oldWords, pattern) {
    var newWords = [];
    for (var i = 0; i < oldWords.length; i++) {
        if (new RegExp('^' + pattern + '$').test(oldWords[i])) {
            newWords.push(oldWords[i]);
        }
    }
    return newWords;
};

// Take the most frequent letter not yet used
var getNextLetter = function (words, used) {
    var LETTERS = 'ETAOINSHRDLCUMWFGYPBVKJXQZ'; // Sorted by frequency
    for (var i = 0; i < LETTERS.length; i++) {
        // If the letter has not been used yet
        if (used.indexOf(LETTERS[i]) === -1) {
            // Check if any word contains that letter
            for (var j = 0; j < words.length; j++) {
                if (words[j].indexOf(LETTERS[i]) !== -1) {
                    return LETTERS[i];
                }
            }
        }
    }
    console.error('Fatal error, no possible words. Words = %j, used = %j', words, used);
    process.exit(1);
};

var readAllWords = function () {
    var wordFile = 'words.txt';
    return fs.readFileSync(wordFile).toString().split('\r\n');
};

var play = function () {
    var client = net.connect({host: '52.49.91.111', port: 9988}, function () {
        // 'connect' listener
        console.log('connected to server!');
//        client.write('world!\r\n');
    });

    var words = readAllWords();

    var welcomePassed = false;
    var level = 1;
    var used = [];

    client.on('data', function (rawData) {
        if (welcomePassed) {
            var data = rawData.toString();
            if (!isSolution(data)) {
                var currentWord = extractWord(data);
                console.log('Data = %s', data);
                console.log('Current word = %s', currentWord);
                words = updateWords(words, currentWord);
                var nextLetter = getNextLetter(words, used);
                console.log('There are %d possible words with pattern %s, trying %s', words.length, currentWord, nextLetter);
                used.push(nextLetter);
                client.write(nextLetter);
            } else {
                // token=9cb4afde731e9eadcda4506ef7c65fa2
                console.log('Found solution for level %d', level, data);
                level++;
                used = [];
                words = readAllWords();
                client.write('\n');
            }
        } else {
            console.log('Got welcome');
            welcomePassed = true;
            client.write('\n');
        }
    });

    client.on('end', function () {
        console.log('Disconnected from server on level %d', level);
    });
};

var main = function() {
    play();
};

main();