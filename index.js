const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');
const ProxyAgent = require('proxy-agent');

const app = express();
app.use(cors());

const PROXY_URL = "http://180.184.79.187:12798"; // استبدل بهذا الوكيل الحقيقي

app.get('/', (req, res) => {
    res.json({ status: 'API is running', usage: '/download?url=YOUTUBE_URL&type=audio|video' });
});

app.get('/download', async (req, res) => {
    const { url, type } = req.query;

    if (!url || !type || !['audio', 'video'].includes(type)) {
        return res.status(400).json({ error: 'Invalid parameters. Use /download?url=YOUTUBE_URL&type=audio|video' });
    }

    try {
        res.header('Content-Disposition', `attachment; filename=${type === 'audio' ? 'audio.mp3' : 'video.mp4'}`);

        const options = {
            filter: type === 'audio' ? 'audioonly' : 'videoandaudio',
            quality: 'highest',
            requestOptions: {
                agent: new ProxyAgent(PROXY_URL) // توجيه الطلبات عبر الوكيل
            }
        };

        const stream = ytdl(url, options);
        stream.pipe(res);
    } catch (error) {
        console.error('Download Error:', error.message);
        res.status(500).json({ error: 'Download failed. Please try again later.' });
    }
});

const PORT = process.env.PORT || 6231;
app.listen(PORT, () => {
    console.log(`API is running on http://localhost:${PORT}`);
});
