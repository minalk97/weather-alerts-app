import { FC } from "react";
import { TableCell, TableRow } from "@mui/material";
import ReadMore from "./ReadMore.tsx";
import { AlertSeverityIcon } from "./AlertSeverityIcon.tsx";
import { WeatherAlert } from "../../types/WeatherAlert.ts";

type propsType = {
  alert: WeatherAlert;
  formatEventTimeWithTimezoneAbbreviation: (
    effective: string,
    expires: string,
  ) => string;
  whatPattern: RegExp;
  impactsPattern: RegExp;
};
export const AlertRow: FC<propsType> = (props) => {
  const {
    alert,
    formatEventTimeWithTimezoneAbbreviation,
    whatPattern,
    impactsPattern,
  } = props;
  const { properties } = alert;
  const {
    id,
    areaDesc: region,
    event,
    effective,
    expires,
    severity,
    description,
    instruction,
  } = properties;

  const whatMatch = description?.match(whatPattern);
  const what = whatMatch ? whatMatch[1].trim() : "";

  const impactsMatch = description?.match(impactsPattern);
  const impacts = impactsMatch ? impactsMatch[1].trim() : "";
  return (
    <>
      <TableRow
        key={id}
        sx={{
          "&:last-child td, &:last-child th": { border: 0 },
        }}
      >
        <TableCell component="th" scope="row">
          <AlertSeverityIcon severity={severity} />
          {event}
        </TableCell>
        <TableCell>
          {formatEventTimeWithTimezoneAbbreviation(effective, expires)}
        </TableCell>
        <TableCell>
          {region ? <ReadMore text={region} maxLength={80} /> : "-"}
        </TableCell>
        <TableCell>
          {what ? <ReadMore text={what} maxLength={80} /> : "-"}
        </TableCell>
        <TableCell>
          {impacts ? <ReadMore text={impacts} maxLength={80} /> : "-"}
        </TableCell>
        <TableCell>
          {instruction ? <ReadMore text={instruction} maxLength={80} /> : "-"}
        </TableCell>
      </TableRow>
    </>
  );
};
