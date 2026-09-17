/**
 * Bemina campus weather — same Open-Meteo feed used in the site footer.
 * Safe for client or server (no secrets).
 */

export const CAMPUS_WEATHER_LAT = 34.078611;
export const CAMPUS_WEATHER_LON = 74.763056;
export const CAMPUS_WEATHER_TZ = "Asia/Kolkata";

export type CampusWeatherSnapshot = {
  tempC: number;
  humidity: number;
  windKmh: number;
  code: number;
  condition: string;
  pm25: number | null;
  aqLabel: string | null;
  fetchedAt: string;
};

export function campusWeatherCondition(code: number): string {
  if (code === 0) return "Clear sky";
  if (code === 1) return "Mainly clear";
  if (code === 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code === 45 || code === 48) return "Fog";
  if (code >= 51 && code <= 67) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Rain showers";
  if (code >= 85 && code <= 86) return "Snow showers";
  if (code >= 95) return "Thunderstorm";
  return "Scattered clouds";
}

/** CPCB-style PM2.5 categories for India */
export function campusPm25Label(pm25: number): string {
  if (pm25 <= 30) return "Good";
  if (pm25 <= 60) return "Satisfactory";
  if (pm25 <= 90) return "Moderate";
  if (pm25 <= 120) return "Poor";
  if (pm25 <= 250) return "Very Poor";
  return "Severe";
}

async function fetchJson(url: string): Promise<unknown | null> {
  try {
    const res = await fetch(url, { method: "GET", mode: "cors", credentials: "omit" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchCampusWeather(): Promise<CampusWeatherSnapshot | null> {
  const wxUrl = `https://api.open-meteo.com/v1/forecast?latitude=${CAMPUS_WEATHER_LAT}&longitude=${CAMPUS_WEATHER_LON}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&wind_speed_unit=kmh&timezone=${encodeURIComponent(CAMPUS_WEATHER_TZ)}`;
  const aqUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${CAMPUS_WEATHER_LAT}&longitude=${CAMPUS_WEATHER_LON}&current=pm2_5&timezone=${encodeURIComponent(CAMPUS_WEATHER_TZ)}`;

  const [wxRaw, aqRaw] = await Promise.all([fetchJson(wxUrl), fetchJson(aqUrl)]);

  const wx = wxRaw as {
    current?: {
      temperature_2m?: number;
      relative_humidity_2m?: number;
      weather_code?: number;
      wind_speed_10m?: number;
    };
  } | null;

  const c = wx?.current;
  if (
    !c ||
    typeof c.temperature_2m !== "number" ||
    typeof c.relative_humidity_2m !== "number" ||
    typeof c.weather_code !== "number" ||
    typeof c.wind_speed_10m !== "number"
  ) {
    return null;
  }

  const aq = aqRaw as { current?: { pm2_5?: number } } | null;
  const pm25 = typeof aq?.current?.pm2_5 === "number" ? aq.current.pm2_5 : null;

  return {
    tempC: c.temperature_2m,
    humidity: c.relative_humidity_2m,
    windKmh: c.wind_speed_10m,
    code: c.weather_code,
    condition: campusWeatherCondition(c.weather_code),
    pm25,
    aqLabel: pm25 != null ? campusPm25Label(pm25) : null,
    fetchedAt: new Date().toISOString(),
  };
}

export function detectWeatherIntent(text: string): boolean {
  return /\b(weather|mausam|temperature|temp|humidity|hawa|wind|pm\s*2\.?5|air\s*quality|aqi|barish|rain|snow|sardi|garmi|forecast)\b/i.test(
    text,
  );
}

export function buildWeatherDirectReply(
  weather: CampusWeatherSnapshot,
  language: "english" | "local",
): string {
  const stamp = new Date(weather.fetchedAt).toLocaleString("en-IN", {
    timeZone: CAMPUS_WEATHER_TZ,
  });
  const aq =
    weather.pm25 != null && weather.aqLabel
      ? language === "english"
        ? `\nAir quality (PM2.5): ${weather.pm25.toFixed(1)} µg/m³ · ${weather.aqLabel}`
        : `\nAir quality (PM2.5): ${weather.pm25.toFixed(1)} µg/m³ · ${weather.aqLabel}`
      : "";

  if (language === "local") {
    return `Bemina campus (GPW Srinagar) ka live weather — Open-Meteo, same feed jo website footer use karti hai (checked ${stamp}):

Condition: ${weather.condition}
Temperature: ${weather.tempC.toFixed(1)}°C
Humidity: ${Math.round(weather.humidity)}%
Wind: ${weather.windKmh.toFixed(1)} km/h${aq}

Yeh campus location ke coordinates pe based hai — IMD app se cross-check kar sakte hain.`;
  }

  return `Live weather at the Bemina campus (GPW Srinagar) — Open-Meteo, the same feed used on this website’s footer (checked ${stamp}):

Condition: ${weather.condition}
Temperature: ${weather.tempC.toFixed(1)}°C
Humidity: ${Math.round(weather.humidity)}%
Wind: ${weather.windKmh.toFixed(1)} km/h${aq}

This is for the campus coordinates. You can cross-check with the India Meteorological Department (IMD) app if needed.`;
}
