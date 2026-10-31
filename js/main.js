// ES5 only: older Tizen TVs run an old WebKit/Chromium.
(function () {
    'use strict';

    var KEY = { LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, ENTER: 13, BACK: 10009, BACKSPACE: 8 };
    var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                  'August', 'September', 'October', 'November', 'December'];

    var hasTizen = typeof tizen !== 'undefined';
    // TizenBrew serves modules from 127.0.0.1:8081 without the tizen object;
    // there we launch apps through the TV's own REST API instead.
    var onTv = location.hostname === '127.0.0.1';
    var TV_API = 'http://127.0.0.1:8001/api/v2/applications/';
    var grid = [];        // grid[row][col] -> tile element
    var pos = { row: 0, col: 0 };
    var toastTimer = null;

    function pad(n) {
        return n < 10 ? '0' + n : '' + n;
    }

    function updateClock() {
        var d = new Date();
        document.getElementById('clock').innerHTML = pad(d.getHours()) + ':' + pad(d.getMinutes());
        document.getElementById('date').innerHTML =
            DAYS[d.getDay()] + ', ' + MONTHS[d.getMonth()] + ' ' + d.getDate();
    }

    function showToast(text) {
        var el = document.getElementById('toast');
        el.innerHTML = text;
        el.className = 'show';
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { el.className = ''; }, 2500);
    }

    function build() {
        var container = document.getElementById('rows');
        for (var r = 0; r < LAUNCHER_ROWS.length; r++) {
            var rowData = LAUNCHER_ROWS[r];
            var rowEl = document.createElement('div');
            rowEl.className = 'row';

            var title = document.createElement('div');
            title.className = 'row-title';
            title.innerHTML = rowData.title;
            rowEl.appendChild(title);

            var rowTiles = [];
            for (var c = 0; c < rowData.tiles.length; c++) {
                var t = rowData.tiles[c];
                var tile = document.createElement('div');
                tile.className = 'tile';
                tile.style.backgroundColor = t.color || '#3a3f4b';
                if (t.url !== undefined) {
                    tile.setAttribute('data-url', t.url);
                } else {
                    tile.setAttribute('data-app', t.id);
                }
                tile.setAttribute('data-name', t.name);

                var name = document.createElement('div');
                name.className = 'tile-name';
                name.innerHTML = t.name;
                tile.appendChild(name);

                rowEl.appendChild(tile);
                rowTiles.push(tile);
            }
            container.appendChild(rowEl);
            grid.push(rowTiles);
        }
    }

    function focus(row, col) {
        if (!grid.length) { return; }
        row = Math.max(0, Math.min(grid.length - 1, row));
        col = Math.max(0, Math.min(grid[row].length - 1, col));
        grid[pos.row][pos.col].className = 'tile';
        pos.row = row;
        pos.col = col;
        grid[row][col].className = 'tile focused';
    }

    // Plain POST with no custom headers is a "simple" CORS request: the TV
    // runs the app even though this page isn't allowed to read the reply.
    function launchViaRest(appId, appName) {
        showToast('Opening ' + appName + '...');
        var xhr = new XMLHttpRequest();
        xhr.open('POST', TV_API + encodeURIComponent(appId), true);
        xhr.send();
    }

    function openUrl(url, appName) {
        if (!url) {
            showToast('No URL set for ' + appName + ' yet (edit js/apps.js)');
            return;
        }
        if (!hasTizen) {
            if (onTv) {
                location.href = url;
            } else {
                showToast('(browser preview) would open ' + url);
            }
            return;
        }
        try {
            var control = new tizen.ApplicationControl(
                'http://tizen.org/appcontrol/operation/view', url);
            tizen.application.launchAppControl(control, null, null, function (err) {
                showToast('Could not open ' + appName + ' (' + err.name + ')');
            });
        } catch (e) {
            showToast('Could not open ' + appName + ': ' + e.message);
        }
    }

    function launch(tile) {
        var appId = tile.getAttribute('data-app');
        var appName = tile.getAttribute('data-name');
        if (tile.hasAttribute('data-url')) {
            openUrl(tile.getAttribute('data-url'), appName);
            return;
        }
        if (!hasTizen) {
            if (onTv) {
                launchViaRest(appId, appName);
            } else {
                showToast('(browser preview) would launch ' + appId);
            }
            return;
        }
        try {
            tizen.application.launch(appId, null, function (err) {
                showToast(appName + ' is not installed (' + err.name + ')');
            });
        } catch (e) {
            showToast('Could not launch ' + appName + ': ' + e.message);
        }
    }

    // Called when the remote's Back key is pressed on the launcher.
    // Available helpers: focus(row, col), showToast(text), pos.row / pos.col,
    // e.preventDefault() (stops TizenBrew/the TV handling Back itself).
    function onBack(e) {
        // TODO(human): decide what Back does on the homescreen.
    }

    function onKey(e) {
        switch (e.keyCode) {
            case KEY.LEFT:  focus(pos.row, pos.col - 1); break;
            case KEY.RIGHT: focus(pos.row, pos.col + 1); break;
            // Keep roughly the same column when moving between rows of different length.
            case KEY.UP:    focus(pos.row - 1, pos.col); break;
            case KEY.DOWN:  focus(pos.row + 1, pos.col); break;
            case KEY.ENTER: launch(grid[pos.row][pos.col]); break;
            case KEY.BACK:
            case KEY.BACKSPACE:
                onBack(e);
                return;
            default:
                return;
        }
        e.preventDefault();
    }

    function init() {
        build();
        focus(0, 0);
        updateClock();
        setInterval(updateClock, 10000);
        document.addEventListener('keydown', onKey);

        // Mouse/pointer support (Smart Control remote and browser preview).
        for (var r = 0; r < grid.length; r++) {
            for (var c = 0; c < grid[r].length; c++) {
                (function (row, col) {
                    var tile = grid[row][col];
                    tile.addEventListener('mouseover', function () { focus(row, col); });
                    tile.addEventListener('click', function () { launch(tile); });
                })(r, c);
            }
        }
    }

    window.onload = init;
})();
