const nodecgApiContext = require(`./nodecg-api-context`);
const nodecg = nodecgApiContext.get();

/** Essa fun;'ao cria endpoints pra intera;'ao via API. Tipo http://localhost/api/sendMessage
 */
function initApi() {
    const app = nodecg.Router();
    app.use(nodecg.util.authCheck); // habilita auth

    // API para enviar mensagem a um bundle
    // USO: Enviar uma request para /api/sendMessage?name=NOME_DA_MENSAGEM&namespace=NOME_DO_BUNDLE&value=CONTEUDO
    // Opcional: NOME_DO_BUNDLE 
    app.all(`/api/sendMessage`, (req, res) => {
        if (!req.query || !req.query.name) {
            res.status(400);
            res.send(`Faltando query strings, veja se você tem a query string 'name'`);
            return;
        }

        const namespace = req.query.namespace || `abw-nodecg`

        nodecg.log.info(`Recebido request na /api/sendMessage: ${req.query.name} | ${namespace}`);

        if (!req.query.value) {
            nodecg.sendMessageToBundle(req.query.name, namespace);
        } else {
            nodecg.sendMessageToBundle(req.query.name, namespace, req.query.value);
        }

        res.sendStatus(200);
    });

    app.all(`/api/setActiveCompRel`, (req, res) => {
        if (!req.query || !req.query.amount) {
            res.status(400);
            res.send(`Faltando query strings, veja se você tem a query string 'amount'`);
            return;
        }

        nodecg.log.debug(`Recebido request em setActiveCompRel`);

        const amount = req.query.amount;

        const totalAtletas = nodecg.Replicant('liveHeatsSchedule').value.length || 1;
        const activeCompRep = nodecg.Replicant('liveHeatsActiveCompetitor');

        nodecg.log.debug(`Total atletas: ${totalAtletas} | Amount: ${amount} | Active Competitor: ${activeCompRep.value}`);

        // atualiza o valor do competidor ativo, mas só entre 0 e o número total de competidores
        activeCompRep.value = Math.min(Math.max(0, activeCompRep.value + parseInt(amount)), parseInt(totalAtletas) - 1);

        res.sendStatus(200);
    });

    nodecg.mount(app);
}

module.exports = { initApi }