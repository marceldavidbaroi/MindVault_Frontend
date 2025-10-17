// components/navigation/ClockWeather.tsx

"use client";

import * as React from "react";
import { Sun, CloudRain, Cloud } from "lucide-react";

interface ClockWeatherProps {
  compact?: boolean; // small version for sidebar
}

export function ClockWeather({ compact = false }: ClockWeatherProps) {
  const [time, setTime] = React.useState<string>("");
  const [weather, setWeather] = React.useState({
    temp: 29,
    condition: "sunny",
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const WeatherIcon =
    weather.condition === "sunny"
      ? Sun
      : weather.condition === "rain"
      ? CloudRain
      : Cloud;

  return (
    <div
      className={`flex items-center justify-between ${
        compact ? "px-2 py-3 border-b mb-3" : "gap-3 ml-auto hidden lg:flex"
      } text-sm font-medium text-muted-foreground`}
    >
      <div className="flex items-center gap-1">
        <WeatherIcon size={18} className="text-yellow-500" />
        <span>{weather.temp}°C</span>
      </div>
      {!compact && <div className="border-l h-4 mx-2" />}
      <span>{time}</span>
    </div>
  );
}
