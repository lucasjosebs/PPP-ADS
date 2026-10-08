const CARDS_PER_PAGE = 6; 
let configAds = { status: 'todos', especie: '', cidade: '', page: 1 };
let configAdocao = { especie: '', cidade: '', page: 1 };

// Variável global para armazenar os dados vindos da API
let anunciosGlobais = []; 

document.addEventListener("DOMContentLoaded", () => {
    initFilters(); // Inicializa os filtros de anúncios e adoções
    initFiltrosMapa(); // Inicializa os filtros do mapa
    initModal(); // Inicializa o modal de detalhes do animal
    initForm(); // Inicializa o formulário de cadastro de anúncios
    initBuscaCEP(); // Inicializa a busca automática de endereço via CEP
    initMobileMenu(); // Inicializa o menu mobile
    inicializarMapa(); // Inicializa o mapa Leaflet
    carregarAnunciosDaAPI(); // Nova função de ligação ao Back-end
});

// --- Lógica de Ligação à API ---
async function carregarAnunciosDaAPI() {
    const adsGrid = document.getElementById('ads-grid');
    const adoptionGrid = document.getElementById('adoption-grid');
    
    // Evita chamadas desnecessárias se estivermos no formulário de registo
    if (!adsGrid && !adoptionGrid) return;

    try {
        const resposta = await fetch('http://localhost:3000/api/anuncios');
        if (resposta.ok) {
            anunciosGlobais = await resposta.json();
            renderAll();
            atualizarPinosNoMapa(anunciosGlobais);
        } else {
            console.error("Erro ao obter anúncios do servidor.");
        }
    } catch (erro) {
        console.error("Falha na ligação à API. O servidor Node.js está a correr?", erro);
        if (adsGrid) adsGrid.innerHTML = '<p style="color: red; padding: 20px;">Erro de ligação ao servidor.</p>';
    }
}

// --- Lógica Principal de Filtragem e Paginação ---
function renderAll() {
    // 1. Filtrar Anúncios Recentes (Perdidos/Achados)
    let filteredAds = anunciosGlobais.filter(a => a.tipo === 'perdido' || a.tipo === 'achado');
    if (configAds.status !== 'todos') filteredAds = filteredAds.filter(a => a.tipo === configAds.status);
    if (configAds.especie) filteredAds = filteredAds.filter(a => a.especie.toLowerCase() === configAds.especie.toLowerCase());
    if (configAds.cidade) filteredAds = filteredAds.filter(a => a.cidade && a.cidade.toLowerCase().includes(configAds.cidade.toLowerCase()));

    // 2. Filtrar Adoções
    let filteredAdocao = anunciosGlobais.filter(a => a.tipo === 'adocao');
    if (configAdocao.especie) filteredAdocao = filteredAdocao.filter(a => a.especie.toLowerCase() === configAdocao.especie.toLowerCase());
    if (configAdocao.cidade) filteredAdocao = filteredAdocao.filter(a => a.cidade && a.cidade.toLowerCase().includes(configAdocao.cidade.toLowerCase()));

    renderGridPaginated('ads-grid', 'paginacao-ads', filteredAds, configAds);
    renderGridPaginated('adoption-grid', 'paginacao-adocao', filteredAdocao, configAdocao);
}

function renderGridPaginated(gridId, pagId, data, config) {
    const grid = document.getElementById(gridId);
    const pagContainer = document.getElementById(pagId);
    if (!grid || !pagContainer) return;

    const totalPages = Math.ceil(data.length / CARDS_PER_PAGE) || 1;
    if (config.page > totalPages) config.page = totalPages;

    const start = (config.page - 1) * CARDS_PER_PAGE;
    const pageData = data.slice(start, start + CARDS_PER_PAGE);

    grid.innerHTML = '';
    if (pageData.length === 0) {
        grid.innerHTML = '<p style="color: #666; font-family: Inter;">Nenhum animal encontrado com estes filtros.</p>';
    } else {
        pageData.forEach(item => {
            grid.insertAdjacentHTML('beforeend', criarElementoCard(item));
        });
    }

    pagContainer.innerHTML = '';
    if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.className = `page-btn ${i === config.page ? 'active' : ''}`;
            btn.textContent = i;
            btn.onclick = () => {
                config.page = i;
                renderAll();
                grid.parentElement.scrollIntoView({ behavior: 'smooth' });
            };
            pagContainer.appendChild(btn);
        }
    }
}

// Escutadores de Eventos dos Filtros
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            configAds.status = button.getAttribute('data-filter');
            configAds.page = 1; 
            renderAll();
        });
    });

    const espAds = document.getElementById('filtro-especie-ads');
    const cidAds = document.getElementById('filtro-cidade-ads');
    if (espAds) espAds.addEventListener('change', e => { configAds.especie = e.target.value; configAds.page = 1; renderAll(); });
    if (cidAds) cidAds.addEventListener('input', e => { configAds.cidade = e.target.value; configAds.page = 1; renderAll(); });

    const espAdocao = document.getElementById('filtro-especie-adocao');
    const cidAdocao = document.getElementById('filtro-cidade-adocao');
    if (espAdocao) espAdocao.addEventListener('change', e => { configAdocao.especie = e.target.value; configAdocao.page = 1; renderAll(); });
    if (cidAdocao) cidAdocao.addEventListener('input', e => { configAdocao.cidade = e.target.value; configAdocao.page = 1; renderAll(); });
}

function criarElementoCard(anuncio) {
    let tagClass = '', tagLabel = '';
    if (anuncio.tipo === 'perdido') { tagClass = 'tag-perdido'; tagLabel = 'Perdido'; }
    else if (anuncio.tipo === 'achado') { tagClass = 'tag-encontrado'; tagLabel = 'Encontrado'; }
    else { tagClass = 'tag-adocao'; tagLabel = 'Adoção'; }

    const imgStyle = anuncio.imagem ? `style="background-image: url('${anuncio.imagem}');"` : '';
    const imgText = anuncio.imagem ? '' : 'Foto';
    
    // Constrói a string do local
    const numeroStr = anuncio.numero && anuncio.numero !== 'S/N' ? `, ${anuncio.numero}` : '';
    const localCompleto = `${anuncio.rua}${numeroStr} - ${anuncio.cidade}`;

    return `
        <div class="card" 
            data-status="${anuncio.tipo}" 
            data-nome="${anuncio.nome}" 
            data-especie="${anuncio.especie}" 
            data-local="${localCompleto}" 
            data-contato="${anuncio.contato}"
            data-img="${anuncio.imagem}">
            
            <div class="card-image-placeholder" ${imgStyle}>${imgText}</div>
            <div class="card-content">
                <h3>${!anuncio.nome || anuncio.nome === 'Sem nome' ? `${anuncio.especie} (${tagLabel})` : anuncio.nome}</h3>
                <p>${anuncio.rua || 'Local desconhecido'}</p> 
                <span class="tag ${tagClass}">${tagLabel}</span>
            </div>
        </div>
    `;
}

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
    if (imgBase64 && imgBase64 !== 'null') {
        imgContainer.style.backgroundImage = `url(${imgBase64})`;
        imgContainer.textContent = "";
    } else {
        imgContainer.style.backgroundImage = "none";
        imgContainer.textContent = "Sem Foto";
    }

    modal.style.display = 'flex';
}

function initForm() {
    const form = document.getElementById('cadastro-form');
    if (!form) return;

    const fileInput = document.getElementById('foto_animal');
    const fileDisplay = document.getElementById('file-name-display');
    fileInput.addEventListener('change', (e) => {
        if(e.target.files.length > 0) fileDisplay.textContent = e.target.files[0].name;
        else fileDisplay.textContent = "Clique ou arraste uma imagem aqui";
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Bloqueia o botão para evitar duplos envios
        const submitBtn = form.querySelector('.btn-submit');
        submitBtn.textContent = 'A processar...';
        submitBtn.disabled = true;

        const formData = new FormData(form);
        const file = fileInput.files[0];

        try {
            let base64Img = "";
            
            if (file) {
                // Comprime a imagem para um máximo de 800x800px com 70% de qualidade (0.7)
                base64Img = await comprimirImagem(file, 800, 800, 0.7);
            }
            
            // Agora envia o formulário e a string comprimida para a função da API
            await enviarParaAPI(formData, base64Img, submitBtn);
            
        } catch (erro) {
            Swal.fire('Erro', 'Falha ao processar a imagem do animal.', 'error');
            console.error(erro);
            submitBtn.textContent = 'Publicar Anúncio';
            submitBtn.disabled = false;
        }
    });
}

// Substitui o antigo salvarAnuncio
async function enviarParaAPI(formData, base64Img, submitBtn) {
    const rua = formData.get('rua');
    const numero = formData.get('numero') || 'S/N';
    const cidade = formData.get('cidade');
    const cep = formData.get('cep') || '';
    const complemento = formData.get('complemento') || '';
    const telefone = formData.get('telefone');
    const email = formData.get('email');
    
    let infoContato = [];
    if (telefone) infoContato.push(telefone);
    if (email) infoContato.push(email);
    const contatoFinal = infoContato.length > 0 ? infoContato.join(' / ') : 'Não informado';

    // 1. Obter Coordenadas usando a API Nominatim (OpenStreetMap)
    let latitude = null;
    let longitude = null;
    const enderecoBusca = `${rua}, ${numero}, ${cidade}, Brasil`;

    try {
        const geoResposta = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enderecoBusca)}`);
        const geoDados = await geoResposta.json();
        
        if (geoDados && geoDados.length > 0) {
            latitude = parseFloat(geoDados[0].lat);
            longitude = parseFloat(geoDados[0].lon);
        }
    } catch (err) {
        console.warn("Aviso: Falha ao procurar as coordenadas no mapa. O anúncio será guardado sem pino.", err);
    }

    // 2. Construir o objeto JSON para a nossa API
    const novoAnuncio = {
        tipo: formData.get('tipo_anuncio'),
        especie: formData.get('especie'),
        nome: formData.get('nome_animal') || 'Sem nome',
        cep: cep,
        rua: rua,
        numero: numero,
        complemento: complemento,
        cidade: cidade,
        contato: contatoFinal,
        imagem: base64Img,
        latitude: latitude,
        longitude: longitude
    };

    // 3. Enviar para o servidor Node.js
    try {
        const resposta = await fetch('http://localhost:3000/api/anuncios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoAnuncio)
        });

        if (resposta.ok) {
            Swal.fire({
                title: 'Sucesso!',
                text: 'Anúncio enviado! Aparecerá no mapa após a aprovação.',
                icon: 'success',
                confirmButtonColor: '#e07a5f' // Cor do seu botão primário
            }).then(() => {
                window.location.href = "../index.html"; 
            });
        } else {
            const erroApi = await resposta.json();
            Swal.fire('Erro', 'Falha ao salvar: ' + (erroApi.error || 'Desconhecido'), 'error');
        }
    } catch (err) {
        Swal.fire('Erro de Conexão', 'Não foi possível ligar ao servidor.', 'error');
        console.error(err);
    } finally {
        submitBtn.textContent = 'Publicar Anúncio';
        submitBtn.disabled = false;
    }
}

function initMobileMenu() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdown = document.querySelector('.dropdown');

    if (!hamburgerBtn || !navMenu) return;

    hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    if (dropdownToggle && dropdown) {
        dropdownToggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    }

    const links = navMenu.querySelectorAll('a:not(.dropdown-toggle)');
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                hamburgerBtn.classList.remove('active');
                navMenu.classList.remove('active');
                dropdown.classList.remove('active');
            }
        });
    });
}

// --- Lógica do Mapa Leaflet ---
let mapaLeaflet;
let grupoMarcadores;

function inicializarMapa() {
    const mapContainer = document.getElementById('mapa-anuncios');
    if (!mapContainer) return; 

    // Inicializa o mapa com o scroll (roda do rato) desativado por defeito
    mapaLeaflet = L.map('mapa-anuncios', {
        scrollWheelZoom: false
    }).setView([-23.5505, -46.6333], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapaLeaflet);

    grupoMarcadores = L.layerGroup().addTo(mapaLeaflet);

    // Ativa o zoom com o scroll apenas quando o utilizador clica no mapa
    mapaLeaflet.on('focus', () => { mapaLeaflet.scrollWheelZoom.enable(); });
    mapaLeaflet.on('click', () => { mapaLeaflet.scrollWheelZoom.enable(); });
    
    // Desativa novamente se o rato sair do mapa
    mapaLeaflet.on('mouseout', () => { mapaLeaflet.scrollWheelZoom.disable(); });
    mapaLeaflet.on('blur', () => { mapaLeaflet.scrollWheelZoom.disable(); });
}

function atualizarPinosNoMapa(anuncios) {
    if (!mapaLeaflet || !grupoMarcadores) return;

    // Limpa os pinos antigos
    grupoMarcadores.clearLayers();

    anuncios.forEach(anuncio => {
        // Verifica se o anúncio tem coordenadas válidas gravadas no SQLite
        if (anuncio.latitude && anuncio.longitude) {
            
            // Define a cor do marcador com base no tipo
            let corPino = 'blue'; // Achado (padrão)
            if (anuncio.tipo === 'perdido') corPino = 'red';
            else if (anuncio.tipo === 'adocao') corPino = 'green';

            // Criar um ícone customizado (usando a API do Google Charts para simplificar)
            const iconePersonalizado = L.icon({
                iconUrl: `http://maps.google.com/mapfiles/ms/icons/${corPino}-dot.png`,
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32]
            });

            // Cria o texto que aparece ao clicar no pino
            const nomeExibicao = anuncio.nome === 'Sem nome' ? anuncio.especie : anuncio.nome;
            const statusLabel = anuncio.tipo === 'perdido' ? 'Perdido' : (anuncio.tipo === 'achado' ? 'Encontrado' : 'Para Adoção');
            
            const conteudoPopup = `
                <div style="text-align: center;">
                    <h3>${nomeExibicao}</h3>
                    <p><strong>Status:</strong> ${statusLabel}</p>
                    <p>${anuncio.cidade}</p>
                </div>
            `;

            // Adiciona o marcador ao mapa
            L.marker([anuncio.latitude, anuncio.longitude], { icon: iconePersonalizado })
                .addTo(grupoMarcadores)
                .bindPopup(conteudoPopup);
        }
    });
}

// --- Lógica de Filtros do Mapa ---
function initFiltrosMapa() {
    const statusMap = document.getElementById('map-filtro-status');
    const espMap = document.getElementById('map-filtro-especie');
    const cidMap = document.getElementById('map-filtro-cidade');
    const ruaMap = document.getElementById('map-filtro-rua');

    // Se os elementos não existirem, não faz nada
    if (!statusMap) return;

    // Adiciona escutadores para atualizar o mapa instantaneamente ao escrever/selecionar
    statusMap.addEventListener('change', aplicarFiltrosMapa);
    espMap.addEventListener('change', aplicarFiltrosMapa);
    cidMap.addEventListener('input', aplicarFiltrosMapa);
    ruaMap.addEventListener('input', aplicarFiltrosMapa);
}

function aplicarFiltrosMapa() {
    const status = document.getElementById('map-filtro-status').value;
    const especie = document.getElementById('map-filtro-especie').value.toLowerCase();
    const cidade = document.getElementById('map-filtro-cidade').value.toLowerCase();
    const rua = document.getElementById('map-filtro-rua').value.toLowerCase();

    // Começa com a lista completa que veio da API
    let filtrados = anunciosGlobais;

    if (status !== 'todos') {
        filtrados = filtrados.filter(a => a.tipo === status);
    }
    if (especie) {
        filtrados = filtrados.filter(a => a.especie.toLowerCase() === especie);
    }
    if (cidade) {
        filtrados = filtrados.filter(a => a.cidade && a.cidade.toLowerCase().includes(cidade));
    }
    if (rua) {
        filtrados = filtrados.filter(a => a.rua && a.rua.toLowerCase().includes(rua));
    }

    // Envia a lista filtrada para desenhar os pinos
    atualizarPinosNoMapa(filtrados);
}


function initBuscaCEP() {
    const inputCep = document.getElementById('cep') || document.querySelector('input[name="cep"]');
    const inputRua = document.getElementById('rua') || document.querySelector('input[name="rua"]');
    const inputCidade = document.getElementById('cidade') || document.querySelector('input[name="cidade"]');
    const inputNumero = document.getElementById('numero') || document.querySelector('input[name="numero"]');

    if (!inputCep) return; 

    inputCep.addEventListener('blur', async (e) => {
        const cepVazio = e.target.value.replace(/\D/g, '');

        if (cepVazio.length === 8) {
            try {
                const resposta = await fetch(`https://viacep.com.br/ws/${cepVazio}/json/`);
                const dados = await resposta.json();

                if (!dados.erro) {
                    if (inputRua) inputRua.value = dados.logradouro;
                    if (inputCidade) inputCidade.value = dados.localidade;
                    if (inputNumero) inputNumero.focus();
                } else {
                    Swal.fire('Atenção', 'CEP não encontrado. Por favor, verifique os números.', 'warning');
                }
            } catch (erro) {
                console.error("Erro ao procurar o CEP:", erro);
            }
        }
    });
}

// --- Lógica de Compressão de Imagens ---
function comprimirImagem(file, maxWidth, maxHeight, quality) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        
        reader.onload = function(event) {
            const img = new Image();
            img.src = event.target.result;
            
            img.onload = function() {
                let width = img.width;
                let height = img.height;

                // Calcula as novas dimensões mantendo a proporção
                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                // Cria um canvas na memória e desenha a imagem redimensionada
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Converte para Base64 no formato JPEG com a qualidade especificada (0 a 1)
                const base64Comprimido = canvas.toDataURL('image/jpeg', quality);
                resolve(base64Comprimido);
            };
            img.onerror = error => reject(error);
        };
        reader.onerror = error => reject(error);
    });
}