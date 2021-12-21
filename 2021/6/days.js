const fs = require('fs');

const languages = ['CA', 'CZ', 'DE', 'DK', 'EN', 'ES', 'FI', 'FR', 'IS', 'GR', 'HU', 'IT', 'NL', 'VI', 'PL', 'RO', 'RU', 'SE', 'SI', 'SK'];
// First day of each array is sunday
const weekDays = {
    CZ: [ 'neděle', 'pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota'],
    DK: ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'],
    GR: ['κυριακή', 'δευτέρα', 'τρίτη', 'τετάρτη', 'πέμπτη', 'παρασκευή', 'σάββατο' ],
    RO: ['duminică', 'luni', 'marţi', 'miercuri', 'joi', 'vineri', 'sâmbătă'],
    SE: ['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag'],
    SI: ['nedelja', 'ponedeljek', 'torek', 'sreda',	'četrtek', 'petek', 'sobota']
}
const printSolution = function (caseNumber, strDate, lang) {
    let solution;
    if (languages.includes(lang)) {
        let day, month, year;
        if (/\d\d\-\d\d\-\d\d\d\d/.test(strDate)) {
            // DD-MM-YYYY
            [day, month, year] = strDate.split('-');
        } else if (/\d\d\d\d\-\d\d\-\d\d/.test(strDate)) {
            // YYYY-MM-DD
            [year, month, day] = strDate.split('-');
        }
        // Check month and days of the month
        if (month > 12 || day > new Date(year, month, 0).getDate()) {
            solution = 'INVALID_DATE';
        } else {
            const myDate = new Date(year, month - 1, day);
            if (weekDays[lang]) {
                solution = weekDays[lang][myDate.getDay()];
            } else {
                solution = myDate.toLocaleString(lang, { weekday: 'long' }).toLowerCase();
            }
        }
    } else {
        solution = 'INVALID_LANGUAGE';
    }

    console.log('Case #%s: %s', caseNumber, solution);
};

const main = function() {
    const inputFile = process.argv[2] || 'testInput';

    const lines = fs.readFileSync(inputFile).toString().split('\n');
    const numberOfCases = lines[0];

    for(let i = 1; i <= numberOfCases; i++) {
        const data = lines[i].split(':');

        printSolution(i, data[0], data[1].toUpperCase());
    }
};

main();
