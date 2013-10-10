goog.provide('kruser.pojos.PlayerInfo');

/**
 * @class kruser.pojos.PlayerInfo
 * @classdesc the player_info object as it comes from the MLBAM APIs
 * 
 * @param {object}
 *            dataObj - the player_info data as it comes from the wire
 */
kruser.pojos.PlayerInfo = function(dataObj) {
    angular.extend(this, dataObj);
}

/**
 * @memberof kruser.pojos.PlayerInfo
 * @instance
 * @returns {string} the full name of the player
 */
kruser.pojos.Player.prototype.getFullName = function() {
    return this.first + ' ' + this.last;
}