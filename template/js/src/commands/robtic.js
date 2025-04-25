const { Command, BaseEmbed } = require("robtic-discord-startup");
const { MessageFlags, SlashCommandBuilder } = require("discord.js");

export default new Command ({ // Command function for safety types
    data: new SlashCommandBuilder()
    .setName("robtic")
    .setDescription("welcome in robtic package"),
    admin: true,
    run: async (interaction) => {
        const embed = new BaseEmbed({
            title: "RobTic",
            description: "welcome in robtic package easily set up a Discord bot with configurable settings",
            type:"info"
        });

        interaction.reply({
            content: "@here Hello World",
            embeds: [embed.get()],
            flags: MessageFlags.Ephemeral
        })
    }
})

/* you can remove this file */