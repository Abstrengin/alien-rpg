# Releasing / publishing updates

A release is driven entirely by pushing a `v*` tag. GitHub Actions
([.github/workflows/release.yml](../.github/workflows/release.yml)) does the
building and publishing.

## TL;DR

```bash
# 1. bump "version" in package.json (single source of truth, e.g. 1.3.0 -> 1.3.1)
# 2. commit everything
git add -A
git commit -m "Describe the changes in this release"
git push origin main

# 3. tag with a matching v-prefixed version and push the tag
git tag v1.3.1
git push origin v1.3.1
```

That's it. The tag push triggers the `Release` workflow. Watch it at
<https://github.com/Abstrengin/alien-rpg/actions>.

> **PowerShell note:** `&&` is not valid in Windows PowerShell 5.1. Run the
> commands on separate lines (as above), or join with `;` (which does **not**
> stop on error).

## Version numbers

- `package.json` `version` is the **only** place to bump. It flows to the
  About page, the footer, every tool's APP INFO modal, and the Electron
  About dialog automatically (via [src/shared/version.js](../src/shared/version.js)
  and `require("../package.json")` in `public/preload.js`).
- The git tag **must** be `v` + that exact version (`1.3.1` -> `v1.3.1`).
  butler receives the version with the `v` stripped (`1.3.1`).
- Add a matching `## [1.3.1] - YYYY-MM-DD` section at the top of
  [CHANGELOG.md](../CHANGELOG.md).

## What the workflow does

| Job             | Produces                                                                                                  |
| --------------- | --------------------------------------------------------------------------------------------------------- |
| `build-windows` | `dist/Alien RPG Tools Portable <version>.exe`                                                             |
| `build-linux`   | `dist/*.AppImage` and the browser bundle `dist-web/`                                                      |
| `publish-itch`  | `butler push` of all three to `abstract-engineer/alien-rpg-tools` on channels `windows`, `linux`, `html5` |
| `release`       | A GitHub Release containing the `.exe` and `.AppImage`                                                    |

The Linux AppImage is the reason this runs in CI rather than locally: it
cannot be built on Windows.

## One-time setup

- **`BUTLER_API_KEY`** must exist as a GitHub Actions secret
  (repo Settings -> Secrets and variables -> Actions). Without it, the
  `publish-itch` job logs a warning and exits green, so releases are not
  blocked. Full detail: [ITCH_SETUP.md](../ITCH_SETUP.md).
- The itch.io page `abstract-engineer/alien-rpg-tools` must exist. It can
  stay hidden for the first push.

## After a run goes green

1. **GitHub Release** – check <https://github.com/Abstrengin/alien-rpg/releases>
   has the `.exe` and `.AppImage` for the new version.
2. **`publish-itch` log** – confirm the three `butler push` commands ran. If it
   skipped (no secret), add the secret and use **Re-run jobs** on that run; no
   new tag needed.
3. **itch.io** (Edit game page):
   - Kind of project: **HTML**
   - `html5` upload: tick **"This file will be played in the browser"**, set
     viewport (1280x800 is a fine start)
   - Confirm the platform tags on the `windows` / `linux` uploads
   - First release only: flip the page from hidden to **Public**

## Optional: dry run

Push a pre-release tag first. It still matches `v*`, publishes to itch.io as
that version string, and lets you watch the whole pipeline before the real tag.

```bash
git tag v1.3.1-rc.1
git push origin v1.3.1-rc.1
```

Delete the RC tag/release afterward if you want:

```bash
git push origin :refs/tags/v1.3.1-rc.1   # delete remote tag
git tag -d v1.3.1-rc.1                    # delete local tag
```

## Building locally instead (for testing, not distribution)

```bash
npm run build          # library bundle (dist/) for the WordPress <ttbg-app> embed + Electron
npm run build:web      # standalone SPA (dist-web/), same thing itch.io HTML5 gets
npm run electron-build # Windows portable .exe in dist/  (no Linux AppImage on Windows)
```

To push a local build to itch.io by hand:

```bash
butler login                       # once
npm run build:web
butler push dist-web abstract-engineer/alien-rpg-tools:html5 --userversion 0.0.0-test
```

## Troubleshooting

- **`fatal: detected dubious ownership in repository`** – Git ownership check on
  a folder whose owner SID differs from your user (common on secondary drives).
  Fix once:
  ```bash
  git config --global --add safe.directory 'E:/Projects_Source/Projects/My_Projects/Apps/Alien RPG/alien-rpg-apps'
  ```
- **`LF will be replaced by CRLF` warnings on `git add`** – harmless Windows
  line-ending normalization. Ignore, or add a `.gitattributes` with
  `* text=auto eol=lf` to silence.
- **HTML5 build loads blank on itch.io** – almost always the itch embed/viewport
  settings, not the build. `vite.config.web.js` sets `base: "./"` so asset paths
  are already relative.
