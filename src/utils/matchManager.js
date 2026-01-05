const { ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { loadSalas, saveSalas } = require('./queueManager');
const { v4: uuidv4 } = require('crypto');

const MODOS = {
    '1x1': { nome: '1x1', jogadores: 2, icone: '⚔️' },
    '2x2': { nome: '2x2', jogadores: 2, icone: '🎮' },
    '3x3': { nome: '3x3', jogadores: 2, icone: '🏆' },
    '4x4': { nome: '4x4', jogadores: 2, icone: '👥' }
};

/**
 * Cria um canal privado para a partida
 */
async function criarCanalPartida(guild, painelId, jogadores) {
    const salas = loadSalas();
    const painel = salas.paineis[painelId];
    const modoInfo = MODOS[painel.modo];
    
    // Buscar categoria
    const categoria = guild.channels.cache.get(painel.categoriaId);
    if (!categoria) {
        throw new Error('Categoria não encontrada');
    }
    
    // Criar nome do canal
    const nomeCanal = `${modoInfo.icone}${painel.modo}-r$${painel.valor}`;
    
    // Criar permissões do canal
    const permissionOverwrites = [
        {
            id: guild.roles.everyone,
            deny: [PermissionFlagsBits.ViewChannel]
        },
        {
            id: painel.cargoSuporteId,
            allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ManageMessages
            ]
        }
    ];
    
    // Adicionar permissões para cada jogador
    for (const jogador of jogadores) {
        permissionOverwrites.push({
            id: jogador.userId,
            allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ReadMessageHistory
            ]
        });
    }
    
    // Criar canal
    const canal = await guild.channels.create({
        name: nomeCanal,
        type: ChannelType.GuildText,
        parent: categoria.id,
        permissionOverwrites: permissionOverwrites
    });
    
    // Gerar ID único para a partida
    const partidaId = `partida_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    // Salvar informações da partida
    salas.partidas[partidaId] = {
        id: partidaId,
        painelId: painelId,
        canalId: canal.id,
        modo: painel.modo,
        valor: painel.valor,
        jogadores: jogadores.map(j => ({
            userId: j.userId,
            opcoes: j.opcoes,
            pronto: false
        })),
        status: 'aguardando_confirmacao',
        criadoEm: Date.now(),
        cargoSuporteId: painel.cargoSuporteId
    };
    
    saveSalas(salas);
    
    // Enviar painel da partida
    await enviarPainelPartida(canal, partidaId);
    
    return { canal, partidaId };
}

/**
 * Envia o painel de informações da partida no canal privado
 */
async function enviarPainelPartida(canal, partidaId) {
    const salas = loadSalas();
    const partida = salas.partidas[partidaId];
    const modoInfo = MODOS[partida.modo];
    
    // Criar embed com informações da partida
    const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle(`${modoInfo.icone} Partida ${partida.modo.toUpperCase()} - R$ ${partida.valor}`)
        .setDescription(
            '**╔═══════ INFORMAÇÕES DA PARTIDA ═══════╗**\n\n' +
            `**💰 Valor da Aposta:** R$ ${partida.valor}\n` +
            `**🎮 Modo:** ${partida.modo}\n` +
            `**👥 Jogadores:** ${partida.jogadores.length}/${modoInfo.jogadores}\n\n` +
            '**╠═══════ JOGADORES ═══════╣**\n' +
            partida.jogadores.map((j, i) => {
                const opcoes = j.opcoes;
                let opcoesTexto = '';
                
                if (partida.modo === '1x1') {
                    opcoesTexto = `\n   └ 🧊 ${opcoes.gelo === 'infinito' ? 'Gelo Infinito' : 'Gelo Normal'}`;
                } else {
                    opcoesTexto = `\n   └ 🔫 Full XM8 & UMP`;
                }
                
                return `**${i + 1}.** <@${j.userId}> ${j.pronto ? '✅' : '⏳'}${opcoesTexto}`;
            }).join('\n\n') +
            '\n\n**╠═══════ STATUS ═══════╣**\n' +
            `📊 **Status:** ${getStatusTexto(partida.status)}\n` +
            `⏰ **Criado:** <t:${Math.floor(partida.criadoEm / 1000)}:R>\n\n` +
            '**╚═══════════════════════════════╝**\n\n' +
            '⚠️ *Todos devem clicar em "PRONTO" para iniciar!*'
        )
        .setThumbnail('https://cdn.discordapp.com/attachments/1433927359018434800/1457591098854605002/Gemini_Generated_Image_np3l62np3l62np3l.png')
        .setFooter({ text: 'Sistema de Partidas • Bot-it' })
        .setTimestamp();
    
    // Criar botões
    const row1 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`pronto_${partidaId}`)
                .setLabel('✅ PRONTO')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId(`cancelar_${partidaId}`)
                .setLabel('❌ CANCELAR PARTIDA')
                .setStyle(ButtonStyle.Danger)
        );
    
    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`confirmar_pagamento_${partidaId}`)
                .setLabel('💰 CONFIRMAR PAGAMENTO')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId(`vencedor_${partidaId}`)
                .setLabel('🏆 DEFINIR VENCEDOR')
                .setStyle(ButtonStyle.Secondary)
        );
    
    const mensagem = await canal.send({
        content: partida.jogadores.map(j => `<@${j.userId}>`).join(' '),
        embeds: [embed],
        components: [row1, row2]
    });
    
    // Salvar ID da mensagem
    partida.mensagemId = mensagem.id;
    saveSalas(salas);
    
    return mensagem;
}

/**
 * Atualiza o painel da partida
 */
async function atualizarPainelPartida(client, partidaId) {
    const salas = loadSalas();
    const partida = salas.partidas[partidaId];
    
    if (!partida || !partida.mensagemId) return;
    
    const canal = await client.channels.fetch(partida.canalId);
    const mensagem = await canal.messages.fetch(partida.mensagemId);
    
    const modoInfo = MODOS[partida.modo];
    
    const embed = new EmbedBuilder()
        .setColor(partida.status === 'em_andamento' ? 0xFFFF00 : partida.status === 'finalizada' ? 0x0000FF : 0x00FF00)
        .setTitle(`${modoInfo.icone} Partida ${partida.modo.toUpperCase()} - R$ ${partida.valor}`)
        .setDescription(
            '**╔═══════ INFORMAÇÕES DA PARTIDA ═══════╗**\n\n' +
            `**💰 Valor da Aposta:** R$ ${partida.valor}\n` +
            `**🎮 Modo:** ${partida.modo}\n` +
            `**👥 Jogadores:** ${partida.jogadores.length}/${modoInfo.jogadores}\n\n` +
            '**╠═══════ JOGADORES ═══════╣**\n' +
            partida.jogadores.map((j, i) => {
                const opcoes = j.opcoes;
                let opcoesTexto = '';
                
                if (partida.modo === '1x1') {
                    opcoesTexto = `\n   └ 🧊 ${opcoes.gelo === 'infinito' ? 'Gelo Infinito' : 'Gelo Normal'}`;
                } else {
                    opcoesTexto = `\n   └ 🔫 Full XM8 & UMP`;
                }
                
                const vencedor = partida.vencedorId === j.userId ? ' 🏆' : '';
                
                return `**${i + 1}.** <@${j.userId}> ${j.pronto ? '✅' : '⏳'}${vencedor}${opcoesTexto}`;
            }).join('\n\n') +
            '\n\n**╠═══════ STATUS ═══════╣**\n' +
            `📊 **Status:** ${getStatusTexto(partida.status)}\n` +
            `⏰ **Criado:** <t:${Math.floor(partida.criadoEm / 1000)}:R>\n` +
            (partida.vencedorId ? `\n🏆 **Vencedor:** <@${partida.vencedorId}>\n` : '') +
            '\n**╚═══════════════════════════════╝**\n\n' +
            (partida.status === 'aguardando_confirmacao' ? '⚠️ *Todos devem clicar em "PRONTO" para iniciar!*' : '')
        )
        .setThumbnail('https://cdn.discordapp.com/attachments/1433927359018434800/1457591098854605002/Gemini_Generated_Image_np3l62np3l62np3l.png')
        .setFooter({ text: 'Sistema de Partidas • Bot-it' })
        .setTimestamp();
    
    await mensagem.edit({ embeds: [embed] });
}

/**
 * Marca jogador como pronto
 */
function marcarPronto(partidaId, userId) {
    const salas = loadSalas();
    const partida = salas.partidas[partidaId];
    
    if (!partida) {
        return { success: false, message: 'Partida não encontrada!' };
    }
    
    const jogador = partida.jogadores.find(j => j.userId === userId);
    
    if (!jogador) {
        return { success: false, message: 'Você não está nesta partida!' };
    }
    
    if (jogador.pronto) {
        return { success: false, message: 'Você já está pronto!' };
    }
    
    jogador.pronto = true;
    
    // Verificar se todos estão prontos
    const todosOrontos = partida.jogadores.every(j => j.pronto);
    
    if (todosOrontos) {
        partida.status = 'em_andamento';
        partida.iniciadoEm = Date.now();
    }
    
    saveSalas(salas);
    
    return {
        success: true,
        message: 'Você está pronto!',
        todosprontos: todosOrontos
    };
}

/**
 * Cancela uma partida
 */
async function cancelarPartida(client, partidaId, userId) {
    const salas = loadSalas();
    const partida = salas.partidas[partidaId];
    
    if (!partida) {
        return { success: false, message: 'Partida não encontrada!' };
    }
    
    // Deletar canal
    try {
        const canal = await client.channels.fetch(partida.canalId);
        await canal.delete();
    } catch (error) {
        console.error('Erro ao deletar canal:', error);
    }
    
    // Remover partida
    delete salas.partidas[partidaId];
    saveSalas(salas);
    
    return { success: true, message: 'Partida cancelada!' };
}

/**
 * Define o vencedor da partida
 */
function definirVencedor(partidaId, vencedorId) {
    const salas = loadSalas();
    const partida = salas.partidas[partidaId];
    
    if (!partida) {
        return { success: false, message: 'Partida não encontrada!' };
    }
    
    const jogador = partida.jogadores.find(j => j.userId === vencedorId);
    
    if (!jogador) {
        return { success: false, message: 'Jogador não encontrado na partida!' };
    }
    
    partida.vencedorId = vencedorId;
    partida.status = 'finalizada';
    partida.finalizadoEm = Date.now();
    
    saveSalas(salas);
    
    return { success: true, vencedor: vencedorId };
}

function getStatusTexto(status) {
    const statusMap = {
        'aguardando_confirmacao': '⏳ Aguardando confirmação',
        'em_andamento': '🎮 Em andamento',
        'finalizada': '✅ Finalizada',
        'cancelada': '❌ Cancelada',
        'aguardando_pagamento': '💰 Aguardando pagamento'
    };
    
    return statusMap[status] || status;
}

module.exports = {
    criarCanalPartida,
    enviarPainelPartida,
    atualizarPainelPartida,
    marcarPronto,
    cancelarPartida,
    definirVencedor
};
