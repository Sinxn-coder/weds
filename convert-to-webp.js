import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirs = [
  path.join(__dirname, 'src', 'assets', 'opening'),
  path.join(__dirname, 'src', 'assets', 'openingmobile')
];

async function convert() {
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (file.endsWith('.png')) {
        const inputPath = path.join(dir, file);
        const webpPath = path.join(dir, file.replace('.png', '.webp'));
        
        await sharp(inputPath)
          .webp({ quality: 80 })
          .toFile(webpPath);
          
        fs.unlinkSync(inputPath);
        console.log(`Converted and deleted ${file}`);
      }
    }
  }
  console.log("Done.");
}

convert().catch(console.error);
