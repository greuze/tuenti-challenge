const fs = require('fs');

const nextNotes = {
    'A': 'A#',
    'A#': 'B',
    'Bb': 'B',
    'B': 'C',
    'C': 'C#',
    'C#': 'D',
    'Db': 'D',
    'D': 'D#',
    'D#': 'E',
    'Eb': 'E',
    'E': 'F',
    'F': 'F#',
    'F#': 'G',
    'Gb': 'G',
    'G': 'G#',
    'G#': 'A',
    'Ab': 'A'
}
const replacements1 = {
    'AA#': 'ABb',
    'CC#': 'CDb',
    'DD#': 'DEb',
    'FF#': 'FGb',
    'GG#': 'GAb',
    'DbD#': 'DbEb',
    'GbG#': 'GbAb',
    'AbA#': 'AbBb' // This must be here, to avoid generating another invalid sequence from previous replacements
}
const replacements2 = {
    'AA#': 'ABb',
    'CC#': 'B#C#',
    'DD#': 'DEb',
    'FF#': 'E#F#',
    'GG#': 'GAb',
    'DbD#': 'DbEb',
    'GbG#': 'GbAb',
    'AbA#': 'AbBb' // This must be here, to avoid generating another invalid sequence from previous replacements
}

const T = function(previous) {
    return s(s(previous));
}

const s = function(previous) {
    return nextNotes[previous];
}

const isValid = function(sol) {
    // Check that letters are not twice (removing leading letter, as it is equal to last)
    const hasLetterTwice = /(A.*A)|(B.*B)|(C.*C)|(D.*D)|(E.*E)|(F.*F)|(G.*G)/.test(sol.slice(1));
    // This should not be necessary, but just in case
    const hasAllLetters = /A/.test(sol) && /B/.test(sol) && /C/.test(sol) && /D/.test(sol) && /E/.test(sol) && /F/.test(sol) && /G/.test(sol);

    return !hasLetterTwice && hasAllLetters;
}

const replaceNotes = function(solution, replacements) {
    let replacedSolution = solution;
    Object.keys(replacements).forEach(key => {
        replacedSolution = replacedSolution.replace(key, replacements[key]);
    });
    // Check that last note matches the first, or update last
    let firstNote;
    if (replacedSolution[1] === '#' || replacedSolution[1] === 'b') {
        firstNote = replacedSolution.substring(0, 2);
    } else {
        firstNote = replacedSolution[0];
    }
    let lastNote;
    if (replacedSolution[replacedSolution.length - 1] === '#' || replacedSolution[replacedSolution.length - 1] === 'b') {
        lastNote = replacedSolution.substring(replacedSolution.length -2);
    } else {
        lastNote = replacedSolution[replacedSolution.length - 1];
    }
    if (firstNote !== lastNote) {
        replacedSolution = replacedSolution.replace(new RegExp(lastNote + '$'), firstNote);
    }
    return replacedSolution;
}

const printSolution = function (caseNumber, root, jumps) {
    let sol = [root];
    for (let i = 0; i < jumps.length; i++) {
        const j = jumps[i];
        if (j === 'T') {
            sol.push(T(sol[sol.length -1]));
        } else if (j === 's') {
            sol.push(s(sol[sol.length -1]));
        } else {
            throw new Error('Unexpected jump');
        }
    }
    // Get the solution as a string, and then replace the invalid sequences
    let solution = sol.join('');
    if (!isValid(solution)) {
        let replacedSolution = replaceNotes(solution, replacements1);
        if (isValid(replacedSolution)) {
            solution = replacedSolution;
        } else {
            let replacedSolution2 = replaceNotes(solution, replacements2);
            if (isValid(replacedSolution2)) {
                solution = replacedSolution2;
            } else {
                throw new Error(`Unable to replace invalid scale ${solution}, ${replacedSolution}, ${replacedSolution2}`);
            }
        }
    }

    console.log('Case #%s: %s', caseNumber, solution);
};

const main = function() {
    const inputFile = process.argv[2] || 'testInput';

    const lines = fs.readFileSync(inputFile).toString().split('\n');
    const numberOfCases = lines[0];

    let i = 1;
    for(let c = 1; c <= numberOfCases; c++) {
        const root = lines[i++];
        const jumps = lines[i++];

        printSolution(c, root, jumps);
    }
};

main();
