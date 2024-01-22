const fs = require('fs');
const promise = require('node:fs/promises');

const bundleCss = fs.createWriteStream('./project-dist/bundle.css');
async function getCss(linkDir = './styles/') {
  const files = await promise.readdir(linkDir);
  const path = require('path');
  for (const file of files) {
    const extension = path.extname(`${file}`);
    if (extension === '.css') {
      const readStream = fs.createReadStream(linkDir + file);
      readStream.on('data', (chunk) => {
        bundleCss.write(chunk.toString());
      });
    }
  }
  for (const file of files) {
    const extension = path.extname(`${file}`);
    if (!extension.split('').includes('.')) {
      getCss(`./${file}/`);
    }
  }
}

getCss();
