const { SlashCommandBuilder, ActionRowBuilder ,ButtonBuilder, PermissionsBitField, ButtonStyle, ComponentType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botrestart')
        .setDescription('重新啟動這個機器人')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
                
    async execute(interaction) {
        try{
            const buttonres = await interaction.reply({
                content: '確定要重啟機器人嗎？',
                components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                        .setCustomId('yes')
                        .setLabel('是')
                        .setStyle(ButtonStyle.Success),
    
                        new ButtonBuilder()
                        .setCustomId('no')
                        .setLabel('否')
                        .setStyle(ButtonStyle.Danger),
                    ),
                ],
                ephemeral: true,
            });

            const collector = buttonres.createMessageComponentCollector({ componentType : ComponentType.Button, max: 1, })
            collector.on('collect', async (button) => {
                await button.deferUpdate();
                if(button.customId === 'yes'){
                    await interaction.followUp({
                        content: '好的，重啟中...',
                        ephemeral: true,
                    });
                    process.exit(1);
                } else if(button.customId === 'no'){
                    interaction.followUp({
                        content: '好吧...那就...掰掰',
                        ephemeral: true,
                    });
                };
            });

            collector.on('end', async () => { 
                return interaction.deleteReply();
            })
        } catch (err) {
            console.error(err)
        };
    },
};