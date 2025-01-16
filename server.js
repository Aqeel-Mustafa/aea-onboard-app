const express = require('express')
const path = require('path');
const app = express()
const port = 8080;
const fs = require('fs');
const http = require("http").createServer(app);
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})
app.get("/video", async(req, res) => {
   const range = req.headers.range;
  if (!range) {
    return res.status(400).send('Requires Range header');
  }

  // Path to your video file
  const videoPath = path.join(__dirname, 'media', 'sample.mp4');

  // Get the video file size
  const videoSize = fs.statSync(videoPath).size;

  // Parse the Range header to get the start and end byte positions
  const CHUNK_SIZE = 10 ** 6; // 1MB per chunk
  const start = Number(range.replace(/\D/g, ''));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  // Calculate content length
  const contentLength = end - start + 1;

  // Create headers for partial content
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': 'video/mp4',
  };

  res.writeHead(206, headers);

  // Stream the video chunk
  const videoStream = fs.createReadStream(videoPath, { start, end });
  videoStream.pipe(res);
  });
//   app.use('/api/v1', router);
http.listen(port,()=>console.log(`Server is running on ${port}`));