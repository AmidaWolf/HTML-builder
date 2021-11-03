const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(file); //создаём поток для чтения файла
readStream.on('data', chunk => {
  process.stdout.write(chunk); //вывод в консоль чанками
});
