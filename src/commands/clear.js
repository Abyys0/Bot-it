const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Limpa todas as mensagens do canal atual')
        .addIntegerOption(option =>
            option.setName('quantidade')
                .setDescription('Número de mensagens a deletar (1-100, padrão: todas)')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(false)),
    
    async execute(interaction) {
        // Verificar permissões
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({
                content: '❌ Você precisa ter permissão de **Gerenciar Mensagens** para usar este comando!',
                ephemeral: true
            });
        }
        
        const quantidade = interaction.options.getInteger('quantidade');
        
        await interaction.deferReply({ ephemeral: true });
        
        try {
            const canal = interaction.channel;
            let totalDeletadas = 0;
            
            if (quantidade) {
                // Deletar quantidade específica
                const mensagens = await canal.messages.fetch({ limit: quantidade });
                const deletadas = await canal.bulkDelete(mensagens, true);
                totalDeletadas = deletadas.size;
            } else {
                // Deletar todas as mensagens (em lotes de 100)
                let continuar = true;
                
                while (continuar) {
                    const mensagens = await canal.messages.fetch({ limit: 100 });
                    
                    if (mensagens.size === 0) {
                        continuar = false;
                        break;
                    }
                    
                    // bulkDelete só funciona com mensagens de até 14 dias
                    const mensagensRecentes = mensagens.filter(
                        msg => Date.now() - msg.createdTimestamp < 14 * 24 * 60 * 60 * 1000
                    );
                    
                    if (mensagensRecentes.size === 0) {
                        // Se não há mensagens recentes, tentar deletar uma por uma
                        for (const [, msg] of mensagens) {
                            try {
                                await msg.delete();
                                totalDeletadas++;
                                await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limit
                            } catch (error) {
                                console.error('Erro ao deletar mensagem antiga:', error);
                            }
                        }
                        continuar = false;
                    } else {
                        const deletadas = await canal.bulkDelete(mensagensRecentes, true);
                        totalDeletadas += deletadas.size;
                        
                        if (deletadas.size < 100) {
                            continuar = false;
                        }
                        
                        // Aguardar um pouco para evitar rate limit
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
            }
            
            await interaction.editReply({
                content: `✅ **${totalDeletadas} mensagem(ns) deletada(s)** do canal ${canal}!`
            });
            
            // Deletar a mensagem de confirmação após 5 segundos
            setTimeout(async () => {
                try {
                    await interaction.deleteReply();
                } catch (error) {
                    console.error('Erro ao deletar mensagem de confirmação:', error);
                }
            }, 5000);
            
        } catch (error) {
            console.error('Erro ao limpar canal:', error);
            await interaction.editReply({
                content: '❌ Ocorreu um erro ao limpar as mensagens. Verifique se o bot tem permissões de **Gerenciar Mensagens**!'
            });
        }
    }
};
