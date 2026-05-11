export function parseCoord(value) {
  const text = String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[^0-9NSEW]/g, "")

  const match = text.match(/^([NS])(\d{2})(\d{2})(\d{2})([EW])(\d{3})(\d{2})(\d{2})$/)

  if (!match) {
    return {
      lat: null,
      lon: null
    }
  }

  const [, latHem, latDeg, latMin, latSec, lonHem, lonDeg, lonMin, lonSec] = match

  let lat = Number(latDeg) + Number(latMin) / 60 + Number(latSec) / 3600
  let lon = Number(lonDeg) + Number(lonMin) / 60 + Number(lonSec) / 3600

  if (latHem === "S") {
    lat *= -1
  }

  if (lonHem === "W") {
    lon *= -1
  }

  return {
    lat,
    lon
  }
}

export function normalizeAltitude(value) {
  const number = Number(String(value || "").trim())

  if (!Number.isFinite(number)) {
    return 0
  }

  return Math.trunc(number)
}

export function normalizeText(value) {
  return String(value || "").trim()
}

export function buildFlightPoint(row) {
  const coord = normalizeText(row.coordenada).toUpperCase()
  const { lat, lon } = parseCoord(coord)

  if (lat === null || lon === null) {
    return null
  }

  return {
    aircraft: normalizeText(row.aircraft),
    aircraftType: normalizeText(row.aircrafttype),
    flight: normalizeText(row.flight),
    origem: normalizeText(row.departureairporticao),
    destino: normalizeText(row.arrivalairporticao),
    coord,
    altitude: normalizeAltitude(row.altitude),
    lat,
    lon
  }
}