# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-12-18

### Added

- **Desktop Application**: Packaged as portable Windows executable (no installation required)
- **Dark Mode Toggle**: Switch between light and dark themes with automatic persistence
- **Dark Mode Support**: Full dark theme implementation with smooth transitions
- **Card-Based UI**: Improved visual hierarchy with card-based layout instead of divider lines
- **Export Controls**: Refined layout with title/link on left and controls on right
- **System Theme Detection**: Fallback to system preference when no user preference is saved

### Changed

- Refactored dark mode CSS from media queries to class-based selectors for better toggle responsiveness
- Updated styling for export buttons to support variable padding
- Improved button alignment and visual consistency

### Fixed

- Fixed white screen issue in production builds (relative asset paths)
- Resolved electron-updater module missing error with graceful degradation
- Fixed background color transitions on dark mode toggle
- Fixed export button height misalignment with dark mode toggle

### Technical Details

- Built with Vue 3.5.13 and Vite 6.0.1
- Electron 39.2.7 for desktop packaging
- Tailwind CSS 3.4.1 with class-based dark mode
- electron-builder for creating portable executable
- localStorage for theme preference persistence

## Features in v1.0.0

### Generation Tools

- **Star System Generator**: Generate complete star systems with gas giants, terrestrial planets, ice planets, and asteroid belts
- **Planet Generator**: Create detailed planets with atmosphere, temperature, geosphere, and terrain
- **Colony Generator**: Generate colonies with size, missions, factions, and allegiances

### Export & History

- Copy to clipboard (formatted text)
- Download as JSON or text file
- Print-friendly layout
- Automatic generation history with ability to restore previous results

### User Experience

- Dark/Light mode toggle with persistence
- Full keyboard navigation
- Screen reader support
- Responsive design
- Smooth animations and transitions
