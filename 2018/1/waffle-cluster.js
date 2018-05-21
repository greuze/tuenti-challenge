const cluster = require('cluster');
const cpus = require('os').cpus().length;

const fs = require('fs');

const sendSolution = function (caseNumber, slices) {
    const sum = (slices[0] - 1) * (slices[1] - 1);
    process.send({caseNumber, solution: `Case #${caseNumber}: ${sum}`})
};

if (cluster.isMaster) {
    masterProcess();
} else {
    childProcess();  
}

function masterProcess() {
    const inputFile = process.argv[2] || 'testInput.txt';

    const lines = fs.readFileSync(inputFile).toString().split('\n');
    const numberOfCases = parseInt(lines[0]);

    let problem = 1;
    let solutions = new Array(numberOfCases);

    for (let i = 0; i < cpus; i++) {
        let worker = cluster.fork();
    
        // Receive messages from this worker and handle them in the master process.
        worker.on('message', function(msg) {
            solutions[msg.caseNumber] = msg.solution;

            if (problem <= numberOfCases) {
                let line = lines[problem].split(' ').map(e => parseInt(e));
                worker.send({caseNumber: problem++, slices: line});
            } else {
                worker.kill();
            }
        });
    }

    cluster.on('online', (worker) => {
        let line = lines[problem].split(' ').map(e => parseInt(e));
        // Send a message from the master process to the worker.
        worker.send({caseNumber: problem++, slices: line});
    });
    
    process.on('exit', () => {
        for (let i = 1; i < solutions.length; i++) {
            console.log(solutions[i]);
        }
    });
}

function childProcess() {
    // Receive messages from the master process.
    process.on('message', function(msg) {
        sendSolution(msg.caseNumber, msg.slices);
    });
}
