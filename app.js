const http = require('http')
const fs = require('fs')
const path = require('path')

const server = http.createServer((req, res) => {
    const videoPath = path.join(__dirname, 'filme.mkv')
    const stat = fs.statSync(videoPath)
    const fileSize = stat.size
    const range = req.headers.range

    const mimeType = 'video/mkv'


    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Length', fileSize);
    res.setHeader('Accept-Ranges', 'bytes');

    if (range) {
        const parts = range.replace(/bytes=/, '').split('-')
        const start = parseInt(parts[0], 10)
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
        const chunksize = end - start + 1
        
        res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
        res.setHeader('Content-Length', chunksize);
        
        const file = fs.createReadStream(videoPath, { start, end })
        file.pipe(res)
    } else {
        const file = fs.createReadStream(videoPath)
        file.pipe(res)
    }
})
const PORT = 3000

server.listen(PORT, () => {
    console.log('rodando na porta 3000')
})