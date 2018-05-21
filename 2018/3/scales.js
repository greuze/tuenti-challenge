const cluster = require('cluster');
const cpus = require('os').cpus().length;
const fs = require('fs');

const scaleNames = [
    'MA', 'MA#', 'MB', 'MC', 'MC#', 'MD', 'MD#', 'ME', 'MF', 'MF#', 'MG', 'MG#', 'mA', 'mA#', 'mB', 'mC', 'mC#', 'mD', 'mD#', 'mE', 'mF', 'mF#', 'mG', 'mG#'
];
const scales = [
    new Set(['A', 'B', 'Cb', 'C#', 'Db', 'D', 'E', 'Fb', 'F#', 'Gb', 'G#', 'Ab']), // MA
    new Set(['A#', 'Bb', 'C', 'B#', 'D', 'D#', 'Eb', 'F', 'E#', 'G', 'A']), // MA#
    new Set(['B', 'Cb', 'C#', 'Db', 'D#', 'Eb', 'E', 'Fb', 'F#', 'Gb', 'G#', 'Ab', 'A#', 'Bb']), // MB
    new Set(['C', 'B#', 'D', 'E', 'Fb', 'F', 'E#', 'G', 'A', 'B', 'Cb']), // MC
    new Set(['C#', 'Db', 'D#', 'Eb', 'E#', 'F', 'F#', 'Gb', 'G#', 'Ab', 'A#', 'Bb', 'B#', 'C', 'B#']), // MC#
    new Set(['D', 'E', 'Fb', 'F#', 'Gb', 'G', 'A', 'B', 'Cb', 'C#', 'Db']), // MD
    new Set(['D#', 'Eb', 'F', 'E#', 'G', 'G#', 'Ab', 'A#', 'Bb', 'C', 'B#', 'D']), // MD#
    new Set(['E', 'Fb', 'F#', 'Gb', 'G#', 'Ab', 'A', 'B', 'Cb', 'C#', 'Db', 'D#', 'Eb']), // ME
    new Set(['F', 'E#', 'G', 'A', 'A#', 'Bb', 'C', 'B#', 'D', 'E', 'Fb']), // MF
    new Set(['F#', 'Gb', 'G#', 'Ab', 'A#', 'Bb', 'B', 'Cb', 'C#', 'Db', 'D#', 'Eb', 'E#', 'F']), // MF#
    new Set(['G', 'A', 'B', 'Cb', 'C', 'B#', 'D', 'E', 'Fb', 'F#', 'Gb']), // MG
    new Set(['G#', 'Ab', 'A#', 'Bb', 'B#', 'C', 'B#', 'C#', 'Db', 'D#', 'Eb', 'E#', 'F', 'G']), // MG#
    new Set(['A', 'B', 'Cb', 'C', 'B#', 'D', 'E', 'Fb', 'F', 'E#', 'G']), // mA
    new Set(['A#', 'Bb', 'B#', 'C', 'B#', 'C#', 'Db', 'D#', 'Eb', 'E#', 'F', 'F#', 'Gb', 'G#', 'Ab']), // mA#
    new Set(['B', 'Cb', 'C#', 'Db', 'D', 'E', 'Fb', 'F#', 'Gb', 'G', 'A']), // mB
    new Set(['C', 'B#', 'D', 'D#', 'Eb', 'F', 'E#', 'G', 'G#', 'Ab', 'A#', 'Bb']), // mC
    new Set(['C#', 'Db', 'D#', 'Eb', 'E', 'Fb', 'F#', 'Gb', 'G#', 'Ab', 'A', 'B', 'Cb']), // mC#
    new Set(['D', 'E', 'Fb', 'F', 'E#', 'G', 'A', 'A#', 'Bb', 'C', 'B#']), // mD
    new Set(['D#', 'Eb', 'E#', 'F', 'F#', 'Gb', 'G#', 'Ab', 'A#', 'Bb', 'B', 'Cb', 'C#', 'Db']), // mD#
    new Set(['E', 'Fb', 'F#', 'Gb', 'G', 'A', 'B', 'Cb', 'C', 'B#', 'D']), // mE
    new Set(['F', 'E#', 'G', 'G#', 'Ab', 'A#', 'Bb', 'C', 'B#', 'C#', 'Db', 'D#', 'Eb']), // mF
    new Set(['F#', 'Gb', 'G#', 'Ab', 'A', 'B', 'Cb', 'C#', 'Db', 'D', 'E', 'Fb']), // mF#
    new Set(['G', 'A', 'A#', 'Bb', 'C', 'B#', 'D', 'D#', 'Eb', 'F', 'E#']), // mG
    new Set(['G#', 'Ab', 'A#', 'Bb', 'B', 'Cb', 'C#', 'Db', 'D#', 'Eb', 'E', 'Fb', 'F#', 'Gb'])  // mG#
];

const getSolution = function (caseNumber, line) {
    let solution;
    if (line == null) {
        solution = scaleNames.join(' ');;
    } else {
        let notes = line.split(' ');
        let fitableScales = [];
        for (let i = 0; i < scales.length; i++) {
            let scaleFits = notes.every(note => scales[i].has(note));
            if (scaleFits) {
                fitableScales.push(scaleNames[i]);
            }
        }
        solution = fitableScales.length > 0 ? fitableScales.join(' ') : 'None';
    }

    return `Case #${caseNumber}: ${solution}`;
};

// Cluster stuff
if (cluster.isMaster) {
    const inputFile = process.argv[2] || 'testInput';

    const lines = fs.readFileSync(inputFile).toString().split('\n');
    const numberOfCases = parseInt(lines[0]);

    let problemNumber = 1;
    let lineNumber = 1;
    let solutions = new Array(numberOfCases);

    function getNextProblem() {
        let numberOfNotes = parseInt(lines[lineNumber++]);
        if (numberOfNotes === 0) {
            return null;
        } else {
            return lines[lineNumber++].trim();
        }
    }

    for (let i = 0; i < cpus; i++) {
        let worker = cluster.fork();

        worker.on('message', function(msg) {
            solutions[msg.caseNumber - 1] = msg.solution;
            // Send a new problem, or exit
            if (problemNumber <= numberOfCases) {
                let line = getNextProblem();
                worker.send({caseNumber: problemNumber++, line});
            } else {
                worker.kill();
            }
        });
    }

    cluster.on('online', (worker) => {
        let line = getNextProblem();
        worker.send({caseNumber: problemNumber++, line});
    });
    
    process.on('exit', () => {
        for (let i = 0; i < solutions.length; i++) {
            console.log(solutions[i]);
        }
    });
} else {
    process.on('message', function(msg) {
        process.send({
            caseNumber: msg.caseNumber,
            solution: getSolution(msg.caseNumber, msg.line)
        })
    });
}
