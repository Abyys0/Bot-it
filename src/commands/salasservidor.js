const { 
    SlashCommandBuilder, 
    EmbedBuilder, 
    ChannelType, 
    PermissionFlagsBits,
    MessageFlags 
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('salasservidor')
        .setDescription('Cria automaticamente as categorias e canais de salas do servidor'),
    
    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        
        const guild = interaction.guild;
        
        // Estrutura das categorias e canais (ordem de cima para baixo)
        const estrutura = [
            {
                nome: '❗ · IMPORTANTE!',
                canais: [
                    { nome: 'regras-x1', tipo: 'texto', emoji: '📚' },
                    { nome: 'regras', tipo: 'texto', emoji: '📚' },
                    { nome: 'preços', tipo: 'texto', emoji: '💰' },
                    { nome: 'avisos', tipo: 'texto', emoji: '📢' },
                    { nome: 'chat', tipo: 'texto', emoji: '💬' }
                ]
            },
            {
                nome: '🏆 · RANKING',
                canais: [
                    { nome: 'top-jogadores', tipo: 'texto', emoji: '🥇' },
                    { nome: 'top-wins', tipo: 'texto', emoji: '🏅' }
                ]
            },
            {
                nome: '📞 · SUPORTE',
                canais: [
                    { nome: 'suporte', tipo: 'texto', emoji: '📩' },
                    { nome: 'atendimento-1', tipo: 'voz', emoji: '🎧' },
                    { nome: 'atendimento-2', tipo: 'voz', emoji: '🎧' }
                ]
            },
            {
                nome: '📱 · MOBILE',
                canais: [
                    { nome: '1x1-mobile', tipo: 'texto' },
                    { nome: '2x2-mobile', tipo: 'texto' },
                    { nome: '3x3-mobile', tipo: 'texto' },
                    { nome: '4x4-mobile', tipo: 'texto' }
                ]
            },
            {
                nome: '🖥️ · EMULADOR',
                canais: [
                    { nome: '1x1-emulador', tipo: 'texto' },
                    { nome: '2x2-emulador', tipo: 'texto' },
                    { nome: '3x3-emulador', tipo: 'texto' },
                    { nome: '4x4-emulador', tipo: 'texto' }
                ]
            },
            {
                nome: '🔀 · MISTO',
                canais: [
                    { nome: '2x2-misto', tipo: 'texto' },
                    { nome: '3x3-misto', tipo: 'texto' },
                    { nome: '4x4-misto', tipo: 'texto' }
                ]
            },
            {
                nome: '🚩 · TÁTICO',
                canais: [
                    { nome: '1x1-tático', tipo: 'texto' },
                    { nome: '2x2-tático', tipo: 'texto' },
                    { nome: '3x3-tático', tipo: 'texto' },
                    { nome: '4x4-tático', tipo: 'texto' }
                ]
            },
            {
                nome: '🔍 · ANALISES',
                canais: [
                    { nome: 'exposed', tipo: 'texto', emoji: '🚫' },
                    { nome: 'blacklist', tipo: 'texto', emoji: '🚫' },
                    { nome: 'regras-telagem', tipo: 'texto', emoji: '🎬' },
                    { nome: 'ANALISE 1', tipo: 'voz' },
                    { nome: 'ANALISE 2', tipo: 'voz' },
                    { nome: 'ANALISE 3', tipo: 'voz' },
                    { nome: 'ANALISE 4', tipo: 'voz' },
                    { nome: 'ANALISE 5', tipo: 'voz' },
                    { nome: 'ANALISE 6', tipo: 'voz' },
                    { nome: 'ANALISE 7', tipo: 'voz' },
                    { nome: 'ANALISE 8', tipo: 'voz' },
                    { nome: 'ANALISE 9', tipo: 'voz' },
                    { nome: 'ANALISE 10', tipo: 'voz' },
                    { nome: 'ANALISE 11', tipo: 'voz' },
                    { nome: 'ANALISE 12', tipo: 'voz' },
                    { nome: 'ANALISE 13', tipo: 'voz' },
                    { nome: 'ANALISE 14', tipo: 'voz' },
                    { nome: 'ANALISE 15', tipo: 'voz' }
                ]
            }
        ];
        
        let criados = {
            categorias: 0,
            canaisTexto: 0,
            canaisVoz: 0
        };
        
        try {
            for (const categoria of estrutura) {
                // Criar categoria
                const novaCategoria = await guild.channels.create({
                    name: categoria.nome,
                    type: ChannelType.GuildCategory
                });
                criados.categorias++;
                
                // Criar canais dentro da categoria
                for (const canal of categoria.canais) {
                    const tipoCanal = canal.tipo === 'voz' 
                        ? ChannelType.GuildVoice 
                        : ChannelType.GuildText;
                    
                    await guild.channels.create({
                        name: canal.nome,
                        type: tipoCanal,
                        parent: novaCategoria.id
                    });
                    
                    if (canal.tipo === 'voz') {
                        criados.canaisVoz++;
                    } else {
                        criados.canaisTexto++;
                    }
                }
            }
            
            // Embed de sucesso
            const embed = new EmbedBuilder()
                .setColor(0x57F287)
                .setTitle('✅ Servidor Configurado com Sucesso!')
                .setDescription(
                    `**Estrutura completa criada:**\n\n` +
                    `📁 **Categorias:** \`${criados.categorias}\`\n` +
                    `💬 **Canais de Texto:** \`${criados.canaisTexto}\`\n` +
                    `🔊 **Canais de Voz:** \`${criados.canaisVoz}\`\n\n` +
                    `**Categorias criadas:**\n` +
                    `> ❗ IMPORTANTE! (5 canais)\n` +
                    `> 🏆 RANKING (2 canais)\n` +
                    `> 📞 SUPORTE (3 canais)\n` +
                    `> 📱 MOBILE (4 canais)\n` +
                    `> 🖥️ EMULADOR (4 canais)\n` +
                    `> 🔀 MISTO (3 canais)\n` +
                    `> 🚩 TÁTICO (4 canais)\n` +
                    `> 🔍 ANALISES (18 canais)`
                )
                .setFooter({ text: `Criado por ${interaction.user.tag}` })
                .setTimestamp();
            
            await interaction.editReply({ embeds: [embed] });
            
        } catch (error) {
            console.error('Erro ao criar salas:', error);
            await interaction.editReply({
                content: '❌ Ocorreu um erro ao criar as salas. Verifique se o bot tem permissão para gerenciar canais.'
            });
        }
    }
};
