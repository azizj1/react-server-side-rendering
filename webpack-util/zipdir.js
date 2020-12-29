const yazl = require('yazl');
const fs = require('fs');
const path = require('path');

console.log(process.argv.slice(2));


const zipfile = new yazl.ZipFile();
const dir = path.resolve(__dirname, '..', 'src');
console.log('dir', dir);
const files = fs.readdirSync(dir).filter(f => !fs.statSync(path.resolve(dir, f)).isDirectory());

console.log(files);

files.forEach(f => zipfile.addFile(path.resolve(dir, f), f));
zipfile.outputStream.pipe(fs.createWriteStream('output.zip')).on('close', () => console.log('woohoo'));
zipfile.end();
