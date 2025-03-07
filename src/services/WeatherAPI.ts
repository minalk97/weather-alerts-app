import axios from "axios";
import { ZoneFeature } from "../types/ZoneInfo.ts";

export const fetchWeatherAlertData = async (selectedState: string) => {
  const url = selectedState
    ? `https://api.weather.gov/alerts?area=${selectedState}`
    : "https://api.weather.gov/alerts/active";
  const response = await axios.get(url);
  return response.data.features;
};

// Fetch zones for a selected state
export const fetchZonesByState = async (selectedState: string) => {
  const response = await axios.get(
    `https://api.weather.gov/zones?area=${selectedState}`,
  );
  return response.data.features.map((zone: ZoneFeature) => ({
    id: zone.properties.id,
    name: zone.properties.name,
  }));
};

// Fetch alerts for a selected zone
export const fetchAlertsByZone = async (zoneId: string) => {
  const response = await axios.get(
    `https://api.weather.gov/alerts/active/zone/${zoneId}`,
  );
  return response.data.features;
};
