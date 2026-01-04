const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('painel')
        .setDescription('Envia o painel de suporte no canal atual'),
    
    async execute(interaction) {
        // Criar embed do painel
        const embed = new EmbedBuilder()
            .setColor(0x2B2D31)
            .setTitle('🎫 Central de Atendimento')
            .setDescription(
                '**Bem-vindo ao nosso sistema de suporte!**\n\n' +
                'Selecione uma das opções abaixo para ser atendido.'
            )
            .setFooter({ text: 'Selecione uma opção no menu abaixo' })
            .setTimestamp();
        
        // Criar Select Menu (dropdown)
        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('ticket_menu')
                    .setPlaceholder('Clique aqui para ver as opções')
                    .addOptions([
                        {
                            label: 'Suporte',
                            description: 'Preciso de suporte',
                            value: 'ticket_suporte',
                            emoji: '💬'
                        },
                        {
                            label: 'Comprar Serviço',
                            description: 'Aguarde ser atendido!',
                            value: 'ticket_compra',
                            emoji: '🛒'
                        }
                    ])
            );
        
        // Enviar painel no canal
        await interaction.channel.send({
            embeds: [embed],
            components: [row]
        });
        
        // Confirmar para o usuário
        await interaction.reply({
            content: '✅ Painel de suporte enviado com sucesso!',
            ephemeral: true
        });
    }
};
