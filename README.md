<p align="center">
  <img src="frontend/assets/logo_bg_Farepet_rounded.png" alt="Farepet" width="200">
</p>

# 🐾 Farepet

> **Farejar + Pet**: uma plataforma web para ajudar a reunir animais perdidos com seus tutores e encontrar um lar para animais abandonados.

Projeto de Prática Profissional em Análise e Desenvolvimento de Sistemas (Faculdade Grau, disciplina *Projetos Profissionalizantes*).

**Status:** ✅ Concluído (Versão Acadêmica Final)

---

## 📌 Sobre o projeto

Quando um animal some, o tempo é decisivo[cite: 8]. Hoje os avisos ficam espalhados em grupos de redes sociais, cartazes e mensagens que se perdem rápido[cite: 8]. O **Farepet** centraliza esses avisos em um mapa, permitindo que[cite: 8]:

- **Tutores** cadastrem o animal perdido, com fotos, descrição, contato e o local onde ele foi visto pela última vez.
- **Quem encontrou** um animal cadastre onde ele foi localizado, com a opção de fazer isso **de forma anônima**.
- **Interessados em adotar** consultem os animais encontrados em situação de abandono.

## ✨ Funcionalidades Implementadas

- **Gestão de Anúncios:** Cadastro completo de animais perdidos, encontrados e adoção, com upload de fotos.
- **Compressão de Imagens:** Redimensionamento inteligente no lado do cliente (via HTML5 Canvas) para conversão em Base64 leve, poupando espaço no banco de dados.
- **Automação de Endereços (ViaCEP):** Preenchimento automático de logradouro e cidade a partir do CEP informado.
- **Geocodificação (Nominatim):** Conversão automática dos endereços digitados em coordenadas geográficas (Latitude/Longitude).
- **Mapa Interativo:** Visualização em tempo real dos anúncios aprovados em um mapa dinâmico utilizando a biblioteca Leaflet e mapas do OpenStreetMap.
- **Painel Administrativo Restrito:** Ambiente seguro com autenticação para gestão da plataforma.
- **Dashboard de Métricas:** Contadores em tempo real de publicações pendentes, ativas, animais perdidos e encontrados.
- **Esteira de Aprovação:** Novos cadastros entram como "Pendentes" e exigem liberação do administrador antes de aparecerem no site público.
- **Alertas Modernos:** Feedbacks interativos e responsivos utilizando a biblioteca SweetAlert2.

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia |
|---|---|
| **Front-end** | HTML5, CSS3, JavaScript (Vanilla), SweetAlert2 |
| **Mapa e Localização** | Leaflet, OpenStreetMap, APIs Nominatim e ViaCEP |
| **Back-end** | Node.js, Express, CORS |
| **Banco de dados** | SQLite (Persistência em arquivo local único) |
| **Integração Contínua** | GitHub Actions (Deploy automatizado do Frontend) |

## 📁 Estrutura do repositório

```text
PPP_ADS/
├── backend/       # Servidor da Aplicação
│   ├── database.js # Configuração e criação automática das tabelas
│   ├── server.js   # Endpoints da API RESTful
│   └── farepet.db  # Banco de dados SQLite (gerado na primeira execução)
├── docs/          # Project Charter, personas e user stories
├── frontend/      # Interface Visual
│   ├── assets/    # Imagens e logotipos do projeto
│   ├── css/       # Arquivos de estilização (style.css)
│   ├── html/      # Páginas de cadastro e painel admin
│   ├── js/        # Lógicas do sistema (script.js, admin.js)
│   └── index.html # Página principal (Home) e Mapa
├── .github/       # Regras do Actions para Deploy no Pages
├── LICENSE        # Licença do projeto
└── README.md      # Documentação principal
```

> A estrutura de `frontend/` e `backend/` será criada no início da Etapa 4 (Desenvolvimento).

## 📄 Documentação do projeto

| Documento | Descrição |
|---|---|
| [Project Charter](docs/Project_Charter_Farepet.md) | Escopo, objetivos, papéis, cronograma e riscos |
| [Personas e User Stories](docs/Personas_UserStories_Farepet.pdf) | Personas do MVP e as 5 user stories priorizadas |

**Quadro Kanban (GitHub Projects):** https://github.com/users/lucasjosebs/projects/1

## ▶️ Como executar

Como o projeto encontra-se na fase de front-end com dados simulados via LocalStorage, você pode executá-lo diretamente no seu navegador, sem necessidade de configurar um servidor local para a API.

1. Clone este repositório em sua máquina:
```bash
git clone https://github.com/lucasjosebs/PPP-ADS.git
```
2. Navegue até a pasta do Backend:
```bash
cd PPP-ADS/backend
```
3. Instale as dependências da API (Express, SQLite, etc.):
```bash
npm install
```
4. Inicie o servidor:
```bash
node server.js
```
> O terminal exibirá a mensagem: "Servidor rodando em http://localhost:3000" e o banco `farepet.db` será criado.

5. Acesse a Aplicação: </br>
Mantenha o terminal aberto rodando o servidor. Navegue até a pasta frontend e abra o arquivo `index.html` em qualquer navegador web (recomendado o uso da extensão Live Server no VS Code ou abertura direta do arquivo).

### 🔐 Acesso ao Painel Administrativo 

Para acessar a esteira de aprovações e o dashboard:

- Acesse: `frontend/html/admin.html`

- Usuário: `admin`

- Senha: `farepet2026`
  

## 🗺️ Roadmap

| Etapa | Foco | Status |
|---|---|---|
| 1 | Kickoff: Project Charter e repositório | ✅ Concluído |
| 2 | Concepção: personas, user stories e MVP | ✅ Concluído |
| 3 | Organização: backlog e quadro Kanban | ✅ Concluído |
| 4 | Desenvolvimento Frontend UI/UX | ✅ Concluído |
| 5 | Implementação Full-Stack (Node.js + SQLite) | ✅ Concluído |
| 6 | Integração Geográfica (Leaflet/Nominatim/ViaCEP) | ✅ Concluído |
| 7 | Encerramento: relatório e apresentação | 🔄 Em andamento  |

## 👤 Autor

**Lucas José** — [@lucasjosebs](https://github.com/lucasjosebs)

## 📄 Licença

Distribuído sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
