# Electron Desktop App Setup

This document explains how to build and run the Alien RPG Star System Generator as a desktop application using Electron.

## Why Electron?

- ✅ **No build tools required** - Just Node.js
- ✅ **Cross-platform** - Windows and Linux with one codebase
- ✅ **Battle-tested** - Used by VS Code, Discord, Slack, etc.
- ✅ **Easy installation** - One-click installers and portable executables
- ✅ **Native features** - File system access, notifications, tray integration, etc.

## Prerequisites

### All Platforms

- **Node.js**: v16 or later (you already have this)
- **npm**: Comes with Node.js

That's it! No compilation required, no external tools needed.

## Development

### Running in Development Mode

```bash
npm run electron-dev
```

This will:

1. Build the Vue.js app
2. Start the Electron app window
3. The app window will auto-reload when you make changes

**Note**: The dev build takes a moment to start since it builds first. After the first build, changes to Vue files will reload automatically.

## Building for Distribution

### Create Installers and Executables

```bash
npm run electron-build
```

This will create:

- **Windows Installer (NSIS)**: Easy installation for users
- **Windows Portable (.exe)**: Single file, no installation
- **Linux AppImage**: Single file for Linux
- **Linux DEB**: Package for Debian-based systems

**Build time**: 1-2 minutes

### Output Files

After building, find your apps in the `dist` folder:

```
dist/
├── Alien RPG Generator 1.0.0.exe          (Portable - Windows)
├── Alien RPG Generator Setup 1.0.0.exe    (Installer - Windows)
├── Alien RPG Generator-1.0.0.AppImage     (Single file - Linux)
└── alien-rpg-generator_1.0.0_amd64.deb    (Package - Linux)
```

## Distribution Strategy

### Recommended for Each Platform

#### Windows

**Best option**: Ship both!

- **Installer (.exe)**: For general users - familiar installation process
- **Portable (.exe)**: For advanced users - no installation needed, USB-friendly

#### Linux

- **AppImage**: Works on most Linux distributions
- **DEB**: For Ubuntu/Debian users who prefer package managers

## File Sizes

| Format         | Size       | Installation                     |
| -------------- | ---------- | -------------------------------- |
| Portable EXE   | ~150-160MB | None (just run)                  |
| Installer      | ~150-160MB | Standard Windows installer       |
| Linux AppImage | ~160-170MB | Direct execution                 |
| Linux DEB      | ~80-90MB   | `apt install` or package manager |

**Note**: Electron apps are larger than Tauri (~30-50MB) because they bundle Chromium. However, Electron requires zero build tools.

## Quick Start Guide

### For Users (You)

```bash
# Run in development
npm run electron-dev

# Build for distribution
npm run electron-build
```

### For End Users (Your Players)

1. Download the appropriate file for their OS
2. **Windows**: Run the `.exe` installer or portable
3. **Linux**: Run the `.AppImage` or use `sudo apt install` for DEB

Users can then just double-click the desktop shortcut or find it in their applications menu.

## Configuration

### App Information

Edit `package.json` to change:

- `name`: Internal app name
- `version`: Current app version
- `productName`: Display name in installers

### Window Settings

Edit `public/electron.js` to customize:

- Window size (default: 1200x900)
- Minimum window size (900x600)
- Dev tools visibility
- Menu items

### Build Settings

Edit the `"build"` section in `package.json` to customize:

- Installer options
- Target platforms
- File associations
- Icons (place in `public/` folder)

## Troubleshooting

### "electron not found"

```bash
npm install
```

### Dev mode window won't open

- Make sure port 5173 is available
- Try: `npm run build` then `electron .`

### Build fails

- Delete `dist/` folder and try again
- Check that you have write permissions in the project directory

### Windows Defender warning

- Unsigned executables may trigger warnings
- This is normal for unsigned apps
- Users can click "More info" then "Run anyway"

## Adding Icons

1. Create a `public/icon.png` (256x256 or larger)
2. Electron-builder will automatically generate all required icon sizes
3. Rebuild with `npm run electron-build`

## Updates

The desktop app has **no built-in updater**. Distribution is through itch.io:

- Users who install via the **itch.io desktop app** are updated automatically
  whenever a new build is pushed to the `windows` / `linux` channels (which
  happens on every `v*` tag; see [docs/RELEASING.md](docs/RELEASING.md)).
- Users who download the file directly from the itch.io page update by
  re-downloading the latest version.

Bump `version` in `package.json` for each release; it flows to the About page,
footer, tool modals, and the Electron About dialog automatically.

## Development Tips

### Hot Reload

- Changes to Vue files automatically reload the window
- Changes to `electron.js` require app restart

### Debugging

- Dev tools open automatically in development mode
- Press `Ctrl+Shift+I` to open/close dev tools
- Use Vue DevTools for component debugging

### Performance

- Electron is memory-intensive (~100-150MB per window)
- Good for desktop apps, not ideal for system-critical applications

## Automated Releases with GitHub Actions

### Setup

The project includes a GitHub Actions workflow (`.github/workflows/release.yml`) that automatically:

1. Builds the application when you push a git tag
2. Creates a GitHub Release
3. Uploads the portable executable to the release

### Creating a Release

**Step 1: Commit your changes**

```bash
git add .
git commit -m "Your commit message"
git push
```

**Step 2: Create a version tag**

```bash
git tag v1.0.1  # Use semantic versioning (v1.0.0, v1.0.1, v2.0.0, etc.)
git push origin v1.0.1
```

**Step 3: GitHub Actions runs automatically**

- Workflow triggers when tag is pushed
- Builds the portable exe
- Creates a release on GitHub with the exe attached
- No manual upload needed!

### For Users

- **Download**: [itch.io](https://abstract-engineer.itch.io/alien-rpg-tools)
- **Updates**: automatic for itch.io app installs; otherwise re-download from the page

### Manual Release (If Needed)

If GitHub Actions fails or you need manual control:

```bash
npm run electron-build
```

Then upload `dist/Alien RPG Star System Generator Portable*.exe` to:

1. Go to GitHub repo → Releases → Draft new release
2. Tag: `v1.0.1` (match your git tag)
3. Upload the exe file
4. Publish

## Web Component Distribution

The app also works as a web component for WordPress/websites:

**Files to deploy**:

- `dist/alien-rpg-planet-generator.js` (bundle)
- `dist/alien-rpg-planet-generator.css` (styles)

**Usage**:

```html
<script src="/path/to/alien-rpg-planet-generator.js"></script>
<link rel="stylesheet" href="/path/to/alien-rpg-planet-generator.css" />

<ttbg-app></ttbg-app>
```

## Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [electron-builder Docs](https://www.electron.build/)
- [Electron Security Best Practices](https://www.electronjs.org/docs/tutorial/security)

## Support

For issues:

1. Check the Electron documentation
2. Search GitHub Issues in electron and electron-builder repos
3. Check your Node.js version: `node --version`

---

**Version**: 1.0.0
**Last Updated**: December 18, 2025
**Status**: ✅ Ready for distribution
