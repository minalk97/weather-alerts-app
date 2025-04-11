import { WeatherAlert } from "./types/WeatherAlert.ts";

export const filterAlerts = (
  alerts: WeatherAlert[],
  selectedSeverity: string,
  selectedUrgency: string,
) => {
  return alerts
    .filter((alert: WeatherAlert) => alert.properties.status !== "Test")
    .filter((alert: WeatherAlert) =>
      selectedSeverity ? alert.properties.severity === selectedSeverity : true,
    )
    .filter((alert: WeatherAlert) =>
      selectedUrgency ? alert.properties.urgency === selectedUrgency : true,
    );
};
