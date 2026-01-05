const { Events, MessageFlags } = require('discord.js');
const { hasSuportRole } = require('../utils/permissions');

// Importar dados da embed
let embedData;
try {
    embedData = require('../commands/embed').embedData;
} catch (e) {
    embedData = new Map();
}

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
                    flags: MessageFlags.Ephemeral
                });
            }
            
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`Erro ao executar comando ${interaction.commandName}:`, error);
                
                const errorMessage = {
                    content: '❌ Ocorreu um erro ao executar este comando.',
                    flags: MessageFlags.Ephemeral
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
            // Handler para seleção de canal do embed
            if (interaction.customId === 'embed_canal') {
                const data = embedData.get(interaction.user.id);
                if (data) {
                    data.channel = interaction.values[0];
                    const channel = interaction.guild.channels.cache.get(data.channel);
                    await interaction.reply({
                        content: `✅ Canal de destino definido para: ${channel}`,
                        flags: MessageFlags.Ephemeral
                    });
                }
                return;
            }
            
            const selectHandler = require('../handlers/selectHandler');
            await selectHandler.execute(interaction);
        }
        
        // Lidar com Modals
        if (interaction.isModalSubmit()) {
            const customId = interaction.customId;
            
            // Modal do título da embed
            if (customId === 'modal_embed_titulo') {
                const titulo = interaction.fields.getTextInputValue('embed_titulo_input');
                const data = embedData.get(interaction.user.id);
                if (data) {
                    data.title = titulo;
                    await interaction.reply({
                        content: `✅ **Título definido:** ${titulo}`,
                        flags: MessageFlags.Ephemeral
                    });
                }
            }
            
            // Modal da descrição da embed
            if (customId === 'modal_embed_descricao') {
                const descricao = interaction.fields.getTextInputValue('embed_descricao_input');
                const data = embedData.get(interaction.user.id);
                if (data) {
                    data.description = descricao;
                    await interaction.reply({
                        content: `✅ **Descrição definida!**\n> ${descricao.substring(0, 100)}${descricao.length > 100 ? '...' : ''}`,
                        flags: MessageFlags.Ephemeral
                    });
                }
            }
            
            // Modal da cor da embed
            if (customId === 'modal_embed_cor') {
                const corInput = interaction.fields.getTextInputValue('embed_cor_input');
                const data = embedData.get(interaction.user.id);
                if (data) {
                    // Converter hex para número
                    const cor = corInput.replace('#', '');
                    const corNum = parseInt(cor, 16);
                    
                    if (isNaN(corNum)) {
                        await interaction.reply({
                            content: '❌ Cor inválida! Use o formato HEX (ex: #FF5733)',
                            flags: MessageFlags.Ephemeral
                        });
                        return;
                    }
                    
                    data.color = corNum;
                    await interaction.reply({
                        content: `✅ **Cor definida:** \`#${cor.toUpperCase()}\``,
                        flags: MessageFlags.Ephemeral
                    });
                }
            }
            
            // Modal da imagem da embed
            if (customId === 'modal_embed_imagem') {
                const imagem = interaction.fields.getTextInputValue('embed_imagem_input');
                const thumbnail = interaction.fields.getTextInputValue('embed_thumbnail_input');
                const footer = interaction.fields.getTextInputValue('embed_footer_input');
                
                const data = embedData.get(interaction.user.id);
                if (data) {
                    if (imagem) data.image = imagem;
                    if (thumbnail) data.thumbnail = thumbnail;
                    if (footer) data.footer = footer;
                    
                    let msg = '✅ **Configurações de imagem atualizadas!**\n';
                    if (imagem) msg += `> 🖼️ Imagem principal definida\n`;
                    if (thumbnail) msg += `> 🔲 Thumbnail definida\n`;
                    if (footer) msg += `> 📝 Rodapé: "${footer}"\n`;
                    
                    await interaction.reply({
                        content: msg,
                        flags: MessageFlags.Ephemeral
                    });
                }
            }
        }
    }
};
