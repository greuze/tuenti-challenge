const fs = require('fs');
const net = require('net');

const mode = process.argv[2] || 'TEST';

const getSameBegining = function (parts, preffix) {
    for (let i = 0; i < parts.length - 1; i++) {
        if (parts[i] !== undefined) {
            for (let j = i + 1; j < parts.length; j++) {
                if (parts[j] !== undefined) {
                    if ((preffix + parts[i]).indexOf(parts[j]) === 0) {
                        let sameStart = [parts[i], parts[j], i, j, (preffix + parts[i]).substring(parts[j].length)];
                        parts[i] = undefined;
                        parts[j] = undefined;
                        return sameStart;
                    }
                    if ((preffix + parts[j]).indexOf(parts[i]) === 0) {
                        let sameStart = [parts[j], parts[i], j, i, (preffix + parts[j]).substring(parts[i].length)];
                        parts[i] = undefined;
                        parts[j] = undefined;
                        return sameStart;
                    }
                    if (parts[i].indexOf(preffix + parts[j]) === 0) {
                        let sameStart = [parts[i], parts[j], i, j, parts[i].substring((preffix + parts[j]).length)];
                        parts[i] = undefined;
                        parts[j] = undefined;
                        return sameStart;
                    }
                    if (parts[j].indexOf(preffix + parts[i]) === 0) {
                        let sameStart = [parts[j], parts[i], j, i, parts[j].substring((preffix + parts[j]).length)];
                        parts[i] = undefined;
                        parts[j] = undefined;
                        return sameStart;
                    }
                }
            }
        }
    }
    console.log('No hay cadenas con el mismo comienzo', preffix);
    return undefined;
};

const getSameEnding = function (parts, suffix) {
    for (let i = 0; i < parts.length - 1; i++) {
        if (parts[i] !== undefined) {
            for (let j = i + 1; j < parts.length; j++) {
                if (parts[j] !== undefined) {
                    if ((parts[i] + suffix).indexOf(parts[j]) === 0) {
                        let sameEnding = [parts[i], parts[j], i, j, (parts[i] + suffix).substring(parts[j].length)];
                        parts[i] = undefined;
                        parts[j] = undefined;
                        return sameEnding;
                    }
                    if ((parts[j] + suffix).indexOf(parts[i]) === 0) {
                        let sameEnding = [parts[j], parts[i], j, i, (parts[j] + suffix).substring(parts[i].length)];
                        parts[i] = undefined;
                        parts[j] = undefined;
                        return sameEnding;
                    }
                    if (parts[i].indexOf(parts[j] + suffix) === 0) {
                        let sameEnding = [parts[i], parts[j], i, j, parts[i].substring((parts[j] + suffix).length)];
                        parts[i] = undefined;
                        parts[j] = undefined;
                        return sameEnding;
                    }
                    if (parts[j].indexOf(parts[i] + suffix) === 0) {
                        let sameEnding = [parts[j], parts[i], j, i, parts[j].substring((parts[j] + suffix).length)];
                        parts[i] = undefined;
                        parts[j] = undefined;
                        return sameEnding;
                    }
                }
            }
        }
    }
    console.log('No hay cadenas con el mismo final', suffix);
    return undefined;
};

const createAnswer = function (parts) {
    console.log('Voy a procesar', parts.join(' '));
    let usedParts = [];

    let sameStart = getSameBegining(parts, '');
    if (sameStart) {
        usedParts.push(sameStart[2] + 1);
        usedParts.push(sameStart[3] + 1);
    }

    while (sameStart && sameStart[4]) {
        sameStart = getSameBegining(parts, sameStart[4]);
        if (sameStart) {
            usedParts.push(sameStart[2] + 1);
            usedParts.push(sameStart[3] + 1);
        }
    }

    usedParts.sort((a, b) => a >= b);

    return usedParts.join(',');
};

const createReverseAnswer = function (parts) {
    console.log('Voy a procesar inversa', parts.join(' '));
    let usedParts = [];

    let sameEnding = getSameEnding(parts, '');
    if (sameEnding) {
        usedParts.push(sameEnding[2] + 1);
        usedParts.push(sameEnding[3] + 1);
    }

    while (sameEnding && sameEnding[4]) {
        sameEnding = getSameEnding(parts, sameEnding[4]);
        if (sameEnding) {
            usedParts.push(sameEnding[2] + 1);
            usedParts.push(sameEnding[3] + 1);
        }
    }

    usedParts.sort((a, b) => a >= b);

    return usedParts.join(',');
};

const main = function () {
    const client = net.connect({host: '52.49.91.111', port: 3241}, function () {
        // 'connect' listener
        console.log('Connected to server');
    });

    let lastData;
    client.on('data', function (rawData) {
        let data = rawData.toString('utf8').trim();
        if (data) {
            if (data === '> Please, provide "TEST" or "SUBMIT"') {
                client.write(mode + '\n');
            } else if (/^[actg ]+$/i.test(data)) {
                lastData = data;
                let answer = createAnswer(data.split(' '));
                client.write(answer + '\n');
            } else if (/not correct/.test(data)) {
                if (lastData) {
                    let answer = createReverseAnswer(lastData.split(' '));
                    lastData = undefined;
                    client.write(answer + '\n');
                } else {
                    console.log('Forward & reverse searchs failed');
                    process.exit(1);
                }
            } else {
                console.log(data);
            }
        }
    });

    client.on('drain', function () {
        console.log('drain');
    });

    client.on('error', function (e) {
        console.log('error', e);
    });

    client.on('end', function () {
        console.log('Disconnected from server');
    });
};

main();
