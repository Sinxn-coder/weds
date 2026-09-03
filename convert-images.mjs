import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const assetsDir = path.resolve('./src/assets');
const files = fs.readdirSync(assetsDir);

async function convert() {
  for (const file of files) {
    const filePath = path.join(assetsDir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isFile() && (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg'))) {
      const parsed = path.parse(file);
      const outPath = path.join(assetsDir, `${parsed.name}.webp`);
      
      console.log(`Converting ${file} to ${parsed.name}.webp...`);
      await sharp(filePath)
        .webp({ quality: 85 })
        .toFile(outPath);
        
      fs.unlinkSync(filePath); // delete original
    }
  }
  console.log('All done!');
}

convert().catch(console.error);
