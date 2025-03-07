import { FC } from "react";
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { useAlertContext } from "../../context/AlertsContext.tsx";

export const SortAlerts: FC = () => {
  const { sortBy, sortDirection, setSortBy, setSortDirection } =
    useAlertContext();

  // Sort options
  const sortOptions = [
    { value: "sent-desc", label: "Newest First" },
    { value: "sent-asc", label: "Oldest First" },
    { value: "severity-desc", label: "Severity (High to Low)" },
    { value: "severity-asc", label: "Severity (Low to High)" },
    { value: "expires-asc", label: "Expiring Soon" },
  ];

  // Function to handle sort change
  const handleSortChange = (e: SelectChangeEvent): void => {
    const value = e.target.value;
    const [field, direction] = value.split("-");
    setSortBy(field);
    setSortDirection(direction);
  };

  return (
    <div
      style={{
        display: "flex",
        padding: "4px",
        margin: "4px",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Typography
        variant="body2"
        sx={{ fontWeight: "bold", color: "#333", mr: 1 }}
      >
        Sort by:
      </Typography>
      <FormControl size="small" sx={{ minWidth: 150, mr: 2 }}>
        <Select
          value={`${sortBy}-${sortDirection}`}
          onChange={handleSortChange}
          displayEmpty
        >
          {sortOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};
