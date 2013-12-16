var moment = require('moment');
var extend = require('node.extend');

/**
 * @class pojos.PlayerInfo
 * @classdesc the player_info object as it comes from the MLBAM APIs
 * 
 * @param {object}
 *            dataObj - the player_info data as it comes from the wire
 */
PlayerInfo = function(dataObj) {
    extend(this, dataObj);
};

/**
 * @memberof pojos.PlayerInfo
 * @instance
 * @returns {moment} the birthday
 */
PlayerInfo.prototype.getBirthDate = function() {
    return moment(this.birth_date);
};

/**
 * @memberof pojos.PlayerInfo
 * @instance
 * @returns {moment} the mlb debut date
 */
PlayerInfo.prototype.getMlbDebut = function() {
    if (this.pro_debut_date) {
        return moment(this.pro_debut_date);
    }
    return undefined;
};

exports.PlayerInfo = PlayerInfo;