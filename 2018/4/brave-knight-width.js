const cluster = require('cluster');
const cpus = require('os').cpus().length;
const fs = require('fs');

const KNIGHT = 'S';
const PRINCESS = 'P';
const EXIT = 'D';
const TRAMPOLIN = '*';
const LAVA = '#';

const findPoints = function (problem) {
    let knight, princess, exit;

    for (let i = 0; i < problem.length; i++) {
        let knightFound = problem[i].indexOf(KNIGHT);
        if (knightFound !== -1) {
            knight = [i, knightFound];
        }
        let princessFound = problem[i].indexOf(PRINCESS);
        if (princessFound !== -1) {
            princess = [i, princessFound];
        }
        let exitFound = problem[i].indexOf(EXIT);
        if (exitFound !== -1) {
            exit = [i, exitFound];
        }

        if (knight && princess && exit) {
            return { knight, princess, exit };
        } 
    }
    console.log('Punto no encontrado', knight, princess, exit, problem);
    process.exit(1);
};

const getNewPaths = function (path, problem, visited) {
    const rows = problem.length;
    const cols = problem[0].length;

    let newRawPaths;
    let isTrampolin = problem[path[0]][path[1]] === TRAMPOLIN;
    if (isTrampolin) {
        newRawPaths = [
            [path[0] - 4, path[1] - 2],
            [path[0] - 4, path[1] + 2],
            [path[0] - 2, path[1] + 4],
            [path[0] + 2, path[1] + 4],
            [path[0] + 4, path[1] + 2],
            [path[0] + 4, path[1] - 2],
            [path[0] + 2, path[1] - 4],
            [path[0] - 2, path[1] - 4]
        ];
    } else {
        newRawPaths = [
            [path[0] - 2, path[1] - 1],
            [path[0] - 2, path[1] + 1],
            [path[0] - 1, path[1] + 2],
            [path[0] + 1, path[1] + 2],
            [path[0] + 2, path[1] + 1],
            [path[0] + 2, path[1] - 1],
            [path[0] + 1, path[1] - 2],
            [path[0] - 1, path[1] - 2]
        ];
    }
    let newPaths = newRawPaths.filter(newPath => {
        return newPath[0] >= 0 && newPath[1] >= 0 &&
            newPath[0] < rows && newPath[1] < cols &&
            visited[newPath[0]][newPath[1]] !== true &&
            problem[newPath[0]][newPath[1]] !== LAVA;
    });
    return newPaths;
};

const getAllNewPaths = function (problem, possiblePaths, visited) {
    let allNewPaths = [];

    possiblePaths.forEach(p => {
        let newPaths = getNewPaths(p, problem, visited);
        allNewPaths = allNewPaths.concat(newPaths);
    });

    return allNewPaths;
};

const getSolution = function (caseNumber, problem) {
    const rows = problem.length;
    const cols = problem[0].length;

    let {knight: start, princess, exit} = findPoints(problem);

    let possiblePaths = [start];

    // Create visited array
    let visited = [];
    for (let i = 0; i < rows; i++) {
        visited.push(new Array(cols));
    }
    visited[start[0]][start[1]] = true;

    let step = 0;
    let hasPrincess = false;
    while (possiblePaths.length > 0) {
        let newPossiblePaths = getAllNewPaths(problem, possiblePaths, visited);
        step++;
        for (let i = 0; i < newPossiblePaths.length; i++) {
            let path = newPossiblePaths[i];
            if (hasPrincess) {
                if (path[0] === exit[0] && path[1] === exit[1]) {
                    return `Case #${caseNumber}: ${step}`;
                }
            } else {
                if (path[0] === princess[0] && path[1] === princess[1]) {
                    hasPrincess = true;
                    // This will be the only point in next step
                    newPossiblePaths = [path];
                    // Restart visited places, as they are valid again
                    visited = [];
                    for (let i = 0; i < rows; i++) {
                        visited.push(new Array(cols));
                    }
                    visited[start[0]][start[1]] = true;
                    break; // Exit for loop
                }
            }
            visited[path[0]][path[1]] = true;
        }
        possiblePaths = newPossiblePaths;
    }

    return `Case #${caseNumber}: IMPOSSIBLE`;
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
        const problemData = lines[lineNumber++].split(' ').map(e => parseInt(e));
        let problem = [];
        for(let i = 0; i < problemData[0]; i++) {
            let line = lines[lineNumber++];
            if (line.length !== problemData[1]) {
                console.log('Las dimensiones no coinciden');
                process.exit(1);
            }
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
        let problem = getNextProblem();
        worker.send({caseNumber: problemNumber++, problem});
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
