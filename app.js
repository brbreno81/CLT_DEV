const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');  // Para ler os arquivos JSON

const app = express();
const port = 3000;

// Configura o Express para usar o body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos (CSS, JS, imagens)
app.use(express.static('public'));

// Rota para a Landing Page (Página inicial)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/home.html');
});

// API de Produtos
// 1. Listar todos os produtos (GET)
app.get('/produtos', (req, res) => {
  const produtos = JSON.parse(fs.readFileSync('./dados/itens.json', 'utf-8'));
  res.json(produtos);
});

// 2. Exibir detalhes de um produto específico (GET)
app.get('/produtos/:id', (req, res) => {
  const produtos = JSON.parse(fs.readFileSync('./dados/itens.json', 'utf-8'));
  const produto = produtos.find(p => p.id === parseInt(req.params.id));
  
  if (produto) {
    res.json(produto);
  } else {
    res.status(404).send('Produto não encontrado');
  }
});

// 3. Adicionar um novo produto (POST)
app.post('/produtos', (req, res) => {
  const novoProduto = req.body;
  const produtos = JSON.parse(fs.readFileSync('./dados/itens.json', 'utf-8'));
  produtos.push(novoProduto);
  fs.writeFileSync('./dados/itens.json', JSON.stringify(produtos, null, 2));
  
  res.status(201).json(novoProduto);
});

// 4. Atualizar um produto existente (PUT)
app.put('/produtos/:id', (req, res) => {
  const produtos = JSON.parse(fs.readFileSync('./dados/itens.json', 'utf-8'));
  const produtoIndex = produtos.findIndex(p => p.id === parseInt(req.params.id));

  if (produtoIndex !== -1) {
    produtos[produtoIndex] = { ...produtos[produtoIndex], ...req.body };
    fs.writeFileSync('./dados/itens.json', JSON.stringify(produtos, null, 2));
    res.json(produtos[produtoIndex]);
  } else {
    res.status(404).send('Produto não encontrado');
  }
});

// 5. Remover um produto (DELETE)
app.delete('/produtos/:id', (req, res) => {
  let produtos = JSON.parse(fs.readFileSync('./dados/itens.json', 'utf-8'));
  produtos = produtos.filter(p => p.id !== parseInt(req.params.id));

  fs.writeFileSync('./dados/itens.json', JSON.stringify(produtos, null, 2));
  res.status(204).send(); // No Content
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
