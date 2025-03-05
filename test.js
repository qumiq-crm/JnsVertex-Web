const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputFolder = path.join(__dirname, 'assets');
const outputFolder = path.join(__dirname, 'compressed_images');

if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
}

fs.readdir(inputFolder, (err, files) => {
    if (err) {
        console.error('Error reading the directory:', err);
        return;
    }

    files.forEach(file => {
        const inputPath = path.join(inputFolder, file);
        const outputPath = path.join(outputFolder, file);
        const fileExtension = path.extname(file).toLowerCase();

        let imageProcess = sharp(inputPath)
            .resize({ width: 1920 }); // Resize to max width of 1920px while keeping aspect ratio

        // Handle different image formats
        if (fileExtension === '.png') {
            imageProcess = imageProcess.png({ quality: 80 });
        } else {
            imageProcess = imageProcess.jpeg({ quality: 80 });
        }

        imageProcess.toFile(outputPath, (err, info) => {
            if (err) {
                console.error('Error compressing', file, err);
            } else {
                console.log('Compressed:', file, '->', info.size / 1024 / 1024, 'MB');
            }
        });
    });
});
