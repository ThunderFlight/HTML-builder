const fs = require('fs');
const promise = require('node:fs/promises');
const distDir = promise.mkdir('project-dist', { recursive: true });

const bundleCss = fs.createWriteStream(
  './06-build-page/project-dist/styles.css',
);
const bundleHtml = fs.createWriteStream(
  './06-build-page/project-dist/index.html',
);
const readStreamTemplate = fs.createReadStream('./06-build-page/template.html');
readStreamTemplate.on('data', (chunk) => {
  bundleHtml.write(chunk.toString());
});

async function getCss(linkDir = './06-build-page/styles/') {
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

async function getAssets(linkDir = './06-build-page/assets/') {
  const files = await promise.readdir(linkDir);
  const path = require('path');
  for (let file of files) {
    file = file.trim();
    const extension = path.extname(`${file}`);
    if (extension.length === 0) {
      const modifiedFile = file.trim();
      const bundleAssets = await promise.mkdir(
        `./06-build-page/project-dist/assets/${modifiedFile}`,
        {
          recursive: true,
        },
      );
    }
    if (extension.split('').includes('.')) {
      const stream = fs.createWriteStream(
        `${linkDir.slice(2, linkDir.length)}${file}`,
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
  const files = await promise.readdir('./06-build-page/components/');
  for (const file of files) {
    const sourceFilePath = './06-build-page/project-dist/index.html';
    const replacementFilePath = `./06-build-page/components/${file}`;

    fs.readFile(sourceFilePath, 'utf8', (err, sourceContent) => {
      if (err) {
        throw err;
      }

      fs.readFile(replacementFilePath, 'utf8', (err, replacementContent) => {
        if (err) {
          throw err;
        }

        const modifiedContent = sourceContent.replace(
          `{{${file.slice(0, file.length - 5)}}}`,
          replacementContent,
        );

        fs.writeFile(sourceFilePath, modifiedContent, 'utf8', (err) => {
          if (err) {
            throw err;
          }
        });
      });
    });
  }
}

function createDist() {
  getCss();
  getAssets();
  getHtml();
}
createDist();
