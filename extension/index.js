// o nodecgApiContext é utilizado para fazer com que o objeto `nodecg` fique disponível em todos os módulos, sem ter que passar ele como argumentos de funções
// mais infos: https://www.nodecg.dev/docs/extensions/#utility-script
const nodecgApiContext = require(`./modules/nodecg-api-context`);

module.exports = (nodecg) => {
    // Store a reference to this nodecg API context in a place where other libs can easily access it.
    // This must be done before any other files are `require`d.
    nodecgApiContext.set(nodecg);
    init(nodecg)
        .then(() => {
            nodecg.log.info(
                `====== Inicializando bundle ${nodecg.bundleName} ======`,
            );
        })
        .catch((error) => {
            nodecg.log.error(
                `====== Falha ao inicializar o bundle ======\n`,
                error,
            );
        });
};

async function init() {
    console.log(`foo`);
}
