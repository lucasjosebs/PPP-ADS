document.addEventListener("DOMContentLoaded", () => {
    initFilters();
    initModal();
    renderDynamicAds();
    initForm();
});

// --- Lógica de Filtros ---
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cardsGrid = document.getElementById('ads-grid');

    if (!filterButtons.length || !cardsGrid) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');
            const cards = cardsGrid.querySelectorAll('.card'); 

            cards.forEach(card => {
                if (filterValue === 'todos' || card.getAttribute('data-status') === filterValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// --- Lógica do Modal ---
function initModal() {
    const modal = document.getElementById('pet-modal');
    const closeModalBtn = document.querySelector('.close-modal');

    if (!modal) return;

    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    document.body.addEventListener('click', (e) => {
        const card = e.target.closest('.card');
        if (card) {
            abrirModal(card);
        }
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
    if (status === 'perdido') {
        tagElement.textContent = 'Perdido';
        tagElement.classList.add('tag-perdido');
    } else if (status === 'achado') {
        tagElement.textContent = 'Encontrado';
        tagElement.classList.add('tag-encontrado');
    } else {
        tagElement.textContent = 'Para Adoção';
        tagElement.classList.add('tag-adocao');
    }

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

// --- Lógica do Formulário e LocalStorage ---
function initForm() {
    const form = document.getElementById('cadastro-form');
    if (!form) return;

    const fileInput = document.getElementById('foto_animal');
    const fileDisplay = document.getElementById('file-name-display');
    fileInput.addEventListener('change', (e) => {
        if(e.target.files.length > 0) {
            fileDisplay.textContent = e.target.files[0].name;
        } else {
            fileDisplay.textContent = "Clique ou arraste uma imagem aqui";
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const file = fileInput.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const base64Img = event.target.result;
                salvarAnuncio(formData, base64Img);
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
    anuncios.push(novoAnuncio);

    localStorage.setItem('farepet_anuncios', JSON.stringify(anuncios));

    alert("Anúncio cadastrado com sucesso!");
    window.location.href = "../index.html"; 
}

// --- Lógica de Renderização Dinâmica (Index.html) ---
function renderDynamicAds() {
    const adsGrid = document.getElementById('ads-grid');
    const adoptionGrid = document.getElementById('adoption-grid');

    if (!adsGrid && !adoptionGrid) return;

    const anuncios = JSON.parse(localStorage.getItem('farepet_anuncios')) || [];

    anuncios.forEach(anuncio => {
        const cardHTML = criarElementoCard(anuncio);
        
        if (anuncio.tipo === 'adocao' && adoptionGrid) {
            adoptionGrid.insertAdjacentHTML('afterbegin', cardHTML);
        } else if (adsGrid && (anuncio.tipo === 'perdido' || anuncio.tipo === 'achado')) {
            adsGrid.insertAdjacentHTML('afterbegin', cardHTML);
        }
    });
}

function criarElementoCard(anuncio) {
    let tagClass = '';
    let tagLabel = '';

    if (anuncio.tipo === 'perdido') {
        tagClass = 'tag-perdido';
        tagLabel = 'Perdido';
    } else if (anuncio.tipo === 'achado') {
        tagClass = 'tag-encontrado';
        tagLabel = 'Encontrado';
    } else {
        tagClass = 'tag-adocao';
        tagLabel = 'Adoção';
    }

    const imgStyle = anuncio.imagem ? `style="background-image: url('${anuncio.imagem}');"` : '';
    const imgText = anuncio.imagem ? '' : 'Foto do animal';

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
                <p>${anuncio.localStr.split('-')[0]}</p> 
                <span class="tag ${tagClass}">${tagLabel}</span>
            </div>
        </div>
    `;
}