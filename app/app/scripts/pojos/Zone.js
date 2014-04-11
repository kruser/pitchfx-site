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
 * Get the wOBA value across all balls in play in this zone
 *
 * @returns {pitchfx.ZoneStat}
 */
pitchfx.Zone.prototype.getWOBA = function()
{
    var bip = 0,
        wobavalue = 0,
        val = 0;

    angular.forEach(this.pitches, function(pitch)
    {
        if (pitch.getWeightedObaValue())
        {
            wobavalue += pitch.getWeightedObaValue(pitch);
        }
        if (pitch.isBallInPlay())
        {
            bip++;
        }
    });
    if (bip === 0)
    {
        return new pitchfx.ZoneStat(0, '0.000 (0 BIP)');
    }

    val = wobavalue / bip;
    return new pitchfx.ZoneStat(val, val.toFixed(3) + ' (' + bip + ' BIP)');
};

/**
 * Get the batting average on balls in play across all hit pitches in this zone
 *
 * @returns {Number}
 */
pitchfx.Zone.prototype.getBABIP = function()
{
    var hits = 0,
        bip = 0,
        val = 0;

    angular.forEach(this.pitches, function(pitch)
    {
        if (!pitch.isHomeRun())
        {
            if (pitch.isHit())
            {
                hits++;
            }
            if (pitch.isBallInPlay())
            {
                bip++;
            }
        }

    });
    if (bip === 0)
    {
        return new pitchfx.ZoneStat(0, '0% (0/0)');
    }
    val = hits / bip;
    return new pitchfx.ZoneStat(val, val.toFixed(3) + ' (' + hits + '/' + bip + ')');
};

/**
 * Get the balls in play rate across all pitches in this zone
 *
 * @returns {Number}
 */
pitchfx.Zone.prototype.getBIPRate = function()
{
    var pitches = this.pitches.length,
        bip = 0,
        val = 0;

    angular.forEach(this.pitches, function(pitch)
    {
        if (pitch.isBallInPlay())
        {
            bip++;
        }
    });
    if (pitches === 0)
    {
        return new pitchfx.ZoneStat(0, '0% (0/0)');
    }

    val = bip / pitches;
    return new pitchfx.ZoneStat(val, (val * 100).toFixed(0) + '% (' + bip + '/' + pitches + ')');
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
 * Get the whiff rate for this zone
 *
 * @returns {pitchfx.ZoneStat}
 */
pitchfx.Zone.prototype.getCalledStrikeRate = function()
{
    var pitches = this.pitches.length,
        calledstrikes = 0,
        val = 0;
    if (pitches === 0)
    {
        return new pitchfx.ZoneStat(0, '0% (0/0)');
    }

    angular.forEach(this.pitches, function(pitch)
    {
        if (!pitch.isSwing() && !pitch.isBall())
        {
            calledstrikes++;
        }
    });

    val = calledstrikes / pitches;
    return new pitchfx.ZoneStat(val, (val * 100).toFixed(0) + '% (' + calledstrikes + '/' + pitches + ')');
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
