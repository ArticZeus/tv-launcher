// Edit this file to change the homescreen.
// Each row has a title and a list of tiles. "id" is the Tizen app ID,
// or use "url" instead to open a website in the TV's browser.
// Check an ID exists on the TV with (from a PC on the same network):
//   Invoke-RestMethod http://<TV_IP>:8001/api/v2/applications/<id>
var LAUNCHER_ROWS = [
    {
        title: 'Watch',
        tiles: [
            { name: 'YouTube',     id: '9Ur5IzDKqV.TizenYouTube',             color: '#cc0000' },
            { name: 'Prime Video', id: 'evKhCgZelL.AmazonIgnitionLauncher2',  color: '#00a8e1' },
            { name: 'Viaplay',     id: '11111300404',                         color: '#e5007e' },
            { name: 'SVT Play',    id: '3201612011287',                       color: '#1f7a3a' },
            { name: 'Streaming',   url: 'https://bingebang.st/',                                   color: '#7b2ff7' }
        ]
    },
    {
        // Max 5 tiles per row fit on a 1920px screen.
        title: 'Music & Live',
        tiles: [
            { name: 'Spotify',     id: 'rJeHak5zRg.Spotify',                  color: '#1db954' },
            { name: 'Twitch',      id: '3202203026841',                       color: '#9146ff' }
        ]
    }
];
