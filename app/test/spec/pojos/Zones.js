'use strict';

describe('POJO: Zones', function()
{
    it('Test creation of zones', function()
    {
        var zones = new pitchfx.Zones();
        expect(zones.pitchZones[2][3] instanceof pitchfx.Zone).toBe(true);
    });

    it('Test a ball in the strike zone', function()
    {
        var pitch = new pitchfx.Pitch({
            "atbat" : {
                "des" : "Josmil Pinto doubles (1) on a line drive to left fielder Jim Adduci.   Clete Thomas scores.  "
            },
            "px" : 0,
            "type" : "B",
            "des" : "Ball",
            "pz" : 2.5,
            "start_speed" : 89.4,
            "pitch_type" : "FC"
        }), zones = new pitchfx.Zones();
        zones.addPitch(pitch);
        expect(zones.pitchZones[5][5].pitches.length).toBe(1);
        expect(zones.pitchZones[4][0].pitches.length).toBe(0);
    });

    it('Test a far outside ball', function()
    {
        var pitch = new pitchfx.Pitch({
            "atbat" : {
                "des" : "Josmil Pinto doubles (1) on a line drive to left fielder Jim Adduci.   Clete Thomas scores.  "
            },
            "px" : 2.44,
            "type" : "B",
            "des" : "Ball",
            "pz" : 4.735,
            "start_speed" : 89.4,
            "pitch_type" : "FC"
        }), zones = new pitchfx.Zones();
        zones.addPitch(pitch);
        expect(zones.pitchZones[9][9].pitches.length).toBe(1);
    });

    it('Test a far inside ball', function()
    {
        var pitch = new pitchfx.Pitch({
            "atbat" : {
                "des" : "Josmil Pinto doubles (1) on a line drive to left fielder Jim Adduci.   Clete Thomas scores.  "
            },
            "px" : -2.44,
            "type" : "B",
            "des" : "Ball",
            "pz" : 4.735,
            "start_speed" : 89.4,
            "pitch_type" : "FC"
        }), zones = new pitchfx.Zones();
        zones.addPitch(pitch);
        expect(zones.pitchZones[0][9].pitches.length).toBe(1);
    });

    it('Test a ball in the dirt', function()
    {
        var pitch = new pitchfx.Pitch({
            "atbat" : {
                "des" : "Josmil Pinto doubles (1) on a line drive to left fielder Jim Adduci.   Clete Thomas scores.  "
            },
            "px" : 0,
            "type" : "B",
            "des" : "Ball",
            "pz" : 0,
            "start_speed" : 89.4,
            "pitch_type" : "FC"
        }), zones = new pitchfx.Zones();
        zones.addPitch(pitch);
        expect(zones.pitchZones[5][0].pitches.length).toBe(1);
    });

    it('Test multiple balls', function()
    {
        var zones = new pitchfx.Zones();

        zones.addPitch(new pitchfx.Pitch({
            "px" : 0,
            "pz" : 0,
        }));
        zones.addPitch(new pitchfx.Pitch({
            "px" : 0,
            "pz" : 0,
        }));
        expect(zones.pitchZones[5][0].pitches.length).toBe(2);
        expect(zones.pitchZones[0][0].pitches.length).toBe(0);
    });
});
