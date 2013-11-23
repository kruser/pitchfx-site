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
        this.sacrifices = 0;
        this.rboe = 0;
    }

    /**
     * @param {*}
     *            atBat - an at bat
     */
    this.accumulateAtBat = function(atBat) {
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
        } else if (event.indexOf('intent walk') >= 0) {
            this.iWalks++;
        } else if (event.indexOf('walk') >= 0) {
            this.walks++;
        } else if (event.indexOf('sac') >= 0) {
            this.sacrifices++;
        } else if (event.indexOf('error') >= 0) {
            this.rboe++;
            this.atbats++;
        } else if (event.indexOf('runner out') >= 0) {
            return;
        } else {
            this.atbats++;
        }

        this.plateAppearances++;

        if (this.atbats) {
            this.BA = (this.singles + this.doubles + this.triples + this.homeRuns) / this.atbats;
        }
        if (this.plateAppearances) {
            this.wOBA = ((this.walks * 0.72) + (this.hitByPitch * 0.75) + (this.singles * 0.9) + (this.doubles*1.24) + (this.triples*1.56) + (this.homeRuns*1.95) + (this.rboe*0.92)) / this.plateAppearances;
        }
    }

    this.resetStats();
} ];