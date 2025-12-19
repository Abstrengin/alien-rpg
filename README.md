# TTBG Tools - Alien RPG Ecosystem

A comprehensive desktop application suite featuring tools for the Alien RPG tabletop game. Built with Vue 3, Vite, and Electron, this multi-app ecosystem provides tools for star system generation and space travel planning, implementing all the generation tables and modifiers from the Alien RPG Core Rulebook.

## Available Tools

### 1. **Star System Generator**
Generate complete star systems, planets, and colonies for your Alien RPG campaigns.
- Star System Generator: Create systems with gas giants, terrestrial planets, ice planets, and asteroid belts
- Planet Generator: Design detailed planets with atmosphere, temperature, geosphere, and terrain
- Colony Generator: Establish colonies with size, missions, factions, and allegiances

### 2. **Space Travel Calculator**
Calculate travel times, paycheck schedules, and ship maintenance needs for space voyages.
- Travel Time Calculator: Determine journey duration based on FTL rating and distance
- Paycheck Calculator: Calculate crew paychecks based on travel duration
- Ship Maintenance Tracker: Track when maintenance checks are needed during long voyages

## Download

**Latest Release: v1.0.0**

Download the portable executable for Windows:

- [TTBG Tools Portable 1.0.0.exe](https://github.com/Abstrengin/alien-rpg/releases/download/v1.0.0/TTBG.Tools.Portable.1.0.0.exe)

No installation required—just download and run!

## System Requirements

- Windows 7 or later (64-bit)
- No additional software required (self-contained executable)

## Features

### Generation Tools (Star System Generator)

- **Star System Generator**: Generate complete star systems with gas giants, terrestrial planets, ice planets, and asteroid belts
- **Planet Generator**: Create detailed planets with atmosphere, temperature, geosphere, and terrain
- **Colony Generator**: Generate colonies with size, missions, factions, and allegiances

### Calculation Tools (Space Travel Calculator)

- **Travel Time**: Calculate journey duration in days based on FTL rating and parsecs traveled
- **Paycheck Schedule**: Determine number of paychecks for crew based on travel duration
- **Ship Maintenance**: Track maintenance checks needed during voyages

### Enhanced Functionality

- ✨ **Export Options**: Copy to clipboard, download as JSON or text file (Star System Generator)
- 🎨 **Dark Mode**: Toggle between light and dark themes with persistent preference
- 🖨️ **Print-Friendly**: Optimized print layout for physical reference
- ♿ **Accessible**: Full keyboard navigation and screen reader support
- 📱 **Responsive**: Works seamlessly on desktop, tablet, and mobile devices

### Quality of Life

- Smooth animations and transitions
- Interactive information tooltips linked to core rulebook pages
- All modifiers automatically calculated based on rulebook specifications
- Reset functionality to start fresh
- Visual feedback for all interactions

## Installation

### For Users

1. Download the latest portable executable from the [Releases](https://github.com/Abstrengin/alien-rpg/releases) page
2. Run the `.exe` file
3. Start generating and calculating!

No installation required. The app works on any Windows computer without admin rights.

### For Developers

#### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

#### Setup

1. Clone the repository:

```bash
git clone https://github.com/Abstrengin/alien-rpg.git
cd alien-rpg
```

2. Install dependencies:

```bash
npm install
```

3. Start development (web version with hot reload):

```bash
npm run dev
```

4. Start development (Electron app):

```bash
npm run electron-dev
```

5. Build for production:

```bash
npm run build
```

6. Build desktop app (creates portable exe):

```bash
npm run electron-build
```

## Usage

### Star System Generator

#### Generating a Star System

1. Select a star type from the dropdown (Giant, Subgiant, Main Sequence, White Dwarf, Red Dwarf, or White Main Sequence)
2. Click "GENERATE NEW [STAR TYPE]" to roll for system contents
3. View the number of gas giants, terrestrial planets, ice planets, and asteroid belts
4. Additional features are generated for gas giants and asteroid belts when applicable

#### Generating a Planet

1. First generate a star system (optional but recommended for context)
2. Select a planet type from the dropdown
3. Click "GENERATE NEW [PLANET TYPE]"
4. View detailed information about size, atmosphere, temperature, geosphere, and terrain

#### Generating a Colony

1. Generate a planet first (required - modifiers are based on planet characteristics)
2. Click "GENERATE COLONY"
3. View colony size, mission type, orbital structures, factions, and allegiances
4. Use the D6 roller button for additional random events requiring dice rolls

#### Export and Data

- **Copy**: Click the copy button to copy all generated data to clipboard as formatted text
- **Download JSON**: Save generation data as a JSON file for programmatic use
- **Download Text**: Save as a human-readable text file
- **Print**: Use the print button or Ctrl+P for a clean printable layout

### Space Travel Calculator

#### Calculating Travel

1. Enter the ship's **FTL Rating**
2. Enter the number of **Parsecs** traveled
3. View calculated results:
   - **Travel Time**: Total days of travel (FTL Rating × Parsecs)
   - **Paycheck Schedule**: Number of paychecks earned (Travel Time ÷ 7)
   - **Ship Maintenance**: Maintenance checks needed (Travel Time ÷ 7)
4. Click "RESET CALCULATOR" to clear and start over

**Note**: You can overcharge engines to travel faster (Core Rulebook, Page 167)

### Theme Toggle

Click the theme toggle button (sun/moon icon) in the header to switch between light and dark modes. Your preference is automatically saved.

## Development

### Project Structure

```
alien-rpg/
├── public/              # Static assets
│   ├── electron.js      # Electron main process
│   ├── preload.js       # Electron preload script
│   └── *.ico           # Application icons
├── src/
│   ├── App.vue         # Main app with tab navigation
│   ├── main.js
│   ├── style.css
│   ├── apps/
│   │   ├── alien-rpg/           # Star System Generator app
│   │   │   ├── App.vue
│   │   │   ├── Data.vue
│   │   │   ├── style.css
│   │   │   └── components/
│   │   │       ├── StarSystem.vue
│   │   │       ├── PlanetGenerator.vue
│   │   │       ├── ColonyGenerator.vue
│   │   │       ├── Directions.vue
│   │   │       ├── Footer.vue
│   │   │       ├── UpdateNotification.vue
│   │   │       └── InfoIcon.vue
│   │   └── space-travel-tool/   # Space Travel Calculator app
│   │       ├── App.vue
│   │       └── components/
│   │           └── Form.vue
│   ├── shared/
│   │   ├── components/          # Shared reusable components
│   │   │   ├── Modal.vue
│   │   │   └── InfoIcon.vue
│   │   └── composables/         # Shared Vue composables
│   │       ├── useExport.js
│   │       └── useUpdater.js
│   └── assets/
├── db.json              # Star system generation tables
├── package.json
├── vite.config.js
└── README.md
```

### Architecture

**Multi-App Ecosystem**: The app uses Vue 3's component system with a main `App.vue` that manages tab-based navigation between multiple independent applications.

**Shared Resources**: Common components and composables are stored in `src/shared/` to avoid duplication.

**Data Management**: Generation tables are centralized in `db.json` and imported through composables for easy access and updates.

### Local Development & Testing

```bash
# Install dependencies
npm install

# Development server with hot reload
npm run dev

# Build web bundle
npm run build

# Electron development (requires two terminals)
npm run electron-dev

# Build portable executable
npm run electron-build
```

### Deployment & Releases

#### Automated Release Process

This project uses GitHub Actions to automatically build and release the portable executable.

**To create a new release:**

1. Push your changes to the repository
2. Create a git tag:
   ```bash
   git tag v1.0.1  # Use semantic versioning
   git push origin v1.0.1
   ```
3. GitHub Actions will automatically:
   - Build the application
   - Create a release on GitHub
   - Upload the portable exe to the release

**For users:**
- Download the latest exe from [Releases](https://github.com/Abstrengin/alien-rpg/releases)
- The app checks for updates automatically on launch (electron-updater)

## Core Rulebook References

This generator implements the following tables and systems from the Alien RPG Core Rulebook:

- **Star Types**: p.330
- **Star System Generator**: p.340
- **Planet Size**: p.332
- **Atmosphere**: p.332
- **Temperature**: p.334
- **Geosphere**: p.334
- **Planetary Terrain**: p.335-336
- **Ice Planet Terrain**: p.335-336
- **Colony Size**: p.336
- **Colony Mission**: p.336-337
- **Orbit**: p.337
- **Factions**: p.337-338
- **Allegiance**: p.338

All modifiers and generation rules are implemented according to the official rulebook specifications.

## Technical Details

### Technologies Used

- **Vue 3**: Progressive JavaScript framework with Composition API
- **Vite**: Next-generation frontend build tool
- **Bootstrap 5**: CSS framework for responsive design
- **LocalStorage**: For persisting history and theme preferences

### Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deployment & Releases

### Automated Release Process

This project uses GitHub Actions to automatically build and release the portable executable.

**To create a new release:**

1. Push your changes to the repository
2. Create a git tag:
   ```bash
   git tag v1.0.1  # Use semantic versioning
   git push origin v1.0.1
   ```
3. GitHub Actions will automatically:
   - Build the application
   - Create a release on GitHub
   - Upload the portable exe to the release

**For users:**
- Download the latest exe from [Releases](https://github.com/Abstrengin/alien-rpg-star-system-generator/releases)
- The app checks for updates automatically on launch (electron-updater)

### Local Development & Testing

```bash
# Install dependencies
npm install

# Development server with hot reload
npm run dev

# Build web bundle
npm run build

# Electron development (requires two terminals)
npm run electron-dev

# Build portable executable
npm run electron-build
```

### Web Component Usage

The app can also be embedded as a web component in WordPress or other websites:

```html
<script src="dist/alien-rpg-planet-generator.js"></script>
<link rel="stylesheet" href="dist/alien-rpg-planet-generator.css" />

<ttbg-app></ttbg-app>
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is a fan-made tool for the Alien RPG and is not officially affiliated with Free League Publishing. The Alien RPG is © Free League Publishing.

## Acknowledgments

- Free League Publishing for creating the Alien RPG
- The Alien RPG community for feedback and suggestions

## Support

For issues, questions, or suggestions:

- Open an issue on GitHub
- Visit [Ties That Bind Gaming](https://www.tiesthatbindgaming.com)

## Version History

### v1.0.0 (Current - Multi-App Ecosystem)

- ✨ Added Space Travel Calculator tool
- 🔀 Restructured as multi-app ecosystem with tab navigation
- 🎨 Updated dark mode toggle to work consistently across all apps
- 📝 Unified header with app title and theme toggle
- 🧹 Code organization with shared components and composables
- 📚 Updated README for multi-app architecture

### Previous Releases

See [GitHub Releases](https://github.com/Abstrengin/alien-rpg/releases) for older versions
