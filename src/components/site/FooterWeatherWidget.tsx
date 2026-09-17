"use client";

import { Cloud, CloudFog, CloudRain, CloudSnow, CloudSun, Sun, Wind } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Bemina campus — verified coordinates */
const LAT = 34.078611;
const LON = 74.763056;
const TZ = "Asia/Kolkata";

type WeatherSnapshot = {
  tempC: number;
  humidity: number;
  windKmh: number;
  code: number;
  pm25: number | null;
};

function weatherLabel(code: number): string {
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

function WeatherIcon({ code, className }: { code: number; className?: string }) {
  const props = { className: cn("size-4 shrink-0", className), "aria-hidden": true as const };
  if (code === 0 || code === 1) return <Sun {...props} />;
  if (code === 2) return <CloudSun {...props} />;
  if (code === 45 || code === 48) return <CloudFog {...props} />;
  if (code >= 51 && code <= 67) return <CloudRain {...props} />;
  if (code >= 71 && code <= 86) return <CloudSnow {...props} />;
  if (code >= 95) return <CloudRain {...props} />;
  return <Cloud {...props} />;
}

function formatDayPart(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: TZ,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatTimePart(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: TZ,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
    .format(date)
    .replace(/\s+(am|pm)/i, "\u00A0$1");
}

/** CPCB-style PM2.5 categories for India */
function pm25Tone(pm25: number): { label: string; className: string } {
  if (pm25 <= 30) return { label: "Good", className: "text-emerald-300" };
  if (pm25 <= 60) return { label: "Satisfactory", className: "text-lime-300" };
  if (pm25 <= 90) return { label: "Moderate", className: "text-amber-300" };
  if (pm25 <= 120) return { label: "Poor", className: "text-orange-300" };
  if (pm25 <= 250) return { label: "Very Poor", className: "text-red-300" };
  return { label: "Severe", className: "text-red-400" };
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

async function fetchWeather(): Promise<WeatherSnapshot | null> {
  const wxUrl = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&wind_speed_unit=kmh&timezone=${encodeURIComponent(TZ)}`;
  const aqUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${LAT}&longitude=${LON}&current=pm2_5&timezone=${encodeURIComponent(TZ)}`;

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
    typeof c?.temperature_2m !== "number" ||
    typeof c.relative_humidity_2m !== "number" ||
    typeof c.weather_code !== "number" ||
    typeof c.wind_speed_10m !== "number"
  ) {
    return null;
  }

  let pm25: number | null = null;
  const aq = aqRaw as { current?: { pm2_5?: number } } | null;
  if (typeof aq?.current?.pm2_5 === "number") pm25 = aq.current.pm2_5;

  return {
    tempC: c.temperature_2m,
    humidity: c.relative_humidity_2m,
    windKmh: c.wind_speed_10m,
    code: c.weather_code,
    pm25,
  };
}

type FooterWeatherWidgetProps = {
  className?: string;
};

/** Live Srinagar clock + weather + air quality for the site footer */
export function FooterWeatherWidget({ className }: FooterWeatherWidgetProps) {
  const [now, setNow] = useState(() => new Date());
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const tick = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(tick);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void fetchWeather().then((data) => {
      if (!cancelled) {
        setWeather(data);
        setLoaded(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const aq = weather?.pm25 != null ? pm25Tone(weather.pm25) : null;

  return (
    <div className={cn("min-w-0 text-sm text-on-dark-muted", className)}>
      <p className="flex items-center gap-2 font-semibold text-on-dark">
        <Cloud className="size-4 shrink-0 text-on-dark/80" aria-hidden="true" />
        Srinagar
      </p>
      <p className="mt-1.5 whitespace-nowrap text-[13px] leading-snug text-on-dark/75">
        {formatDayPart(now)} at {formatTimePart(now)}
      </p>

      {!loaded ? (
        <p className="mt-3 text-xs text-on-dark/55">Loading weather…</p>
      ) : weather ? (
        <div className="mt-3 space-y-2">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-on-dark/85">
            <WeatherIcon code={weather.code} className="text-on-dark/80" />
            <span>{weatherLabel(weather.code)}</span>
            <span className="text-on-dark/40" aria-hidden="true">
              ·
            </span>
            <span>Temp: {weather.tempC.toFixed(1)}°C</span>
          </p>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-on-dark/70">
            <span>Humidity: {Math.round(weather.humidity)}%</span>
            <span className="inline-flex items-center gap-1">
              <Wind className="size-3.5" aria-hidden="true" />
              Wind: {weather.windKmh.toFixed(1)} km/h
            </span>
          </p>
          {weather.pm25 != null && aq ? (
            <div className="mt-2 rounded-md border border-dashed border-on-dark/25 px-3 py-2">
              <p className="text-xs text-on-dark/80">
                Air Quality (PM2.5):{" "}
                <span className={cn("font-semibold", aq.className)}>
                  {weather.pm25.toFixed(1)} µg/m³ · {aq.label}
                </span>
              </p>
              <p className="mt-1 text-[10px] text-on-dark/45">Source: Open-Meteo</p>
            </div>
          ) : (
            <p className="mt-2 text-xs text-on-dark/55">Air quality reading unavailable.</p>
          )}
        </div>
      ) : (
        <p className="mt-3 text-xs text-on-dark/55">Weather unavailable right now.</p>
      )}
    </div>
  );
}
