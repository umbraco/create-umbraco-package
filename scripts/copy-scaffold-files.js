import fs from 'fs';

if(fs.existsSync('./dist/scaffolds')) {
    console.log('Deleting existing scaffold files in ./dist/scaffolds');
    fs.rmSync('./dist/scaffolds', { recursive: true, force: true });
}

console.log('Copying scaffold files from ./src/scaffolds to ./dist/scaffolds');
fs.cpSync('./src/scaffolds', './dist/scaffolds', { recursive: true,  });