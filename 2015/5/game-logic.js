var LAST_ISLAND = 'Raftel';

var getFirstCheapestRoute = function(source, routes) {
    var routesFromSource = routes.filter(function(e) {
        return e[0] === source;
    });

    var next = routesFromSource[0];
    if (routesFromSource.length > 1) {
        for (var i = 1; i < routesFromSource.length; i++) {
            if (routesFromSource[i][2] < next[2]) {
                next = routesFromSource[i];
            }
        }
    }
    return next;
};

var getFirstMostExpensiveRoute = function(source, routes) {
    var routesFromSource = routes.filter(function(e) {
        return e[0] === source;
    });

    var next = routesFromSource[0];
    if (routesFromSource.length > 1) {
        for (var i = 1; i < routesFromSource.length; i++) {
            if (routesFromSource[i][2] > next[2]) {
                next = routesFromSource[i];
            }
        }
    }
    return next;
};

var calculateMaximumMovements = function(shipsOrig, routes) {
    var ships = JSON.parse(JSON.stringify(shipsOrig));
    var movements = 0;
    while (true) {
        movements++;
        for (var i = 0; i < ships.length; i++) {
            var ship = ships[i];
            var nextShip = (ship[0] % 2) === 0 ?
                getFirstMostExpensiveRoute(ship[3], routes) : getFirstCheapestRoute(ship[3], routes);
            ship[3] = nextShip[1];
            if (ship[3] === LAST_ISLAND) {
                return movements;
            }
        }
    }
};

var calculateGold = function(myShip, shipsOrig, routes, islands, solution) {
    var gold = myShip[2];
    var ships = JSON.parse(JSON.stringify(shipsOrig));

    var filterOneRoute = function(i) {
        return function(e) {
            return e[0] === solution[i - 1] && e[1] === solution[i];
        };
    };
    var filterOneIsland = function (i) {
        return function(e) {
            return e[0] === solution[i];
        };
    };

    for (var i = 1; i < solution.length; i++) {
        if (solution[i] === null) {
            gold += 10;
            solution[i] = solution[i - 1]; // To avoid routes from null to anywhere
        } else {
            // Can be only one route
            var route = routes.filter(filterOneRoute(i))[0];
            // Subtract route cost
            gold -= route[2];
            // Can be only one island
            var destIsland = islands.filter(filterOneIsland(i))[0];
            gold -= destIsland[1];
        }
        // Check for collision with other ships
        var lastVisitedIsland = solution[i];
        if (lastVisitedIsland === null) {
            // Get last non-null island before this step
            lastVisitedIsland = solution.slice(0, i).filter(function(e) {
                return e !== null;
            }).slice(-1)[0];
        }
        if (lastVisitedIsland !== LAST_ISLAND) {
            for (var j = 0; j < ships.length; j++) {
                var ship = ships[j];
                var nextShip = (ship[0] % 2) === 0 ?
                    getFirstMostExpensiveRoute(ship[3], routes) : getFirstCheapestRoute(ship[3], routes);
                ship[3] = nextShip[1];
                if (ship[3] === lastVisitedIsland) {
                    gold -= ship[2];
                }
            }
        }
    }
    return gold;
};

module.exports.printOneTreasure = function(myShip, ships, routes, islands) {
    // Calculate maximum movements
    var maxMovements = calculateMaximumMovements(ships, routes);

    // Store all posible routes from starting island within max movements
    var solutions = [];
    var partialSolutions = [[myShip[3]]]; // Initial partial solution, with only one island
    var nextPartialSolutions;

    var filterRoutesFromSource = function(lastIsland) {
        return function(e) {
            return e[0] === lastIsland;
        };
    };
    var addNewRoutes = function(i) {
        return function(route) {
            var newSol = JSON.parse(JSON.stringify(partialSolutions[i]));
            newSol.push(route[1]);
            if (route[1] == LAST_ISLAND) {
                solutions.push(newSol);
            } else {
                nextPartialSolutions.push(newSol);
            }
        };
    };

    for (var mov = 1; mov <= maxMovements; mov++) {
        nextPartialSolutions = [];
        for (var i = 0; i < partialSolutions.length; i++) {
            var oldSol = partialSolutions[i];
            oldSol = oldSol.filter(function(e) { // Remove stays for pillage
                return e !== null;
            });
            var lastIsland = oldSol[oldSol.length - 1];
            var routesFromSource = routes.filter(filterRoutesFromSource(lastIsland));

            var staySol = JSON.parse(JSON.stringify(partialSolutions[i]));
            staySol.push(null); // Stay for pillage
            nextPartialSolutions.push(staySol);
            
            routesFromSource.forEach(addNewRoutes(i));
        }
        partialSolutions = nextPartialSolutions;
    }

    // Iterate over all possible solutions (with max movements or less)
    var maxGold = Number.NEGATIVE_INFINITY;
    solutions.forEach(function(solution) {
        var gold = calculateGold(myShip, ships, routes, islands, solution);
        if (gold > maxGold) {
            //console.log('Last sol (%d) %j', gold, solution);
            maxGold = gold;
        }
    });
    console.log(maxGold);
};
