# itch.io distribution

The app is published to <https://abstract-engineer.itch.io/alien-rpg-tools> on
every `v*` tag by the `publish-itch` job in
[.github/workflows/release.yml](.github/workflows/release.yml), using
[butler](https://itch.io/docs/butler/).

## One-time setup

### 1. Create a butler API key

1. Sign in to itch.io as the account that owns the page.
2. Go to <https://itch.io/user/settings/api-keys> and generate a new key.

### 2. Add it as a GitHub Actions secret

In the GitHub repo: **Settings → Secrets and variables → Actions → New
repository secret**

- Name: `BUTLER_API_KEY`
- Value: the key from step 1

Until this secret exists the `publish-itch` job runs but skips every push with a
warning, so releases are not blocked.

### 3. Configure the itch.io page

On the project's **Edit game** page:

- **Kind of project:** HTML
- Upload / channel behaviour is created automatically by the first butler push.
  After that first release, for the `html5` upload tick **"This file will be
  played in the browser"** and set the viewport (a good starting point is
  1280×800, with "Fullscreen button" and "Mobile friendly" enabled).
- Mark the `windows` and `linux` uploads with their platform and as
  downloadable.
- Flip the page from **Draft / hidden** to **Public** (or Restricted) once a
  release looks good.

## How a release flows

```bash
# 1. bump "version" in package.json (and it will flow to the About/Footer views
#    and the Electron About dialog, which read it dynamically)
# 2. commit
# 3. tag and push
git tag v1.3.0
git push origin v1.3.0
```

The workflow then:

| Job | Produces |
|---|---|
| `build-windows` | `dist/*Portable*.exe` |
| `build-linux` | `dist/*.AppImage`, `dist-web/` |
| `publish-itch` | `butler push` to `abstract-engineer/alien-rpg-tools` channels `windows`, `linux`, `html5`, each tagged `--userversion <version>` |
| `release` | GitHub Release with the `.exe` and `.AppImage` |

## Channels

| Channel | Source artifact | butler target |
|---|---|---|
| `windows` | `dist/Alien RPG Tools Portable <version>.exe` | `abstract-engineer/alien-rpg-tools:windows` |
| `linux` | `dist/*.AppImage` | `abstract-engineer/alien-rpg-tools:linux` |
| `html5` | `dist-web/` (directory, contains `index.html`) | `abstract-engineer/alien-rpg-tools:html5` |

## Testing butler locally (optional)

```bash
# install: https://itchio.itch.io/butler
butler login                       # interactive, one time
npm run build:web
butler push dist-web abstract-engineer/alien-rpg-tools:html5 --userversion 0.0.0-test
butler status abstract-engineer/alien-rpg-tools
```
