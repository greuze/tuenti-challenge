var fs = require('fs');
var game = require('./game-logic.js');

var ISLANDS = [];
var ROUTES = [];

var main = function() {
    var inputFile = process.argv[2] || 'testInput';

    var lines = fs.readFileSync(inputFile).toString().split('\n');

    var numberOfIslands = parseInt(lines[0]);

    for(var i = 1; i <= numberOfIslands; i++) {
        var island = lines[i].split(' ');
        island[1] = parseInt(island[1]);
        ISLANDS.push(island);
    }

    var numberOfRoutes = parseInt(lines[numberOfIslands + 1]);

    for(var j = numberOfIslands + 2; j <= numberOfRoutes + numberOfIslands + 1; j++) {
        var route = lines[j].split(' ');
        route[2] = parseInt(route[2]);
        ROUTES.push(route);
    }

    var numberOfShips = parseInt(lines[numberOfIslands + numberOfRoutes + 2]);

    var myShip = lines[numberOfIslands + numberOfRoutes + 3].split(' ');
    myShip[0] = parseInt(myShip[0]);
    myShip[2] = parseInt(myShip[2]);
    var ships = [];

    for(var k = numberOfIslands + numberOfRoutes + 4; k <= numberOfRoutes + numberOfIslands + numberOfShips + 2; k++) {
        var ship = lines[k].split(' ');
        ship[0] = parseInt(ship[0]);
        ship[2] = parseInt(ship[2]);
        ships.push(ship);
    }

    game.printOneTreasure(myShip, ships, ROUTES, ISLANDS);
};

main();
