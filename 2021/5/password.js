const fs = require('fs');

const main = function() {
    const inputFile = process.argv[2] || 'Invictus.txt';

    let output = '';
    const lines = fs.readFileSync(inputFile).toString().split('\n');
    lines.forEach(line => {
        output += line.replace(/[A-Za-z,\. ]/g, '');
    });

/*
 * Previous code generates a string with only the special characters (from
 * U+E005F to U+E008D. As these characters are not printable and cannot
 * get the password from there (the surname must be in upper case), so a
 * shift of the characters are required, as the more common character is
 * U+E006F : TAG LATIN SMALL LETTER O, assume that that one is upper A,
 * and shift the others in the same way (substract E002E to the number).
 * Then we get:

U+E0077 : TAG LATIN SMALL LETTER W --- I
U+E007C : TAG VERTICAL LINE        --- N
U+E0084 : <reserved>               --- V
U+E0077 : TAG LATIN SMALL LETTER W --- I
U+E0071 : TAG LATIN SMALL LETTER Q --- C
U+E0082 : <reserved>               --- T
U+E0083 : <reserved>               --- U
U+E0081 : <reserved>               --- S
U+E008D : <reserved>               --- _
U+E007C : TAG VERTICAL LINE        --- N
U+E0073 : TAG LATIN SMALL LETTER S --- E
U+E007A : TAG LATIN SMALL LETTER Z --- L
U+E0081 : <reserved>               --- S
U+E007D : TAG RIGHT CURLY BRACKET  --- O
U+E007C : TAG VERTICAL LINE        --- N
U+E008D : <reserved>               --- _
U+E0080 : <reserved>               --- R
U+E007D : TAG RIGHT CURLY BRACKET  --- O
U+E007A : TAG LATIN SMALL LETTER Z --- L
U+E0077 : TAG LATIN SMALL LETTER W --- I
U+E0076 : TAG LATIN SMALL LETTER V --- H
U+E007A : TAG LATIN SMALL LETTER Z --- L
U+E006F : TAG LATIN SMALL LETTER O --- A
U+E0076 : TAG LATIN SMALL LETTER V --- H
U+E007A : TAG LATIN SMALL LETTER Z --- L
U+E006F : TAG LATIN SMALL LETTER O --- A
U+E008D : <reserved>               --- _
U+E007B : TAG LEFT CURLY BRACKET   --- M
U+E006F : TAG LATIN SMALL LETTER O --- A
U+E007C : TAG VERTICAL LINE        --- N
U+E0072 : TAG LATIN SMALL LETTER R --- D
U+E0073 : TAG LATIN SMALL LETTER S --- E
U+E007A : TAG LATIN SMALL LETTER Z --- L
U+E006F : TAG LATIN SMALL LETTER O --- A
U+E008D : <reserved>               --- _
U+E0082 : <reserved>               --- T
U+E0083 : <reserved>               --- U
U+E0073 : TAG LATIN SMALL LETTER S --- E
U+E007C : TAG VERTICAL LINE        --- N
U+E0082 : <reserved>               --- T
U+E0077 : TAG LATIN SMALL LETTER W --- I
U+E0071 : TAG LATIN SMALL LETTER Q --- C
U+E0076 : TAG LATIN SMALL LETTER V --- H
U+E006F : TAG LATIN SMALL LETTER O --- A
U+E007A : TAG LATIN SMALL LETTER Z --- L
U+E007A : TAG LATIN SMALL LETTER Z --- L
U+E0073 : TAG LATIN SMALL LETTER S --- E
U+E007C : TAG VERTICAL LINE        --- N
U+E0075 : TAG LATIN SMALL LETTER U --- G
U+E0073 : TAG LATIN SMALL LETTER S --- E
U+E005F : TAG LOW LINE             --- 1
U+E005F : TAG LOW LINE             --- 1
*/

    // Let's try to generate the password directly, without manual process
    const rawChars = [...output]; // Take into account surrogare pairs because the string iterator is Unicode-aware.
    console.log(String.fromCharCode.apply(null, rawChars.map(e => e.codePointAt(0) - 0xE002E))); // 
};

main();
