var extend = require('node.extend'),
    pitchfx = pitchfx || {};

/**
 * @class pojos.AtBat
 * @classdesc an object as it is stored in the 'atbat' collection
 *
 * @param {object}
 *            dataObj - the data object from the mongo collection
 */
pitchfx.AtBat = function(dataObj) {
    extend(this, dataObj);
};

/**
 * @memberof pojos.AtBat
 * @instance
 * @returns {moment} one of {L|C|R} or undefined if the atbat didn't result in a
 *          hit ball. Note that foul ball outs may not be accurate if they're
 *          behind the plate.
 */
pitchfx.AtBat.prototype.getField = function() {
    if (this.hip && typeof this.hip.angle !== 'undefined') {
        if (this.hip.angle < 75) {
            return 'L';
        } else if (this.hip.angle > 105) {
            return 'R';
        } else {
            return 'C';
        }
    }
    return undefined;
};

exports.AtBat = pitchfx.AtBat;
