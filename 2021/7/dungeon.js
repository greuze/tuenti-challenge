const fs = require('fs');
const net = require('net');

const welcome = 'Welcome, my friend!';
const goodbye = 'Good bye, my friend...';
const tooMuchTime = 'Oh, no! You took too much time to exit.';
const moved = 'Great movement. Here is your new position: '
const youCanMove = 'Well, well, well, my friend. You could do these movements: ';
const noExit = 'No. Sorry, traveller...';
const yesExit = 'Yes. Congratulations, you found the exit door'

// "(5, 10)" -> "5,10"
const removeBrackets = function(currentPosition) {
    return currentPosition.replace(/[\(\s\)]/g, '');
};

const filterMovements = function (currentPosition, movements, openPaths) {
    const [x, y] = removeBrackets(currentPosition).split(',').map(e => parseInt(e));
    const filteredMovements = [];
    movements.forEach(move => {
        if (
            (move === 'north' && !openPaths[`(${x}, ${y+1})`]) ||
            (move === 'west' && !openPaths[`(${x+1}, ${y})`]) ||
            (move === 'east' && !openPaths[`(${x-1}, ${y})`]) ||
            (move === 'south' && !openPaths[`(${x}, ${y-1})`])
        ) {
            // Movement is valid (not yet visited)
            filteredMovements.push(move);
        }
    });
    return filteredMovements;
};

const getShortestNext = function(openPaths) {
    let minCost = Number.MAX_SAFE_INTEGER;
    let shortestNext;
    Object.keys(openPaths).forEach(e => {
        if (!openPaths[e].finished && (openPaths[e].cost < minCost)) {
            shortestNext = e;
            minCost = openPaths[e].cost;
        }
    });
    return shortestNext;
};

const getNextMove = function(currentPosition, movements, openPaths) {
    const filteredMovements = filterMovements(currentPosition, movements, openPaths);
    if (filteredMovements.length === 0) {
        console.log(`No more unvisited paths from ${currentPosition}`);
        // Do not visit this position again
        openPaths[currentPosition].finished = true;
    } else {
        console.log(`Can move from ${currentPosition} to ${filteredMovements}`);
        openPaths[currentPosition].movements = filteredMovements;
    }

    const bestNext = getShortestNext(openPaths);
    console.log(`Best "go to" candidate is ${bestNext}`);
    let nextMove;
    // If there is a shortest path than from current position
    if (bestNext && (openPaths[currentPosition].finished || (openPaths[bestNext].cost < openPaths[currentPosition].cost))) {
        console.log(`Go to shortest path ${bestNext} (length ${openPaths[bestNext].cost})`);
        nextMove = `go to ${removeBrackets(bestNext)}`;
    } else {
        // This can only happen if filteredMovements > 0, otherwise the path cost cannot be smaller than best other
        console.log(`Moving ${filteredMovements[0]}`);
        nextMove = filteredMovements[0];
        // If only one possible movement, we don't want to go to this position again
        if (filteredMovements.length === 1) {
            openPaths[currentPosition].finished = true;
        }
    }
    return nextMove;
};

const printSolution = function(currentPosition, openPaths) {
    let solution = currentPosition;
    let nextNode = openPaths[currentPosition].previous;
    // Repeat until reaching the root node (starting position)
    while (nextNode) {
        solution = nextNode + ', ' + solution;
        nextNode = openPaths[nextNode].previous;
    }
    return solution;
};

const play = function () {
    const client = net.connect({host: 'codechallenge-daemons.0x14.net', port: 4321}, function () {
        // 'connect' listener
        console.log('Connected to server!');
    });

    const openPaths = {};
    let currentPosition;

    client.on('data', rawData => {
        const data = rawData.toString().trim();
        if (data.indexOf(welcome) === 0) { // Process start
            console.log('Starting game...');
            // Check the starting point
            client.write('where am I');
        } else if (/^\(\d+,\s*\d+\)$/.test(data)) { // Process "where am I"
            console.log(`Starting at ${data}, path has 0 steps`);
            currentPosition = data;
            openPaths[data] = { cost: 0, previous: null };
            client.write('is exit?');
        } else if (data.indexOf(youCanMove) === 0) { // Process "look"
            const movements = data.substring(youCanMove.length).split(' ');
            // Remove already done movements
            const nextMove = getNextMove(currentPosition, movements, openPaths);
            client.write(nextMove);
        } else if (data.indexOf(moved) === 0) { // Process "north", "west", "east", "south" or "go to x,y"
            const newPosition = data.substring(moved.length)
            if (openPaths[newPosition]) {
                // Already been here, come with a "go to x,y"
                console.log(`Went to ${newPosition}`);
                const nextMove = getNextMove(newPosition, openPaths[newPosition].movements, openPaths);
                currentPosition = newPosition;
                client.write(nextMove);
            } else {
                // Come with a movement
                openPaths[newPosition] = { cost: openPaths[currentPosition].cost + 1, previous: currentPosition };
                console.log(`Moved from ${currentPosition} to ${newPosition}, path has ${openPaths[newPosition].cost} steps`);
                // TODO: Update a path trail
                currentPosition = newPosition;
                client.write('is exit?');
            }
        } else if (data.indexOf(noExit) === 0) { // Process "is exit?"
            console.log('No exit, look again...');
            client.write('look');
        } else if (data.indexOf(yesExit) === 0) { // Process fount exit
            console.log(`FOUND EXIT at ${currentPosition} with ${openPaths[currentPosition].cost}!!!`);
            console.log('Path to exit will be displayed following:');
            console.log(printSolution(currentPosition, openPaths));
            client.write('bye');
        } else if (data.indexOf(goodbye) === 0) { // Process "bye"
            console.log('Disconnecting...');
        } else if (data.indexOf(tooMuchTime) === 0) { // Process timeout
            console.log('Disconnecting due to inactivity...');
        } else {
            console.log('Unknown command', data); // Process fallback
            client.write('bye');
        }
    });

    client.on('drain', () => console.log('drain'));
    client.on('error', e => console.log('error', e));
    client.on('end', () => console.log('Disconnected from server!'));
};

const main = function() {
    play();
};

main();
