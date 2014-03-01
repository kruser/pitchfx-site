'use strict';

describe('POJO: Pitch', function() {
    it('Test pitch display names', function() {
        var p = pitchfx.Pitch;
        expect(p.getPitchDisplayName('FA')).toBe('Fastball');
        expect(p.getPitchDisplayName('FF')).toBe('4-seam');
        expect(p.getPitchDisplayName('FT')).toBe('2-seam');
        expect(p.getPitchDisplayName('FC')).toBe('Cutter');
        expect(p.getPitchDisplayName('FS')).toBe('Splitter');
        expect(p.getPitchDisplayName('SI')).toBe('Sinker');
        expect(p.getPitchDisplayName('SL')).toBe('Slider');
        expect(p.getPitchDisplayName('CU')).toBe('Curve');
        expect(p.getPitchDisplayName('KC')).toBe('Knuck-Curve');
        expect(p.getPitchDisplayName('EP')).toBe('Ephuus');
        expect(p.getPitchDisplayName('CH')).toBe('Change');
        expect(p.getPitchDisplayName('SC')).toBe('Screwball');
        expect(p.getPitchDisplayName('KN')).toBe('Knuckleball');
        expect(p.getPitchDisplayName('UN')).toBe('Unknown');
    });

    it('Test a ball', function() {
        var pitch = new pitchfx.Pitch({
            "atbat" : {
                "des" : "Josmil Pinto doubles (1) on a line drive to left fielder Jim Adduci.   Clete Thomas scores.  "
            },
            "px" : -0.44,
            "type" : "B",
            "des" : "Ball",
            "pz" : 4.735,
            "start_speed" : 89.4,
            "pitch_type" : "FC"
        });
        expect(pitch.isBall()).toBe(true);
        expect(pitch.isSwing()).toBe(false);
        expect(pitch.isWhiff()).toBe(false);
        expect(pitch.isHit()).toBe(false);
        expect(pitch.isBallInPlay()).toBe(false);
        expect(pitch.isFoul()).toBe(false);
        expect(pitch.getWeightedObaValue()).toBe(undefined);
        expect(pitch.getHipTrajectory()).toBe('');
    });

    it('Test a double', function() {
        var pitch = new pitchfx.Pitch({
            "hip" : {
                "des" : "Double"
            },
            "atbat" : {
                "des" : "Josmil Pinto doubles (1) on a line drive to left fielder Jim Adduci.   Clete Thomas scores.  "
            },
            "px" : -0.107,
            "type" : "X",
            "des" : "In play, run(s)",
            "pz" : 3.364,
            "start_speed" : 70,
            "pitch_type" : "CU"
        });
        expect(pitch.isBall()).toBe(false);
        expect(pitch.isSwing()).toBe(true);
        expect(pitch.isWhiff()).toBe(false);
        expect(pitch.isHit()).toBe(true);
        expect(pitch.isBallInPlay()).toBe(true);
        expect(pitch.isFoul()).toBe(false);
        expect(pitch.getWeightedObaValue()).toBe(1.24);
        expect(pitch.getHipTrajectory()).toBe('liner');
        expect(pitch.getPitchType()).toBe('CU');
    });

    it('Test a groundout', function() {
        var pitch = new pitchfx.Pitch({
            "hip" : {
                "des" : "Groundout"
            },
            "atbat" : {
                "des" : "Josmil Pinto grounds out, shortstop Jurickson Profar to first baseman Mitch Moreland.  "
            },
            "px" : 0.187,
            "type" : "X",
            "des" : "In play, out(s)",
            "pz" : 0.92,
            "start_speed" : 80.1,
            "pitch_type" : "CH"
        });
        expect(pitch.isBall()).toBe(false);
        expect(pitch.isSwing()).toBe(true);
        expect(pitch.isWhiff()).toBe(false);
        expect(pitch.isHit()).toBe(false);
        expect(pitch.isBallInPlay()).toBe(true);
        expect(pitch.isFoul()).toBe(false);
        expect(pitch.getWeightedObaValue()).toBe(undefined);
        expect(pitch.getHipTrajectory()).toBe('grounder');
        expect(pitch.getPitchType()).toBe('CH');
    });
});