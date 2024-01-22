const { mkdir } = require('node:fs/promises');
const promise = require('node:fs/promises');
const fs = require('fs');

async function take() {
  const dirCreation = await mkdir('copy', { recursive: true });
  const files = await promise.readdir('./files/');
  for (const file of files) {
    const readStream = fs.createReadStream(`./files/${file}`);
    const writeStream = fs.createWriteStream(`./copy/${file}`);
    readStream.on('data', (chunk) => {
      writeStream.write(chunk.toString());
    });
  }
  return dirCreation;
}

take();
