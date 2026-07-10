import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

sharp.cache(false);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirs = [
  path.join(__dirname, 'src', 'assets', 'opening'),
  path.join(__dirname, 'src', 'assets', 'openingmobile')
];

async function processImages() {
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (file.endsWith('.webp')) {
        const filePath = path.join(dir, file);
        
        try {
          const fileBuffer = fs.readFileSync(filePath);
          const { data, info } = await sharp(fileBuffer)
            .ensureAlpha() // Guarantee 4 channels (RGBA)
            .raw()
            .toBuffer({ resolveWithObject: true });
          
          for (let i = 0; i < data.length; i += info.channels) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Define threshold for "white"
            if (r > 235 && g > 235 && b > 235) {
              data[i + 3] = 0; // Set Alpha to 0 (fully transparent)
            }
          }
          
          await sharp(data, {
            raw: {
              width: info.width,
              height: info.height,
              channels: info.channels
            }
          })
          .webp({ quality: 80 })
          .toFile(filePath + '.temp');

          fs.unlinkSync(filePath);
          fs.renameSync(filePath + '.temp', filePath);
          console.log(`Processed ${file}`);
        } catch (err) {
          console.error(`Error processing ${file}:`, err);
        }
      }
    }
  }
  console.log("All done making white transparent!");
}

processImages().catch(console.error);
