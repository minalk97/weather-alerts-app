export type WeatherAlert = {
  id: string;
  type: string;
  properties: WeatherAlertProperties;
};

export type Severity = "Extreme" | "Severe" | "Moderate" | "Minor" | "Unknown";

export type Urgency = "Immediate" | "Expected" | "Future" | "Past" | "Unknown";

// Properties of an alert
export type WeatherAlertProperties = {
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
  severity: Severity;
  certainty: "Observed" | "Likely" | "Possible" | "Unlikely";
  urgency: Urgency;
  event: string;
  sender: string;
  senderName: string;
  headline: string;
  description: string;
  instruction: string;
  response: string;
};
