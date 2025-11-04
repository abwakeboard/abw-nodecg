
const form = document.getElementById("formIdEvento");

// lida com envio do formulário
form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const formJSON = Object.fromEntries(formData.entries())

    if (!formJSON.idLiveHeats) {
        nodecg.log.warn(`você deve selecionar um ID`);
        return;
    }

    // nodecg.Replicant(`idLiveHeats`).value = formJSON.idLiveHeats;
    nodecg.sendMessage(`liveHeatsFetchOrdemEntrada`, formJSON.idLiveHeats);

});

// lida com preenchimento automático do formulário
nodecg.Replicant(`idLiveHeats`).on(`change`, (newValue) => {
    if (!newValue) return;
    document.getElementById(`idLiveHeats`).value = newValue;
});

// popula a tabela com os dados do cronograma do liveheats
nodecg.Replicant(`liveHeatsSchedule`).on(`change`, (newValue) => {
    if (!newValue) return;

    const tabela = document.getElementById(`cronograma`).querySelector(`tbody`);
    tabela.innerHTML = ``;

    newValue.forEach((atleta, index) => {

        const row = `<tr abw-index="${index}">
                        <td><img src='${atleta.foto}' /></td>
                        <td>${atleta.nome}</td>
                        <td>${atleta.categoria}</td>
                        <td>${atleta.heat}</td>
                        <td>${atleta.idade}</td>
        </tr>`;

        tabela.innerHTML += row;

    });

});