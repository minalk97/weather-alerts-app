import { WeatherAlert } from "./types/WeatherAlert.ts";

type SeverityOrder = {
  Extreme: number;
  Severe: number;
  Moderate: number;
  Minor: number;
  Unknown: number;
};
type DateKeys = "sent" | "effective" | "expires";

export const sortAlerts = (
  alerts: WeatherAlert[],
  sortBy: string,
  sortDirection: string,
) => {
  const severityOrder: SeverityOrder = {
    Extreme: 4,
    Severe: 3,
    Moderate: 2,
    Minor: 1,
    Unknown: 0,
  };

  return alerts.sort((a: WeatherAlert, b: WeatherAlert) => {
    if (["sent", "effective", "expires"].includes(sortBy)) {
      const key = sortBy as DateKeys;
      const dateA = new Date(a.properties[key] as string).getTime();
      const dateB = new Date(b.properties[key] as string).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }
    if (sortBy === "severity") {
      const severityA = severityOrder[a.properties.severity] || 0;
      const severityB = severityOrder[b.properties.severity] || 0;
      return sortDirection === "asc"
        ? severityA - severityB
        : severityB - severityA;
    }

    return 0;
  });
};
