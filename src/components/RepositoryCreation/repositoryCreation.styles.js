import { styled } from "@mui/system";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export const FormContainer = styled(Box)({
  display: "flex",
  flexDirection: "row",
  gap: "16px",
  alignItems: "end",
});

export const Input = styled(TextField)({
  flex: 1,
});

export const CreateButton = styled(Button)({
  flexShrink: 0,
});
