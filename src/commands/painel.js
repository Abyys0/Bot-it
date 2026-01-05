const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('painel')
        .setDescription('Envia o painel de suporte no canal atual'),
    
    async execute(interaction) {
        // Criar embed do painel - Design moderno e elegante
        const embed = new EmbedBuilder()
            .setColor(0x5865F2) // Cor Discord Blurple
            .setAuthor({ 
                name: interaction.guild.name, 
                iconURL: interaction.guild.iconURL({ dynamic: true }) 
            })
            .setTitle('╭─────────────────────╮\n🎫  Central de Atendimento\n╰─────────────────────╯')
            .setDescription(
                '> *Estamos aqui para ajudar você!*\n\n' +
                '```fix\n' +
                '═══════════════════════════════════\n' +
                '          BEM-VINDO AO SUPORTE\n' +
                '═══════════════════════════════════\n' +
                '```\n\n' +
                '**📋 Como funciona?**\n' +
                '╰ Selecione uma opção no menu abaixo e um canal privado será criado para você.\n\n' +
                '**⏰ Horário de Atendimento**\n' +
                '╰ Segunda a Sexta: `09:00 - 18:00`\n' +
                '╰ Sábado: `09:00 - 12:00`\n\n' +
                '**📌 Opções Disponíveis:**\n\n' +
                '> 💬 **Suporte** — Dúvidas, problemas ou ajuda geral\n' +
                '> 🛒 **Comprar Serviço** — Adquira nossos produtos/serviços\n\n' +
                '```\n' +
                '⚠️ Não abra tickets desnecessários!\n' +
                '```'
            )
            .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 256 }))
            .setImage('https://cdn.discordapp.com/attachments/1433927359018434800/1457589373372596327/Gemini_Generated_Image_np3l62np3l62np3l.png?ex=695c8d63&is=695b3be3&hm=9677a8ad3a8267b5c6adde3945ec04aded40dcafacfdc21ba033e2428e8492e5&') // Banner decorativo
            .setFooter({ 
                text: '🔽 Selecione uma opção abaixo para abrir um ticket', 
                iconURL: interaction.client.user.displayAvatarURL() 
            })
            .setTimestamp();
        
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
