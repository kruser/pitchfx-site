var MongoClient = require('mongodb').MongoClient;

/**
 * Query atbats for a batter or a pitcher. If there isn't a "batter" or
 * "pitcher" query parameter than this method will throw a 500.
 * 
 * @param req -
 *            the express request
 * @param res -
 *            the express response
 */
exports.query = function(req, res) {

    /* Supported parameters */
    var filter = JSON.parse(req.query.filter);

    var playerId = parseInt(req.params.playerId, 10);
    var query = {};
    if (req.params.type === 'batter') {
        query['atbat.batter'] = playerId;
    } else {
        query['atbat.pitcher'] = playerId;
    }

    adjustQueryByFilter(query, filter);

    console.log(JSON.stringify(query, null, 4));

    MongoClient.connect("mongodb://localhost:27017/mlbatbat", function(err, db) {
        db.collection('pitches').find(query).toArray(function(err, docs) {
            res.json(docs);
            db.close();
        });
    });
};

/**
 * Adjusts the mongoDB query using the filter provided from the API call
 * 
 * @param query
 * @param filter
 */
function adjustQueryByFilter(query, filter) {

    var topLevelFilters = [];
    if (filter.pitcherHand) {
        topLevelFilters.push({
            'atbat.p_throws' : filter.pitcherHand
        });
    }
    if (filter.batterHand) {
        topLevelFilters.push({
            'atbat.stand' : filter.batterHand
        });
    }

    if (filter.outs) {
        var outs = [];

        if (filter.outs['0']) {
            outs.push(0);
        }
        if (filter.outs['1']) {
            outs.push(1);
        }
        if (filter.outs['2']) {
            outs.push(2);
        }
        if (outs.length > 0) {
            topLevelFilters.push({
                'atbat.o' : {
                    '$in' : outs
                }
            });
        }
    }
    
    if (filter.gameType) {
        var gameTypes = [];
        if (filter.gameType['S']) {
            gameTypes.push('S');
        }
        if (filter.gameType['R']) {
            gameTypes.push('R');
        }
        if (filter.gameType['P']) {
            gameTypes.push('D');
            gameTypes.push('L');
            gameTypes.push('W');
        }
        if (gameTypes.length > 0) {
            topLevelFilters.push({
                'game.game_type' : {
                    '$in' : gameTypes
                }
            });
        }
    }

    var inningsQuery = buildInningQuery(filter.inning);
    if (inningsQuery) {
        topLevelFilters.push(inningsQuery);
    }

    var runnerQuery = buildRunnersQuery(filter.runners);
    if (runnerQuery) {
        topLevelFilters.push(runnerQuery);
    }

    if (filter.date) {
        if (filter.date.start && filter.date.end) {
            topLevelFilters.push({
                'tfs_zulu' : {
                    '$gte' : new Date(filter.date.start),
                    '$lte' : new Date(filter.date.end)
                }
            });
        } else if (filter.date.start) {
            topLevelFilters.push({
                'tfs_zulu' : {
                    '$gte' : new Date(filter.date.start)
                }
            });
        } else if (filter.date.end) {
            topLevelFilters.push({
                'tfs_zulu' : {
                    '$lt' : new Date(filter.date.end)
                }
            });
        }
    }
    query.$and = topLevelFilters;
}

/**
 * Create a query block based on the innings filter
 * 
 * @param {*}
 *            inning - the innings portion of the filter
 * 
 */
function buildInningQuery(inning) {
    if (inning) {
        var innings = [];
        if (inning['1']) {
            innings.push(1);
        }
        if (inning['2']) {
            innings.push(2);
        }
        if (inning['3']) {
            innings.push(3);
        }
        if (inning['4']) {
            innings.push(4);
        }
        if (inning['5']) {
            innings.push(5);
        }
        if (inning['6']) {
            innings.push(6);
        }
        if (inning['7']) {
            innings.push(7);
        }
        if (inning['8']) {
            innings.push(8);
        }
        if (inning['9']) {
            innings.push(9);
        }

        if (inning.extra && innings.length > 0) {
            return {
                '$or' : [ {
                    'inning.number' : {
                        '$gt' : 9
                    }
                }, {
                    'inning.number' : {
                        '$in' : innings
                    }
                } ]
            };
        } else if (innings.length > 0) {
            return {
                'inning.number' : {
                    '$in' : innings
                }
            };
        } else if (inning.extra) {
            return {
                'inning.number' : {
                    '$gt' : 9
                }
            };
        }
        return undefined;
    }
}

/**
 * Add the base runners filter to the query if we have any
 * 
 * @param {*}
 *            runners - the runners portion of the filter
 * @returns {*}
 */
function buildRunnersQuery(runners) {
    if (runners && runners.gate) {
        var bases = [];
        if (runners.first) {
            bases.push({
                'on_1b' : {
                    '$exists' : true
                }
            });
        }
        if (runners.second) {
            bases.push({
                'on_2b' : {
                    '$exists' : true
                }
            });
        }
        if (runners.third) {
            bases.push({
                'on_3b' : {
                    '$exists' : true
                }
            });
        }
        if (runners.empty) {
            bases.push({
                '$and' : [ {
                    'on_1b' : {
                        '$exists' : false
                    }
                }, {
                    'on_2b' : {
                        '$exists' : false
                    }
                }, {
                    'on_3b' : {
                        '$exists' : false
                    }
                } ]
            });
        }
        if (bases.length > 0) {
            runnerFilter = {};
            if (runners.gate === 'OR') {
                return {
                    '$or' : bases,
                };
            } else {
                return {
                    '$and' : bases,
                };
            }
            return runnerFilter;
        }
    }
    return undefined;
}
