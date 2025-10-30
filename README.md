# Audio Merger Service для n8n

Этот сервис объединяет MP3 файлы для вашего Telegram бота.

## 📋 Что это делает?

Принимает несколько аудио файлов в формате base64 и возвращает один объединенный MP3 файл.

## 🚀 Как развернуть на Railway (бесплатно)

Следуйте пошаговой инструкции в файле **ИНСТРУКЦИЯ.md** или **БЫСТРЫЙ_СТАРТ.txt**

## 📡 API

### Endpoint: `POST /merge-audio`

**Запрос:**
```json
{
  "files": ["base64_audio_1", "base64_audio_2"]
}
```

**Ответ:**
```json
{
  "success": true,
  "file": "base64_merged_audio",
  "size": 1234567,
  "mimeType": "audio/mpeg",
  "parts": 2
}
```

## ⚙️ Технологии

- Node.js 18
- Express
- FFmpeg
- Railway.app (хостинг)
