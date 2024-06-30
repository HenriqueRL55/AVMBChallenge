import styled from "styled-components";
import { TextField, Button, Box } from "@mui/material";

export const FormContainer = styled(Box)`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

export const Input = styled(TextField)`
  flex: 1;
`;

export const QueryButton = styled(Button)`
  height: 100%;
`;
