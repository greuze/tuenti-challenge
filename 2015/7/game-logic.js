var getAnswer = function(name, question, girls) {
    var girl;
    girls.some(function(g) {
        if (g.name === name) {
            girl = g;
            return true;
        }
        return false;
    });
    return girl.answers[question];
};

var getFriends = function(name, rels) {
    var rawFriends = [];
    rels.forEach(function(rel) {
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

var getSecondFriends = function(name, rels) {
    var directFriends = getFriends(name, rels);
    var rawSecondFriends = [];
    directFriends.forEach(function(f) {
        rels.forEach(function(rel) {
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

var getFriendNetwork = function(name, rels) {
    var friends = getFriends(name, rels);
    var friendNetwork = [];
    var newFriendNetwork = getFriends(name, rels);

    var concatNetwork = function(friendNetwork) {
        return function(friendName) {
            friendNetwork.push.apply(friendNetwork, getFriends(friendName, rels));
        };
    };
    var addToNetworkIfNew = function(friendNetwork) {
        return function(f) {
             if(f !== name && friendNetwork.indexOf(f) === -1) {
                 friendNetwork.push(f);
             }
        };
    };

    while (friendNetwork.length < newFriendNetwork.length) {
        friendNetwork = newFriendNetwork;
        var newRawFriendNetwork = [];
        friendNetwork.forEach(concatNetwork(newRawFriendNetwork));
        newFriendNetwork = [];
        newRawFriendNetwork.forEach(addToNetworkIfNew(newFriendNetwork));
    }
    return friendNetwork;
};

var processQuestionA = function(g, girls, rels) {
    if (g.answers[0]) {
        g.points += 7;
    }
};

var processQuestionB = function(g, girls, rels) {
    var friends = getFriends(g.name, rels);
    friends.forEach(function(name) {
        if (getAnswer(name, 1, girls)) {
            g.points += 3;
        }
    });
};

var processQuestionC = function(g, girls, rels) {
    var secondFriends = getSecondFriends(g.name, rels);
    secondFriends.forEach(function(name) {
        if (getAnswer(name, 2, girls)) {
            g.points += 6;
        }
    });
};

var processQuestionD = function(g, girls, rels) {
    var friends = getFriends(g.name, rels);
    friends.forEach(function(friendName) {
        if (getAnswer(friendName, 3, girls)) {
            var hasNoFriendWhoLikesCats = true;
            // For every friend who likes cats, try to find out if no friends of her likes cats (but g)
            var friendsOfFriend = getFriends(friendName, rels);
            friendsOfFriend.forEach(function(friendOfFriendName) {
                if (friendOfFriendName !== g.name && getAnswer(friendOfFriendName, 3, girls)) {
                    hasNoFriendWhoLikesCats = false;
                }
            });
            if (hasNoFriendWhoLikesCats) {
                g.points += 4;
            }
        }
    });
};

var processQuestionE = function(g, girls, rels) {
    var friendNetwork = getFriendNetwork(g.name, rels);
    girls.forEach(function(girl) {
        if (g.name !== girl.name && friendNetwork.indexOf(girl.name) === -1 && getAnswer(girl.name, 4, girls)) {
            g.points += 5;
        }
    });
};

var processGirl = function(girls, rels) {
    return function(g) {
        processQuestionA(g, girls, rels);
        processQuestionB(g, girls, rels);
        processQuestionC(g, girls, rels);
        processQuestionD(g, girls, rels);
        processQuestionE(g, girls, rels);

//        console.log('%s has %d points', g.name, g.points);
    };
};

module.exports.printPerfectLarryMatchingAlgorithm = function(girls, rels) {
    // Process the points
    girls.forEach(processGirl(girls, rels));
    // Find the maximum
    var max = 0;
    girls.forEach(function(g) {
        if (g.points > max) {
            max = g.points;
        }
    });
    console.log(max);
};
