var moment = require('moment');
var MongoClient = require('mongodb').MongoClient;
var AtBat = require('../../pojos/AtBat').AtBat;
var mongoUtils = require('../../utils/mongoUtils');
var arrayUtils = require('../../utils/arrayUtils');
var statsConstantsService = require('../../services/statsConstantsService');

/**
 * These are the fields we'll pull from the DB
 */
var atbatIncludes = {
    'des': 1,
    'hip': 1,
    'runnersMovedBases': 1,
    'runnersPotentialBases': 1,
    'runner': 1,
    'event': 1,
    '_id': 0
};

/**
 * Calculate Runners Moved Indicator
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
 * Calculate Weighted On Base Average
 *
 * @param results
 */
function calcWOBA(results) {
    var coefficients = statsConstantsService.getCoefficients(results.year);
    if (results.plateAppearances) {
        results.wOBA = ((results.walks * coefficients.wBB) + (results.hitByPitch * coefficients.wHBP) + (results.singles * coefficients.w1B) + (results.doubles * coefficients.w2B) + (results.triples * coefficients.w3B) + (results.homeRuns * coefficients.wHR) + (results.rboe * 0.92)) / results.plateAppearances;
    }
}

/**
 * Calculate Weighted Runs Above Average
 *
 * @param results
 */
function calcWRAA(results) {
    var coefficients = statsConstantsService.getCoefficients(results.year);
    if (results.plateAppearances) {
        results.wRAA = ((results.wOBA - coefficients.wOBA) / coefficients.wOBAScale) * results.plateAppearances;
    }
}

/**
 * Calculate Batting Average
 *
 * @param results
 */
function calcBattingAverage(results) {
    if (results.atbats) {
        results.BA = (results.singles + results.doubles + results.triples + results.homeRuns) / results.atbats;
    }
}

/**
 * To be called when accumulation is complete.
 *
 * @param results
 */
function completeStats(results) {
    calcBattingAverage(results);
    calcWOBA(results);
    calcWRAA(results);
    calcSLG(results);
    calcOBP(results);
    calcBABIP(results);
    calcRMI(results);
}

/**
 * Accumulate AtBats
 *
 * @param {pojos.AtBat}
 *            atBat
 * @param results
 */
function accumulateAtBat(atBat, results) {
    var trajectory, field, event, i = 0;
    if (atBat.hip && atBat.hip.trajectory) {
        trajectory = atBat.hip.trajectory.toLowerCase();
        if (!results.hitBalls[trajectory]) {
            results.hitBalls[trajectory] = [];
        }
        results.hitBalls[trajectory].push([atBat.hip.x, 0 - atBat.hip.y]);

        if (!results.hitBallDistribution[trajectory]) {
            results.hitBallDistribution[trajectory] = {};
        }
        field = atBat.getField();
        if (field) {
            if (!results.hitBallDistribution[trajectory][field]) {
                results.hitBallDistribution[trajectory][field] = 1;
            } else {
                results.hitBallDistribution[trajectory][field]++;
            }
        }
    }

    results.runnersMovedBases += atBat.runnersMovedBases;
    results.runnersPotentialBases += atBat.runnersPotentialBases;

    if (atBat.runner && atBat.runner.length > 0) {
        for (i = 0; i < atBat.runner.length; i++) {
            if (atBat.runner[i].rbi === 'T') {
                results.rbi++;
            }
        }
    }

    event = atBat.event.toLowerCase();
    if (event.indexOf('single') >= 0) {
        results.singles++;
        results.atbats++;
    } else if (event === 'double') {
        results.doubles++;
        results.atbats++;
    } else if (event === 'triple') {
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
                '$or': [{
                    'inning.number': {
                        '$gt': 9
                    }
                }, {
                    'inning.number': {
                        '$in': innings
                    }
                }]
            };
        } else if (innings.length > 0) {
            return {
                'inning.number': {
                    '$in': innings
                }
            };
        } else if (inning.extra) {
            return {
                'inning.number': {
                    '$gt': 9
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
    var bases = [],
        runnerFilter = {};
    if (runners && runners.gate) {
        if (runners.first) {
            bases.push({
                'pitch.on_1b': {
                    '$exists': true
                }
            });
        }
        if (runners.second) {
            bases.push({
                'pitch.on_2b': {
                    '$exists': true
                }
            });
        }
        if (runners.third) {
            bases.push({
                'pitch.on_3b': {
                    '$exists': true
                }
            });
        }
        if (runners.empty) {
            bases.push({
                '$and': [{
                    'pitch.on_1b': {
                        '$exists': false
                    }
                }, {
                    'pitch.on_2b': {
                        '$exists': false
                    }
                }, {
                    'pitch.on_3b': {
                        '$exists': false
                    }
                }]
            });
        }
        if (bases.length > 0) {
            runnerFilter = {};
            if (runners.gate === 'OR') {
                return {
                    '$or': bases,
                };
            } else {
                return {
                    '$and': bases,
                };
            }
            return runnerFilter;
        }
    }
    return undefined;
}

/**
 * Adjusts the mongoDB query using the filter provided from the API call
 *
 * @param query
 * @param filter
 */
function adjustQueryByFilter(query, filter) {

    var topLevelFilters = [],
        gameTypes = [];
    if (filter.pitcherHand) {
        topLevelFilters.push({
            'p_throws': filter.pitcherHand
        });
    }
    if (filter.batterHand) {
        topLevelFilters.push({
            'stand': filter.batterHand
        });
    }

    arrayUtils.pushIfExists(topLevelFilters, mongoUtils.buildInFilter(filter.outs, 'o_start'));
    arrayUtils.pushIfExists(topLevelFilters, mongoUtils.buildInFilter(filter.balls, 'b'));
    arrayUtils.pushIfExists(topLevelFilters, mongoUtils.buildInFilter(filter.strikes, 's'));

    if (filter.gameType) {
        gameTypes = [];
        if (filter.gameType.S) {
            gameTypes.push('S');
        }
        if (filter.gameType.R) {
            gameTypes.push('R');
        }
        if (filter.gameType.P) {
            gameTypes.push('D');
            gameTypes.push('L');
            gameTypes.push('W');
        }
        if (gameTypes.length > 0) {
            topLevelFilters.push({
                'game.game_type': {
                    '$in': gameTypes
                }
            });
        }
    }

    arrayUtils.pushIfExists(topLevelFilters, buildInningQuery(filter.inning));
    arrayUtils.pushIfExists(topLevelFilters, buildRunnersQuery(filter.runners));

    if (filter.date) {
        if (filter.date.start && filter.date.end) {
            topLevelFilters.push({
                'start_tfs_zulu': {
                    '$gte': new Date(filter.date.start),
                    '$lte': new Date(filter.date.end)
                }
            });
        } else if (filter.date.start) {
            topLevelFilters.push({
                'start_tfs_zulu': {
                    '$gte': new Date(filter.date.start)
                }
            });
        } else if (filter.date.end) {
            topLevelFilters.push({
                'start_tfs_zulu': {
                    '$lt': new Date(filter.date.end)
                }
            });
        }
    }
    query.$and = topLevelFilters;
}

/**
 * calculate the results based on the raw mongo results
 *
 * @param docs
 * @returns {*} results
 */
function calculateResults(docs, statsYear) {
    var results = {
        year: statsYear,
        BA: 0.0,
        wOBA: 0.0,
        singles: 0,
        doubles: 0,
        triples: 0,
        homeRuns: 0,
        atbats: 0,
        plateAppearances: 0,
        iWalks: 0,
        walks: 0,
        rbi: 0,
        hitByPitch: 0,
        sacBunts: 0,
        sacFlies: 0,
        strikeouts: 0,
        rboe: 0,
        runnersPotentialBases: 0,
        runnersMovedBases: 0,
        hitBalls: {},
        hitBallDistribution: {},
    }, i = 0,
        atbatDoc;
    if (docs) {
        for (i = 0; i < docs.length; i++) {
            atbatDoc = new AtBat(docs[i]);
            accumulateAtBat(atbatDoc, results);
        }
    }
    completeStats(results);

    return results;
}

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
    var filter = JSON.parse(req.query.filter),
        playerId = parseInt(req.params.playerId, 10),
        query = {},
        statsYear = moment().year();
    if (filter.playerCard === 'batter') {
        query.batter = playerId;
    } else {
        query.pitcher = playerId;
    }
    if (filter.date && filter.date.end) {
        statsYear = moment(filter.date.end).year();
    }

    adjustQueryByFilter(query, filter);

    console.log(JSON.stringify(query, null, 4));

    MongoClient.connect("mongodb://localhost:27017/mlbatbat", function(err, db) {
        db.collection('atbats').find(query, atbatIncludes).toArray(function(err, docs) {
            res.json(calculateResults(docs, statsYear));
            db.close();
        });
    });
};
