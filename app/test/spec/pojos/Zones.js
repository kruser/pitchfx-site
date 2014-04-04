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
        var pitch = new pitchfx.Pitch(
        {
            "atbat":
            {
                "des": "Josmil Pinto doubles (1) on a line drive to left fielder Jim Adduci.   Clete Thomas scores.  "
            },
            "px": 0,
            "type": "B",
            "des": "Ball",
            "pz": 2.5,
            "start_speed": 89.4,
            "pitch_type": "FC"
        }),
            zones = new pitchfx.Zones();
        zones.addPitch(pitch);
        expect(zones.pitchZones[5][5].pitches.length).toBe(1);
        expect(zones.pitchZones[4][0].pitches.length).toBe(0);
    });

    it('Test a far outside ball', function()
    {
        var pitch = new pitchfx.Pitch(
        {
            "atbat":
            {
                "des": "Josmil Pinto doubles (1) on a line drive to left fielder Jim Adduci.   Clete Thomas scores.  "
            },
            "px": 2.44,
            "type": "B",
            "des": "Ball",
            "pz": 4.735,
            "start_speed": 89.4,
            "pitch_type": "FC"
        }),
            zones = new pitchfx.Zones();
        zones.addPitch(pitch);
        expect(zones.pitchZones[9][9].pitches.length).toBe(1);
    });

    it('Test a far inside ball', function()
    {
        var pitch = new pitchfx.Pitch(
        {
            "atbat":
            {
                "des": "Josmil Pinto doubles (1) on a line drive to left fielder Jim Adduci.   Clete Thomas scores.  "
            },
            "px": -2.44,
            "type": "B",
            "des": "Ball",
            "pz": 4.735,
            "start_speed": 89.4,
            "pitch_type": "FC"
        }),
            zones = new pitchfx.Zones();
        zones.addPitch(pitch);
        expect(zones.pitchZones[0][9].pitches.length).toBe(1);
    });

    it('Test a ball in the dirt', function()
    {
        var pitch = new pitchfx.Pitch(
        {
            "atbat":
            {
                "des": "Josmil Pinto doubles (1) on a line drive to left fielder Jim Adduci.   Clete Thomas scores.  "
            },
            "px": 0,
            "type": "B",
            "des": "Ball",
            "pz": 0,
            "start_speed": 89.4,
            "pitch_type": "FC"
        }),
            zones = new pitchfx.Zones();
        zones.addPitch(pitch);
        expect(zones.pitchZones[5][0].pitches.length).toBe(1);
    });

    it('Test multiple balls', function()
    {
        var zones = new pitchfx.Zones();

        zones.addPitch(new pitchfx.Pitch(
        {
            "px": 0,
            "pz": 0,
        }));
        zones.addPitch(new pitchfx.Pitch(
        {
            "px": 0,
            "pz": 0,
        }));
        expect(zones.pitchZones[5][0].pitches.length).toBe(2);
        expect(zones.pitchZones[0][0].pitches.length).toBe(0);
    });

    it('Test swing rate functions', function()
    {
        var zones = new pitchfx.Zones(),
            pitches = [
            {
                "atbat":
                {
                    "des": "Josmil Pinto grounds out, shortstop Jurickson Profar to first baseman Mitch Moreland.  "
                },
                "px": 0,
                "type": "S",
                "des": "Called Strike",
                "pz": 2.5,
                "start_speed": 84.5,
                "pitch_type": "CH"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto grounds out, shortstop Jurickson Profar to first baseman Mitch Moreland.  "
                },
                "px": 0,
                "type": "B",
                "des": "Ball",
                "pz": 2.5,
                "start_speed": 79,
                "pitch_type": "CH"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto grounds out, shortstop Jurickson Profar to first baseman Mitch Moreland.  "
                },
                "px": 0,
                "type": "S",
                "des": "Called Strike",
                "pz": 2.5,
                "start_speed": 80,
                "pitch_type": "CH"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto grounds out, shortstop Jurickson Profar to first baseman Mitch Moreland.  "
                },
                "px": 0,
                "type": "B",
                "des": "Ball",
                "pz": 2.5,
                "start_speed": 71.3,
                "pitch_type": "CU"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto grounds out, shortstop Jurickson Profar to first baseman Mitch Moreland.  "
                },
                "px": 0,
                "type": "S",
                "des": "Foul",
                "pz": 2.5,
                "start_speed": 88.1,
                "pitch_type": "FT"
            }],
            swingRates;

        angular.forEach(pitches, function(pitch)
        {
            zones.addPitch(new pitchfx.Pitch(pitch));
        });
        swingRates = zones.getSwingRates();
        expect(swingRates[0][0].stat).toBe(0);
        expect(swingRates[9][9].stat).toBe(0);
        expect(swingRates[5][5].stat).toBe(0.2);
    });

    it('Test whiff/swing rate functions', function()
    {
        var zones = new pitchfx.Zones(),
            pitches = [
            {
                "atbat":
                {
                    "des": "Josmil Pinto grounds out, shortstop Jurickson Profar to first baseman Mitch Moreland.  "
                },
                "des": "In play, out(s)",
                "hip":
                {
                    "des": "Groundout"
                },
                "pitch_type": "CH",
                "px": 0,
                "pz": 2.5,
                "start_speed": 80.1,
                "type": "X"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto doubles (1) on a line drive to left fielder Jim Adduci.   Clete Thomas scores.  "
                },
                "px": 0,
                "type": "B",
                "des": "Ball",
                "pz": 2.5,
                "start_speed": 78.2,
                "pitch_type": "CH"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto doubles (1) on a line drive to left fielder Jim Adduci.   Clete Thomas scores.  "
                },
                "px": 0,
                "type": "B",
                "des": "Ball",
                "pz": 2.5,
                "start_speed": 80,
                "pitch_type": "CH"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto doubles (1) on a line drive to left fielder Jim Adduci.   Clete Thomas scores.  "
                },
                "px": 0,
                "type": "B",
                "des": "Ball",
                "pz": 2.5,
                "start_speed": 89.4,
                "pitch_type": "FC"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto doubles (1) on a line drive to left fielder Jim Adduci.   Clete Thomas scores.  "
                },
                "px": 0,
                "type": "S",
                "des": "Called Strike",
                "pz": 2.5,
                "start_speed": 72.5,
                "pitch_type": "CU"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto doubles (1) on a line drive to left fielder Jim Adduci.   Clete Thomas scores.  "
                },
                "px": 0,
                "type": "S",
                "des": "Foul",
                "pz": 2.5,
                "start_speed": 81.2,
                "pitch_type": "CH"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto doubles (1) on a line drive to left fielder Jim Adduci.   Clete Thomas scores.  "
                },
                "des": "In play, run(s)",
                "hip":
                {
                    "des": "Double"
                },
                "pitch_type": "CU",
                "px": 0,
                "pz": 2.5,
                "start_speed": 70,
                "type": "X"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto strikes out swinging.  "
                },
                "px": 0,
                "type": "S",
                "des": "Called Strike",
                "pz": 2.5,
                "start_speed": 91.2,
                "pitch_type": "SI"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto strikes out swinging.  "
                },
                "px": 0,
                "type": "S",
                "des": "Swinging Strike",
                "pz": 2.5,
                "start_speed": 83.2,
                "pitch_type": "CH"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto strikes out swinging.  "
                },
                "px": 0,
                "type": "S",
                "des": "Foul",
                "pz": 2.5,
                "start_speed": 84.1,
                "pitch_type": "CH"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto strikes out swinging.  "
                },
                "px": 0,
                "type": "S",
                "des": "Swinging Strike (Blocked)",
                "pz": 2.5,
                "start_speed": 84.2,
                "pitch_type": "CH"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto singles on a line drive to right fielder Alex Rios.   Clete Thomas to 2nd.  "
                },
                "px": 0,
                "type": "S",
                "des": "Called Strike",
                "pz": 2.5,
                "start_speed": 93.8,
                "pitch_type": "FF"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto singles on a line drive to right fielder Alex Rios.   Clete Thomas to 2nd.  "
                },
                "px": 0,
                "type": "S",
                "des": "Foul",
                "pz": 2.5,
                "start_speed": 92.9,
                "pitch_type": "FF"
            }],
            whiffRates, csv;

        angular.forEach(pitches, function(pitch)
        {
            zones.addPitch(new pitchfx.Pitch(pitch));
        });
        whiffRates = zones.getWhiffsPerSwingRates();
        csv = pitchfx.Zones.gridToCsv(whiffRates, 'Whiff Rates');

        expect(/Whiff Rates$/m.test(csv)).toBe(true);

        expect(whiffRates[0][0].stat).toBe(0);
        expect(/^0,0,0$/m.test(csv)).toBe(true);

        expect(whiffRates[9][9].stat).toBe(0);
        expect(/^9,9,0$/m.test(csv)).toBe(true);

        expect(whiffRates[5][5].stat.toFixed(2)).toBe('0.29');
        expect(/^5,5,0.28\d+$/m.test(csv)).toBe(true);

    });

    it('Test BIP rate functions', function()
    {
        var zones = new pitchfx.Zones(),
            pitches = [
            {
                "atbat":
                {
                    "des": "Josmil Pinto grounds out, shortstop Jurickson Profar to first baseman Mitch Moreland.  "
                },
                "des": "In play, out(s)",
                "hip":
                {
                    "des": "Groundout"
                },
                "pitch_type": "CH",
                "px": 0,
                "pz": 2.5,
                "start_speed": 80.1,
                "type": "X"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto doubles (1) on a line drive to left fielder Jim Adduci.   Clete Thomas scores.  "
                },
                "px": 0,
                "type": "B",
                "des": "Ball",
                "pz": 2.5,
                "start_speed": 78.2,
                "pitch_type": "CH"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto doubles (1) on a line drive to left fielder Jim Adduci.   Clete Thomas scores.  "
                },
                "px": 0,
                "type": "B",
                "des": "Ball",
                "pz": 2.5,
                "start_speed": 80,
                "pitch_type": "CH"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto doubles (1) on a line drive to left fielder Jim Adduci.   Clete Thomas scores.  "
                },
                "px": 0,
                "type": "B",
                "des": "Ball",
                "pz": 2.5,
                "start_speed": 89.4,
                "pitch_type": "FC"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto doubles (1) on a line drive to left fielder Jim Adduci.   Clete Thomas scores.  "
                },
                "px": 0,
                "type": "S",
                "des": "Called Strike",
                "pz": 2.5,
                "start_speed": 72.5,
                "pitch_type": "CU"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto doubles (1) on a line drive to left fielder Jim Adduci.   Clete Thomas scores.  "
                },
                "px": 0,
                "type": "S",
                "des": "Foul",
                "pz": 2.5,
                "start_speed": 81.2,
                "pitch_type": "CH"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto doubles (1) on a line drive to left fielder Jim Adduci.   Clete Thomas scores.  "
                },
                "des": "In play, run(s)",
                "hip":
                {
                    "des": "Double"
                },
                "pitch_type": "CU",
                "px": 0,
                "pz": 2.5,
                "start_speed": 70,
                "type": "X"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto strikes out swinging.  "
                },
                "px": 0,
                "type": "S",
                "des": "Called Strike",
                "pz": 2.5,
                "start_speed": 91.2,
                "pitch_type": "SI"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto strikes out swinging.  "
                },
                "px": 0,
                "type": "S",
                "des": "Swinging Strike",
                "pz": 2.5,
                "start_speed": 83.2,
                "pitch_type": "CH"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto strikes out swinging.  "
                },
                "px": 0,
                "type": "S",
                "des": "Foul",
                "pz": 2.5,
                "start_speed": 84.1,
                "pitch_type": "CH"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto strikes out swinging.  "
                },
                "px": 0,
                "type": "S",
                "des": "Swinging Strike (Blocked)",
                "pz": 2.5,
                "start_speed": 84.2,
                "pitch_type": "CH"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto singles on a line drive to right fielder Alex Rios.   Clete Thomas to 2nd.  "
                },
                "px": 0,
                "type": "S",
                "des": "Called Strike",
                "pz": 2.5,
                "start_speed": 93.8,
                "pitch_type": "FF"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto singles on a line drive to right fielder Alex Rios.   Clete Thomas to 2nd.  "
                },
                "px": 0,
                "type": "S",
                "des": "Foul",
                "pz": 2.5,
                "start_speed": 92.9,
                "pitch_type": "FF"
            }],
            BIPRates, csv;

        angular.forEach(pitches, function(pitch)
        {
            zones.addPitch(new pitchfx.Pitch(pitch));
        });
        BIPRates = zones.getBIPRates();
        csv = pitchfx.Zones.gridToCsv(BIPRates, 'BIP Rates');

        expect(/BIP Rates$/m.test(csv)).toBe(true);

        expect(BIPRates[0][0].stat).toBe(0);
        expect(/^0,0,0$/m.test(csv)).toBe(true);

        expect(BIPRates[9][9].stat).toBe(0);
        expect(/^9,9,0$/m.test(csv)).toBe(true);

        expect(BIPRates[5][5].stat.toFixed(2)).toBe('0.15');
        expect(/^5,5,0.15\d+$/m.test(csv)).toBe(true);

    });

    it('Test BABIP functions', function()
    {
        var zones = new pitchfx.Zones(),
            pitches = [
            {
                "atbat":
                {
                    "des": "Josmil Pinto grounds out, shortstop Jurickson Profar to first baseman Mitch Moreland.  "
                },
                "des": "In play, out(s)",
                "hip":
                {
                    "des": "Groundout"
                },
                "pitch_type": "CH",
                "px": 0,
                "pz": 2.5,
                "start_speed": 80.1,
                "type": "X"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto doubles (1) on a line drive to left fielder Jim Adduci.   Clete Thomas scores.  "
                },
                "px": 0,
                "type": "B",
                "des": "Ball",
                "pz": 2.5,
                "start_speed": 78.2,
                "pitch_type": "CH"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto doubles (1) on a line drive to left fielder Jim Adduci.   Clete Thomas scores.  "
                },
                "px": 0,
                "type": "B",
                "des": "Ball",
                "pz": 2.5,
                "start_speed": 80,
                "pitch_type": "CH"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto doubles (1) on a line drive to left fielder Jim Adduci.   Clete Thomas scores.  "
                },
                "px": 0,
                "type": "B",
                "des": "Ball",
                "pz": 2.5,
                "start_speed": 89.4,
                "pitch_type": "FC"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto doubles (1) on a line drive to left fielder Jim Adduci.   Clete Thomas scores.  "
                },
                "px": 0,
                "type": "S",
                "des": "Called Strike",
                "pz": 2.5,
                "start_speed": 72.5,
                "pitch_type": "CU"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto doubles (1) on a line drive to left fielder Jim Adduci.   Clete Thomas scores.  "
                },
                "px": 0,
                "type": "S",
                "des": "Foul",
                "pz": 2.5,
                "start_speed": 81.2,
                "pitch_type": "CH"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto doubles (1) on a line drive to left fielder Jim Adduci.   Clete Thomas scores.  "
                },
                "des": "In play, run(s)",
                "hip":
                {
                    "des": "Double"
                },
                "pitch_type": "CU",
                "px": 0,
                "pz": 2.5,
                "start_speed": 70,
                "type": "X"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto strikes out swinging.  "
                },
                "px": 0,
                "type": "S",
                "des": "Called Strike",
                "pz": 2.5,
                "start_speed": 91.2,
                "pitch_type": "SI"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto strikes out swinging.  "
                },
                "px": 0,
                "type": "S",
                "des": "Swinging Strike",
                "pz": 2.5,
                "start_speed": 83.2,
                "pitch_type": "CH"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto strikes out swinging.  "
                },
                "px": 0,
                "type": "S",
                "des": "Foul",
                "pz": 2.5,
                "start_speed": 84.1,
                "pitch_type": "CH"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto strikes out swinging.  "
                },
                "px": 0,
                "type": "S",
                "des": "Swinging Strike (Blocked)",
                "pz": 2.5,
                "start_speed": 84.2,
                "pitch_type": "CH"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto singles on a line drive to right fielder Alex Rios.   Clete Thomas to 2nd.  "
                },
                "px": 0,
                "type": "S",
                "des": "Called Strike",
                "pz": 2.5,
                "start_speed": 93.8,
                "pitch_type": "FF"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto singles on a line drive to right fielder Alex Rios.   Clete Thomas to 2nd.  "
                },
                "px": 0,
                "type": "S",
                "des": "Foul",
                "pz": 2.5,
                "start_speed": 92.9,
                "pitch_type": "FF"
            },
            {
                "hip":
                {
                    "des": "Home Run"
                },
                "atbat":
                {
                    "des": "Josmil Pinto homers (1) on a fly ball to left center field.  "
                },
                "px": 0,
                "type": "X",
                "des": "In play, run(s)",
                "pz": 2.5,
                "start_speed": 88.4,
                "pitch_type": "FC"
            }],
            BABIP, csv;

        angular.forEach(pitches, function(pitch)
        {
            zones.addPitch(new pitchfx.Pitch(pitch));
        });
        BABIP = zones.getBABIPRates();
        csv = pitchfx.Zones.gridToCsv(BABIP, 'BABIP');

        expect(/BABIP$/m.test(csv)).toBe(true);

        expect(BABIP[0][0].stat).toBe(0);
        expect(/^0,0,0$/m.test(csv)).toBe(true);

        expect(BABIP[9][9].stat).toBe(0);
        expect(/^9,9,0$/m.test(csv)).toBe(true);

        expect(BABIP[5][5].stat.toFixed(2)).toBe('0.50');
        expect(/^5,5,0.5$/m.test(csv)).toBe(true);

    });

    it('Test wOBA functions', function()
    {
        var zones = new pitchfx.Zones(),
            pitches = [
            {
                "atbat":
                {
                    "des": "Josmil Pinto grounds out, shortstop Jurickson Profar to first baseman Mitch Moreland.  "
                },
                "des": "In play, out(s)",
                "hip":
                {
                    "des": "Groundout"
                },
                "pitch_type": "CH",
                "px": 0,
                "pz": 2.5,
                "start_speed": 80.1,
                "type": "X"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto doubles (1) on a line drive to left fielder Jim Adduci.   Clete Thomas scores.  "
                },
                "px": 0,
                "type": "B",
                "des": "Ball",
                "pz": 2.5,
                "start_speed": 78.2,
                "pitch_type": "CH"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto doubles (1) on a line drive to left fielder Jim Adduci.   Clete Thomas scores.  "
                },
                "px": 0,
                "type": "B",
                "des": "Ball",
                "pz": 2.5,
                "start_speed": 80,
                "pitch_type": "CH"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto doubles (1) on a line drive to left fielder Jim Adduci.   Clete Thomas scores.  "
                },
                "px": 0,
                "type": "B",
                "des": "Ball",
                "pz": 2.5,
                "start_speed": 89.4,
                "pitch_type": "FC"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto doubles (1) on a line drive to left fielder Jim Adduci.   Clete Thomas scores.  "
                },
                "px": 0,
                "type": "S",
                "des": "Called Strike",
                "pz": 2.5,
                "start_speed": 72.5,
                "pitch_type": "CU"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto doubles (1) on a line drive to left fielder Jim Adduci.   Clete Thomas scores.  "
                },
                "px": 0,
                "type": "S",
                "des": "Foul",
                "pz": 2.5,
                "start_speed": 81.2,
                "pitch_type": "CH"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto doubles (1) on a line drive to left fielder Jim Adduci.   Clete Thomas scores.  "
                },
                "des": "In play, run(s)",
                "hip":
                {
                    "des": "Double"
                },
                "pitch_type": "CU",
                "px": 0,
                "pz": 2.5,
                "start_speed": 70,
                "type": "X"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto strikes out swinging.  "
                },
                "px": 0,
                "type": "S",
                "des": "Called Strike",
                "pz": 2.5,
                "start_speed": 91.2,
                "pitch_type": "SI"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto strikes out swinging.  "
                },
                "px": 0,
                "type": "S",
                "des": "Swinging Strike",
                "pz": 2.5,
                "start_speed": 83.2,
                "pitch_type": "CH"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto strikes out swinging.  "
                },
                "px": 0,
                "type": "S",
                "des": "Foul",
                "pz": 2.5,
                "start_speed": 84.1,
                "pitch_type": "CH"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto strikes out swinging.  "
                },
                "px": 0,
                "type": "S",
                "des": "Swinging Strike (Blocked)",
                "pz": 2.5,
                "start_speed": 84.2,
                "pitch_type": "CH"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto singles on a line drive to right fielder Alex Rios.   Clete Thomas to 2nd.  "
                },
                "px": 0,
                "type": "S",
                "des": "Called Strike",
                "pz": 2.5,
                "start_speed": 93.8,
                "pitch_type": "FF"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto singles on a line drive to right fielder Alex Rios.   Clete Thomas to 2nd.  "
                },
                "px": 0,
                "type": "S",
                "des": "Foul",
                "pz": 2.5,
                "start_speed": 92.9,
                "pitch_type": "FF"
            },
            {
                "atbat":
                {
                    "des": "Josmil Pinto homers (1) on a fly ball to left center field.  "
                },
                "des": "In play, run(s)",
                "hip":
                {
                    "des": "Home Run"
                },
                "pitch_type": "FC",
                "px": 0,
                "pz": 2.5,
                "start_speed": 88.4,
                "type": "X"
            }],
            wOBA, csv;

        angular.forEach(pitches, function(pitch)
        {
            zones.addPitch(new pitchfx.Pitch(pitch));
        });
        wOBA = zones.getWOBARates();
        csv = pitchfx.Zones.gridToCsv(wOBA, 'wOBA');

        expect(/wOBA$/m.test(csv)).toBe(true);

        expect(wOBA[0][0].stat).toBe(0);
        expect(/^0,0,0$/m.test(csv)).toBe(true);

        expect(wOBA[9][9].stat).toBe(0);
        expect(/^9,9,0$/m.test(csv)).toBe(true);

        expect(wOBA[5][5].stat.toFixed(2)).toBe('1.06');
        expect(/^5,5,1.06\d+$/m.test(csv)).toBe(true);

    });
});
