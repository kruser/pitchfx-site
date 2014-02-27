var yearlyCoefficients = {
    '2014': {
        'wOBA': 0.314,
        'wOBAScale': 1.277,
        'wBB': 0.690,
        'wHBP': 0.722,
        'w1B': 0.888,
        'w2B': 1.271,
        'w3B': 1.616,
        'wHR': 2.101,
        'runSB': 0.200,
        'runCS': -0.384,
        'RperPA': 0.110,
        'RperW': 9.264,
        'cFIP': 3.048
    },
    '2013': {
        'wOBA': 0.314,
        'wOBAScale': 1.277,
        'wBB': 0.690,
        'wHBP': 0.722,
        'w1B': 0.888,
        'w2B': 1.271,
        'w3B': 1.616,
        'wHR': 2.101,
        'runSB': 0.200,
        'runCS': -0.384,
        'RperPA': 0.110,
        'RperW': 9.264,
        'cFIP': 3.048
    },
    '2012': {
        'wOBA': 0.315,
        'wOBAScale': 1.245,
        'wBB': 0.691,
        'wHBP': 0.722,
        'w1B': 0.884,
        'w2B': 1.257,
        'w3B': 1.593,
        'wHR': 2.058,
        'runSB': 0.200,
        'runCS': -0.398,
        'RperPA': 0.114,
        'RperW': 9.544,
        'cFIP': 3.095
    },
    '2011': {
        'wOBA': 0.316,
        'wOBAScale': 1.264,
        'wBB': 0.694,
        'wHBP': 0.726,
        'w1B': 0.890,
        'w2B': 1.270,
        'w3B': 1.611,
        'wHR': 2.086,
        'runSB': 0.200,
        'runCS': -0.394,
        'RperPA': 0.112,
        'RperW': 9.454,
        'cFIP': 3.025
    },
    '2010': {
        'wOBA': 0.321,
        'wOBAScale': 1.251,
        'wBB': 0.701,
        'wHBP': 0.732,
        'w1B': 0.895,
        'w2B': 1.270,
        'w3B': 1.608,
        'wHR': 2.072,
        'runSB': 0.200,
        'runCS': -0.403,
        'RperPA': 0.115,
        'RperW': 9.643,
        'cFIP': 3.079
    },
    '2009': {
        'wOBA': 0.329,
        'wOBAScale': 1.210,
        'wBB': 0.707,
        'wHBP': 0.737,
        'w1B': 0.895,
        'w2B': 1.258,
        'w3B': 1.585,
        'wHR': 2.023,
        'runSB': 0.200,
        'runCS': -0.420,
        'RperPA': 0.120,
        'RperW': 9.994,
        'cFIP': 3.097
    },
    '2008': {
        'wOBA': 0.328,
        'wOBAScale': 1.211,
        'wBB': 0.708,
        'wHBP': 0.739,
        'w1B': 0.896,
        'w2B': 1.259,
        'w3B': 1.587,
        'wHR': 2.024,
        'runSB': 0.200,
        'runCS': -0.422,
        'RperPA': 0.120,
        'RperW': 10.032,
        'cFIP': 3.132
    },
    '2007': {
        'wOBA': 0.331,
        'wOBAScale': 1.192,
        'wBB': 0.711,
        'wHBP': 0.741,
        'w1B': 0.896,
        'w2B': 1.253,
        'w3B': 1.575,
        'wHR': 1.999,
        'runSB': 0.200,
        'runCS': -0.433,
        'RperPA': 0.124,
        'RperW': 10.250,
        'cFIP': 3.240
    }
};

/**
 * @param {Moment}
 *            statsYear - the year of the stats
 * @returns {Array} coefficients Source: http://www.fangraphs.com/guts.aspx
 */
exports.getCoefficients = function(statsYear) {
    return yearlyCoefficients[statsYear];
};
