var Game = function(girls, rels) {
    this.GIRLS = girls;
    this.RELS = rels;
};

Game.prototype = {
    printPerfectLarryMatchingAlgorithm: function() {
        // To be used in functions
        var self = this;

        var getAnswer = function(name, question) {
            var girl;
            self.GIRLS.some(function(g) {
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
            self.RELS.forEach(function(rel) {
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
                self.RELS.forEach(function(rel) {
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

            var concatNetwork = function(friendNetwork) {
                return function(friendName) {
                    friendNetwork.push.apply(friendNetwork, getFriends(friendName));
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
            self.GIRLS.forEach(function(girl) {
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

        // Process the points
        self.GIRLS.forEach(processGirl);
        // Find the maximum
        var max = 0;
        self.GIRLS.forEach(function(g) {
            if (g.points > max) {
                max = g.points;
            }
        });
        console.log(max);
    }
};

module.exports.Game = Game;