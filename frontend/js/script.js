const CARDS_PER_PAGE = 6; // Limite de 6 cards (2 linhas x 3 colunas)

// Configuração de estado para paginação e filtros
let configAds = { status: 'todos', especie: '', cidade: '', page: 1 };
let configAdocao = { especie: '', cidade: '', page: 1 };

document.addEventListener("DOMContentLoaded", () => {
    inicializarDadosMock(); // Garante que a tela não fique vazia
    initFilters();
    initModal();
    initForm();
    renderAll(); // Inicia a renderização dinâmica e paginação
});

function inicializarDadosMock() {
    let anuncios = JSON.parse(localStorage.getItem('farepet_anuncios')) || [];
    if (anuncios.length === 0) {
        anuncios = [
            { id: 1, tipo: 'perdido', especie: 'Cão', nome: 'Theo', localStr: 'Pinheiros - São Paulo', contato: '(11) 99999-9999', imagem: '' },
            { id: 2, tipo: 'achado', especie: 'Gato', nome: 'Gato cinza sem coleira', localStr: 'Vila Madalena - São Paulo', contato: '(11) 98888-8888', imagem: '' },
            { id: 3, tipo: 'adocao', especie: 'Gato', nome: 'Gato SRD', localStr: 'Abrigo parceiro - Lapa - São Paulo', contato: 'abrigo@email.com', imagem: '' },
            { id: 4, tipo: 'perdido', especie: 'Aves', nome: 'Louro', localStr: 'Centro - Mogi das Cruzes', contato: '(11) 97777-7777', imagem: '' },
            { id: 5, tipo: 'achado', especie: 'Cão', nome: 'Poodle Branco', localStr: 'Moema - São Paulo', contato: 'Não informado', imagem: '' },
            { id: 6, tipo: 'perdido', especie: 'Gato', nome: 'Frajola', localStr: 'Tatuapé - São Paulo', contato: '(11) 91111-1111', imagem: '' },
            { id: 7, tipo: 'achado', especie: 'Roedor', nome: 'Hamster Sírio', localStr: 'Sé - São Paulo', contato: 'Não informado', imagem: '' }
        ];
        localStorage.setItem('farepet_anuncios', JSON.stringify(anuncios));
    }
}

// --- Lógica Principal de Filtragem e Paginação ---
function renderAll() {
    const anuncios = JSON.parse(localStorage.getItem('farepet_anuncios')) || [];

    // 1. Filtrar Anúncios Recentes (Perdidos/Achados)
    let filteredAds = anuncios.filter(a => a.tipo === 'perdido' || a.tipo === 'achado');
    if (configAds.status !== 'todos') filteredAds = filteredAds.filter(a => a.tipo === configAds.status);
    if (configAds.especie) filteredAds = filteredAds.filter(a => a.especie.toLowerCase() === configAds.especie.toLowerCase());
    if (configAds.cidade) filteredAds = filteredAds.filter(a => a.localStr.toLowerCase().includes(configAds.cidade.toLowerCase()));

    // 2. Filtrar Adoções
    let filteredAdocao = anuncios.filter(a => a.tipo === 'adocao');
    if (configAdocao.especie) filteredAdocao = filteredAdocao.filter(a => a.especie.toLowerCase() === configAdocao.especie.toLowerCase());
    if (configAdocao.cidade) filteredAdocao = filteredAdocao.filter(a => a.localStr.toLowerCase().includes(configAdocao.cidade.toLowerCase()));

    // Renderizar
    renderGridPaginated('ads-grid', 'paginacao-ads', filteredAds, configAds);
    renderGridPaginated('adoption-grid', 'paginacao-adocao', filteredAdocao, configAdocao);
}

function renderGridPaginated(gridId, pagId, data, config) {
    const grid = document.getElementById(gridId);
    const pagContainer = document.getElementById(pagId);
    if (!grid || !pagContainer) return; // Proteção para caso não esteja na Index

    const totalPages = Math.ceil(data.length / CARDS_PER_PAGE) || 1;
    if (config.page > totalPages) config.page = totalPages;

    const start = (config.page - 1) * CARDS_PER_PAGE;
    const pageData = data.slice(start, start + CARDS_PER_PAGE);

    // Injetar os Cards
    grid.innerHTML = '';
    if (pageData.length === 0) {
        grid.innerHTML = '<p style="color: #666; font-family: Inter;">Nenhum animal encontrado com esses filtros.</p>';
    } else {
        pageData.forEach(item => {
            grid.insertAdjacentHTML('beforeend', criarElementoCard(item));
        });
    }

    // Gerar Botões de Paginação
    pagContainer.innerHTML = '';
    if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.className = `page-btn ${i === config.page ? 'active' : ''}`;
            btn.textContent = i;
            btn.onclick = () => {
                config.page = i;
                renderAll(); // Re-renderiza a tela no clique
                // Opcional: Rolar de volta para o topo da seção
                grid.parentElement.scrollIntoView({ behavior: 'smooth' });
            };
            pagContainer.appendChild(btn);
        }
    }
}

// Escutadores de Eventos dos Filtros
function initFilters() {
    // Botões Status
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            configAds.status = button.getAttribute('data-filter');
            configAds.page = 1; // Reseta para a página 1 ao filtrar
            renderAll();
        });
    });

    // Inputs Anúncios Recentes
    const espAds = document.getElementById('filtro-especie-ads');
    const cidAds = document.getElementById('filtro-cidade-ads');
    if (espAds) espAds.addEventListener('change', e => { configAds.especie = e.target.value; configAds.page = 1; renderAll(); });
    if (cidAds) cidAds.addEventListener('input', e => { configAds.cidade = e.target.value; configAds.page = 1; renderAll(); });

    // Inputs Adoção
    const espAdocao = document.getElementById('filtro-especie-adocao');
    const cidAdocao = document.getElementById('filtro-cidade-adocao');
    if (espAdocao) espAdocao.addEventListener('change', e => { configAdocao.especie = e.target.value; configAdocao.page = 1; renderAll(); });
    if (cidAdocao) cidAdocao.addEventListener('input', e => { configAdocao.cidade = e.target.value; configAdocao.page = 1; renderAll(); });
}

// --- Criação do HTML do Card ---
function criarElementoCard(anuncio) {
    let tagClass = '', tagLabel = '';
    if (anuncio.tipo === 'perdido') { tagClass = 'tag-perdido'; tagLabel = 'Perdido'; }
    else if (anuncio.tipo === 'achado') { tagClass = 'tag-encontrado'; tagLabel = 'Encontrado'; }
    else { tagClass = 'tag-adocao'; tagLabel = 'Adoção'; }

    const imgStyle = anuncio.imagem ? `style="background-image: url('${anuncio.imagem}');"` : '';
    const imgText = anuncio.imagem ? '' : 'Foto do animal';
    const localResumido = anuncio.localStr ? anuncio.localStr.split('-')[0].trim() : '';

    return `
        <div class="card" 
            data-status="${anuncio.tipo}" 
            data-nome="${anuncio.nome}" 
            data-especie="${anuncio.especie}" 
            data-local="${anuncio.localStr}" 
            data-contato="${anuncio.contato}"
            data-img="${anuncio.imagem}">
            
            <div class="card-image-placeholder" ${imgStyle}>${imgText}</div>
            <div class="card-content">
                <h3>${anuncio.nome === 'Sem nome' ? `${anuncio.especie} (${tagLabel})` : anuncio.nome}</h3>
                <p>${localResumido}</p> 
                <span class="tag ${tagClass}">${tagLabel}</span>
            </div>
        </div>
    `;
}

// --- Lógica do Modal (Mantida) ---
function initModal() {
    const modal = document.getElementById('pet-modal');
    const closeModalBtn = document.querySelector('.close-modal');

    if (!modal) return;

    closeModalBtn.addEventListener('click', () => { modal.style.display = 'none'; });
    window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

    document.body.addEventListener('click', (e) => {
        const card = e.target.closest('.card');
        if (card) abrirModal(card);
    });
}

function abrirModal(card) {
    const modal = document.getElementById('pet-modal');
    
    const status = card.getAttribute('data-status');
    const nome = card.getAttribute('data-nome') || 'Desconhecido';
    const especie = card.getAttribute('data-especie');
    const local = card.getAttribute('data-local');
    const contato = card.getAttribute('data-contato');
    const imgBase64 = card.getAttribute('data-img');

    document.getElementById('modal-nome').textContent = nome;
    document.getElementById('modal-especie').textContent = especie;
    document.getElementById('modal-local').textContent = local;
    document.getElementById('modal-contato').textContent = contato;

    const tagElement = document.getElementById('modal-tag');
    tagElement.className = 'tag'; 
    if (status === 'perdido') { tagElement.textContent = 'Perdido'; tagElement.classList.add('tag-perdido'); }
    else if (status === 'achado') { tagElement.textContent = 'Encontrado'; tagElement.classList.add('tag-encontrado'); }
    else { tagElement.textContent = 'Para Adoção'; tagElement.classList.add('tag-adocao'); }

    const imgContainer = document.getElementById('modal-img-container');
    if (imgBase64) {
        imgContainer.style.backgroundImage = `url(${imgBase64})`;
        imgContainer.textContent = "";
    } else {
        imgContainer.style.backgroundImage = "none";
        imgContainer.textContent = "Foto do animal";
    }

    modal.style.display = 'flex';
}

// --- Lógica do Formulário e LocalStorage (Mantida) ---
function initForm() {
    const form = document.getElementById('cadastro-form');
    if (!form) return;

    const fileInput = document.getElementById('foto_animal');
    const fileDisplay = document.getElementById('file-name-display');
    fileInput.addEventListener('change', (e) => {
        if(e.target.files.length > 0) fileDisplay.textContent = e.target.files[0].name;
        else fileDisplay.textContent = "Clique ou arraste uma imagem aqui";
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const file = fileInput.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                salvarAnuncio(formData, event.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            salvarAnuncio(formData, "");
        }
    });
}

function salvarAnuncio(formData, base64Img) {
    const rua = formData.get('rua');
    const numero = formData.get('numero') || 'S/N';
    const cidade = formData.get('cidade');
    const telefone = formData.get('telefone');
    const email = formData.get('email');
    
    let infoContato = [];
    if (telefone) infoContato.push(telefone);
    if (email) infoContato.push(email);
    const contatoFinal = infoContato.length > 0 ? infoContato.join(' / ') : 'Não informado';
    
    const novoAnuncio = {
        id: Date.now(),
        tipo: formData.get('tipo_anuncio'),
        especie: formData.get('especie'),
        nome: formData.get('nome_animal') || 'Sem nome',
        localStr: `${rua}, ${numero} - ${cidade}`,
        contato: contatoFinal,
        imagem: base64Img
    };

    let anuncios = JSON.parse(localStorage.getItem('farepet_anuncios')) || [];
    anuncios.unshift(novoAnuncio); // Insere no topo da lista (mais recentes primeiro)
    localStorage.setItem('farepet_anuncios', JSON.stringify(anuncios));

    alert("Anúncio cadastrado com sucesso!");
    window.location.href = "../index.html"; 
}