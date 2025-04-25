import { defineConfig } from "robtic-discord-startup";

export default defineConfig({
    starter: {
        token: "Your Bot Discord Token Here",
        clientId: "Your Bot Discord Id Here",
        //mongoURL: "",
        //clientSecret: "",
    },
    activity: {
        text: "Robtic package"
    },
    slashcommand: {
        defaultCooldown: 5,
        ownerOnly: false,
    },
    access: {
        CEO: {
            roles: {
                name: ["CEO Role Name"],
                id: ["CEO Role Id"]
            },
            perms: ["Administrator"]
        },

        // can also add admin, mod, support
    },
    intents: [
        "Guilds",
        "GuildMessages",
        "MessageContent",
        // any other bot intents here
    ],
    paths: {
        // you can add a custom path for command and events here
    }
})
