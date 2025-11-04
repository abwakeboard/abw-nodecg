const scheduleRep = nodecg.Replicant('liveHeatsSchedule');
const activeCompRep = nodecg.Replicant('liveHeatsActiveCompetitor');


NodeCG.waitForReplicants(scheduleRep, activeCompRep).then(() => {
    // popula a tabela com os dados do cronograma do liveheats
    scheduleRep.on(`change`, updateGraphic);

    // quando o atleta ativo trocar, atualiza a UI pra feedback
    activeCompRep.on(`change`, updateGraphic);

});

function updateGraphic() {
    const atleta = scheduleRep.value[activeCompRep.value];
    nodecg.log.debug(atleta);

    document.getElementById(`foto`).src = atleta.foto;
    document.getElementById(`nome`).innerText = atleta.nome;
    document.getElementById(`idade`).innerText = atleta.idade ? `${atleta.idade} anos` : ``;
    document.getElementById(`categoria`).innerText = atleta.categoria;
    document.getElementById(`heat`).innerText = atleta.heat;

}