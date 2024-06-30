import styled from "styled-components";
import { Container, Box, Typography as MuiTypography } from "@mui/material";

export const LoginContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  background-color: #222831;
  height: 100vh;
  min-width: 100vw;
  align-content: center;
  color: #eeeeee;
`;

export const RegisterContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

export const StyledTypography = styled(MuiTypography)`
  text-align: center;
`;

export const FormBox = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 15%;
  margin: 0 auto;
  padding: 2rem;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #eeeeee;
`;
