var fs = require('fs');

var getState = function (line) {
    var e = /^  ([^ :]+):$/.exec(line);
    return e ? e[1] : null;
};

var getInput = function (line) {
    var e = /^    '([^']+)':$/.exec(line);
    return e ? e[1] : null;
};

var getCommand = function (line) {
    var e = /^      ([^:]+): '?([^']+)'?$/.exec(line);
    return e ? {
        name: e[1],
        value: e[2]
    } : null;
};

var getTapesKeyword = function (line) {
    return /^tapes:$/.test(line);
};

var getTape = function (line) {
    var e = /^  ([^:]+): '([^:]+)'$/.exec(line);
    return e ? {
        name: e[1],
        value: e[2]
    } : null;
};

var getEndKeyword = function (line) {
    return /^\.\.\.$/.test(line);
};

var parseInput = function (lines) {
    var input = {
        code: {},
        tapes: {}
    };
    // lines[0] === '---'
    // lines[1] === 'code:'
    var currentState, currentInput;
    for (var i = 2; i < lines.length; i++) {
        var line = lines[i];
        if (getState(line)) {
            currentState = getState(line);
            input.code[currentState] = {};
        } else if (getInput(line)) {
            currentInput = getInput(line);
            input.code[currentState][currentInput] = {};
        } else if (getCommand(line)) {
            var command = getCommand(line);
            input.code[currentState][currentInput][command.name] = command.value;
        } else if (getTapesKeyword(line)) {
            // It's not necessary to do anything
        } else if (getTape(line)) {
            var tape = getTape(line);
            input.tapes[tape.name] = tape.value;
        } else if (getEndKeyword(line)) {
            // It's not necessary to do anything but exiting loop
            break;
        } else {
            console.log('What the hell is this?', line);
            process.exit(1);
        }
    }

    return input;
};

String.prototype.replaceAt = function(index, character) {
    return this.substr(0, index) + character + this.substr(index + character.length);
}

var execute = function (code, tape) {
    var p = 0;
    var stateName = 'start';
    var state, input, block, move;
    do {
        input = tape[p] === undefined ? ' ' : tape[p];
        block = code[stateName][input];

        if (block.write) {
            tape = tape.replaceAt(p, block.write);
        }

        if (block.state) {
            stateName = block.state;
        }

        if (block.move) {
            move = block.move;
        }

        if (move === 'right') {
            p = p <= tape.length ? p + 1 : tape.length;
        } else if (move === 'left') {
            p = p >= 0 ? p - 1 : 0;
        } else {
            console.log('Unknown move', move);
            process.exit(1);
        }
    } while (stateName !== 'end');
    

    return tape;
};

var printSolution = function (code, tapes) {
    for (var tape in tapes) {
        var execution = execute(code, tapes[tape]);
        console.log('Tape #%s: %s', tape, execution);
    }
};

var main = function() {
    var inputFile = process.argv[2] || 'testInput';

    var lines = fs.readFileSync(inputFile).toString().split('\n');
    var input = parseInput(lines);
    printSolution(input.code, input.tapes);
};

main();
