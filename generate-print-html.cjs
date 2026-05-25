const fs = require('fs');
const path = require('path');

const placesFilePath = path.join(__dirname, 'src/app/data/places.ts');

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

const uniqueGems = [];
const seenIds = new Set();
for (const gem of gems) {
  if (!seenIds.has(gem.id)) {
    seenIds.add(gem.id);
    uniqueGems.push(gem);
  }
}

// Generate HTML
let html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>HADI QR Codes Print</title>
<style>
  @page { size: A4 portrait; margin: 10mm; }
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0; background: #eee; }
  .page {
    width: 190mm; /* A4 is 210mm wide, minus 2x10mm margins */
    height: 277mm; /* A4 is 297mm high, minus 2x10mm margins */
    background: white;
    margin: 10mm auto;
    box-sizing: border-box;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 5mm;
    page-break-after: always;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  }
  @media print {
    body { background: white; margin: 0; }
    .page { margin: 0; box-shadow: none; width: 100%; height: 277mm; }
  }
  .qr-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px dashed #ccc;
    padding: 10px;
    box-sizing: border-box;
    text-align: center;
  }
  .qr-image {
    width: 50mm;
    height: 50mm;
    object-fit: contain;
  }
  .qr-name {
    margin-top: 10px;
    font-size: 13px;
    font-weight: bold;
    color: #333;
    max-width: 100%;
    word-wrap: break-word;
  }
</style>
</head>
<body>
`;

let pageCount = Math.ceil(uniqueGems.length / 9);

for (let p = 0; p < pageCount; p++) {
  html += `<div class="page">\n`;
  for (let i = 0; i < 9; i++) {
    const idx = p * 9 + i;
    if (idx < uniqueGems.length) {
      const gem = uniqueGems[idx];
      const filename = `gem_${gem.id}_${gem.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
      html += `  <div class="qr-cell">
    <img class="qr-image" src="all_qrs/${filename}" alt="${gem.name}" />
    <div class="qr-name">${gem.name}</div>
  </div>\n`;
    } else {
      // Empty cell to keep grid layout
      html += `  <div class="qr-cell" style="border: none;"></div>\n`;
    }
  }
  html += `</div>\n`;
}

html += `</body></html>`;

fs.writeFileSync(path.join(__dirname, 'print_qrs.html'), html);
console.log('Successfully generated print_qrs.html');
