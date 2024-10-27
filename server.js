const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const FILES_DIRECTORY = path.join(__dirname, 'files');

app.use(express.static(__dirname));
app.use(express.json());

// Rota para listar os arquivos do diretório
app.get('/list-files', (req, res) => {
    fs.readdir(FILES_DIRECTORY, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao listar arquivos' });
        }
        res.json({ files });
    });
});

// Rota para obter o conteúdo de um arquivo específico
app.get('/files/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(FILES_DIRECTORY, fileName);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao ler o arquivo' });
        }
        res.send(data);
    });
});

// Rota para renomear o arquivo
app.post('/rename', (req, res) => {
    const { originalFileName, newFileName } = req.body;
    const oldPath = path.join(FILES_DIRECTORY, `${originalFileName}.txt`);
    const newPath = path.join(FILES_DIRECTORY, newFileName);

    fs.rename(oldPath, newPath, (err) => {
        if (err) {
            console.error('Erro ao renomear o arquivo:', err);
            return res.status(500).json({ error: 'Erro ao renomear o arquivo' });
        }

        res.json({ message: 'Arquivo renomeado com sucesso', newFileName });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Certifique-se de que os arquivos .txt estejam na pasta: ${FILES_DIRECTORY}`);
});
