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
        query.batter = playerId;
    } else {
        query.pitcher = playerId;
    }

    adjustQueryByFilter(query, filter);

    console.log(JSON.stringify(query, null, 4));

    MongoClient.connect("mongodb://localhost:27017/mlbatbat", function(err, db) {
        db.collection('atbats').find(query).toArray(function(err, docs) {
            res.json(calculateResults(docs));
            db.close();
        });
    });
};

/**
 * calculate the results based on the raw mongo results
 * 
 * @param docs
 * @returns {*} results
 */
function calculateResults(docs) {
    var results = {
        BA : 0.0,
        wOBA : 0.0,
        singles : 0,
        doubles : 0,
        triples : 0,
        homeRuns : 0,
        atbats : 0,
        plateAppearances : 0,
        iWalks : 0,
        walks : 0,
        rbi : 0,
        hitByPitch : 0,
        sacBunts : 0,
        sacFlies : 0,
        strikeouts : 0,
        rboe : 0,
        runnersPotentialBases : 0,
        runnersMovedBases : 0,
        hitBalls : {},
    };
    for ( var i = 0; i < docs.length; i++) {
        var atbatDoc = docs[i];
        accumulateAtBat(atbatDoc, results);
    }
    completeStats(results);

    return results;
}

/**
 * To be called when accumulation is complete.
 * 
 * @param results
 */
function completeStats(results) {
    calcBattingAverage(results);
    calcWOBA(results);
    calcSLG(results);
    calcOBP(results);
    calcBABIP(results);
    calcRMI(results);
}

/**
 * Calculates Runners Moved Indicator
 * 
 * @param results
 */
function calcRMI(results) {
    if (results.atbats) {
        results.rmi = results.runnersMovedBases / results.runnersPotentialBases;
    }
}

/**
 * Calculate Batting Average on Balls in Play
 * 
 * @param results
 */
function calcBABIP(results) {
    if (results.atbats) {
        results.babip = (results.singles + results.doubles + results.triples) / (results.atbats - results.strikeouts - results.homeRuns + results.sacFlies);
    }
}

/**
 * Calculate On Base Percentage
 * 
 * @param results
 */
function calcOBP(results) {
    if (results.atbats) {
        results.obp = (results.singles + results.doubles + results.triples + results.homeRuns + results.hitByPitch + results.walks + results.iWalks) / (results.atbats + results.walks + results.iWalks + results.hitByPitch);
    }
}

/**
 * Calculate Slugging Percentage
 * 
 * @param results
 */
function calcSLG(results) {
    if (results.atbats) {
        results.slg = (results.singles + (results.doubles * 2) + (results.triples * 3) + (results.homeRuns * 4)) / results.atbats;
    }
}

/**
 * Weighted OBA calculation
 * 
 * @param results
 */
function calcWOBA(results) {
    if (results.plateAppearances) {
        results.wOBA = ((results.walks * 0.72) + (results.hitByPitch * 0.75) + (results.singles * 0.9) + (results.doubles * 1.24) + (results.triples * 1.56) + (results.homeRuns * 1.95) + (results.rboe * 0.92)) / results.plateAppearances;
    }
}

/**
 * Batting average calculation
 * 
 * @param results
 */
function calcBattingAverage(results) {
    if (results.atbats) {
        results.BA = (results.singles + results.doubles + results.triples + results.homeRuns) / results.atbats;
    }
}

/**
 * Accumulate AtBats
 * 
 * @param atBat
 * @param results
 */
function accumulateAtBat(atBat, results) {
    if (atBat.hip && atBat.hip.trajectory) {
        var trajectory = atBat.hip.trajectory.toLowerCase();
        if (!results.hitBalls[trajectory]) {
            results.hitBalls[trajectory] = [];
        }
        results.hitBalls[trajectory].push([ atBat.hip.x, 0 - atBat.hip.y ]);
    }

    results.runnersMovedBases += atBat.runnersMovedBases;
    results.runnersPotentialBases += atBat.runnersPotentialBases;

    if (atBat.runner && atBat.runner.length > 0) {
        for ( var i = 0; i < atBat.runner.length; i++) {
            if (atBat.runner[i].rbi === 'T') {
                results.rbi++;
            }
        }
    }

    var event = atBat.event.toLowerCase();
    if (event.indexOf('single') >= 0) {
        results.singles++;
        results.atbats++;
    } else if (event.indexOf('double') >= 0) {
        results.doubles++;
        results.atbats++;
    } else if (event.indexOf('triple') >= 0) {
        results.triples++;
        results.atbats++;
    } else if (event.indexOf('home') >= 0) {
        results.homeRuns++;
        results.atbats++;
    } else if (event.indexOf('strikeout') >= 0) {
        results.strikeouts++;
        results.atbats++;
    } else if (event.indexOf('intent walk') >= 0) {
        results.iWalks++;
    } else if (event.indexOf('walk') >= 0) {
        results.walks++;
    } else if (event.indexOf('sac bunt') >= 0) {
        results.sacBunts++;
    } else if (event.indexOf('sac fly') >= 0) {
        results.sacFlies++;
    } else if (event.indexOf('hit by pitch') >= 0) {
        results.hitByPitch++;
    } else if (event.indexOf('error') >= 0) {
        results.rboe++;
        results.atbats++;
    } else if (event.indexOf('runner out') >= 0) {
        return;
    } else {
        results.atbats++;
    }

    results.plateAppearances++;
}

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
            'p_throws' : filter.pitcherHand
        });
    }
    if (filter.batterHand) {
        topLevelFilters.push({
            'stand' : filter.batterHand
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
        if (filter.outs['3']) {
            outs.push(3);
        }
        if (outs.length > 0) {
            topLevelFilters.push({
                'o' : {
                    '$in' : outs
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
                'start_tfs_zulu' : {
                    '$gte' : new Date(filter.date.start),
                    '$lte' : new Date(filter.date.end)
                }
            });
        } else if (filter.date.start) {
            topLevelFilters.push({
                'start_tfs_zulu' : {
                    '$gte' : new Date(filter.date.start)
                }
            });
        } else if (filter.date.end) {
            topLevelFilters.push({
                'start_tfs_zulu' : {
                    '$lt' : new Date(filter.date.end)
                }
            });
        }
    }
    query.$and = topLevelFilters;
}

/**
 * Create a query block based on the innings filter
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

        if (inning.extra && inning.length > 0) {
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
        } else if (inning.length > 0) {
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
                'pitch.on_1b' : {
                    '$exists' : true
                }
            });
        }
        if (runners.second) {
            bases.push({
                'pitch.on_2b' : {
                    '$exists' : true
                }
            });
        }
        if (runners.third) {
            bases.push({
                'pitch.on_3b' : {
                    '$exists' : true
                }
            });
        }
        if (runners.empty) {
            bases.push({
                '$and' : [ {
                    'pitch.on_1b' : {
                        '$exists' : false
                    }
                }, {
                    'pitch.on_2b' : {
                        '$exists' : false
                    }
                }, {
                    'pitch.on_3b' : {
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
