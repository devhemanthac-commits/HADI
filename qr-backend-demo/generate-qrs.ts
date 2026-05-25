import * as QRCode from 'qrcode';
import * as fs from 'fs';
import * as path from 'path';

// Mock list of places (using the same IDs from the HADI database)
const PLACES = [
  { id: "mysore_palace_1", name: "Mysore Palace Main Gate" },
  { id: "chamundi_hill_1", name: "Chamundi Hill Steps Base" },
  { id: "devaraja_market_1", name: "Devaraja Market Spices Corner" },
  { id: "krs_dam_1", name: "KRS Dam Entrance" },
  { id: "st_philomenas_1", name: "St. Philomena's Cathedral" }
];

const OUTPUT_DIR = path.join(__dirname, 'output_qrs');

async function generateQRCodes() {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log(`Generating QR codes for ${PLACES.length} places...`);

  for (const place of PLACES) {
    // The payload the app will read
    const payload = JSON.stringify({ place_id: place.id });
    
    // File destination
    const filePath = path.join(OUTPUT_DIR, `${place.id}.png`);

    try {
      await QRCode.toFile(filePath, payload, {
        errorCorrectionLevel: 'H',
        margin: 2,
        width: 400,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      console.log(`✅ Generated: ${place.name} -> ${filePath}`);
    } catch (err) {
      console.error(`❌ Failed to generate QR for ${place.id}:`, err);
    }
  }

  console.log("\nAll QR codes generated successfully!");
}

generateQRCodes();
