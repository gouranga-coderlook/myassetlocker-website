import type { Warehouse, WarehouseDistanceCharge } from "@/lib/api/warehouseService";

export type Coordinate = { lat: number; long: number };

const EARTH_RADIUS_MILES = 3958.8;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function calculateDistanceMiles(coord1: Coordinate, coord2: Coordinate): number {
  const latDiff = toRadians(coord2.lat - coord1.lat);
  const longDiff = toRadians(coord2.long - coord1.long);
  const lat1 = toRadians(coord1.lat);
  const lat2 = toRadians(coord2.lat);

  const a =
    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(longDiff / 2) * Math.sin(longDiff / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_MILES * c;
}

export function findNearestWarehouse(
  userCoord: Coordinate,
  warehouses: Warehouse[]
): { warehouse: Warehouse; distanceMiles: number } | null {
  const candidates = warehouses.filter(
    (warehouse) =>
      warehouse.geo &&
      Number.isFinite(warehouse.geo.latitude) &&
      Number.isFinite(warehouse.geo.longitude)
  );

  if (!candidates.length) return null;

  let nearest = candidates[0];
  let shortest = calculateDistanceMiles(userCoord, {
    lat: nearest.geo!.latitude,
    long: nearest.geo!.longitude,
  });

  for (let i = 1; i < candidates.length; i += 1) {
    const candidate = candidates[i];
    const distance = calculateDistanceMiles(userCoord, {
      lat: candidate.geo!.latitude,
      long: candidate.geo!.longitude,
    });
    if (distance < shortest) {
      nearest = candidate;
      shortest = distance;
    }
  }

  return { warehouse: nearest, distanceMiles: shortest };
}

export function resolveDistanceCharge(
  distanceMiles: number,
  distanceCharges: WarehouseDistanceCharge[]
): number | "out_of_area" {
  for (const charge of distanceCharges) {
    if (
      distanceMiles >= charge.distanceFromMiles &&
      distanceMiles <= charge.distanceToMiles
    ) {
      return charge.price;
    }
  }
  return "out_of_area";
}
