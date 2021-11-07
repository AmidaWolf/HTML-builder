const path = require('path');
const fsPromises = require('fs/promises');

//пути для копирования
const sourceFolderPath = path.join(__dirname, 'files');
const destinationFolderPath = path.join(__dirname, 'files-copy');

//промисы нужны для того, чтобы не было "конкуренции"
//(когда файл копируется и асинхронно его пытаются удалить)
async function copyAll() {
  try {
    //создаём папку
    await fsPromises.mkdir(destinationFolderPath, {recursive: true});
    const destinationFiles = await fsPromises.readdir(destinationFolderPath);
    //удаляем файлы из папки, если они есть
    for (const destinationFile of destinationFiles) {
      let curPath = path.join(destinationFolderPath, destinationFile);
      await fsPromises.unlink(curPath);
    }
    //читаем папку сырцов
    const sourceFiles = await fsPromises.readdir(sourceFolderPath, {withFileTypes: true});
    //копируем файлы
    for (const sourceFile of sourceFiles) {
      let sourceFilePath = path.join(sourceFolderPath, sourceFile.name);
      let destinationFilePath = path.join(destinationFolderPath, sourceFile.name);
      await fsPromises.copyFile(sourceFilePath, destinationFilePath);
    }
  } catch (err) {
    console.error(err);
  }
}

copyAll().then(() => console.log('Files copy successfully'));
