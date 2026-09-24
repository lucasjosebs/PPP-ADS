# 🐾 Farepet

> **Farejar + Pet**: uma plataforma web para ajudar a reunir animais perdidos com seus tutores e encontrar um lar para animais abandonados.

Projeto de Prática Profissional em Análise e Desenvolvimento de Sistemas (Faculdade Grau, disciplina *Projetos Profissionalizantes*).

**Status:** 🚧 Em desenvolvimento (Sprint 0 — Kickoff)

---

## 📌 Sobre o projeto

Quando um animal some, o tempo é decisivo. Hoje os avisos ficam espalhados em grupos de redes sociais, cartazes e mensagens que se perdem rápido. O **Farepet** centraliza esses avisos em um mapa, permitindo que:

- **Tutores** cadastrem o animal perdido, com fotos, descrição, contato e o local onde ele foi visto pela última vez.
- **Quem encontrou** um animal cadastre onde ele foi localizado, com a opção de fazer isso **de forma anônima**.
- **Interessados em adotar** consultem os animais encontrados em situação de abandono.

A cidade inicial de cobertura é **São Paulo (SP)**.

## ✨ Funcionalidades do MVP

- [ ] Cadastro de animal **perdido** (foto, descrição, local no mapa, contato)
- [ ] Cadastro de animal **encontrado** (com opção anônima)
- [ ] Visualização dos anúncios em **mapa e lista**, com filtros (tipo, espécie)
- [ ] Página de **detalhes** do anúncio
- [ ] Seção de **animais para adoção**

**Fora do MVP (ideias futuras):** contas de usuário, notificações, cruzamento automático entre "perdido" e "encontrado", outras cidades.

## 🛠️ Tecnologias

| Camada | Tecnologia (planejada) |
|---|---|
| Front-end | HTML, CSS e JavaScript |
| Mapa | Leaflet + OpenStreetMap |
| Back-end | Node.js + Express |
| Banco de dados | A definir (SQLite ou DynamoDB) |
| Armazenamento de fotos | Amazon S3 |
| Hospedagem | AWS |

## 📁 Estrutura do repositório

```
PPP-ADS/
├── docs/          # Project Charter, personas, relatório
├── frontend/      # Páginas, estilos e scripts do site
├── backend/       # API (Node.js + Express)
├── LICENSE
└── README.md
```

> A estrutura será criada e ajustada conforme o projeto avança.

## ▶️ Como executar

*Será documentado assim que a primeira versão funcional estiver pronta (Sprint 1).*

## 🗺️ Roadmap

| Etapa | Foco | Status |
|---|---|---|
| 1 | Kickoff: Project Charter e repositório | 🔄 Em andamento |
| 2 | Concepção: personas, user stories e MVP | ⏳ Pendente |
| 3 | Organização: backlog e quadro Kanban | ⏳ Pendente |
| 4 | Desenvolvimento em sprints | ⏳ Pendente |
| 5 | Testes e validação | ⏳ Pendente |
| 6 | Encerramento: relatório e apresentação | ⏳ Pendente |

## 👤 Autor

**Lucas José** — [@lucasjosebs](https://github.com/lucasjosebs)

## 📄 Licença

Distribuído sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
