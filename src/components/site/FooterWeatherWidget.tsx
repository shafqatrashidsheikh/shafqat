"use client";

import { Cloud, CloudFog, CloudRain, CloudSnow, CloudSun, Sun, Wind } from "lucide-react";
import { useEffect, useState } from "react";
import {
  CAMPUS_WEATHER_TZ,
  campusPm25Label,
  campusWeatherCondition,
  fetchCampusWeather,
  type CampusWeatherSnapshot,
} from "@/lib/campus-weather";
import { cn } from "@/lib/utils";

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
    timeZone: CAMPUS_WEATHER_TZ,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatTimePart(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: CAMPUS_WEATHER_TZ,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
    .format(date)
    .replace(/\s+(am|pm)/i, "\u00A0$1");
}

function pm25Tone(pm25: number): { label: string; className: string } {
  const label = campusPm25Label(pm25);
  /* Map-pin maroon/red on the navy footer — never lime/green. */
  if (pm25 <= 30) return { label, className: "text-[#e85a5a]" };
  if (pm25 <= 60) return { label, className: "text-[#e53935]" };
  if (pm25 <= 90) return { label, className: "text-[#d32f2f]" };
  if (pm25 <= 120) return { label, className: "text-[#c62828]" };
  if (pm25 <= 250) return { label, className: "text-[#b71c1c]" };
  return { label, className: "text-[#9b1b30]" };
}

type FooterWeatherWidgetProps = {
  className?: string;
};

/** Live Srinagar clock + weather + air quality for the site footer */
export function FooterWeatherWidget({ className }: FooterWeatherWidgetProps) {
  const [now, setNow] = useState(() => new Date());
  const [weather, setWeather] = useState<CampusWeatherSnapshot | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const tick = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(tick);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void fetchCampusWeather().then((data) => {
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
      <p className="mt-1.5 text-[13px] leading-snug text-pretty text-on-dark/75">
        {formatDayPart(now)} at {formatTimePart(now)}
      </p>

      {!loaded ? (
        <p className="mt-3 text-xs text-on-dark/55">Loading weather…</p>
      ) : weather ? (
        <div className="mt-3 space-y-2">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-on-dark/85">
            <WeatherIcon code={weather.code} className="text-on-dark/80" />
            <span>{campusWeatherCondition(weather.code)}</span>
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
              <p className="text-[11px] font-semibold tracking-wide text-on-dark/60 uppercase">
                Air quality
              </p>
              <p className={cn("mt-0.5 text-sm font-semibold", aq.className)}>
                {weather.pm25.toFixed(1)} µg/m³ · {aq.label}
              </p>
            </div>
          ) : null}
        </div>
      ) : (
        <p className="mt-3 text-xs text-on-dark/55">Weather unavailable right now.</p>
      )}
    </div>
  );
}
