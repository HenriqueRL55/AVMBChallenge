import styled from "styled-components";
import { TextField, Button as MuiButton, Box } from "@mui/material";

export const FormContainer = styled(Box)({
  display: "flex",
  flexDirection: "row",
  gap: "16px",
  alignItems: "end",
});

export const Input = styled(TextField)({
  flex: 1,
});

export const CreateButton = styled(MuiButton)({
  flexShrink: 0,
});
