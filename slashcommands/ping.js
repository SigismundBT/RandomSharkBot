const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('ping')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
                
    execute(interaction) {

        interaction.reply({
            content: '我醒著喔！',
            ephemeral: true,
        });
    },
};