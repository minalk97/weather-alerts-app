import { FC } from "react";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { WeatherAlertProperties } from "../../types/WeatherAlert.ts";

interface AlertSeverityIconProps {
  severity: WeatherAlertProperties["severity"];
}

export const AlertSeverityIcon: FC<AlertSeverityIconProps> = ({ severity }) => {
  const getSeverityIcon = (severity: WeatherAlertProperties["severity"]) => {
    switch (severity) {
      case "Extreme":
        return [...Array(2)].map((_, index) => (
          <PriorityHighIcon key={index} sx={{ color: "red", fontSize: 24 }} />
        ));
      case "Severe":
        return <PriorityHighIcon sx={{ color: "red", fontSize: 24 }} />;
      case "Moderate":
        return <WarningAmberIcon sx={{ color: "orange", fontSize: 24 }} />;
      case "Minor":
        return <InfoOutlinedIcon sx={{ color: "#009CFF", fontSize: 24 }} />;
      default:
        return null;
    }
  };

  return <div>{getSeverityIcon(severity)}</div>;
};
