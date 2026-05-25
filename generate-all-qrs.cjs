const fs = require('fs');
const path = require('path');
const QRCode = require('./qr-backend-demo/node_modules/qrcode');

const placesFilePath = path.join(__dirname, 'src/app/data/places.ts');
const outDir = path.join(__dirname, 'all_qrs');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const content = fs.readFileSync(placesFilePath, 'utf-8');

const gems = [];

const blocks = content.split('id:');
for (let i = 1; i < blocks.length; i++) {
  const block = blocks[i];
  const idMatch = block.match(/^\s*(\d+)/);
  const nameMatch = block.match(/name:\s*"([^"]+)"/);
  
  if (idMatch && nameMatch) {
    gems.push({ id: idMatch[1], name: nameMatch[1] });
  }
}

// deduplicate
const uniqueGems = [];
const seenIds = new Set();
for (const gem of gems) {
  if (!seenIds.has(gem.id)) {
    seenIds.add(gem.id);
    uniqueGems.push(gem);
  }
}

console.log(`Found ${uniqueGems.length} places. Generating QR codes...`);

async function generate() {
  for (const gem of uniqueGems) {
    const payload = JSON.stringify({ place_id: gem.id.toString() });
    const filename = `gem_${gem.id}_${gem.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
    const filepath = path.join(outDir, filename);
    
    try {
      await QRCode.toFile(filepath, payload, {
        errorCorrectionLevel: 'H',
        margin: 2,
        width: 400,
        color: { dark: '#000000', light: '#ffffff' }
      });
    } catch (e) {
      console.error(`Failed to generate ${filename}:`, e);
    }
  }
  console.log(`All ${uniqueGems.length} QR codes generated in ${outDir}`);
}

generate();
