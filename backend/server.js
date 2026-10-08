// backend/server.js
const express = require('express');
const cors = require('cors');
const { openDb, initDb } = require('./database');

const app = express();

// Middlewares
app.use(cors()); // Permite que o frontend (em outra porta ou domínio) acesse a API
app.use(express.json({ limit: '10mb' })); // Limite aumentado para aceitar imagens em Base64

// Inicializa o banco de dados
initDb();

// ==========================================
// ROTAS DA API
// ==========================================

// 1. Rota para BUSCAR todos os anúncios ATIVOS (aprovados)
app.get('/api/anuncios', async (req, res) => {
    try {
        const db = await openDb();
        // Agora busca apenas os anúncios previamente aprovados pelo admin
        const anuncios = await db.all("SELECT * FROM anuncios WHERE status_publicacao = 'aprovado' ORDER BY data_criacao DESC");
        res.json(anuncios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Rota para CRIAR um novo anúncio
app.post('/api/anuncios', async (req, res) => {
    try {
        const { tipo, especie, nome, cep, rua, numero, complemento, cidade, contato, imagem, latitude, longitude } = req.body;
        const db = await openDb();
        
        const result = await db.run(`
            INSERT INTO anuncios (tipo, especie, nome, cep, rua, numero, complemento, cidade, contato, imagem, latitude, longitude)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [tipo, especie, nome, cep, rua, numero, complemento, cidade, contato, imagem, latitude, longitude]);
        
        res.status(201).json({ 
            message: 'Anúncio cadastrado com sucesso!',
            id: result.lastID 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// ROTAS DO PAINEL ADMINISTRATIVO
// ==========================================

// Rota de Login simples (Para ambiente académico)
app.post('/api/admin/login', (req, res) => {
    const { usuario, senha } = req.body;
    // Credenciais fixas para o projeto
    if (usuario === 'admin' && senha === 'farepet2026') {
        res.json({ success: true, token: 'admin-token-123' });
    } else {
        res.status(401).json({ error: 'Credenciais inválidas' });
    }
});

// Rota para calcular as métricas do Dashboard
app.get('/api/admin/metricas', async (req, res) => {
    try {
        const db = await openDb();
        
        // Faz a contagem diretamente no banco de dados de forma otimizada
        const pendentes = await db.get("SELECT COUNT(*) as count FROM anuncios WHERE status_publicacao = 'pendente'");
        const ativos = await db.get("SELECT COUNT(*) as count FROM anuncios WHERE status_publicacao = 'aprovado'");
        const perdidos = await db.get("SELECT COUNT(*) as count FROM anuncios WHERE tipo = 'perdido' AND status_publicacao = 'aprovado'");
        const achados = await db.get("SELECT COUNT(*) as count FROM anuncios WHERE tipo = 'achado' AND status_publicacao = 'aprovado'");

        res.json({
            pendentes: pendentes.count,
            ativos: ativos.count,
            perdidos: perdidos.count,
            achados: achados.count
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota para listar TODOS os anúncios (Ativos e Ocultos)
app.get('/api/admin/anuncios', async (req, res) => {
    try {
        const db = await openDb();
        const anuncios = await db.all('SELECT * FROM anuncios ORDER BY data_criacao DESC');
        res.json(anuncios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota para alterar status (Aprovar, Ocultar, Reativar)
app.patch('/api/admin/anuncios/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status_publicacao } = req.body; 
        
        const db = await openDb();
        await db.run('UPDATE anuncios SET status_publicacao = ? WHERE id = ?', [status_publicacao, id]);
        
        res.json({ success: true, message: 'Status atualizado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Inicialização do Servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});