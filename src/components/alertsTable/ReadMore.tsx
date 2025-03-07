import { FC } from "react";
import { useState } from "react";
import { Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

interface ReadMoreProps {
  text: string;
  maxLength?: number;
}

const ReadMore: FC<ReadMoreProps> = ({ text, maxLength = 100 }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  if (text.length <= maxLength) return <span>{text}</span>;

  return (
    <span>
      {isExpanded ? text : `${text.substring(0, maxLength)}... `}
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
