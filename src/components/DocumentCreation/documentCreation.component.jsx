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
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const DocumentCreation = ({
  isModalOpen,
  closeModal,
  activeTab,
  handleTabChange,
  newEnvelope,
  updateNewEnvelope,
  addSignatory,
  updateSignatory,
  removeSignatory,
  createEnvelope,
  repositoryList,
}) => {
  const selectedRepository =
    repositoryList.find((repo) => repo.id === newEnvelope.repositoryId) || null;

  return (
    <Modal open={isModalOpen} onClose={closeModal}>
      <Box
        sx={{
          width: "40%",
          border: "1px solid #1976d2",
          bgcolor: "background.paper",
          maxHeight: "50%",
          overflow: "auto",
          borderRadius: 2,
          p: 4,
          margin: "auto",
          marginTop: "5%",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="envelope creation tabs"
          TabIndicatorProps={{ style: { display: "none" } }} 
          sx={{
            "& .MuiTab-root": {
              "&:focus": {
                outline: "none", 
              },
            },
          }}
        >
          <Tab label="Anexar Arquivo" />
          <Tab label="Descrição e Repositório" />
          <Tab label="Signatários" />
          <Tab label="Resumo" />
        </Tabs>
        {activeTab === 0 && (
          <Box p={3}>
            <Typography
              sx={{ color: "#222831", fontWeight: "bold", mb: 3, fontSize: 20 }}
            >
              Anexar Arquivo
            </Typography>
            <input
              type="file"
              onChange={(e) => updateNewEnvelope("file", e.target.files[0])}
            />
          </Box>
        )}
        {activeTab === 1 && (
          <Box p={3}>
            <Typography
              sx={{ color: "#222831", fontWeight: "bold", mb: 3, fontSize: 20 }}
            >
              Descrição e Repositório
            </Typography>
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
              value={selectedRepository}
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
            <Typography
              sx={{ color: "#222831", fontWeight: "bold", mb: 3, fontSize: 20 }}
            >
              Signatários
            </Typography>
            {newEnvelope.signatories.map((signatory, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                gap={2}
                mb={2}
              >
                <TextField
                  label="Nome"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  value={signatory.name}
                  onChange={(e) =>
                    updateSignatory(index, "name", e.target.value)
                  }
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  value={signatory.email}
                  onChange={(e) =>
                    updateSignatory(index, "email", e.target.value)
                  }
                />
                <IconButton
                  color="secondary"
                  onClick={() => removeSignatory(index)}
                >
                  <DeleteIcon sx={{ color: "#1976d2" }} />
                </IconButton>
              </Box>
            ))}
            <Button variant="contained" onClick={addSignatory}>
              Adicionar Signatário
            </Button>
          </Box>
        )}
        {activeTab === 3 && (
          <Box p={3}>
            <Typography
              sx={{ color: "#222831", fontWeight: "bold", mb: 3, fontSize: 20 }}
            >
              Resumo
            </Typography>
            <Typography sx={{ color: "#222831" }}>
              <strong>Arquivo:</strong>{" "}
              {newEnvelope.file
                ? newEnvelope.file.name
                : "Nenhum arquivo selecionado"}
            </Typography>
            <Typography sx={{ color: "#222831" }}>
              <strong>Descrição:</strong> {newEnvelope.description}
            </Typography>
            <Typography sx={{ color: "#222831" }}>
              <strong>Repositório:</strong> {newEnvelope.repositoryName} (
              {newEnvelope.repositoryId})
            </Typography>
            <Typography sx={{ color: "#222831" }}>
              <strong>Signatários:</strong>
            </Typography>
            <List>
              {newEnvelope.signatories.map((signatory, index) => (
                <ListItem key={index}>
                  <ListItemText
                    sx={{
                      color: "#222831",
                      fontWeight: "bold",
                      mb: 3,
                      fontSize: 20,
                    }}
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
