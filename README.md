# Reaper Web Remote

A responsive web-based remote control interface for Reaper DAW with a clean, easily customizable UI.

## Features

- **Transport Controls**: Play, Pause, Stop, Record
- **Project Management**: Save and Discard (Undo)
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Easy Styling**: CSS custom properties for quick theme customization

## Setup

### 1. Enable Reaper Web Interface

1. Open Reaper
2. Go to **Preferences** → **Control/OSC/web**
3. Click **Add** and select **Web browser interface**
4. Set the port (default: 8080)
5. Enable the interface

### 2. Install the Remote

Copy all files from this directory to your Reaper web root directory:

**Default locations:**
- **Windows**: `C:\Users\<YourUsername>\AppData\Roaming\REAPER\reaper_www_root\`
- **macOS**: `~/Library/Application Support/REAPER/reaper_www_root/`
- **Linux**: `~/.config/REAPER/reaper_www_root/`

Create a subdirectory (e.g., `reaper_www_root/remote/`) and place the files there.

### 3. Access the Remote

Open your web browser and navigate to:

```
http://localhost:8080/remote/
```

(Replace `8080` with your configured port and `remote` with your directory name)

## Customization

The UI is fully customizable through CSS custom properties in `style.css`:

```css
:root {
    --primary-bg: #1a1a1a;        /* Main background */
    --secondary-bg: #2a2a2a;      /* Card background */
    --accent-color: #4a9eff;      /* Accent color */
    --record-color: #ff4444;      /* Record button */
    --play-color: #44ff88;        /* Play active state */
    /* ... and more */
}
```

## Controls

- **Play**: Start playback
- **Pause**: Pause playback
- **Stop**: Stop playback
- **Record**: Toggle recording
- **Save**: Save current project
- **Discard**: Undo last action (with confirmation)

## Technical Details

The remote communicates with Reaper using HTTP requests to Reaper's built-in web interface.

Command IDs used:
- Play: 1007
- Pause: 1008
- Stop: 1016
- Record: 1013
- Save: 40026
- Undo: 40029

## Browser Compatibility

Works with all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari

## License

MIT
