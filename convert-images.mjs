import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const assetsDir = path.resolve('./src/assets');
const files = fs.readdirSync(assetsDir);

async function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // skip desktopflower as it is an animation sequence
      if (file !== 'desktopflower') {
        await processDir(filePath);
      }
    } else if (stat.isFile() && (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg'))) {
      const parsed = path.parse(file);
      const outPath = path.join(dir, `${parsed.name}.webp`);
      
      console.log(`Converting ${filePath} to ${parsed.name}.webp...`);
      await sharp(filePath)
        .webp({ quality: 85 })
        .toFile(outPath);
        
      fs.unlinkSync(filePath); // delete original
    }
  }
}

async function convert() {
  await processDir(assetsDir);
  console.log('All done!');
}

convert().catch(console.error);
