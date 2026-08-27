# Alien RPG Tools

A suite of generators and calculators for the **Alien RPG** tabletop game by
[Ties That Bind Gaming](https://www.tiesthatbindgaming.com). The same tools run
on the Ties That Bind Gaming website; this project bundles them as a desktop app
(Windows / Linux) and a browser-playable build distributed on itch.io.

The generators are compatible with both the original Alien RPG and the Evolved
Edition. Built with Vue 3, Vite, and Electron.

## Tools

| Tool | What it does |
|---|---|
| Star System Generator | Complete star systems, planets, and colonies |
| Space Travel Tool | FTL travel time, crew pay periods, and hypersleep event rolls |
| Combat Tracker | Initiative order, health, and status for every combatant |
| Contract & Cargo Generator | Freighter contracts: cargo, destination, pay, and complications |
| Stress & Panic Tool | Stress rolls and Panic table resolution |
| NPC Generator | Careers, motivations, appearance, personality, hidden agendas |
| Creature Generator | Original alien threats with attributes, attacks, and abilities |
| Ship Generator | Ship class, condition, crew, cargo, and history |
| Supply & Salvage Generator | Supplies and salvage from derelicts, stations, and wrecks |

The tool components under `src/apps/*/tool.vue` are copied verbatim from the
`ties-that-bind-gaming` repo (`src/components/islands/AlienRPG*.vue`). Keep them
in sync with that source rather than editing them here; local changes belong in
the per-tool `App.vue` wrapper.

## Download

- **itch.io** (Windows, Linux, or play in browser):
  <https://abstract-engineer.itch.io/alien-rpg-tools>
- **GitHub Releases** (portable `.exe` and `.AppImage`):
  <https://github.com/Abstrengin/alien-rpg/releases>

The desktop app has no built-in updater. Installs made through the itch.io app
update automatically on each release; otherwise grab the latest build from the
itch.io page.

## Development

```bash
npm install

npm run dev            # Vite dev server (SPA, hot reload)
npm run electron-dev   # Electron shell + Vite

npm run lint           # ESLint (with --fix)
```

### Build outputs

| Command | Config | Output | Used for |
|---|---|---|---|
| `npm run build` | `vite.config.js` | `dist/alien-rpg-tools.js` + `.css` | Electron shell, WordPress `<ttbg-app>` embed (library / custom-element mode) |
| `npm run build:web` | `vite.config.web.js` | `dist-web/` | Standalone SPA for itch.io HTML5, or any static host (`base: "./"`) |
| `npm run electron-build` | – | `dist/*Portable*.exe`, `dist/*.AppImage` | Desktop distribution |

## Releasing

Distribution is driven by version tags. `.github/workflows/release.yml` builds
on `push` of any `v*` tag and then:

1. builds the Windows portable `.exe` and the Linux `.AppImage`
2. builds the browser (`dist-web/`) bundle
3. **`publish-itch`**: pushes all three to `abstract-engineer/alien-rpg-tools`
   via [butler](https://itch.io/docs/butler/) on channels `windows`, `linux`,
   and `html5` (skips cleanly if the `BUTLER_API_KEY` secret is absent)
4. **`release`**: publishes a GitHub Release with the desktop artifacts

```bash
# bump "version" in package.json first, then:
git tag v1.3.0
git push origin v1.3.0
```

Step-by-step: [docs/RELEASING.md](docs/RELEASING.md). itch.io setup (API key,
the `BUTLER_API_KEY` secret, page configuration): [ITCH_SETUP.md](ITCH_SETUP.md).

## Also from Ties That Bind Gaming

[Diegetic Simulators](https://diegeticsimulators.com) gives your players
terminals and databases they operate directly, at the table or remotely.

## License

Fan-made tool for the Alien RPG, not officially affiliated with Free League
Publishing. The Alien RPG is © Free League Publishing. See [LICENSE](LICENSE).
