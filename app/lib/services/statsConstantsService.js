/**
 * @param {Moment} start - starting date
 * @param {Moment} end - ending date
 * @returns {Array} coefficients
 * Source: http://www.fangraphs.com/guts.aspx
 */
exports.getCoefficients = function(statsYear) {
    var yearlyCoefficients = {
        '2014' : {
            'wOBA':.314,
            'wOBAScale':1.277,
            'wBB':.690,
            'wHBP':.722,
            'w1B':.888,
            'w2B':1.271,
            'w3B':1.616,
            'wHR':2.101,
            'runSB':.200,
            'runCS':-.384,
            'RperPA':.110,
            'RperW':9.264,
            'cFIP':3.048
        },
        '2013' : {
            'wOBA' : .314,
            'wOBAScale' : 1.277,
            'wBB' : .690,
            'wHBP' : .722,
            'w1B' : .888,
            'w2B' : 1.271,
            'w3B' : 1.616,
            'wHR' : 2.101,
            'runSB' : .200,
            'runCS' : -.384,
            'RperPA' : .110,
            'RperW' : 9.264,
            'cFIP' : 3.048
        },
        '2012' : {
            'wOBA' : .315,
            'wOBAScale' : 1.245,
            'wBB' : .691,
            'wHBP' : .722,
            'w1B' : .884,
            'w2B' : 1.257,
            'w3B' : 1.593,
            'wHR' : 2.058,
            'runSB' : .200,
            'runCS' : -.398,
            'RperPA' : .114,
            'RperW' : 9.544,
            'cFIP' : 3.095
        },
        '2011' : {
            'wOBA' : .316,
            'wOBAScale' : 1.264,
            'wBB' : .694,
            'wHBP' : .726,
            'w1B' : .890,
            'w2B' : 1.270,
            'w3B' : 1.611,
            'wHR' : 2.086,
            'runSB' : .200,
            'runCS' : -.394,
            'RperPA' : .112,
            'RperW' : 9.454,
            'cFIP' : 3.025
        },
        '2010' : {
            'wOBA' : .321,
            'wOBAScale' : 1.251,
            'wBB' : .701,
            'wHBP' : .732,
            'w1B' : .895,
            'w2B' : 1.270,
            'w3B' : 1.608,
            'wHR' : 2.072,
            'runSB' : .200,
            'runCS' : -.403,
            'RperPA' : .115,
            'RperW' : 9.643,
            'cFIP' : 3.079
        },
        '2009' : {
            'wOBA' : .329,
            'wOBAScale' : 1.210,
            'wBB' : .707,
            'wHBP' : .737,
            'w1B' : .895,
            'w2B' : 1.258,
            'w3B' : 1.585,
            'wHR' : 2.023,
            'runSB' : .200,
            'runCS' : -.420,
            'RperPA' : .120,
            'RperW' : 9.994,
            'cFIP' : 3.097
        },
        '2008' : {
            'wOBA' : .328,
            'wOBAScale' : 1.211,
            'wBB' : .708,
            'wHBP' : .739,
            'w1B' : .896,
            'w2B' : 1.259,
            'w3B' : 1.587,
            'wHR' : 2.024,
            'runSB' : .200,
            'runCS' : -.422,
            'RperPA' : .120,
            'RperW' : 10.032,
            'cFIP' : 3.132
        },
        '2007' : {
            'wOBA' : .331,
            'wOBAScale' : 1.192,
            'wBB' : .711,
            'wHBP' : .741,
            'w1B' : .896,
            'w2B' : 1.253,
            'w3B' : 1.575,
            'wHR' : 1.999,
            'runSB' : .200,
            'runCS' : -.433,
            'RperPA' : .124,
            'RperW' : 10.250,
            'cFIP' : 3.240
        }
    }
    return yearlyCoefficients[statsYear];
};