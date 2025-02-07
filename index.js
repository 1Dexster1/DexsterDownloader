const express = require('express');
const ytdl = require('@distube/ytdl-core');
const cors = require('cors');

const app = express();
app.use(cors()); // السماح بالطلبات من أي مصدر

// صفحة الفحص
app.get('/', (req, res) => {
    res.json({ status: 'API is running', usage: '/download?url=YOUTUBE_URL&type=audio|video' });
});

// API لتحميل الفيديو أو الصوت
app.get('/download', async (req, res) => {
    const { url, type } = req.query;

    if (!url || !type || !['audio', 'video'].includes(type)) {
        return res.status(400).json({ error: 'Invalid parameters. Use /download?url=YOUTUBE_URL&type=audio|video' });
    }

    try {
        res.header('Content-Disposition', `attachment; filename=${type === 'audio' ? 'audio.mp3' : 'video.mp4'}`);
        const stream = ytdl(url, {
            filter: type === 'audio' ? 'audioonly' : 'videoandaudio',
            quality: 'highest',
            requestOptions: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                },
            },
        });
        stream.pipe(res);
    } catch (error) {
        console.error('Download Error:', error.message);
        res.status(500).json({ error: 'Download failed. Please check the URL or try again later.' });
    }
});

// تشغيل السيرفر
const PORT = process.env.PORT || 6231;
app.listen(PORT, () => {
    console.log(`API is running on http://localhost:${PORT}`);
});
