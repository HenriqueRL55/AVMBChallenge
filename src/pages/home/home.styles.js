import styled from "styled-components";
import { Container, Box, Button as MuiButton } from "@mui/material";

export const HomeContainer = styled(Container)`
  background-color: #fff;
  border-radius: 6px;
  height: 100vh;
  overflow: auto;
  min-width: 50vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  color: white;
`;

export const InsideContainer = styled(Box)`
  display: grid;
  grid-template-areas:
    "logout"
    "repository"
    "list";
  gap: 1rem;
  width: 100%;

  @media (max-width: 780px) {
    grid-template-areas:
      "logout"
      "repository"
      "list";
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
`;

export const RespositoryCreate = styled(Box)`
  display: flex;
  justify-content: space-between;
  width: 100%;

  @media (max-width: 780px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const ListRepository = styled(Box)`
  grid-area: list;
`;

export const LogoutButton = styled(MuiButton)`
  display: flex;
  justify-self: end;
  width: 12rem;
  grid-area: logout;
  background-color: #393e46;
  color: white;
  &:hover {
    background-color: #4e555e;
  }
`;

export const ButtonCreate = styled(MuiButton)`
  display: flex;
  justify-self: end;
  align-self: end;
  width: 18rem;
  height: 2rem;
  grid-area: logout;
  background-color: #393e46;
  color: white;
  &:hover {
    background-color: #4e555e;
  }

  @media (max-width: 780px) {
    width: 100%;
    margin-top: 1rem;
  }
`;
