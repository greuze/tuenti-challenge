const fs = require('fs');

const addRoute = function(origin, destination, routes) {
    // Add destination from origin if already exist, or create with a single destination otherwise
    if (routes[origin]) {
        routes[origin].push(destination);
    } else {
        routes[origin] = [ destination ];
    }
};

// cityFrom and cityTo cannot be the same
const isConnected = function(cityFrom, cityTo, citiesToAvoid, routes) {
    // Do not try this destination again
    citiesToAvoid.push(cityFrom);
    if (routes[cityFrom].includes(cityTo)) {
        return true;
    } else {
        // Iterate rest of routes, not yet tested
        return routes[cityFrom].filter(c => !citiesToAvoid.includes(c)).some(c => {
            // If one direct route is connected, than the cities are connected 
            return isConnected(c, cityTo, citiesToAvoid, routes);
        });
    }
};

const isCriticalSlow = function(city, cities, routes) {
    // If one city has only one route (could not have 0 routes), it is a leaf, is not critical
    if (routes[city].length === 1) {
        return false;
    } else {
        // Test from all cities but the current one
        const citiesFrom = Array.from(cities).filter(c => c !== city);
        return !citiesFrom.every(cityFrom => {
            // Test destinations that are alphabetically after origin, to avoid test twice same route
            const citiesTo = citiesFrom.filter(c => c > cityFrom);
            return citiesTo.every(cityTo => {
                return isConnected(cityFrom, cityTo, [city], routes);
            });
        });
    }
};

const printSolution = function (caseNumber, rawRoutes) {
    // Prepare data
    const cities = new Set();
    const routes = {};
    rawRoutes.forEach(rawRoute => {
        const route = rawRoute.split(',');
        // Add to set both cities to known cities list
        cities.add(route[0]);
        cities.add(route[1]);
        // Add route both ways
        addRoute(route[0], route[1], routes);
        addRoute(route[1], route[0], routes);
    });

    // Iterate cities to look for critical
    const criticalCities = [];
    cities.forEach(city => {
        if (isCriticalSlow(city, cities, routes)) {
            criticalCities.push(city);
        }
    });

    // Prepare solution
    let solution;
    if (criticalCities.length > 0) {
        solution = criticalCities.sort().join(',');
    } else {
        solution = '-';
    }

    console.log('Case #%s: %s', caseNumber, solution);
};

const main = function() {
    const inputFile = process.argv[2] || 'testInput';

    const lines = fs.readFileSync(inputFile).toString().split('\n');
    const numberOfCases = lines[0];

    let currentCase = 1;
    let currentLine = 1;
    while (currentCase <= numberOfCases) {
        const routes = [];
        const numberOfTickets = parseInt(lines[currentLine++]);
        for (let i = 0; i < numberOfTickets; i++) {
            routes.push(lines[currentLine++]);
        }

        printSolution(currentCase++, routes);
    }
};

main();
