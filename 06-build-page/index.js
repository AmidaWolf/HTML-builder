const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const buildFolderPath = path.join(__dirname, 'project-dist');
const buildAssetsPath = path.join(buildFolderPath, 'assets');
const sourceAssetsPath = path.join(__dirname, 'assets');

//тут вариант с очищением папки не прокатит, как в 04, так что чутка другая реализация, через rm
async function buildHTML() {
  try {
    //Проверяем, есть ли папка
    const files = await fsPromises.readdir(__dirname, { withFileTypes: true });
    //Если хоть в одном имени файла есть папка билда - очищаем её
    const isExist = files.some((item) => item.name === 'project-dist');
    if (isExist) {
      await fsPromises.rm(buildFolderPath, { force: true, recursive: true });
    }

    const templateHtmlPath = path.join(__dirname, 'template.html');
    const componentsFolderPath = path.join(__dirname, 'components');

    //читаем шаблон и создаём выходной файл
    const htmlData = await fsPromises.readFile(templateHtmlPath, 'utf-8');
    await fsPromises.mkdir(buildFolderPath);
    const htmlFilePath = path.join(buildFolderPath, 'index.html');
    await fsPromises.writeFile(htmlFilePath, htmlData);

    //берём все компоненты
    const components = await fsPromises.readdir(componentsFolderPath, { withFileTypes: true });
    //для каждого компонента берём имя и по имени заменяем и записываем в выходной файл
    for (const component of components) {
      const componentNameFile = component.name.split('.')[0];
      const componentExtNameFile = component.name.split('.')[1];
      if (component.isFile() && componentExtNameFile === 'html') {
        const componentFilePath = path.join(componentsFolderPath, component.name);
        const componentFileData = await fsPromises.readFile(componentFilePath, 'utf-8');
        const templateTag = `{{${componentNameFile}}}`;
        const dataNewFile = await fsPromises.readFile(htmlFilePath, 'utf-8');
        await fsPromises.writeFile(htmlFilePath, dataNewFile.replace(templateTag, componentFileData));
      }
    }
  } catch (err) {
    console.error('buildHTML: ' + err);
  }
}

//чуть изменённая функция из задания 05, можно было бы поправить там и импортнуть сюда, но лень)
async function buildCSS() {
  const destinationFilePath = path.join(buildFolderPath, 'style.css');
  const sourceFolderPath = path.join(__dirname, 'styles');
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
    console.error('buildCSS: ' + err);
  }
}

//можно было бы сразу в 04 написать с рекурсией и входными параметрами, но всё та же лень)
async function copyFolder(sourceFolder, buildFolder) {
  try {
    //создаём папку
    await fsPromises.mkdir(buildFolder);
    const sourceItems = await fsPromises.readdir(sourceFolder, { withFileTypes: true });
    //копируем все файлы, для папок используем рекурсию
    for (const sourceItem of sourceItems) {
      const sourceItemPath = path.join(sourceFolder, sourceItem.name);
      const buildItemPath = path.join(buildFolder, sourceItem.name);

      if (sourceItem.isFile()) {
        await fsPromises.copyFile(sourceItemPath, buildItemPath);
      } else {
        await copyFolder(sourceItemPath, buildItemPath);
      }
    }
  } catch (err) {
    console.error('copyFolder: ' + err);
  }
}

async function buildPage() {
  try {
    await buildHTML();
    await buildCSS();
    await copyFolder(sourceAssetsPath, buildAssetsPath);
  } catch (err) {
    console.error(err);
  }
}
//стоило бы и вывод ошибок по-человечески сделать, но расчёт на то, что каждый модуль свою ошибку и так выкинет)
buildPage().then(() => {
  console.log('Build completed successfully');
});
