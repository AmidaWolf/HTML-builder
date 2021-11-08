const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const sourceFolderPath = path.join(__dirname, 'styles');
const destinationFolderPath = path.join(__dirname, 'project-dist');
const destinationFilePath = path.join(destinationFolderPath, 'bundle.css');

async function buildCSS() {
  try {
    //создаём файл (создаст новый, даже если есть старый)
    await fsPromises.open(destinationFilePath, 'w');
    //читаем папку сырцов
    const sourceFiles = await fsPromises.readdir(sourceFolderPath);
    for (const sourceFile of sourceFiles) {
      let sourceFilePath = path.join(sourceFolderPath, sourceFile);
      let extNameFile = path.extname(sourceFilePath);
      if (extNameFile === '.css') {
        //читаем каждый файл чанками и записываем их в конец файла
        const input = fs.createReadStream(sourceFilePath);
        input.on('data', partData => {
          fs.appendFile(destinationFilePath, partData, err => {if (err) throw err;});
        });
        input.on('error', error => console.log('Error', error.message));
      }
    }
  } catch (err) {
    console.error(err);
  }
}

buildCSS().then(() => console.log('CSS merge successfully'));
