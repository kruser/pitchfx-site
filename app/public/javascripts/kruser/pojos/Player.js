goog.provide('kruser.pojos.Player');

/**
 * @class kruser.pojos.Player
 * @classdesc a player object identifies
 * 
 * @param {object}
 *            dataObj - the player data as it comes from the wire
 */
kruser.pojos.Player = function(dataObj) {
    angular.extend(this, dataObj);
}

/**
 * @memberof kruser.pojos.Player
 * @instance
 * @returns {string} the full name of the player
 */
kruser.pojos.Player.prototype.getFullName = function() {
    return this.first + ' ' + this.last;
}