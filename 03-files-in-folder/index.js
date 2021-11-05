const fs = require('fs');
const path = require('path');

//ВНИМАНИЕ!!! Не проходит по подпапкам, в условии сказано выводить файлы из текущей папки
const dirPath = path.join(__dirname, 'secret-folder');

fs.readdir(dirPath, {withFileTypes: true}, (err, files) => {
  if (err) throw err;

  files.forEach(file => {
    //отсеиваем папки
    if (!file.isDirectory()) {
      let filePath = path.join(dirPath, file.name);

      //берём свойства файла (нужно только для size)
      fs.stat(filePath, (err1, stats) => {
        if (err1) throw err1;

        let nameFile = path.parse(filePath).name;
        let extNameFile = path.extname(filePath);
        let sizeFile = stats.size * 0.001;
        console.log(nameFile + '-' + extNameFile + '-' + sizeFile + 'kb');
      });
    }
  });
});
