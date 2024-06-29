import React from "react";
import {
  Box,
  Button,
  Modal,
  Tabs,
  Tab,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  Autocomplete,
} from "@mui/material";

const DocumentCreation = ({
  isModalOpen,
  closeModal,
  activeTab,
  handleTabChange,
  newEnvelope,
  updateNewEnvelope,
  addSignatory,
  updateSignatory,
  createEnvelope,
  repositoryList,
}) => {
  const selectedRepository =
    repositoryList.find((repo) => repo.id === newEnvelope.repositoryId) || null;

  return (
    <Modal open={isModalOpen} onClose={closeModal}>
      <Box
        sx={{
          width: "80%",
          bgcolor: "background.paper",
          p: 4,
          margin: "auto",
          marginTop: "5%",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="envelope creation tabs"
        >
          <Tab label="Anexar Arquivo" />
          <Tab label="Descrição e Repositório" />
          <Tab label="Signatários" />
          <Tab label="Resumo" />
        </Tabs>
        {activeTab === 0 && (
          <Box p={3}>
            <Typography>Anexar Arquivo</Typography>
            <input
              type="file"
              onChange={(e) => updateNewEnvelope("file", e.target.files[0])}
            />
          </Box>
        )}
        {activeTab === 1 && (
          <Box p={3}>
            <Typography>Descrição e Repositório</Typography>
            <TextField
              label="Descrição do Envelope"
              variant="outlined"
              fullWidth
              margin="normal"
              value={newEnvelope.description}
              onChange={(e) => updateNewEnvelope("description", e.target.value)}
            />
            <Autocomplete
              options={repositoryList}
              getOptionLabel={(option) => option.nome}
              value={selectedRepository} // Set the value of the Autocomplete
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Repositório"
                  variant="outlined"
                  margin="normal"
                />
              )}
              onChange={(event, value) => {
                updateNewEnvelope("repositoryId", value ? value.id : "");
                updateNewEnvelope("repositoryName", value ? value.nome : "");
              }}
            />
          </Box>
        )}
        {activeTab === 2 && (
          <Box p={3}>
            <Typography>Signatários</Typography>
            {newEnvelope.signatories.map((signatory, index) => (
              <Box key={index} display="flex" gap={2} mb={2}>
                <TextField
                  label="Nome"
                  variant="outlined"
                  fullWidth
                  value={signatory.name}
                  onChange={(e) =>
                    updateSignatory(index, "name", e.target.value)
                  }
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={signatory.email}
                  onChange={(e) =>
                    updateSignatory(index, "email", e.target.value)
                  }
                />
              </Box>
            ))}
            <Button variant="contained" onClick={addSignatory}>
              Adicionar Signatário
            </Button>
          </Box>
        )}
        {activeTab === 3 && (
          <Box p={3}>
            <Typography>Resumo</Typography>
            <Typography>
              <strong>Arquivo:</strong>{" "}
              {newEnvelope.file
                ? newEnvelope.file.name
                : "Nenhum arquivo selecionado"}
            </Typography>
            <Typography>
              <strong>Descrição:</strong> {newEnvelope.description}
            </Typography>
            <Typography>
              <strong>Repositório:</strong> {newEnvelope.repositoryName} (
              {newEnvelope.repositoryId})
            </Typography>
            <Typography>
              <strong>Signatários:</strong>
            </Typography>
            <List>
              {newEnvelope.signatories.map((signatory, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={signatory.name}
                    secondary={signatory.email}
                  />
                </ListItem>
              ))}
            </List>
            <Button
              variant="contained"
              color="primary"
              onClick={createEnvelope}
            >
              Finalizar e Criar Envelope
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default DocumentCreation;
