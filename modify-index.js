const fs = require('fs');

const indexPath = './dist/index.html';

fs.readFile(indexPath, 'utf-8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const modifiedData = data
    .replace(/\/assets\//g, './assets/')
    .replace(/\/src\//g, './src/');

  fs.writeFile(indexPath, modifiedData, 'utf-8', (err) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log('Modified index.html successfully.');
  });
});
