const fs = require('node:fs');
const readable = fs.createReadStream('./01-read-file/text.txt');
readable.on('data', (chunk) => console.log(chunk.toString()));
