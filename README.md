# Tabster - Simplified Tab Management Extension

A lightweight Chrome extension that provides user authentication with a clean, modern interface. This simplified version focuses on authentication screens and includes a basic dashboard.

## Features

- **User Authentication**
  - Sign In / Sign Up functionality
  - Password reset via email
  - Secure authentication using Supabase

- **Clean Interface**
  - Modern, responsive design
  - Dark/Light theme support
  - Smooth transitions and animations

- **Simple Dashboard**
  - Welcome message display
  - User profile integration
  - Quick logout functionality

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory
5. The Tabster icon should appear in your toolbar

## Usage

1. Click the Tabster icon in your toolbar
2. Sign up for a new account or sign in with existing credentials
3. Enjoy the clean dashboard with personalized welcome messages
4. Use the theme toggle in the top-right to switch between dark and light modes

## Project Structure

- `popup.html` - Main extension popup interface
- `manifest.json` - Extension configuration
- `css/popup.css` - Styling for all screens
- `js/popup.js` - Main application logic
- `js/background.js` - Background script for extension management
- `js/content.js` - Content script for web page integration
- `js/supabase.js` - Authentication helpers
- `lib/supabase.js` - Supabase client library
- `icons/` - Extension icons and logos

## Authentication

The extension uses Supabase for authentication, providing:
- Secure user registration and login
- Email verification
- Password reset functionality
- Session management

## Development

This is a simplified version focusing on core authentication features. The codebase is clean and well-structured for easy maintenance and future feature additions.

## License

This project is open source and available under the [MIT License](LICENSE). 