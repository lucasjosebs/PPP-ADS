# Project Charter — Farepet

**Disciplina:** Projetos Profissionalizantes — Faculdade Grau (Prof. Josivan)
**Curso:** Análise e Desenvolvimento de Sistemas
**Autor:** Lucas José
**Repositório:** https://github.com/lucasjosebs/PPP-ADS
**Data de abertura:** 24 de setembro de 2026

---

## 1. Título do projeto
**Farepet** — Plataforma web para animais perdidos e abandonados.

## 2. Problema
Quando um animal se perde ou é abandonado, os avisos ficam dispersos em redes sociais, grupos e cartazes, o que dificulta que tutores e pessoas que encontraram o animal se conectem a tempo. Além disso, muita gente que encontra um animal deixa de divulgar por não querer expor seus dados pessoais.

## 3. Público-alvo
- Tutores que perderam um animal de estimação.
- Pessoas que encontraram um animal perdido ou abandonado.
- Pessoas interessadas em adotar.
- Protetores independentes e ONGs (público secundário).

## 4. Objetivo
Desenvolver um MVP de plataforma web que centralize, em um mapa, o registro de animais perdidos, encontrados e disponíveis para adoção, com opção de cadastro anônimo, começando pela cidade de São Paulo.

## 5. Equipe e papéis
Projeto **individual** (turma EAD).

| Papel | Responsável | Como será exercido |
|---|---|---|
| Product Owner | Lucas José | Define a visão e prioriza o backlog |
| Scrum Master | Lucas José | Organiza sprints, Kanban e remove bloqueios |
| Desenvolvedor | Lucas José | Desenvolve, testa e documenta |

*Para equilibrar os três papéis, o planejamento e a revisão de cada sprint serão registrados por escrito no Kanban.*

## 6. Escopo inicial (MVP)
**Dentro do escopo:**
1. Cadastro de animal perdido (foto, descrição, local no mapa, contato).
2. Cadastro de animal encontrado, com opção anônima.
3. Visualização de anúncios em mapa e lista, com filtros.
4. Página de detalhes do anúncio.
5. Seção de animais para adoção.

**Fora do escopo (nesta versão):** contas de usuário com login, notificações, cruzamento automático de anúncios, outras cidades, aplicativo mobile.

## 7. Recursos e ferramentas
- **Código e versionamento:** GitHub (branches, commits, pull requests, issues, releases).
- **Gestão de tarefas:** quadro Kanban (Trello ou GitHub Projects).
- **Tecnologias:** HTML, CSS, JavaScript, Node.js + Express, Leaflet/OpenStreetMap.
- **Nuvem:** AWS (S3 para fotos e hospedagem; demais serviços a definir).

## 8. Critérios e métricas de sucesso
- Todas as 5 funcionalidades do MVP funcionando e demonstráveis.
- Sistema publicado em ambiente acessível por link (demo).
- Testes realizados com pelo menos 3 pessoas, com bugs registrados nas *issues* do GitHub.
- Todas as entregas das 6 etapas concluídas dentro do prazo.
- Relatório técnico (máx. 8 páginas) e apresentação final entregues.

## 9. Cronograma previsto

| Etapa | Foco | Prazo |
|---|---|---|
| 1 | Kickoff, Charter e repositório | 28/09/2026 |
| 2 | Concepção: personas e user stories | 28/09/2026 |
| 3 | Organização: backlog e Kanban | A definir ... |
| 4 | Desenvolvimento (sprints) | A definir ... |
| 5 | Testes e validação | A definir ... |
| 6 | Encerramento e apresentação | A definir ... |

## 10. Plano de comunicação
- **Acompanhamento das tarefas:** quadro Kanban atualizado a cada sessão de trabalho.
- **Registro do progresso:** commits frequentes e *issues* no GitHub.
- **Dúvidas e bloqueios:** checkpoints com o tutor/professor pelos canais oficiais da disciplina.
- **Feedback de usuários:** teste do MVP com pessoas próximas (etapa 5), com retorno registrado.

## 11. Principais riscos e mitigação

| Risco | Mitigação |
|---|---|
| Escopo grande para uma pessoa só | Foco rigoroso no MVP; ideias extras vão para o backlog futuro |
| Pouca experiência com back-end e AWS | Desenvolver primeiro localmente; migrar para a AWS depois |
| Procrastinação | Microentregas por etapa e Kanban atualizado |
| Privacidade de dados (LGPD) | Contato opcional, sem exibir endereço exato de quem encontrou o animal |
| Uso indevido (spam, anúncios falsos) | Validação de campos e botão de denúncia |

---

**Aprovação:** __Lucas José de Barros Silva__ (Lucas José)   **Data:** __24__/__09__/__2026__
