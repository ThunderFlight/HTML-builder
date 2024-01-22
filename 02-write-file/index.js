const fs = require('fs');
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const rl = readline.createInterface({ input, output });
fs.open('myfile', 'wx', (err, fd) => {
  if (err) {
    if (err.code === 'EEXIST') {
      return;
    }

    throw err;
  }

  fs.close(fd, (err) => {
    if (err) throw err;
  });
});

const streamWrite = fs.createWriteStream('myfile.txt');

rl.on('SIGINT', () => {
  console.log('see you later :)');
  rl.pause();
});

rl.on('line', (text) => {
  if (text === 'exit') {
    console.log('see you later :)');
    rl.pause();
  }
  streamWrite.write(`${text}\n`);
});
