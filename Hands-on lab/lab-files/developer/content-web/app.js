const express = require('express');
const http = require('http');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'dist/content-web')));
app.get('/config/content', function (req, res) {
    const contentApiUrl = process.env.CONTENT_API_URL || "http://localhost:3001/";
    res.send({ "contentUrl": contentApiUrl });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/content-web/index.html'));
});
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => console.log('Running'));