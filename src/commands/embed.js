const { 
    SlashCommandBuilder, 
    EmbedBuilder, 
    ActionRowBuilder, 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle,
    StringSelectMenuBuilder,
    ChannelType,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

// Armazenar dados temporários da embed sendo criada
const embedData = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Cria e envia uma embed personalizada'),
    
    async execute(interaction) {
        // Criar embed de preview inicial
        const previewEmbed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle('📝 Criador de Embed')
            .setDescription(
                '```fix\n' +
                '════════════════════════════════════\n' +
                '       CONFIGURADOR DE EMBED\n' +
                '════════════════════════════════════\n' +
                '```\n\n' +
                '**🎨 Personalize sua mensagem!**\n\n' +
                '> Utilize os botões abaixo para configurar cada parte da sua embed.\n\n' +
                '**📋 Opções Disponíveis:**\n\n' +
                '╭─────────────────────────────────╮\n' +
                '│ 📌 **Título** — Defina o título da embed\n' +
                '│ 📝 **Descrição** — Adicione o conteúdo principal\n' +
                '│ 🎨 **Cor** — Escolha uma cor personalizada\n' +
                '│ 🖼️ **Imagem** — Adicione imagem/thumbnail\n' +
                '│ 📢 **Canal** — Selecione o canal de destino\n' +
                '╰─────────────────────────────────╯\n\n' +
                '```\n' +
                '💡 Dica: Configure todos os campos antes de enviar!\n' +
                '```'
            )
            .setFooter({ text: '⚙️ Use os botões para configurar sua embed' })
            .setTimestamp();
        
        // Inicializar dados da embed para este usuário
        embedData.set(interaction.user.id, {
            title: null,
            description: null,
            color: 0x5865F2,
            image: null,
            thumbnail: null,
            footer: null,
            channel: null
        });
        
        // Botões de configuração
        const row1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('embed_titulo')
                    .setLabel('Título')
                    .setEmoji('📌')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('embed_descricao')
                    .setLabel('Descrição')
                    .setEmoji('📝')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('embed_cor')
                    .setLabel('Cor')
                    .setEmoji('🎨')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('embed_imagem')
                    .setLabel('Imagem')
                    .setEmoji('🖼️')
                    .setStyle(ButtonStyle.Primary)
            );
        
        // Obter canais de texto do servidor
        const textChannels = interaction.guild.channels.cache
            .filter(c => c.type === ChannelType.GuildText)
            .map(c => ({
                label: `#${c.name}`,
                value: c.id,
                description: c.parent?.name || 'Sem categoria'
            }))
            .slice(0, 25); // Limite de 25 opções no select
        
        const row2 = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('embed_canal')
                    .setPlaceholder('📢 Selecione o canal de destino')
                    .addOptions(textChannels)
            );
        
        const row3 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('embed_preview')
                    .setLabel('Visualizar')
                    .setEmoji('👁️')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('embed_enviar')
                    .setLabel('Enviar Embed')
                    .setEmoji('📤')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('embed_cancelar')
                    .setLabel('Cancelar')
                    .setEmoji('❌')
                    .setStyle(ButtonStyle.Danger)
            );
        
        await interaction.reply({
            embeds: [previewEmbed],
            components: [row1, row2, row3],
            ephemeral: true
        });
    }
};

// Exportar embedData para uso no handler
module.exports.embedData = embedData;
