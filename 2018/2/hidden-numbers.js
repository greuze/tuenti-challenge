const cluster = require('cluster');
const cpus = require('os').cpus().length;
const fs = require('fs');
const bigInt = require('big-integer');

const min = '1023456789abcdefghijklmnop';
const max = 'ponmlkjihgfedcba9876543210';

const getSolution = function (caseNumber, line) {
    let s = new Set();
    line.split('').map(l => s.add(l));
    if (line.length !== s.size) {
        console.log('Alguna letra esta repetida');
        process.exit(1);
    }
    let base = s.size;
    let baseMin = min.substr(0, base);
    let baseMax = max.substr(max.length - base, base);
    let diff = bigInt(baseMax, base).minus(bigInt(baseMin, base));

    return `Case #${caseNumber}: ${diff}`;
};

// Cluster stuff
if (cluster.isMaster) {
    const inputFile = process.argv[2] || 'testInput';

    const lines = fs.readFileSync(inputFile).toString().split('\n');
    const numberOfCases = parseInt(lines[0]);

    let problem = 1;
    let solutions = new Array(numberOfCases);

    for (let i = 0; i < cpus; i++) {
        let worker = cluster.fork();

        worker.on('message', function(msg) {
            solutions[msg.caseNumber - 1] = msg.solution;
            // Send a new problem, or exit
            if (problem <= numberOfCases) {
                let line = lines[problem];
                worker.send({caseNumber: problem++, line});
            } else {
                worker.kill();
            }
        });
    }

    cluster.on('online', (worker) => {
        let line = lines[problem];
        worker.send({caseNumber: problem++, line});
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
