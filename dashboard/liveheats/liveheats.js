
const form = document.getElementById("formIdEvento");
const formCSS = document.getElementById("formCSS");

const scheduleRep = nodecg.Replicant('liveHeatsSchedule');
const activeCompRep = nodecg.Replicant('liveHeatsActiveCompetitor');
const cssRep = nodecg.Replicant(`liveHeatsCustomCSS`);

// lida com envio do formulário
form.addEventListener("submit", (event) => {
    event.preventDefault();

    form.querySelector(`button`).innerText = `atualizando...`;

    const formData = new FormData(form);
    const formJSON = Object.fromEntries(formData.entries())

    if (!formJSON.idLiveHeats) {
        nodecg.log.warn(`você deve selecionar um ID`);
        form.querySelector(`button`).innerText = `Pegar Ordem de Entrada`;
        return;
    }

    // nodecg.Replicant(`idLiveHeats`).value = formJSON.idLiveHeats;
    nodecg.sendMessage(`liveHeatsFetchOrdemEntrada`, formJSON.idLiveHeats).then(result => {
        form.querySelector(`button`).innerText = `Pegar Ordem de Entrada`;
    }).catch(error => {
        nodecg.log.error(error);
    });


});

// lida com preenchimento automático do formulário
nodecg.Replicant(`idLiveHeats`).on(`change`, (newValue) => {
    if (!newValue) return;
    document.getElementById(`idLiveHeats`).value = newValue;
});

NodeCG.waitForReplicants(scheduleRep, activeCompRep).then(() => {
    // popula a tabela com os dados do cronograma do liveheats
    scheduleRep.on(`change`, (newValue) => {
        if (!newValue) return;

        const tabela = document.getElementById(`cronograma`).querySelector(`tbody`);
        tabela.innerHTML = ``;

        newValue.forEach((atleta, index) => {

            nodecg.log.debug(index, activeCompRep.value);

            const row = `<tr 
                            class="${index === activeCompRep.value ? `active` : ``}"
                        >
                            <td><img src='${atleta.foto}' /></td>
                            <td>${atleta.nome}</td>
                            <td>${atleta.categoria}</td>
                            <td>${atleta.heat}</td>
                            <td>${atleta.idade}</td>
                        </tr>`;

            tabela.innerHTML += row;

        });

    });

    // quando o atleta ativo trocar, atualiza a UI pra feedback
    activeCompRep.on(`change`, (newValue) => {
        const tableRows = document.querySelectorAll('#cronograma tbody tr');

        tableRows.forEach((row, index) => {
            if (index === newValue) {
                row.classList.add(`active`);
                row.scrollIntoView({
                    behavior: 'smooth', // or 'auto'
                    block: 'center',     // 'start', 'center', 'end', or 'nearest'
                });
            } else {
                row.classList.remove(`active`);
            }
        });

    });

});

// event listener global pra cliques na página
document.addEventListener("click", (event) => {
    // checa se uma linha na tabela de atletas foi clicada. 
    setActiveCompAbs(event);
    setActiveCompRel(event);

});

function setActiveCompAbs(event) {
    const row = event.target.closest("#cronograma tbody tr");

    if (row) {
        const rows = Array.from(document.querySelectorAll("#cronograma tbody tr"));
        const index = rows.indexOf(row);

        nodecg.log.debug(`Linha clicada: ${index}`);

        // atualiza UI: Adiciona class active à linha clicada
        rows.forEach(row => {
            row.classList.remove(`active`);
        });
        row.classList.add(`active`);

        // atualiza banco de dados:
        activeCompRep.value = index;

    }
}

function setActiveCompRel(event) {
    const btn = event.target.closest('[abw-action]');
    if (!btn) return;
    const amount = btn.getAttribute('abw-amount');

    const tableRows = document.querySelectorAll('#cronograma tbody tr').length;

    // atualiza o valor do competidor ativo, mas só entre 0 e o número total de competidores
    activeCompRep.value = Math.min(Math.max(0, activeCompRep.value + parseInt(amount)), tableRows - 1);
}

// função pra abrir e fechar o customizador de CSS
const toggleBtn = document.getElementById('toggle-css');
if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const cssDiv = document.getElementById('custom-css');
        if (!cssDiv) return;
        cssDiv.classList.toggle('d-none');
    });
}

// envio de CSS customizado
formCSS.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(formCSS);
    const formJSON = Object.fromEntries(formData.entries())

    cssRep.value = formJSON.css;

});

cssRep.on(`change`, (newValue) => {
    document.getElementById(`css`).value = newValue;
});