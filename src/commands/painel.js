const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('painel')
        .setDescription('Envia o painel de suporte no canal atual'),
    
    async execute(interaction) {
        // Criar embed do painel - Design compacto e elegante
        const embed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setAuthor({ 
                name: '🎫 Central de Atendimento', 
                iconURL: interaction.guild.iconURL({ dynamic: true }) 
            })
            .setDescription(
                '**Selecione uma opção abaixo para abrir um ticket.**\n\n' +
                '> 💬 **Suporte** — Dúvidas ou problemas\n' +
                '> 🛒 **Comprar** — Adquirir serviços\n\n' +
                '*⚠️ Não abra tickets desnecessários!*'
            )
            .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 256 }))
            .setImage('https://cdn.discordapp.com/attachments/1433927359018434800/1457591098854605002/Gemini_Generated_Image_np3l62np3l62np3l.png?ex=695c8efe&is=695b3d7e&hm=d2242612eb07dc7eadd240ad1c80e8bc84212eaa9d749f47315f43fdc5c22b4b&')
            .setFooter({ 
                text: `${interaction.guild.name} • Suporte`, 
                iconURL: interaction.client.user.displayAvatarURL() 
            });
        
        // Criar Select Menu (dropdown) estilizado
        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('ticket_menu')
                    .setPlaceholder('🎫 Clique aqui para selecionar')
                    .addOptions([
                        {
                            label: '💬 Suporte Geral',
                            description: '📝 Tire suas dúvidas ou relate um problema',
                            value: 'ticket_suporte',
                            emoji: '🔧'
                        },
                        {
                            label: '🛒 Comprar Serviço',
                            description: '💰 Adquira nossos produtos e serviços',
                            value: 'ticket_compra',
                            emoji: '💎'
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
            content: '✅ **Painel de suporte enviado com sucesso!**\n> O painel está pronto para receber tickets.',
            ephemeral: true
        });
    }
};
