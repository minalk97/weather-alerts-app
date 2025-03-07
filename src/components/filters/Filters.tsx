import { FC } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { StateDropdown } from "./StateDropdown.tsx";
import { ZoneDropdown } from "./ZoneDropdown.tsx";
import { SeverityDropdown } from "./SeverityDropdown.tsx";
import { UrgencyDropdown } from "./UrgencyDropdown .tsx";

export const Filters: FC = () => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const handleAccordionChange = (): void => {
    setExpanded(!expanded);
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={handleAccordionChange}
      sx={{ mb: 2, borderRadius: 2 }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{ backgroundColor: "#f0f0f0", borderRadius: "8px" }}
      >
        <Typography sx={{ fontWeight: "bold" }}>Filters</Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <StateDropdown />
          <ZoneDropdown />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
            mt: 2,
          }}
        >
          <SeverityDropdown />
          <UrgencyDropdown />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
