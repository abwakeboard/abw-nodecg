// copy me to `nodecg.js`and edit me
module.exports = {
    host: "0.0.0.0",
    port: 9090,
    baseURL: "example.com",
    bundles: {
        disabled: ["example-bundle"],
    },
    login: {
        enabled: true,
        sessionSecret: "randon-string-here",
        local: {
            enabled: true,
            allowedUsers: [
                {
                    username: "admin",
                    password: "admin",
                },
            ],
        },
        discord: {
            enabled: true,
            clientID: "123456789",
            clientSecret: "discord-secret",
            scope: "identify guilds",
            allowedGuilds: [
                {
                    guildID: "646491979651350547",
                    allowedRoleIDs: ["856637238199451681"],
                    guildBotToken: "bot-token",
                },
            ],
        },
    },
    logging: {
        console: {
            enabled: true,
            timestamps: true,
            level: "info",
            replicants: false,
        },
    },
};
