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
        
        // Estrutura das categorias e canais
        const estrutura = [
            {
                nome: '📱 · MOBILE',
                canais: ['1x1-mobile', '2x2-mobile', '3x3-mobile', '4x4-mobile']
            },
            {
                nome: '🖥️ · EMULADOR',
                canais: ['1x1-emulador', '2x2-emulador', '3x3-emulador', '4x4-emulador']
            },
            {
                nome: '🔀 · MISTO',
                canais: ['2x2-misto', '3x3-misto', '4x4-misto']
            },
            {
                nome: '🚩 · TÁTICO',
                canais: ['1x1-tático', '2x2-tático', '3x3-tático', '4x4-tático']
            }
        ];
        
        let criados = {
            categorias: 0,
            canais: 0
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
                    await guild.channels.create({
                        name: canal,
                        type: ChannelType.GuildText,
                        parent: novaCategoria.id
                    });
                    criados.canais++;
                }
            }
            
            // Embed de sucesso
            const embed = new EmbedBuilder()
                .setColor(0x57F287)
                .setTitle('✅ Salas Criadas com Sucesso!')
                .setDescription(
                    `**Estrutura criada:**\n\n` +
                    `📁 **Categorias:** \`${criados.categorias}\`\n` +
                    `💬 **Canais:** \`${criados.canais}\`\n\n` +
                    `**Categorias criadas:**\n` +
                    `> 📱 MOBILE (4 canais)\n` +
                    `> 🖥️ EMULADOR (4 canais)\n` +
                    `> 🔀 MISTO (3 canais)\n` +
                    `> 🚩 TÁTICO (4 canais)`
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
