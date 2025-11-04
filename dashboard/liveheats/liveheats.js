
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
