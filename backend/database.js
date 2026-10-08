const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

async function openDb() {
    return open({
        filename: './farepet.db', 
        driver: sqlite3.Database
    });
}

async function initDb() {
    const db = await openDb();
    await db.exec(`
        CREATE TABLE IF NOT EXISTS anuncios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tipo TEXT NOT NULL,
            especie TEXT NOT NULL,
            nome TEXT,
            cep TEXT,
            rua TEXT,
            numero TEXT,
            complemento TEXT,
            cidade TEXT,
            contato TEXT,
            imagem TEXT,
            latitude REAL,
            longitude REAL,
            status_publicacao TEXT DEFAULT 'pendente',
            data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    console.log("Banco de dados SQLite inicializado com sucesso.");
}

module.exports = { openDb, initDb };