# Reaper Web Remote

A responsive web-based remote control interface for Reaper DAW.

## Features

- **Transport Controls**: Play, Pause, Stop, Record, Abort
- **Project Management**: Save and Discard (Undo)
- **Time Display**: Shows current playback position
- **Quick Actions**: Clear All (select all items, delete, go to start), Select All, Go to Start
- **Real-time State Sync**: UI automatically reflects Reaper's transport state
- **Responsive Design**: Works on desktop, tablet, and mobile

## Setup

### 1. Enable Reaper Web Interface

1. Open Reaper
2. Go to **Preferences** → **Control/OSC/web**
3. Click **Add** and select **Web browser interface**
4. Set the port (default: 8080)
5. Enable the interface

### 2. Install the Remote

Run `pnpm dist` and copy all files and directories from `dist` to the root of `reaper_web_root` directory:

**Default locations:**
- **Windows**: `C:\Users\<YourUsername>\AppData\Roaming\REAPER\reaper_www_root\`
- **macOS**: `~/Library/Application Support/REAPER/reaper_www_root/`
- **Linux**: `~/.config/REAPER/reaper_www_root/`

### 3. Access the Remote

Open your web browser and navigate to:

```
http://localhost:8080/remote/
```

(Replace `8080` with your configured port and `remote` with your directory name)

## Controls

### Transport Controls
- **Play**: Start playback
- **Pause**: Pause playback
- **Stop**: Stop playback
- **Abort**: Stop playback (abort) - do not save the recording
- **Record**: Toggle recording

### Rendering to file
- **Save**: Renders the project to an output file

### Quick Actions
- **Clear All**: Select all items, delete them, and go to start of track
- **Select All**: Select all items
- **Delete**: Deletes selected items
- **Go to Start**: Jump to the start of track

### Display
- **Time Display**: Shows current playback position in format `minutes:seconds.milliseconds`

