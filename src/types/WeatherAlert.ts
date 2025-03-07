export type WeatherAlert = {
  id: string;
  type: string;
  properties: WeatherAlertProperties;
};

// Properties of an alert
export type WeatherAlertProperties = {
  [key: string]: string | number | undefined;
  id: string;
  areaDesc: string;
  sent: string;
  effective: string;
  onset: string;
  expires: string;
  ends?: string;
  status: "Actual" | "Test" | "Exercise" | "System";
  messageType: "Alert" | "Update" | "Cancel" | "Ack";
  category: "Met" | "Geo" | "Safety" | "Security";
  severity: "Extreme" | "Severe" | "Moderate" | "Minor";
  certainty: "Observed" | "Likely" | "Possible" | "Unlikely";
  urgency: "Immediate" | "Expected" | "Future" | "Past";
  event: string;
  sender: string;
  senderName: string;
  headline: string;
  description: string;
  instruction: string;
  response: string;
};
