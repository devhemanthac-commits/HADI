// test-api.ts
// Simple script to test the /api/verify-checkin endpoint

async function testCheckIn() {
  const API_URL = "http://localhost:3001/api/verify-checkin";

  console.log("🧪 Starting Backend API Verification...\n");

  // TEST 1: SUCCESS CASE (User is exactly at the location)
  console.log("▶️  TEST 1: Valid Check-In (Distance = 0m)");
  try {
    const res1 = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        place_id: "mysore_palace_1",
        user_lat: 12.3051,
        user_lon: 76.6551
      })
    });
    const data1 = await res1.json();
    console.log(`Status: ${res1.status}`);
    console.log(`Response:`, data1);
    if (data1.success) {
      console.log("✅ TEST 1 PASSED!\n");
    } else {
      console.log("❌ TEST 1 FAILED!\n");
    }
  } catch (err) {
    console.log("❌ TEST 1 FAILED! (Is the server running?)", err);
  }

  // TEST 2: FAILURE CASE (User is ~111 meters away, > 50m limit)
  console.log("▶️  TEST 2: Invalid Check-In (Too far away)");
  try {
    const res2 = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        place_id: "mysore_palace_1",
        user_lat: 12.3061, // Changed by 0.001 degrees
        user_lon: 76.6551
      })
    });
    const data2 = await res2.json();
    console.log(`Status: ${res2.status}`);
    console.log(`Response:`, data2);
    if (!data2.success && data2.distance_meters > 50) {
      console.log("✅ TEST 2 PASSED!\n");
    } else {
      console.log("❌ TEST 2 FAILED!\n");
    }
  } catch (err) {
    console.log("❌ TEST 2 FAILED! (Is the server running?)", err);
  }

  // TEST 3: FAILURE CASE (Invalid QR Code ID)
  console.log("▶️  TEST 3: Invalid Check-In (Fake Place ID)");
  try {
    const res3 = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        place_id: "fake_qr_code_999",
        user_lat: 12.3051,
        user_lon: 76.6551
      })
    });
    const data3 = await res3.json();
    console.log(`Status: ${res3.status}`);
    console.log(`Response:`, data3);
    if (!data3.success && res3.status === 404) {
      console.log("✅ TEST 3 PASSED!\n");
    } else {
      console.log("❌ TEST 3 FAILED!\n");
    }
  } catch (err) {
    console.log("❌ TEST 3 FAILED! (Is the server running?)", err);
  }
}

testCheckIn();
