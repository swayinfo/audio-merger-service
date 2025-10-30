# 🎵 Audio Merger Service

A lightweight Node.js service for merging multiple MP3 files using FFmpeg. Designed for n8n workflows.

## 🚀 Features

- ✅ Merge multiple MP3 files into one
- ✅ Accept base64 encoded audio files
- ✅ Return base64 encoded result
- ✅ Built with Express + FFmpeg
- ✅ Docker ready for easy deployment

## 📡 API

### `POST /merge-audio`

**Request:**
```json
{
  "files": ["base64_audio_1", "base64_audio_2", "..."]
}
```

**Response:**
```json
{
  "success": true,
  "file": "base64_merged_audio",
  "size": 1234567,
  "mimeType": "audio/mpeg",
  "parts": 2
}
```

### `GET /`

Health check endpoint that returns service status.

## 🏗️ Deployment

### Railway (Recommended)

1. Fork this repository
2. Connect your GitHub to [Railway](https://railway.app)
3. Create new project → Deploy from GitHub repo
4. **Important:** In Settings → Build, ensure **"Dockerfile"** is selected
5. Deploy!

Railway will automatically:
- Build the Docker image with FFmpeg
- Install Node.js dependencies
- Expose the service with a public URL

### Render.com

1. Create account on [Render](https://render.com)
2. New → Web Service
3. Connect repository
4. Render auto-detects Dockerfile
5. Deploy!

### Fly.io

```bash
fly auth login
fly launch
fly deploy
```

## 🛠️ Local Development

**Prerequisites:**
- Node.js 18+
- FFmpeg installed on your system

**Install:**
```bash
npm install
```

**Run:**
```bash
npm start
```

**Test:**
```bash
curl http://localhost:8080/
```

## 📦 Files

- `index.js` - Main Express server
- `Dockerfile` - Docker configuration with FFmpeg
- `package.json` - Node.js dependencies

## 🔧 How it works

1. Receives base64 encoded MP3 files
2. Decodes to Buffer and saves temporarily
3. Uses FFmpeg concat demuxer to merge files
4. Returns merged file as base64

## 📝 Use Case

Perfect for n8n workflows that need to:
- Merge multiple audio chunks from OpenAI TTS
- Create long-form podcast episodes
- Combine audio segments

## 🆘 Troubleshooting

**Error: "ffmpeg not found"**
- Ensure Railway is using Dockerfile (not Nixpacks)
- Check Settings → Build → select "Dockerfile"

**Error: "Module not found"**
- Ensure `package.json` is in repository
- Rebuild the project

## 📄 License

MIT

## 🤝 Contributing

Issues and PRs welcome!
