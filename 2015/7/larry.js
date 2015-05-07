var fs = require('fs');

var GIRLS = [];
var RELS = [];

var getAnswer = function(name, question) {
    var girl;
    GIRLS.some(function(g) {
        if (g.name === name) {
            girl = g;
            return true;
        }
        return false;
    });
    return girl.answers[question];
};

var getFriends = function(name) {
    var rawFriends = [];
    RELS.forEach(function(rel) {
        if (rel.indexOf(name) !== -1) {
            rawFriends = rawFriends.concat(rel);
        }
    });
    // Filter duplicates and girl herself
    var friends = [];
    rawFriends.forEach(function(f) {
         if(f !== name && friends.indexOf(f) === -1) {
             friends.push(f);
         }
    });

    return friends;
};

var getSecondFriends = function(name) {
    var directFriends = getFriends(name);
    var rawSecondFriends = [];
    directFriends.forEach(function(f) {
        RELS.forEach(function(rel) {
            if (rel.indexOf(f) !== -1) {
                rawSecondFriends = rawSecondFriends.concat(rel);
            }
        });
    });

    // Filter duplicates, direct friends and girl herself
    var secondFriends = [];
    rawSecondFriends.forEach(function(f) {
         if(f !== name && directFriends.indexOf(f) === -1 && secondFriends.indexOf(f) === -1) {
             secondFriends.push(f);
         }
    });

    return secondFriends;
};

var getFriendNetwork = function(name) {
    var friends = getFriends(name);
    var friendNetwork = [];
    var newFriendNetwork = getFriends(name);

    while (friendNetwork.length < newFriendNetwork.length) {
        friendNetwork = newFriendNetwork;
        var newRawFriendNetwork = [];
        friendNetwork.forEach(function(friendName) {
            newRawFriendNetwork = newRawFriendNetwork.concat(getFriends(friendName));
        });
        var newFriendNetwork = [];
        newRawFriendNetwork.forEach(function(f) {
             if(f !== name && newFriendNetwork.indexOf(f) === -1) {
                 newFriendNetwork.push(f);
             }
        });
    }
    return friendNetwork;
};

var processQuestionA = function(g) {
    if (g.answers[0]) {
        g.points += 7;
    }
};

var processQuestionB = function(g) {
    var friends = getFriends(g.name);
    friends.forEach(function(name) {
        if (getAnswer(name, 1)) {
            g.points += 3;
        }
    });
};

var processQuestionC = function(g) {
    var secondFriends = getSecondFriends(g.name);
    secondFriends.forEach(function(name) {
        if (getAnswer(name, 2)) {
            g.points += 6;
        }
    });
};

var processQuestionD = function(g) {
    var friends = getFriends(g.name);
    friends.forEach(function(friendName) {
        if (getAnswer(friendName, 3)) {
            var hasNoFriendWhoLikesCats = true;
            // For every friend who likes cats, try to find out if no friends of her likes cats (but g)
            var friendsOfFriend = getFriends(friendName);
            friendsOfFriend.forEach(function(friendOfFriendName) {
                if (friendOfFriendName !== g.name && getAnswer(friendOfFriendName, 3)) {
                    hasNoFriendWhoLikesCats = false;
                }
            });
            if (hasNoFriendWhoLikesCats) {
                g.points += 4;
            }
        }
    });
};

var processQuestionE = function(g) {
    var friendNetwork = getFriendNetwork(g.name);
    GIRLS.forEach(function(girl) {
        if (g.name !== girl.name && friendNetwork.indexOf(girl.name) === -1 && getAnswer(girl.name, 4)) {
            g.points += 5;
        }
    });
};

var processGirl = function(g) {
    processQuestionA(g);
    processQuestionB(g);
    processQuestionC(g);
    processQuestionD(g);
    processQuestionE(g);

//    console.log('%s has %d points', g.name, g.points);
};

var printPerfectLarryMatchingAlgorithm = function() {
    // Process the points
    GIRLS.forEach(processGirl);
    // Find the maximum
    var max = 0;
    GIRLS.forEach(function(g) {
        if (g.points > max) {
            max = g.points;
        }
    });
    console.log(max);
};

var main = function() {
    var inputFile = process.argv[2] || 'testInput';

    var lines = fs.readFileSync(inputFile).toString().split('\n');

    var firstLine = lines[0].split(' ');
    var numberOfGirls = parseInt(firstLine[0]);
    var numberOfFriendships = parseInt(firstLine[1]);

    for(var i = 1; i <= numberOfGirls; i++) {
        var girl = lines[i].split(' ');
        girl = {
            name: girl[0],
            answers: [
                girl[1] === 'Y',
                girl[2] === 'Y',
                girl[3] === 'Y',
                girl[4] === 'Y',
                girl[5] === 'Y'
            ],
            points: 0
        };
        GIRLS.push(girl);
    }

    for(var i = numberOfGirls + 1; i <= numberOfGirls + numberOfFriendships; i++) {
        var rel = lines[i].split(' ');
        RELS.push(rel);
    }

    printPerfectLarryMatchingAlgorithm();
};

main();
