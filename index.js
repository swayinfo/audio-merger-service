const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json({ limit: '100mb' }));

const PORT = process.env.PORT || 8080;

// Создаем временную директорию
const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// Endpoint для объединения MP3 из base64
app.post('/merge-audio', async (req, res) => {
  const { files } = req.body;
  
  if (!files || !Array.isArray(files) || files.length < 2) {
    return res.status(400).json({ 
      success: false,
      error: 'Нужно минимум 2 base64 аудиофайла в массиве "files"' 
    });
  }

  const timestamp = Date.now();
  const filePaths = [];
  
  try {
    // Сохраняем все файлы из base64
    console.log(`📥 Получено ${files.length} файлов для объединения`);
    
    for (let i = 0; i < files.length; i++) {
      const filePath = path.join(tempDir, `part_${timestamp}_${i}.mp3`);
      const buffer = Buffer.from(files[i], 'base64');
      fs.writeFileSync(filePath, buffer);
      filePaths.push(filePath);
      console.log(`✅ Файл ${i + 1} сохранен: ${(buffer.length / 1024).toFixed(2)} KB`);
    }

    // Объединяем через ffmpeg
    const outputPath = path.join(tempDir, `merged_${timestamp}.mp3`);

    console.log('🎵 Объединяю файлы через ffmpeg...');
    
    // Запускаем ffmpeg для объединения
    await new Promise((resolve, reject) => {
      const command = ffmpeg();
      
      // Добавляем все файлы как входы
      filePaths.forEach(filePath => {
        command.input(filePath);
      });
      
      // Используем filter_complex для объединения
      const filterComplex = filePaths.map((_, i) => `[${i}:a]`).join('') + `concat=n=${filePaths.length}:v=0:a=1[out]`;
      
      command
        .complexFilter(filterComplex)
        .outputOptions(['-map [out]'])
        .audioCodec('libmp3lame')
        .audioBitrate('128k')
        .on('start', (cmd) => {
          console.log('FFmpeg команда:', cmd);
        })
        .on('progress', (progress) => {
          if (progress.percent) {
            console.log(`Прогресс: ${progress.percent.toFixed(2)}%`);
          }
        })
        .on('end', () => {
          console.log('✅ Файлы успешно объединены');
          resolve();
        })
        .on('error', (err) => {
          console.error('❌ Ошибка ffmpeg:', err.message);
          reject(err);
        })
        .save(outputPath);
    });

    // Читаем результат
    const mergedBuffer = fs.readFileSync(outputPath);
    const base64Result = mergedBuffer.toString('base64');
    
    // Удаляем временные файлы
    filePaths.forEach(p => {
      if (fs.existsSync(p)) fs.unlinkSync(p);
    });
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

    console.log(`✅ Готово! Размер: ${(mergedBuffer.length / 1024 / 1024).toFixed(2)} MB`);

    // Возвращаем результат
    res.json({
      success: true,
      file: base64Result,
      size: mergedBuffer.length,
      mimeType: 'audio/mpeg',
      parts: files.length
    });

  } catch (error) {
    console.error('❌ Ошибка:', error);
    
    // Очистка при ошибке
    filePaths.forEach(p => {
      if (fs.existsSync(p)) {
        try { fs.unlinkSync(p); } catch (e) {}
      }
    });
    
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Audio Merger Service (Base64)',
    version: '1.1.0',
    usage: {
      endpoint: 'POST /merge-audio',
      body: {
        files: ['base64_audio_1', 'base64_audio_2', '...']
      },
      response: {
        success: true,
        file: 'base64_merged_audio',
        size: 1234567,
        mimeType: 'audio/mpeg',
        parts: 2
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Audio Merger Service запущен на порту ${PORT}`);
  console.log(`📝 Документация: http://localhost:${PORT}/`);
});
