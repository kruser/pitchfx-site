var pojos = pojos || {};

/**
 * @class pojos.Player
 * @classdesc a player object identifies
 * 
 * @param {object}
 *            dataObj - the player data as it comes from the wire
 */
pojos.Player = function(dataObj) {
    angular.extend(this, dataObj);
}

/**
 * @memberof pojos.Player
 * @instance
 * @returns {string} the full name of the player
 */
pojos.Player.prototype.getFullName = function() {
    return this.first + ' ' + this.last;
}