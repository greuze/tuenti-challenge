const fs = require('fs');

const reverseString = function (input) {
    return input.split('').reverse().join('');
}

const printSolution = function (caseNumber, pokemons, map) {
    let i = 0;
    while (pokemons.length > 0) {
        const pokemon = pokemons[i];
        // Replace pokemon in straight order
        let newMap = map.replace(pokemon, '');
        if (newMap.length === map.length) {
            // If pokemon was not found, replace backwards
            newMap = map.replace(reverseString(pokemon), '');
        }
        // If the pokemon was replaced straight or backwards
        if (newMap.length !== map.length) {
            map = newMap;
            pokemons.splice(i, 1);
            // Reset index to start again from the begining
            i = 0;
        } else {
            i++
        }
    }
    console.log('Case #%s: %s', caseNumber, map);
};

const main = function() {
    const inputFile = process.argv[2] || 'testInput';

    const lines = fs.readFileSync(inputFile).toString().split('\n');
    const numberOfCases = parseInt(lines[0]);

    let currentCase = 1;
    let currentLine = 1;
    while (currentCase <= numberOfCases) {
        const descriptionLine = lines[currentLine++].split(' ').map(e => parseInt(e));
        const numberOfPokemon = descriptionLine[0];
        const numberOfRows = descriptionLine[1];
        const numberOfColumns = descriptionLine[2];

        const pokemons = [];
        for(let i = 1; i <= numberOfPokemon; i++) {
            pokemons.push(lines[currentLine++]);
        }

        let map = '';
        for(let i = 1; i <= numberOfRows; i++) {
            map = map + lines[currentLine++].replace(/ /g, '');
        }

        printSolution(currentCase++, pokemons, map);
    }
};

main();
