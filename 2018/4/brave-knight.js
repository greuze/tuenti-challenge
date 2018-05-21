const cluster = require('cluster');
const cpus = require('os').cpus().length;
const fs = require('fs');
const LinkedList = require('linkedlist');

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

const manhattanDistance = function (start, end) {
    return Math.abs(end[0] - start[0]) + Math.abs(end[1] - start[1]);
}

const getNewPaths = function (current, problem, visited) {
    const rows = problem.length;
    const cols = problem[0].length;
    let path = current.point;

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
            (visited[newPath[0]][newPath[1]] === undefined || visited[newPath[0]][newPath[1]] > current.length + 1) &&
            problem[newPath[0]][newPath[1]] !== LAVA;
    });
    return newPaths;
};

const addNewPaths = function (current, dest, problem, possiblePaths, visited) {
    let newPaths = getNewPaths(current, problem, visited);

    newPaths.forEach(p => {
        let newPath = {
            length: current.length + 1,
            distance: manhattanDistance(p, dest),
            point: p
        };
        possiblePaths.push(newPath);
        if (problem[p[0]][p[1]] !== PRINCESS && problem[p[0]][p[1]] !== EXIT) {
            visited[p[0]][p[1]] = newPath.length;
        }
    });
};

const getBest = function(possiblePaths, bestLength) {
    possiblePaths.resetCursor();
    let current = possiblePaths.next();
    while (current !== undefined) {
        if (bestLength !== undefined && bestLength < current.length) {
            possiblePaths.removeCurrent();
        } else {
            if (current.distance < possiblePaths.head.distance ||
                    current.distance == possiblePaths.head.distance && current.length < possiblePaths.head.length) {
                // Put the better in the first place of the list
                possiblePaths.unshiftCurrent();
            }
        }
        current = possiblePaths.next();
    }

    let best = possiblePaths.shift();
    return best;
};

const getSolution = function (caseNumber, problem) {
    const rows = problem.length;
    const cols = problem[0].length;

    let {knight: start, princess, exit} = findPoints(problem);

    // Create visited array
    let visited = new Array(rows);
    for (let i = 0; i < rows; i++) {
        visited[i] = new Array(cols);
    }
    visited[start[0]][start[1]] = 0;

    let step = 0;
    let possiblePaths = new LinkedList();
    possiblePaths.push({
        length: 0,
        distance: manhattanDistance(start, princess),
        point: start
    });

    // Find the princess
    let pathToPrincess;
    while (possiblePaths.length > 0) {
        // Find best
        let best = getBest(possiblePaths, pathToPrincess);
        // No paths
        if (best === undefined) {
            break;
        }

        // Check dest
        if (best.point[0] === princess[0] && best.point[1] === princess[1]) {
            if (pathToPrincess === undefined || pathToPrincess > best.length) {
                pathToPrincess = best.length;
            }
            // Check other paths for any better
        } else {
            addNewPaths(best, princess, problem, possiblePaths, visited)
        }
    }
    if (pathToPrincess === undefined) {
        return `Case #${caseNumber}: IMPOSSIBLE`;
    }

    // Reset to find the exit
    visited = new Array(rows);
    for (let i = 0; i < rows; i++) {
        visited[i] = new Array(cols);
    }
    visited[princess[0]][princess[1]] = pathToPrincess;

    possiblePaths = new LinkedList();
    possiblePaths.push({
        length: pathToPrincess,
        distance: manhattanDistance(princess, exit),
        point: princess
    });

    let pathToExit;
    while (possiblePaths.length > 0) {
        // Find best
        let best = getBest(possiblePaths, pathToExit);
        // No paths
        if (best === undefined) {
            break;
        }

        // Check dest
        if (best.point[0] === exit[0] && best.point[1] === exit[1]) {
            if (pathToExit === undefined || pathToExit > best.length) {
                pathToExit = best.length;
            }
            // Check other paths for any better
        } else {
            addNewPaths(best, exit, problem, possiblePaths, visited)
        }
    }
    if (pathToExit === undefined) {
        return `Case #${caseNumber}: IMPOSSIBLE`;
    }

    return `Case #${caseNumber}: ${pathToExit}`;
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
