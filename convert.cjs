const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.join(__dirname, 'src', 'assets', 'opening');

const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));

(async () => {
  for (const file of files) {
    const filePath = path.join(dir, file);
    const webpPath = path.join(dir, file.replace('.png', '.webp'));
    console.log(`Converting ${file} to WebP...`);
    try {
      await sharp(filePath).webp({ quality: 80 }).toFile(webpPath);
      // Delete original png to save space
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error(`Error converting ${file}:`, err);
    }
  }
  console.log('Finished converting all images to WebP! Memory print decreased significantly.');
})();
