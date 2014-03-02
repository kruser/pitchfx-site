'use strict';

describe('Controller: PitchstatsCtrl', function() {

    // load the controller's module
    beforeEach(module('pitchfxApp'));

    var PitchstatsCtrl, scope, $httpBackend;

    // Initialize the controller and a mock scope
    beforeEach(inject(function(_$httpBackend_, $controller, $rootScope) {
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('/api/pitches/123?atbatFilter=%7B%7D').respond([{
            "atbat": {
                "des": "Josmil Pinto grounds out, shortstop Jurickson Profar to first baseman Mitch Moreland.  "
            },
            "px": 0.301,
            "type": "S",
            "des": "Called Strike",
            "pz": 3.047,
            "start_speed": 84.5,
            "pitch_type": "CH"
        }, {
            "atbat": {
                "des": "Josmil Pinto grounds out, shortstop Jurickson Profar to first baseman Mitch Moreland.  "
            },
            "px": -0.252,
            "type": "B",
            "des": "Ball",
            "pz": 0.464,
            "start_speed": 79,
            "pitch_type": "CH"
        }, {
            "atbat": {
                "des": "Josmil Pinto grounds out, shortstop Jurickson Profar to first baseman Mitch Moreland.  "
            },
            "px": -0.097,
            "type": "S",
            "des": "Called Strike",
            "pz": 3.33,
            "start_speed": 80,
            "pitch_type": "CH"
        }, {
            "atbat": {
                "des": "Josmil Pinto grounds out, shortstop Jurickson Profar to first baseman Mitch Moreland.  "
            },
            "px": 0.272,
            "type": "B",
            "des": "Ball",
            "pz": 5.18,
            "start_speed": 71.3,
            "pitch_type": "CU"
        }, {
            "atbat": {
                "des": "Josmil Pinto doubles (1) on a line drive to left fielder Jim Adduci.   Clete Thomas scores.  "
            },
            "px": -0.44,
            "type": "B",
            "des": "Ball",
            "pz": 4.735,
            "start_speed": 89.4,
            "pitch_type": "FC"
        }]);
        scope = $rootScope.$new();
        scope.playerId = 123;
        PitchstatsCtrl = $controller('PitchstatsCtrl', {
            $scope: scope
        });
    }));

    it('Test pitch counts', function() {
        expect(scope.loading).toBe(true);
        expect(scope.pitchCount).toBe(0);
        $httpBackend.flush();
        expect(scope.pitchCount).toBe(5);
    });

    it('Test pitch speeds chart', function() {
        $httpBackend.flush();
        /* there is a 19 MPH difference between slowest and fastest pitches */
        expect(scope.pitchSpeeds.categories.length).toBe(19);

        /*
         * the 2nd (element 1) thing in our data series is curveballs, where we
         * have a single pitch in the slowest speed
         */
        expect(scope.pitchSpeeds.series[1].name).toBe('Curve');
        expect(scope.pitchSpeeds.series[1].data[0]).toBe(1);
        expect(scope.pitchSpeeds.series[1].data[1]).toBeFalsy();
    });

    it('Test out the pitch table', function() {
        expect(scope.pitchTypes.length).toBe(0);
        $httpBackend.flush();
        expect(scope.pitchTypes.length).toBe(3);
        expect(scope.pitchTypes[0].displayName).toBe('Change');
        expect(scope.pitchTypes[0].ball).toBe(1);
        expect(scope.pitchTypes[0].strike).toBe(2);
        expect(scope.pitchTypes[0].foul).toBe(0);
        expect(scope.pitchTypes[0].bip).toBe(0);
        expect(scope.pitchTypes[0].hit).toBe(0);
        expect(scope.pitchTypes[0].out).toBe(0);
        expect(scope.pitchTypes[0].grounder).toBe(0);
        expect(scope.pitchTypes[0].liner).toBe(0);
        expect(scope.pitchTypes[0].flyball).toBe(0);
        expect(scope.pitchTypes[0].popup).toBe(0);
    });
});
