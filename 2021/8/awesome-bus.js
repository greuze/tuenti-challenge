const fs = require('fs');

const addRoute = function(origin, destination, routes) {
    // Add destination from origin if already exist, or create with a single destination otherwise
    if (routes[origin]) {
        routes[origin].push(destination);
    } else {
        routes[origin] = [ destination ];
    }
};

// Get all the cities directly connected to the input city list
const getFurtherConnections = function(citiesFrom, cityToAvoid, routes, allConnectedCities) {
    const directConnectedCities = new Set();
    citiesFrom.forEach(cityFrom => {
        if (cityFrom !== cityToAvoid) {
            routes[cityFrom].forEach(cityTo => {
                // If the city to was not previously added and it not the city to avoid
                if (cityTo != cityToAvoid && !allConnectedCities.has(cityTo)) {
                    // Add to direct connections and all connections
                    directConnectedCities.add(cityTo);
                    allConnectedCities.add(cityTo);
                }
            });
        }
    });
    return directConnectedCities;
};

const isCritical = function(city, cities, routes) {
    // If one city has only one route (could not have 0 routes), it is a leaf, is not critical
    if (routes[city].length === 1) {
        return false;
    } else {
        const allConnectedCities = new Set();
        // Get a random city (not the one to be removed)
        const randomCity = Array.from(cities).find(c => c !== city);

        let directConnectedCities = getFurtherConnections([randomCity], city, routes, allConnectedCities);
        // While there are unexplored routes
        while (directConnectedCities.size > 0) {
            directConnectedCities = getFurtherConnections(directConnectedCities, city, routes, allConnectedCities);
        }

        return allConnectedCities.size < (cities.size - 1);
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
        if (isCritical(city, cities, routes)) {
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
