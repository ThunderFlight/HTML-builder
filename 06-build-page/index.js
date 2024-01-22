const fs = require('fs');
const promise = require('node:fs/promises');
const distDir = promise.mkdir('project-dist', { recursive: true });

const bundleCss = fs.createWriteStream('./project-dist/styles.css');
const bundleHtml = fs.createWriteStream('./project-dist/index.html');
const readStreamTemplate = fs.createReadStream('./template.html');
readStreamTemplate.on('data', (chunk) => {
  bundleHtml.write(chunk.toString());
});

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

async function getAssets(linkDir = './assets/') {
  const files = await promise.readdir(linkDir);
  const path = require('path');
  for (let file of files) {
    file = file.trim();
    const extension = path.extname(`${file}`);
    if (extension.length === 0) {
      const modifiedFile = file.trim();
      const bundleAssets = await promise.mkdir(
        `./project-dist/assets/${modifiedFile}`,
        {
          recursive: true,
        },
      );
    }
    if (extension.split('').includes('.')) {
      const stream = fs.createWriteStream(
        `./project-dist/${linkDir.slice(2, linkDir.length)}${file}`,
      );
      const readStream = fs.createReadStream(linkDir + file);
      readStream.on('data', (chunk) => {
        stream.write(chunk.toString());
      });
    }
  }
  for (const file of files) {
    const extension = path.extname(`${file}`);
    if (!extension.split('').includes('.')) {
      getAssets(`${linkDir}${file.trim()}/`);
    }
  }
}

async function getHtml() {
  const files = await promise.readdir('./components/');
  for (const file of files) {
    const readIndex = fs.createReadStream('./project-dist/index.html');
    const writeIndex = fs.createWriteStream('./project-dist/index.html');
    const data = fs.readFileSync(`./components/${file}`, 'utf8');
    readIndex.on('data', (chunk) => {
      const regExp = new RegExp(`{{${file.slice(0, file.length - 5)}}}`);
      if (regExp.test(chunk.toString())) {
        writeIndex.write(
          chunk
            .toString()
            .replace(`{{${file.slice(0, file.length - 5)}}}`, data),
        );
      }
    });
  }
}

function createDist() {
  getCss();
  getAssets();
  getHtml();
}
createDist();
