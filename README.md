# TV Launcher (TizenBrew module)

A clean homescreen for a Samsung UE43NU7475 (2018, Tizen 4.0). It runs as a
[TizenBrew](https://github.com/reisxd/TizenBrew) app module: TizenBrew downloads it from this
GitHub repo and runs it, so you don't need Tizen Studio or a Samsung certificate.

> Keep Developer Mode's **Host PC IP set to 127.0.0.1**. TizenBrew needs that to work.

## 1. Debloat through settings (reversible)
- **Settings > General > Smart Features > Autorun Smart Hub: Off**, so the ad-filled bar doesn't
  pop up at power-on.
- **Settings > Support > Terms & Privacy**: turn off *Interest-Based Advertisement*,
  *Viewing Information Services*, *Voice Recognition* and *Marketing*/*Privacy Choices* items.
- **Settings > Support > Software Update > Auto Update: Off** (optional, stops new promo apps).
- **Home > Apps > settings cog**: highlight preinstalled/promo apps and choose **Delete**.
  Built-in apps that can't be deleted can be **moved** to the end of the bar.
- On the home bar: highlight an unwanted tile > press Down > **Remove**.

## 2. Add the launcher to TizenBrew
1. Open TizenBrew on the TV.
2. Open the module manager and add a GitHub module: `ArticZeus/tv-launcher`.
3. Open **Home** from the module list. Optionally set it as the auto-launch module.
4. Move TizenBrew to the first slot on Samsung's home bar, so your launcher is one press away.

## 3. Customise
Edit [js/apps.js](js/apps.js), commit and push. TizenBrew picks up the new version.
To find out if an app ID exists on the TV, run this from a PC on the same network:
```powershell
Invoke-RestMethod http://192.168.1.68:8001/api/v2/applications/<app-id>
```
Website tiles use `url: 'https://...'` instead of `id`.

Preview on the PC: open `index.html` in a browser at 1920×1080 and use the arrow keys and
Enter. Launches only show a message there.
