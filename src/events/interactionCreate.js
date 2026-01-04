const { Events } = require('discord.js');
const { hasSuportRole } = require('../utils/permissions');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // Lidar com comandos slash
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            
            if (!command) {
                console.error(`Comando ${interaction.commandName} não encontrado.`);
                return;
            }
            
            // Verificar permissão (cargo de suporte)
            if (!hasSuportRole(interaction.member)) {
                return interaction.reply({
                    content: '❌ Você não tem permissão para usar este comando. É necessário ter o cargo de suporte.',
                    ephemeral: true
                });
            }
            
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`Erro ao executar comando ${interaction.commandName}:`, error);
                
                const errorMessage = {
                    content: '❌ Ocorreu um erro ao executar este comando.',
                    ephemeral: true
                };
                
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(errorMessage);
                } else {
                    await interaction.reply(errorMessage);
                }
            }
        }
        
        // Lidar com botões
        if (interaction.isButton()) {
            const buttonHandler = require('../handlers/buttonHandler');
            await buttonHandler.execute(interaction);
        }
        
        // Lidar com Select Menu (dropdown)
        if (interaction.isStringSelectMenu()) {
            const selectHandler = require('../handlers/selectHandler');
            await selectHandler.execute(interaction);
        }
    }
};
