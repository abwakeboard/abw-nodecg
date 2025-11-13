# abw-nodecg
Sistema de gráficos pra Live da ABW usando NodeCG, integrado com o LiveHeats

![print do sistema](https://github.com/user-attachments/assets/cf6bc95a-3916-49c6-8cfc-bc6e2beb5729)

## Objetivo

Facilitar a tarefa de mostrar informações dos atletas em transmissões ao vivo de campeonatos da ABW

### Como isso é feito

Criando uma integração com a API do LiveHeats, conseguimos puxar todas as informações dos atletas do campeonato, já na ordem de entrada. Ou seja, para o operador da live, é só clicar no botão "próximo atleta", em vez de ficar digitando todas as informações manualmente toda vez que há a troca de atletas.

## Instalação

### Com Docker (recomendado)
- Clonar o repositório
- Copiar `template.env` para `.env` e editar as informações
- Copiar `cfg/example.nodecg.js` para `cfg/nodecg.js` e trocar o `username` e `password` (ATENÇÃO: Não trocar a porta no `nodejs.js`. A porta é mapeada no `.env`)
- Rodar `docker compose run --rm nodecg npm ci` para instalar as dependências (ou `make npm-ci` se tiver make instalado)
- Rodar `docker compose up -d`
- Acessar o sistema em `http://localhost:9092` (ou outra porta, se foi trocada no `.env`)

### Sem docker
- Clonar o repositório
- Copiar `cfg/example.nodecg.js` para `cfg/nodecg.js` e trocar o `username` e `password` (e a porta, se necessário)
- Rodar `npm ci` para instalar as dependências
- Rodar `npm run start`
- Acessar o sistema em `http://localhost:9092` (ou outra porta, se foi trocada no `.env`)

