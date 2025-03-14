const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
const produtosRoutes = require('./routes/produtos');

// Middleware para interpretar JSON
app.use(express.json());

// Servir arquivos estáticos (CSS, imagens, scripts)
app.use(express.static('public'));

// Definir o motor de visualização como EJS
app.set('view engine', 'ejs');

// Usar as rotas de produtos
app.use('/api', produtosRoutes);

// Rotas de páginas
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/admin', (req, res) => {
    res.render('admin');
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
