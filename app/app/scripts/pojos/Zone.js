var pitchfx = pitchfx || {};

/**
 * @class pitchfx.Zone
 * @classdesc a single zone represents a collection of pitches that live within
 *            the same square area as they crossed the plate.
 */
pitchfx.Zone = function()
{
    this.pitches = [];
};

/**
 * @param {pitchfx.Pitch}
 *            pitch - the pitch to add to the zone
 */
pitchfx.Zone.prototype.addPitch = function(pitch)
{
    this.pitches.push(pitch);
};

/**
 * Get the whiff rate across all pitches in this zone
 * 
 * @returns {Number}
 */
pitchfx.Zone.prototype.getWhiffsPerSwing = function()
{
    return 0.0;
};

/**
 * Get the swing rate across all pitches in this zone
 * 
 * @returns {Number}
 */
pitchfx.Zone.prototype.getSwingRate = function()
{
    return 0.0;
};