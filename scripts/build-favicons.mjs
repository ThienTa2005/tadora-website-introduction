import sharp from 'sharp';
import fs from 'fs';

async function main() {
  const masterPath = 'public/favicon-master.png';
  if (!fs.existsSync(masterPath)) {
    throw new Error(`Master image not found at ${masterPath}`);
  }

  const masterBuf = await sharp(masterPath).toBuffer();

  const sizes = [
    { size: 16, path: 'public/favicon-16x16.png' },
    { size: 32, path: 'public/favicon-32x32.png' },
    { size: 48, path: 'public/favicon-48x48.png' },
    { size: 180, path: 'public/apple-touch-icon.png' },
    { size: 192, path: 'public/favicon-192x192.png' },
    { size: 512, path: 'public/favicon-512x512.png' },
  ];

  for (const { size, path } of sizes) {
    let pipeline = sharp(masterBuf).resize(size, size, { kernel: sharp.kernel.lanczos3 });
    if (size <= 32) {
      pipeline = pipeline.sharpen();
    }
    await pipeline.png().toFile(path);
    console.log(`Generated ${path} (${size}x${size})`);
  }

  // Generate favicon.ico (32x32 PNG container recognized by modern browsers)
  await sharp(masterBuf)
    .resize(32, 32, { kernel: sharp.kernel.lanczos3 })
    .sharpen()
    .png()
    .toFile('public/favicon.ico');
  console.log('Generated public/favicon.ico');

  // Generate public/favicon.svg with high-res base64 data
  const base64Png = (await sharp(masterBuf).resize(512, 512).png().toBuffer()).toString('base64');
  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <image href="data:image/png;base64,${base64Png}" width="512" height="512"/>
</svg>
`;
  fs.writeFileSync('public/favicon.svg', svgContent.trim());
  console.log('Generated public/favicon.svg');
}

main().catch(console.error);
