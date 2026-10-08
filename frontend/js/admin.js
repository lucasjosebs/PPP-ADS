let anunciosGlobaisAdmin = []; 

document.addEventListener("DOMContentLoaded", () => {
    verificarSessao();

    document.getElementById('btn-login').addEventListener('click', fazerLogin);
    document.getElementById('btn-logout').addEventListener('click', fazerLogout);
    document.getElementById('close-admin-modal').addEventListener('click', () => {
        document.getElementById('admin-modal').style.display = 'none';
    });
});

async function fazerLogin() {
    const user = document.getElementById('admin-user').value;
    const pass = document.getElementById('admin-pass').value;

    try {
        const res = await fetch('http://localhost:3000/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario: user, senha: pass })
        });

        if (res.ok) {
            const data = await res.json();
            localStorage.setItem('farepet_admin_token', data.token);
            verificarSessao();
        } else {
            Swal.fire({
                title: 'Acesso Negado',
                text: 'Usuário ou senha incorretos.',
                icon: 'error',
                confirmButtonColor: '#d32f2f'
            });
        }
    } catch (err) {
        Swal.fire('Erro de Conexão', 'Não foi possível ligar ao servidor.', 'error');
    }
}

function fazerLogout() {
    localStorage.removeItem('farepet_admin_token');
    window.location.reload();
}

function verificarSessao() {
    const token = localStorage.getItem('farepet_admin_token');
    if (token) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('dashboard-section').style.display = 'block';
        document.getElementById('btn-logout').style.display = 'block';
        carregarTabelaAdmin();
        carregarMetricas();
    } else {
        document.getElementById('login-section').style.display = 'block';
        document.getElementById('dashboard-section').style.display = 'none';
        document.getElementById('btn-logout').style.display = 'none';
    }
}

async function carregarTabelaAdmin() {
    const tbody = document.getElementById('admin-table-body');
    tbody.innerHTML = '<tr><td colspan="7">Carregando dados...</td></tr>';

    try {
        const res = await fetch('http://localhost:3000/api/admin/anuncios');
        anunciosGlobaisAdmin = await res.json();

        tbody.innerHTML = '';
        anunciosGlobaisAdmin.forEach(a => {
            const dataStr = new Date(a.data_criacao).toLocaleDateString('pt-BR');
            let statusLabel = '';
            let botoesAcao = '';

            const btnVer = `<button class="btn-toggle btn-ver" onclick="abrirModal(${a.id})">Ver Foto</button>`;

            if (a.status_publicacao === 'pendente') {
                statusLabel = '<span style="color: #ed6c02; font-weight: 700;">Novo (Pendente)</span>';
                botoesAcao = `
                    ${btnVer}
                    <button class="btn-toggle btn-aprovar" onclick="alterarStatus(${a.id}, 'aprovado')">Aprovar</button>
                    <button class="btn-toggle btn-ocultar" onclick="alterarStatus(${a.id}, 'oculto')">Recusar</button>
                `;
            } else if (a.status_publicacao === 'aprovado') {
                statusLabel = '<span style="color: green; font-weight: 700;">Público</span>';
                botoesAcao = `
                    ${btnVer}
                    <button class="btn-toggle btn-ocultar" onclick="alterarStatus(${a.id}, 'oculto')">Ocultar</button>
                `;
            } else {
                statusLabel = '<span style="color: red; font-weight: 700;">Oculto</span>';
                botoesAcao = `
                    ${btnVer}
                    <button class="btn-toggle btn-aprovar" onclick="alterarStatus(${a.id}, 'aprovado')">Reativar</button>
                `;
            }

            const tr = `
                <tr>
                    <td>#${a.id}</td>
                    <td>${dataStr}</td>
                    <td>${a.nome === 'Sem nome' ? a.especie : a.nome}</td>
                    <td style="text-transform: capitalize;">${a.tipo}</td>
                    <td>${a.contato}</td>
                    <td>${statusLabel}</td>
                    <td>${botoesAcao}</td>
                </tr>
            `;
            tbody.insertAdjacentHTML('beforeend', tr);
        });
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="7" style="color: red;">Erro ao carregar do servidor.</td></tr>';
    }
}

async function alterarStatus(id, novoStatus) {
    let msg = novoStatus === 'aprovado' 
        ? "Confirmar a publicação deste anúncio no site?" 
        : "Ocultar/Recusar este anúncio?";
        
    const confirmacao = await Swal.fire({
        title: 'Tem certeza?',
        text: msg,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: novoStatus === 'aprovado' ? '#2e7d32' : '#d32f2f',
        cancelButtonColor: '#757575',
        confirmButtonText: 'Sim, confirmar',
        cancelButtonText: 'Cancelar'
    });

    if (!confirmacao.isConfirmed) return;

    try {
        const res = await fetch(`http://localhost:3000/api/admin/anuncios/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status_publicacao: novoStatus })
        });

        if (res.ok) {
            Swal.fire({
                title: 'Atualizado!',
                text: 'O status do anúncio foi modificado.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
            carregarTabelaAdmin(); 
            carregarMetricas();
        } else {
            Swal.fire('Erro', 'Falha ao alterar o status no servidor.', 'error');
        }
    } catch (err) {
        Swal.fire('Erro', 'Erro de conexão com o servidor.', 'error');
    }
}

function abrirModal(id) {
    const anuncio = anunciosGlobaisAdmin.find(a => a.id === id);
    if (!anuncio) return;

    document.getElementById('modal-nome').textContent = anuncio.nome === 'Sem nome' ? anuncio.especie : anuncio.nome;
    document.getElementById('modal-especie').textContent = anuncio.especie;
    document.getElementById('modal-tipo').textContent = anuncio.tipo;
    document.getElementById('modal-local').textContent = `${anuncio.rua}, ${anuncio.numero} - ${anuncio.cidade}`;
    document.getElementById('modal-contato').textContent = anuncio.contato;

    const imgContainer = document.getElementById('modal-img');
    if (anuncio.imagem && anuncio.imagem !== 'null') {
        imgContainer.style.backgroundImage = `url(${anuncio.imagem})`;
        imgContainer.textContent = "";
    } else {
        imgContainer.style.backgroundImage = "none";
        imgContainer.textContent = "Nenhuma foto enviada";
    }

    document.getElementById('admin-modal').style.display = 'flex';
}

async function carregarMetricas() {
    try {
        const res = await fetch('http://localhost:3000/api/admin/metricas');
        if (res.ok) {
            const dados = await res.json();
            
            document.getElementById('metric-pendentes').textContent = dados.pendentes;
            document.getElementById('metric-ativos').textContent = dados.ativos;
            document.getElementById('metric-perdidos').textContent = dados.perdidos;
            document.getElementById('metric-achados').textContent = dados.achados;
        }
    } catch (err) {
        console.error("Erro ao carregar as métricas do painel.", err);
    }
}