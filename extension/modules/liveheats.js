const nodecgApiContext = require(`./nodecg-api-context`);
const nodecg = nodecgApiContext.get();
const axios = require("axios");
const { getAge } = require(`./formatar`);

const logNamespace = ":: [liveheats.js] :: ";

function initLiveHeats() {
    nodecg.log.info(`${logNamespace} Iniciando...`);

    nodecg.listenFor(`liveHeatsFetchOrdemEntrada`, async (idLiveHeats, ack) => {
        if (!idLiveHeats) {
            nodecg.log.warn(
                `${logNamespace} Nenhum ID fornecido. Abortando...`,
            );
            ack(new Error(`Nenhum ID fornecido.`));
            return;
        }

        // atualiza o ID do LiveHeats na UI da dashboard
        nodecg.Replicant(`idLiveHeats`).value = idLiveHeats;
        // roda a função que pega a ordem de entrada no liveheats
        await fetchOrdemEntrada(idLiveHeats);
        if (ack && !ack.handled) {
            ack(null, `ok`);
        }
    });
}

async function fetchOrdemEntrada(idLiveHeats) {
    nodecg.log.info(
        `${logNamespace} Pegando ordem de entrada para o evento ${idLiveHeats}`,
    );

    const endpoint = `https://liveheats.com/api/graphql`;

    const query = `
                    query Event {
                        event(id: "${idLiveHeats}") {
                            currentScheduleIndex
                            id
                            organisationId
                            status
                            fullSchedule {
                                podiums {
                                    heats {
                                        competitors {
                                            athlete {
                                                name
                                                id
                                                image
                                                dob
                                            }
                                        }
                                        eventDivision {
                                            division {
                                                name
                                            }
                                        }
                                        round
                                        position
                                    }
                                    name
                                }
                            }
                        }
                    }
                    `;

    let res;

    try {
        const response = await axios.post(
            endpoint,
            { query },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        res = response.data;
        console.log(response.data.data.event);
    } catch (error) {
        nodecg.log.error(
            `${logNamespace} GraphQL request failed:`,
            error.response?.data || error.message,
        );
        return;
    }

    const formatted = formatSchedule(res);
    // nodecg.log.info(formatted);
    nodecg.Replicant(`liveHeatsSchedule`).value = formatted;
    nodecg.log.info(`${logNamespace} Atualizado cronograma do LiveHeats pro replicant "liveHeatsSchedule"`);
    return;
}

/** Essa função pega o resultado da query da API do LiveHeats e formata em um cronograma fácil de usar
 *
 */
function formatSchedule(apiRes) {
    // confere se temos um cronograma na resposta da API
    if (
        !apiRes?.data?.event?.fullSchedule?.podiums ||
        !apiRes?.data?.event?.fullSchedule?.podiums.length
    ) {
        nodecg.log.error(
            `${logNamespace} A resposta da API do LiveHeats não retornou nenhum cronograma`,
        );
        return;
    }

    const formatted = [];

    // faz o loop em cada um dos bancos do cronograma
    apiRes.data.event.fullSchedule.podiums.forEach((podium) => {
        if (!podium.heats || !podium.heats.length) return;

        // faz o loop dentro de cada uma das baterias desse banco
        podium.heats.forEach((heat) => {
            if (!heat) return;
            nodecg.log.info(
                `${logNamespace} Lendo bateria ${heat.position} da rodada ${heat.round} da categoria ${heat.eventDivision.division.name}`,
            );
            if (!heat.competitors || !heat.competitors.length) return;

            // formata texto da bateria
            // se a bateria for a final, só usamos o texto "Final". Caso contrário é formatado tipo "Semifinal - Heat 1"
            let heatName;
            if (heat.round === `Final`) {
                heatName = heat.round;
            } else {
                heatName = `${heat.round} - Heat ${heat.position + 1}`;
            }

            // faz o loop pra cada um dos competidores dessa bateria
            heat.competitors.forEach((competitor) => {

                // inclui o nome da bateria e adiciona aos dados formatados
                formatted.push({
                    nome: competitor.athlete.name,
                    id: competitor.athlete.id,
                    foto: competitor.athlete.image || `/assets/abw-nodecg/images/backupAtleta.png`,
                    categoria: heat.eventDivision.division.name,
                    heat: heatName,
                    idade: getAge(competitor.athlete.dob, ``)
                });
            });
        });
    });

    // nodecg.log.debug(
    //     `${logNamespace} formatSchedule :: dados formatados: `,
    //     formatted,
    // );

    return formatted;

}

module.exports = { initLiveHeats };
