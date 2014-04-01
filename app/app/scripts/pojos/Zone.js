var pitchfx = pitchfx ||
{};

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
pitchfx.Zone.prototype.getWhiffsPerSwingRate = function()
{
    var whiffs = 0,
        swings = 0,
        val = 0;

    angular.forEach(this.pitches, function(pitch)
    {
        if (pitch.isSwing())
        {
            swings++;
        }
        if (pitch.isWhiff())
        {
            whiffs++;
        }
    });
    if (swings === 0)
    {
        return new pitchfx.ZoneStat(0, '0% (0/0)');
    }
    val = whiffs / swings;
    return new pitchfx.ZoneStat(val, (val * 100).toFixed(0) + '% (' + whiffs + '/' + swings + ')');
};

/**
 * Get the whiff rate for this zone
 *
 * @returns {pitchfx.ZoneStat}
 */
pitchfx.Zone.prototype.getWhiffRate = function()
{
    var pitches = this.pitches.length,
        whiffs = 0,
        val = 0;
    if (pitches === 0)
    {
        return new pitchfx.ZoneStat(0, '0% (0/0)');
    }

    angular.forEach(this.pitches, function(pitch)
    {
        if (pitch.isWhiff())
        {
            whiffs++;
        }
    });

    val = whiffs / pitches;
    return new pitchfx.ZoneStat(val, (val * 100).toFixed(0) + '% (' + whiffs + '/' + pitches + ')');
};

/**
 * Get the swing rate across all pitches in this zone
 *
 * @returns {Number}
 */
pitchfx.Zone.prototype.getSwingRate = function()
{
    var pitches = this.pitches.length,
        swings = 0,
        val = 0;
    if (pitches === 0)
    {
        return new pitchfx.ZoneStat(0, '0% (0/0)');
    }

    angular.forEach(this.pitches, function(pitch)
    {
        if (pitch.isSwing())
        {
            swings++;
        }
    });

    val = swings / pitches;
    return new pitchfx.ZoneStat(val, (val * 100).toFixed(0) + '% (' + swings + '/' + pitches + ')');
};

/**
 * Get the rate of a certain trajectory to balls-in-play
 * @param {string} trajectory - one of (grounder|popup|liner|flyball)
 * @returns {pitchfx.ZoneStat}
 */
pitchfx.Zone.prototype.getTrajectoryRate = function(trajectory)
{
    var bip = 0,
        trajectoryType = 0,
        val = 0;

    angular.forEach(this.pitches, function(pitch)
    {
        if (pitch.isBallInPlay())
        {
            bip++;
        }
        if (pitch.getHipTrajectory() === trajectory)
        {
            trajectoryType++;
        }
    });

    if (bip === 0)
    {
        return new pitchfx.ZoneStat(0, '0% (0/0)');
    }

    val = trajectoryType / bip;
    return new pitchfx.ZoneStat(val, (val * 100).toFixed(0) + '% (' + trajectoryType + '/' + bip + ')');
};
