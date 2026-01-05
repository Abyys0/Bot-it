const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');

const MODOS = {
    '1x1': { nome: '1x1', jogadores: 2, icone: '⚔️' },
    '2x2': { nome: '2x2', jogadores: 2, icone: '🎮' },
    '3x3': { nome: '3x3', jogadores: 2, icone: '🏆' },
    '4x4': { nome: '4x4', jogadores: 2, icone: '👥' }
};

/**
 * Cria o painel de fila para um modo e valor específico
 */
function createQueuePanel(modo, valor, modoInfo) {
    const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle(`${modoInfo.icone} ${modoInfo.nome.toUpperCase()} - R$ ${valor}`)
        .setDescription(
            `**╔═══════ INFORMAÇÕES ═══════╗**\n\n` +
            `**💰 Valor:** R$ ${valor}\n` +
            `**🎮 Modo:** ${modoInfo.nome}\n` +
            `**👥 Jogadores:** 0/${modoInfo.jogadores}\n\n` +
            `**╠═══════ FILA ═══════╣**\n` +
            `*Nenhum jogador na fila*\n\n` +
            `**╚═══════════════════════╝**\n\n` +
            `⚠️ *Escolha suas opções e entre na fila!*`
        )
        .setThumbnail('https://cdn.discordapp.com/attachments/1433927359018434800/1457591098854605002/Gemini_Generated_Image_np3l62np3l62np3l.png')
        .setFooter({ text: 'Sistema de Filas • Bot-it' })
        .setTimestamp();
    
    const components = [];
    const painelId = `${modo}_${valor.replace('.', '')}`;
    
    // Para modo 1x1, adicionar opção de gelo
    if (modo === '1x1') {
        const rowGelo = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(`gelo_${painelId}`)
                    .setPlaceholder('🧊 Escolha o tipo de gelo')
                    .addOptions([
                        {
                            label: 'Gelo Normal',
                            description: 'Modo padrão de jogo',
                            value: 'normal',
                            emoji: '❄️'
                        },
                        {
                            label: 'Gelo Infinito',
                            description: 'Modo com gelo infinito',
                            value: 'infinito',
                            emoji: '♾️'
                        }
                    ])
            );
        components.push(rowGelo);
    }
    
    // Menu de seleção de arma
    const rowArma = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(`arma_${painelId}`)
                .setPlaceholder('🔫 Escolha sua arma')
                .addOptions([
                    {
                        label: 'Full XM8',
                        description: 'Arma XM8 completa',
                        value: 'Full XM8',
                        emoji: '🔫'
                    },
                    {
                        label: 'UMP',
                        description: 'Submetralhadora UMP',
                        value: 'UMP',
                        emoji: '🔫'
                    }
                ])
        );
    components.push(rowArma);
    
    // Botões de ação
    const rowBotoes = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`entrar_fila_${painelId}`)
                .setLabel('✅ ENTRAR NA FILA')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId(`sair_fila_${painelId}`)
                .setLabel('❌ SAIR DA FILA')
                .setStyle(ButtonStyle.Danger)
        );
    components.push(rowBotoes);
    
    return { embed, components };
}

/**
 * Atualiza o embed da fila com os jogadores atuais
 */
function atualizarEmbedFila(modo, valor, jogadores, modoInfo) {
    const filaTexto = jogadores.length > 0 
        ? jogadores.map((j, i) => {
            let opcoes = `🔫 ${j.opcoes.arma}`;
            if (modo === '1x1') {
                opcoes += ` • 🧊 ${j.opcoes.gelo === 'infinito' ? 'Gelo Infinito' : 'Gelo Normal'}`;
            }
            return `**${i + 1}.** <@${j.userId}>\n   └ ${opcoes}`;
        }).join('\n\n')
        : '*Nenhum jogador na fila*';
    
    const embed = new EmbedBuilder()
        .setColor(jogadores.length >= modoInfo.jogadores ? 0x00FF00 : 0x5865F2)
        .setTitle(`${modoInfo.icone} ${modoInfo.nome.toUpperCase()} - R$ ${valor}`)
        .setDescription(
            `**╔═══════ INFORMAÇÕES ═══════╗**\n\n` +
            `**💰 Valor:** R$ ${valor}\n` +
            `**🎮 Modo:** ${modoInfo.nome}\n` +
            `**👥 Jogadores:** ${jogadores.length}/${modoInfo.jogadores}\n\n` +
            `**╠═══════ FILA ═══════╣**\n` +
            `${filaTexto}\n\n` +
            `**╚═══════════════════════╝**\n\n` +
            (jogadores.length >= modoInfo.jogadores 
                ? '🎮 *Iniciando partida...*' 
                : '⚠️ *Escolha suas opções e entre na fila!*')
        )
        .setThumbnail('https://cdn.discordapp.com/attachments/1433927359018434800/1457591098854605002/Gemini_Generated_Image_np3l62np3l62np3l.png')
        .setFooter({ text: 'Sistema de Filas • Bot-it' })
        .setTimestamp();
    
    return embed;
}

module.exports = {
    createQueuePanel,
    atualizarEmbedFila,
    MODOS
};
