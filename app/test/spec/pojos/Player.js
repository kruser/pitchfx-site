'use strict';

describe('POJO: Player', function()
{
    it('Test player full name', function()
    {
        var player = new pitchfx.Player(
        {
            "_id": "52ea94c4ccd240a2510f982a",
            "first": "Josmil",
            "last": "Pinto",
            "id": 500887
        });
        expect(player.getFullName()).toBe('Josmil Pinto');
    });

    it('Test player url', function()
    {
        var player = new pitchfx.Player(
        {
            "_id": "52ea94c4ccd240a2510f982a",
            "first": "Josmil",
            "last": "Pinto",
            "id": 500887
        });
        expect(player.getUrlFriendlyName()).toBe('josmil-pinto');
    });
});
