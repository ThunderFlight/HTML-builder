const fs = require('node:fs');
const readable = fs.createReadStream('text.txt');
readable.on('data', (chunk) => console.log(chunk.toString()));
