const fsPromise = require('node:fs/promises');
const fs = require('fs');

async function take() {
  try {
    const files = await fsPromise.readdir('./03-files-in-folder/secret-folder');
    for (const file of files) {
      const controller = new AbortController();
      const size = await fsPromise.stat(
        `./03-files-in-folder/secret-folder/${file}`,
      );
      const path = require('path');
      const extension = path.extname(`${file}`);
      const name = path.basename(`${file}`, extension);
      controller.abort();
      console.log(
        `${name} - ${extension.slice(1, extension.length)} - ${
          size.size * 0.001
        }kb`,
      );
    }
  } catch (err) {
    console.error(err);
  }
}
take();
