# Automatic Updates Setup Guide

This application uses `electron-updater` to automatically check for and notify users about new releases hosted on GitHub.

## One-Time Setup

1. **Create a GitHub Personal Access Token:**
   - Go to https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Give it a name (e.g., "Alien RPG Releases")
   - Check **`repo`** scope (full control of private repositories)
   - Copy the token
   - Save it somewhere safe

2. **Set Environment Variable:**
   ```powershell
   $env:GH_TOKEN = "your_token_here"
   ```

## Deploy Updates

**Just two steps:**

1. Update version in package.json
2. Run: `npm run release`

The script handles everything else - building, creating the release, and uploading!

## Manual Release Workflow

```bash
# 1. Update version in package.json
"version": "1.0.1"

# 2. Run
npm run release
```

Done! Users will be notified automatically.

## Troubleshooting

**Updates not detected:**

- Verify release tag matches your `package.json` version exactly
- Ensure the EXE file is attached to the release
- Check that the repository is public
- App checks for updates on startup; restart the application

**Wrong version showing:**

- Confirm the tag in your GitHub release matches `package.json` version

## Manual Release Workflow

```bash
# 1. Update version in package.json
# 2. Build
npm run release

# 3. Go to GitHub and create a new release with the tag matching your version
# 4. Upload the new EXE from Release/v{version}/ folder
# 5. Publish the release
```

That's it! Users will be notified of updates automatically.
