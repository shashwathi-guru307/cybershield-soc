import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const ignoreList = new Set([
  'node_modules',
  'dist',
  '.git',
  '.DS_Store',
  'cybershield-soc.zip',
]);

async function createZip() {
  const zip = new JSZip();

  function addDir(currentDir, zipFolder) {
    const items = fs.readdirSync(currentDir);
    for (const item of items) {
      if (ignoreList.has(item)) continue;
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        const sub = zipFolder.folder(item);
        if (sub) addDir(fullPath, sub);
      } else if (stat.isFile()) {
        zipFolder.file(item, fs.readFileSync(fullPath));
      }
    }
  }

  addDir(rootDir, zip);

  console.log('Generating ZIP buffer...');
  const buffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  const targetPath = path.join(publicDir, 'cybershield-soc.zip');
  fs.writeFileSync(targetPath, buffer);
  console.log(`ZIP created successfully at ${targetPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

createZip().catch((err) => {
  console.error('Error generating zip:', err);
  process.exit(1);
});
