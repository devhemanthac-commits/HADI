import { allGems } from "../data/gems";
import { haversineDistance } from "./checkin";
import type { Coords } from "./types";

const NOTIFICATION_RADIUS = 200; // Notify when within 200m
const GEOFENCE_COOLDOWN = 12 * 60 * 60 * 1000; // 12 hours cooldown per gem

let watchId: number | null = null;
const notifiedGems = new Map<number, number>(); // gemId -> timestamp

export function startGeofence(onNearGem: (gemName: string, distance: number) => void) {
  if (!("geolocation" in navigator)) return;
  if (!("Notification" in window)) return;

  Notification.requestPermission();

  if (watchId !== null) return;

  watchId = navigator.geolocation.watchPosition(
    (position) => {
      const userCoords: Coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      const now = Date.now();

      allGems.forEach((gem) => {
        const distance = haversineDistance(userCoords, gem.coords);
        if (distance <= NOTIFICATION_RADIUS) {
          const lastNotified = notifiedGems.get(gem.id) || 0;
          if (now - lastNotified > GEOFENCE_COOLDOWN) {
            notifiedGems.set(gem.id, now);
            onNearGem(gem.name, distance);

            // Trigger system notification if backgrounded
            if (Notification.permission === "granted" && document.visibilityState === "hidden") {
              new Notification("HADI: Hidden Gem Nearby! 💎", {
                body: `You are ${Math.round(distance)}m away from ${gem.name}. Open HADI to check in!`,
                icon: "/pwa-192x192.png"
              });
            }
          }
        }
      });
    },
    (err) => {
      console.warn("Geofence watch error:", err);
    },
    { enableHighAccuracy: true, maximumAge: 10000 }
  );
}

export function stopGeofence() {
  if (watchId !== null && "geolocation" in navigator) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
}
