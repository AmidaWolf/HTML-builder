const fs = require('fs');
const path = require('path');
const readline = require('readline');

const file = path.join(__dirname, 'consoleText.txt');

//ВНИМАНИЕ!!! Запись в файл производится после начала новой строки, exit работает так же только в новой строке
//(вводим текст или exit, тыкаем enter, получаем введённый текст в файле или выход).
//создаём файл и уже после создания начинаем с ним работать
fs.writeFile(file, '', err => {
  if (err) {
    throw err;
  }

  let welcomeText = 'Please enter text: ';
  let exitText = 'Press "ctrl+c" or write "exit"';

  //создаём интерфейс для ввода/вывода
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  //выводим приветствие
  rl.output.write(exitText + '\n' + welcomeText);

  //вешаем обработчик на строку ввода
  rl.on('line', input => {
    if (input === 'exit') {
      rl.close();
      return;
    }

    //добавляем к файлу строку ввода с переносом в конце
    fs.appendFile(file, input + '\n', err => {
      if (err) {
        throw err;
      }
    });
  });

  //вешаем обработчик на завершение работы для вывода прощального текста
  rl.on('close', () => {
    return console.log('Writing completed');
  });
});
