# Modern Web Music Player

A feature-rich, responsive music player built with HTML5, CSS3, and JavaScript. This project demonstrates modern web development practices and provides an excellent user experience for playing audio files.

## 🎵 Features

### Core Functionality
- **Audio Playback**: Play, pause, and control audio files using HTML5 Audio API
- **Playlist Management**: Add, remove, and organize songs in a dynamic playlist
- **Progress Control**: Seek to different parts of songs using an interactive progress bar
- **Volume Control**: Adjust audio volume with a dedicated slider
- **Song Information**: Display title, artist, and album information

### Advanced Features
- **Shuffle Mode**: Randomize song playback order
- **Repeat Modes**: Support for repeat one, repeat all, and no repeat
- **Keyboard Shortcuts**: Control playback using keyboard keys
- **Theme Toggle**: Switch between light and dark themes
- **Drag & Drop**: Upload audio files by dragging them into the application
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **File Upload**: Support for multiple audio formats (MP3, WAV, OGG, M4A)
- **Visual Feedback**: Animated album art and progress indicators
- **Offline Support**: Service Worker for offline functionality

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, for file uploads)

### Installation
1. Clone or download the repository
2. Open `index.html` in your web browser
3. For full functionality (file uploads), serve the files using a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using Live Server extension in VS Code
   Right-click on index.html and select "Open with Live Server"
   ```

## 📁 Project Structure

```
MusicPlayer/
├── index.html          # Main HTML structure
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript functionality
├── sw.js              # Service Worker for offline support
├── README.md          # Project documentation
└── LICENSE            # License information
```

## 🎮 How to Use

### Basic Controls
- **Play/Pause**: Click the play button or press `Space`
- **Previous/Next**: Use navigation buttons or arrow keys (`←` `→`)
- **Volume**: Adjust using the volume slider or arrow keys (`↑` `↓`)
- **Seek**: Click anywhere on the progress bar to jump to that position

### Adding Songs
1. Click the "Add Song" button
2. Select audio files from your device or drag & drop them
3. Songs will be added to your playlist automatically

### Keyboard Shortcuts
- `Space`: Play/Pause
- `←`: Previous song
- `→`: Next song
- `↑`: Increase volume
- `↓`: Decrease volume
- `M`: Toggle mute
- `S`: Toggle shuffle
- `R`: Toggle repeat mode

### Features
- **Shuffle**: Randomize playback order
- **Repeat**: Choose between repeat one, repeat all, or no repeat
- **Theme**: Toggle between light and dark themes
- **Playlist**: Manage your songs with add/remove functionality

## 🛠️ Technical Implementation

### Technologies Used
- **HTML5**: Semantic markup and Audio API
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **JavaScript ES6+**: Modern JavaScript features and DOM manipulation
- **Font Awesome**: Icon library for UI elements
- **Service Worker**: For offline functionality and caching

### Key Components

#### Audio Management
- HTML5 Audio API for playback control
- Event listeners for audio events (play, pause, ended, timeupdate)
- Volume and progress tracking

#### Playlist System
- Dynamic playlist management with add/remove functionality
- File upload with drag & drop support
- Object URL creation for local file handling

#### User Interface
- Responsive design with CSS Grid and Flexbox
- Smooth animations and transitions
- Theme switching with CSS custom properties
- Interactive progress and volume controls

#### Data Persistence
- LocalStorage for theme preferences
- Service Worker for offline caching
- File handling with proper cleanup

## 🎨 Design Features

### Visual Elements
- Modern gradient backgrounds
- Animated album art rotation during playback
- Smooth hover effects and transitions
- Responsive layout for all device sizes
- Clean, intuitive user interface

### User Experience
- Drag and drop file upload
- Keyboard navigation support
- Visual feedback for all interactions
- Error handling and user notifications
- Accessible controls and indicators

## 🔧 Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## 📱 Mobile Support

The application is fully responsive and includes:
- Touch-friendly controls
- Optimized layout for mobile screens
- Gesture support for progress and volume controls
- Mobile-specific styling adjustments

## 🤝 Contributing

This project is part of an internship assignment. Suggestions and improvements are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Font Awesome for the icon library
- Web Audio API documentation and examples
- Modern web development best practices
- Responsive design principles

## 📞 Support

For questions or issues, please refer to the code comments or create an issue in the repository.

---

**Author**: Nirdesh Jain  
**Project**: Modern Web Music Player  
**Purpose**: Unified Mentor Internship Assignment  
**Date**: July 2025
