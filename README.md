# Tabster - UI Only Template

A Chrome extension template showcasing a clean, modern interface for tab management. This is a UI-only version with no backend functionality - perfect for development and design purposes.

## Features

- **Modern Interface Design**
  - Clean sign-in and sign-up screens
  - Password reset interface
  - Dashboard layout with workspace cards
  - Space creation and editing forms

- **Theme Support**
  - Dark/Light theme toggle
  - Smooth transitions and animations
  - Modern CSS variables

- **Navigation System**
  - Screen-to-screen navigation
  - Form interactions (visual only)
  - Button states and hover effects

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory
5. The Tabster icon should appear in your toolbar

## Usage

1. Click the Tabster icon in your toolbar
2. Navigate through the interface screens
3. All forms and buttons are for display purposes only
4. Use the theme toggle to switch between dark and light modes

## Project Structure

- `popup.html` - Main extension popup interface with all screens
- `manifest.json` - Extension configuration (minimal permissions)
- `css/popup.css` - Complete styling for all screens and components
- `js/popup.js` - UI navigation and theme switching only
- `js/background.js` - Minimal background script
- `js/content.js` - Basic content script
- `js/supabase.js` - Empty (functionality removed)
- `lib/supabase.js` - Empty (functionality removed)
- `icons/` - Extension icons and logos

## UI Screens Included

- Welcome/Landing screen
- Sign-in form
- Sign-up form
- Password reset form
- Dashboard with workspace cards
- Create new space form
- Edit space form
- Delete confirmation modal

## Development Notes

This template provides:
- Complete UI structure for a tab management extension
- Responsive design patterns
- Theme switching implementation
- Navigation system between screens
- Form layouts and styling
- Modal implementations

Perfect for:
- UI/UX development and testing
- Chrome extension learning
- Design system development
- Frontend prototyping

## Customization

All functionality has been removed, making this template easy to customize:
- Add your own backend integration
- Modify the UI design and layout
- Extend with additional screens
- Implement actual form submission logic

## License

This project is open source and available under the [MIT License](LICENSE). 