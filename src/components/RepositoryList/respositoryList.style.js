import styled from "styled-components";
import {
  Accordion as MuiAccordion,
  AccordionSummary as MuiAccordionSummary,
  AccordionDetails as MuiAccordionDetails,
  Typography as MuiTypography,
  List as MuiList,
  ListItem as MuiListItem,
  ListItemText as MuiListItemText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const Accordion = styled(MuiAccordion)`
  border: 1px solid #fff !important;
  color: white;
`;

export const AccordionSummary = styled(MuiAccordionSummary)`
  color: #000 !important;
  background-color: #1976d2 !important;
  margin-bottom: 0.1rem;
  border-radius: 6px;
`;

export const AccordionDetails = styled(MuiAccordionDetails)`
  background-color: #fff !important;
  border: 1px solid #222831;
  color: #222831;
  
`;

export const Typography = styled(MuiTypography)`
  color: #fff !important;
`;

export const TypographyCreation = styled(MuiTypography)`
  color: #222831 !important;
`;

export const List = styled(MuiList)`
  color: #222831 !important;
`;

export const ListItem = styled(MuiListItem)`
  border-bottom: 1px solid #393e46;
`;

export const ListItemText = styled(MuiListItemText)`
  color: #222831;
  margin-right: 20rem;
`;

export const WhiteExpandMoreIcon = styled(ExpandMoreIcon)`
  color: white !important;
`;
