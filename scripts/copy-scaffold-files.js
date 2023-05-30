import fs from 'fs';

console.log('Copying scaffold files from ./src/scaffolds to ./dist/scaffolds');
fs.cpSync('./src/scaffolds', './dist/scaffolds', { recursive: true,  });