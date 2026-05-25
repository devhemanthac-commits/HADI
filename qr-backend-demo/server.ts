import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- MOCK DATABASE ---
// Mapping place_id to its actual geographic coordinates
const PLACES_DB: Record<string, { name: string; lat: number; lon: number }> = {
  "mysore_palace_1": { name: "Mysore Palace Main Gate", lat: 12.3051, lon: 76.6551 },
  "chamundi_hill_1": { name: "Chamundi Hill Steps Base", lat: 12.2743, lon: 76.6738 },
  "devaraja_market_1": { name: "Devaraja Market Spices Corner", lat: 12.3115, lon: 76.6508 },
  "krs_dam_1": { name: "KRS Dam Entrance", lat: 12.4243, lon: 76.5723 },
  "st_philomenas_1": { name: "St. Philomena's Cathedral", lat: 12.3204, lon: 76.6582 },
};

// --- HAVERSINE FORMULA ---
// Calculates the distance in meters between two lat/lon coordinates
function calculateDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const toRadians = (deg: number) => (deg * Math.PI) / 180;

  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δφ = toRadians(lat2 - lat1);
  const Δλ = toRadians(lon2 - lon1);

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
}

// --- CHECK-IN API ENDPOINT ---
app.post('/api/verify-checkin', (req, res) => {
  const { place_id, user_lat, user_lon } = req.body;

  // 1. Validate request parameters
  if (!place_id || typeof user_lat !== 'number' || typeof user_lon !== 'number') {
    return res.status(400).json({
      success: false,
      message: "Missing or invalid parameters. Expected place_id (string), user_lat (number), user_lon (number)."
    });
  }

  // 2. Validate Place ID
  const place = PLACES_DB[place_id];
  if (!place) {
    return res.status(404).json({
      success: false,
      message: "Invalid QR Code. This place does not exist in our database."
    });
  }

  // 3. Calculate distance
  const distance = calculateDistanceInMeters(user_lat, user_lon, place.lat, place.lon);

  // 4. Verification Logic (50 meter radius)
  const MAX_ALLOWED_DISTANCE = 50;

  if (distance <= MAX_ALLOWED_DISTANCE) {
    return res.status(200).json({
      success: true,
      message: `Check-in successful at ${place.name}!`,
      points_awarded: 50,
      distance_meters: Math.round(distance)
    });
  } else {
    return res.status(403).json({
      success: false,
      message: `Check-in failed. You are ${Math.round(distance)} meters away from the physical location. You must be within ${MAX_ALLOWED_DISTANCE} meters.`,
      distance_meters: Math.round(distance)
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🛡️  Secure QR Check-in API running on http://localhost:${PORT}`);
  console.log(`Send POST requests to http://localhost:${PORT}/api/verify-checkin`);
});
