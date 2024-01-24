const { mkdir } = require('node:fs/promises');
const promise = require('node:fs/promises');
const fs = require('fs');

async function take() {
  const dirCreation = await mkdir('./04-copy-directory/copy', {
    recursive: true,
  });
  const files = await promise.readdir('./04-copy-directory/files/');
  for (const file of files) {
    const readStream = fs.createReadStream(`./04-copy-directory/files/${file}`);
    const writeStream = fs.createWriteStream(
      `./04-copy-directory/copy/${file}`,
    );
    readStream.on('data', (chunk) => {
      writeStream.write(chunk.toString());
    });
  }
  return dirCreation;
}

take();
