import { useState } from "react";
import { Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

/**
 * ReadMore Component - Truncates long text with an expandable "Read More" button
 * @param {Object} props - Component props
 * @param {string} props.text - The text content to be displayed
 * @param {number} props.maxLength - Maximum length of text before truncation (defaults to 100)
 * @returns {JSX.Element} A span element containing truncated or full text with a toggle button
 */
const ReadMore = ({ text, maxLength = 100 }) => {
  // State to track whether the text is expanded or truncated
  const [isExpanded, setIsExpanded] = useState(false);

  // If text is shorter than maxLength, just return it without the Read More button
  if (text.length <= maxLength) return <span>{text}</span>;

  return (
    <span>
      {/* Display either full text or truncated text based on isExpanded state */}
      {isExpanded ? text : `${text.substring(0, maxLength)}... `}

      {/* Toggle button with dynamic text and icon */}
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        size="small"
        sx={{ textTransform: "none", fontSize: "12px" }}
        endIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      >
        {isExpanded ? "Read Less" : "Read More"}
      </Button>
    </span>
  );
};

export default ReadMore;
