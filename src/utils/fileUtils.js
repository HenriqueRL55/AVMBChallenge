// Função para ler um arquivo como Base64
export const readFileAsBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader(); // Cria uma instância do FileReader

    // Evento que é disparado quando a leitura do arquivo é concluída
    reader.onloadend = () => {
      const base64 = reader.result.split(",")[1]; // Extrai a parte Base64 do resultado
      resolve(base64); // Resolve a promessa com o valor Base64
    };

    // Evento que é disparado quando ocorre um erro na leitura do arquivo
    reader.onerror = reject;

    // Inicia a leitura do arquivo como uma URL de dados
    reader.readAsDataURL(file);
  });
};
