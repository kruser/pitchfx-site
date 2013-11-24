var services = services || {};

/**
 * An AngularJS service with stat aggregator functions
 */
services.statsService = [ '$log', function($log) {
    "use strict";

    /**
     * Reset the stats know to this controller
     */
    this.resetStats = function() {
        this.BA = 0.0;
        this.wOBA = 0.0;

        this.singles = 0;
        this.doubles = 0;
        this.triples = 0;
        this.homeRuns = 0;
        this.atbats = 0;
        this.plateAppearances = 0;
        this.iWalks = 0;
        this.walks = 0;
        this.hitByPitch = 0;
        this.sacBunts = 0;
        this.sacFlies = 0;
        this.strikeouts = 0;
        this.rboe = 0;
        this.runnersPotentialBases = 0;
        this.runnersMovedBases = 0;
    }

    /**
     * To be called when accumulation is complete.
     */
    this.completeStats = function() {
        this.calcBattingAverage();
        this.calcWOBA();
        this.calcSLG();
        this.calcOBP();
        this.calcBABIP();
        this.calcRMI();
    }
    
    /**
     * Calculates Runners Moved Indicator
     */
    this.calcRMI = function() {
        if (this.atbats) {
            this.rmi = this.runnersMovedBases / this.runnersPotentialBases;
        }
    }

    /**
     * Calculate Batting Average on Balls in Play
     */
    this.calcBABIP = function() {
        if (this.atbats) {
            this.babip = (this.singles + this.doubles + this.triples) / (this.atbats - this.strikeouts - this.homeRuns + this.sacFlies);
        }
    }

    /**
     * Calculate On Base Percentage
     */
    this.calcOBP = function() {
        if (this.atbats) {
            this.obp = (this.singles + this.doubles + this.triples + this.homeRuns + this.hitByPitch + this.walks + this.iWalks) / (this.atbats + this.walks + this.iWalks + this.hitByPitch);
        }
    }

    /**
     * Calculate Slugging Percentage
     */
    this.calcSLG = function() {
        if (this.atbats) {
            this.slg = (this.singles + (this.doubles * 2) + (this.triples * 3) + (this.homeRuns * 4)) / this.atbats;
        }
    }

    /**
     * Weighted OBA calculation
     */
    this.calcWOBA = function() {
        if (this.plateAppearances) {
            this.wOBA = ((this.walks * 0.72) + (this.hitByPitch * 0.75) + (this.singles * 0.9) + (this.doubles * 1.24) + (this.triples * 1.56) + (this.homeRuns * 1.95) + (this.rboe * 0.92)) / this.plateAppearances;
        }
    }

    /**
     * Batting average calculation
     */
    this.calcBattingAverage = function() {
        if (this.atbats) {
            this.BA = (this.singles + this.doubles + this.triples + this.homeRuns) / this.atbats;
        }
    }

    /**
     * @param {*}
     *            atBat - an at bat
     */
    this.accumulateAtBat = function(atBat) {
        this.runnersMovedBases += atBat.runnersMovedBases;
        this.runnersPotentialBases += atBat.runnersPotentialBases;
        
        var event = atBat.event.toLowerCase();
        if (event.indexOf('single') >= 0) {
            this.singles++;
            this.atbats++;
        } else if (event.indexOf('double') >= 0) {
            this.doubles++;
            this.atbats++;
        } else if (event.indexOf('triple') >= 0) {
            this.triples++;
            this.atbats++;
        } else if (event.indexOf('home') >= 0) {
            this.homeRuns++;
            this.atbats++;
        } else if (event.indexOf('strikeout') >= 0) {
            this.strikeouts++;
            this.atbats++;
        } else if (event.indexOf('intent walk') >= 0) {
            this.iWalks++;
        } else if (event.indexOf('walk') >= 0) {
            this.walks++;
        } else if (event.indexOf('sac bunt') >= 0) {
            this.sacBunts++;
        } else if (event.indexOf('sac fly') >= 0) {
            this.sacFlies++;
        } else if (event.indexOf('hit by pitch') >= 0) {
            this.hitByPitch++;
        } else if (event.indexOf('error') >= 0) {
            this.rboe++;
            this.atbats++;
        } else if (event.indexOf('runner out') >= 0) {
            return;
        } else {
            this.atbats++;
        }

        this.plateAppearances++;
    }

    this.resetStats();
} ];