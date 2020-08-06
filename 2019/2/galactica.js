const cluster = require('cluster');
const cpus = require('os').cpus().length;
const fs = require('fs');

const GALACTICA = 'Galactica';
const NEW_EARTH = 'New Earth';

// Solve one problem
const getSolution = function (caseNumber, problemRaw) {
    const problem = {};
    problemRaw.forEach(path => {
        const s = path.split(':');
        problem[s[0]] = s[1];
    });

    let current = problem[GALACTICA].split(',');
    while (current.some(e => e !== NEW_EARTH)) {
        let next = [];
        current.forEach(e => {
            if (e !== NEW_EARTH) {
                next = next.concat(problem[e].split(','));
            } else {
                next.push(e)
            }
        });
        current = next;
    }

    return `Case #${caseNumber}: ${current.length}`;
};

// Cluster stuff
if (cluster.isMaster) {
    const inputFile = process.argv[2] || 'testInput';

    const lines = fs.readFileSync(inputFile).toString().split('\n');
    const numberOfCases = parseInt(lines[0]);

    let problemNumber = 1;
    let lineNumber = 1;
    let solutions = new Array(numberOfCases);

    // Code to read a new problem
    function getNextProblem() {
        const problemLength = parseInt(lines[lineNumber++]);
        let problem = [];
        for(let i = 0; i < problemLength; i++) {
            let line = lines[lineNumber++];
            problem.push(line);
        }
        return problem;
    }

    for (let i = 0; i < cpus; i++) {
        let worker = cluster.fork();

        worker.on('message', function(msg) {
            solutions[msg.caseNumber - 1] = msg.solution;
            // Send a new problem, or exit
            if (problemNumber <= numberOfCases) {
                let problem = getNextProblem();
                worker.send({caseNumber: problemNumber++, problem});
            } else {
                worker.kill();
            }
        });
    }

    cluster.on('online', (worker) => {
        if (problemNumber <= numberOfCases) {
            let problem = getNextProblem();
            worker.send({caseNumber: problemNumber++, problem});
        } else {
            worker.kill();
        }
    });

    process.on('exit', () => {
        for (let i = 0; i < solutions.length; i++) {
            console.log(solutions[i]);
        }
    });
} else {
    process.on('message', function(msg) {
        const solution = getSolution(msg.caseNumber, msg.problem);
        process.send({
            caseNumber: msg.caseNumber,
            solution: solution
        })
    });
}
