const express = require('express');
const fs = require('fs');
const router = express.Router();

// Carregar os produtos do arquivo JSON
const getProdutos = () => {
    return JSON.parse(fs.readFileSync('./dados/produtos.json'));
};

// Salvar produtos no arquivo JSON
const salvarProdutos = (produtos) => {
    fs.writeFileSync('./dados/produtos.json', JSON.stringify(produtos, null, 4));
};

// 🔹 GET: Listar todos os produtos
router.get('/produtos', (req, res) => {
    res.json(getProdutos());
});

// 🔹 GET: Exibir detalhes de um produto específico
router.get('/produtos/:id', (req, res) => {
    const produtos = getProdutos();
    const produto = produtos.find(p => p.id == req.params.id);
    if (produto) {
        res.json(produto);
    } else {
        res.status(404).json({ mensagem: "Produto não encontrado" });
    }
});

// 🔹 POST: Adicionar um novo produto
router.post('/produtos', (req, res) => {
    const produtos = getProdutos();
    const novoProduto = {
        id: produtos.length + 1,  // Gerando um ID simples
        nome: req.body.nome,
        preco: req.body.preco,
        estoque: req.body.estoque
    };

    produtos.push(novoProduto);
    salvarProdutos(produtos);

    res.status(201).json({ mensagem: "Produto adicionado!", produto: novoProduto });
});

// 🔹 PUT: Atualizar um produto existente
router.put('/produtos/:id', (req, res) => {
    let produtos = getProdutos();
    const index = produtos.findIndex(p => p.id == req.params.id);

    if (index !== -1) {
        produtos[index] = { ...produtos[index], ...req.body };
        salvarProdutos(produtos);
        res.json({ mensagem: "Produto atualizado!", produto: produtos[index] });
    } else {
        res.status(404).json({ mensagem: "Produto não encontrado" });
    }
});

// 🔹 DELETE: Remover um produto
router.delete('/produtos/:id', (req, res) => {
    let produtos = getProdutos();
    const produtosFiltrados = produtos.filter(p => p.id != req.params.id);

    if (produtos.length === produtosFiltrados.length) {
        return res.status(404).json({ mensagem: "Produto não encontrado" });
    }

    salvarProdutos(produtosFiltrados);
    res.json({ mensagem: "Produto removido com sucesso!" });
});

module.exports = router;
