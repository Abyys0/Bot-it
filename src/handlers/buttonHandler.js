const { 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle,
    ChannelType,
    PermissionFlagsBits,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    MessageFlags
} = require('discord.js');
const { getServerConfig } = require('../utils/permissions');

// Importar dados da embed
let embedData;
try {
    embedData = require('../commands/embed').embedData;
} catch (e) {
    embedData = new Map();
}

// Importar gerenciadores de sala
const queueManager = require('../utils/queueManager');
const matchManager = require('../utils/matchManager');
const { atualizarEmbedFila, MODOS } = require('../utils/panelTemplates');

// Armazenar seleções temporárias dos jogadores (compartilhado com selectHandler)
const playerSelections = new Map();

// Exportar playerSelections para ser usado pelo selectHandler
module.exports.playerSelections = playerSelections;

module.exports = {
    async execute(interaction) {
        const customId = interaction.customId;
        
        // === HANDLERS DE SALAS DE JOGO ===
        
        // Entrar na fila
        if (customId.startsWith('entrar_fila_')) {
            await handleEntrarFila(interaction);
            return;
        }
        
        // Sair da fila
        if (customId.startsWith('sair_fila_')) {
            await handleSairFila(interaction);
            return;
        }
        
        // Marcar como pronto
        if (customId.startsWith('pronto_')) {
            await handlePronto(interaction);
            return;
        }
        
        // Cancelar partida (apenas suporte)
        if (customId.startsWith('cancelar_')) {
            await handleCancelarPartida(interaction);
            return;
        }
        
        // Confirmar pagamento (apenas suporte)
        if (customId.startsWith('confirmar_pagamento_')) {
            await handleConfirmarPagamento(interaction);
            return;
        }
        
        // Definir vencedor (apenas suporte)
        if (customId.startsWith('vencedor_')) {
            await handleVencedor(interaction);
            return;
        }
        
        // Ticket de Compra
        if (customId === 'ticket_compra') {
            await createTicket(interaction, 'compra', '🛒');
        }
        
        // Ticket de Suporte
        if (customId === 'ticket_suporte') {
            await createTicket(interaction, 'suporte', '💬');
        }
        
        // Fechar ticket
        if (customId === 'ticket_fechar') {
            await closeTicket(interaction);
        }
        
        // Assumir ticket
        if (customId === 'ticket_claim') {
            await claimTicket(interaction);
        }
        
        // === HANDLERS DO COMANDO EMBED ===
        
        // Título da embed
        if (customId === 'embed_titulo') {
            const modal = new ModalBuilder()
                .setCustomId('modal_embed_titulo')
                .setTitle('📌 Configurar Título');
            
            const tituloInput = new TextInputBuilder()
                .setCustomId('embed_titulo_input')
                .setLabel('Título da Embed')
                .setPlaceholder('Digite o título da sua embed...')
                .setStyle(TextInputStyle.Short)
                .setMaxLength(256)
                .setRequired(true);
            
            modal.addComponents(new ActionRowBuilder().addComponents(tituloInput));
            await interaction.showModal(modal);
        }
        
        // Descrição da embed
        if (customId === 'embed_descricao') {
            const modal = new ModalBuilder()
                .setCustomId('modal_embed_descricao')
                .setTitle('📝 Configurar Descrição');
            
            const descricaoInput = new TextInputBuilder()
                .setCustomId('embed_descricao_input')
                .setLabel('Descrição da Embed')
                .setPlaceholder('Digite a descrição da sua embed...\n\nDica: Use **texto** para negrito e *texto* para itálico')
                .setStyle(TextInputStyle.Paragraph)
                .setMaxLength(4000)
                .setRequired(true);
            
            modal.addComponents(new ActionRowBuilder().addComponents(descricaoInput));
            await interaction.showModal(modal);
        }
        
        // Cor da embed
        if (customId === 'embed_cor') {
            const modal = new ModalBuilder()
                .setCustomId('modal_embed_cor')
                .setTitle('🎨 Configurar Cor');
            
            const corInput = new TextInputBuilder()
                .setCustomId('embed_cor_input')
                .setLabel('Cor em HEX (exemplo: #FF5733)')
                .setPlaceholder('#5865F2')
                .setStyle(TextInputStyle.Short)
                .setMaxLength(7)
                .setRequired(true);
            
            modal.addComponents(new ActionRowBuilder().addComponents(corInput));
            await interaction.showModal(modal);
        }
        
        // Imagem da embed
        if (customId === 'embed_imagem') {
            const modal = new ModalBuilder()
                .setCustomId('modal_embed_imagem')
                .setTitle('🖼️ Configurar Imagens');
            
            const imagemInput = new TextInputBuilder()
                .setCustomId('embed_imagem_input')
                .setLabel('URL da Imagem Principal')
                .setPlaceholder('https://exemplo.com/imagem.png')
                .setStyle(TextInputStyle.Short)
                .setRequired(false);
            
            const thumbnailInput = new TextInputBuilder()
                .setCustomId('embed_thumbnail_input')
                .setLabel('URL da Thumbnail (imagem pequena)')
                .setPlaceholder('https://exemplo.com/thumbnail.png')
                .setStyle(TextInputStyle.Short)
                .setRequired(false);
            
            const footerInput = new TextInputBuilder()
                .setCustomId('embed_footer_input')
                .setLabel('Texto do Rodapé (opcional)')
                .setPlaceholder('Texto que aparece no rodapé da embed')
                .setStyle(TextInputStyle.Short)
                .setMaxLength(2048)
                .setRequired(false);
            
            modal.addComponents(
                new ActionRowBuilder().addComponents(imagemInput),
                new ActionRowBuilder().addComponents(thumbnailInput),
                new ActionRowBuilder().addComponents(footerInput)
            );
            await interaction.showModal(modal);
        }
        
        // Preview da embed
        if (customId === 'embed_preview') {
            await previewEmbed(interaction);
        }
        
        // Enviar embed
        if (customId === 'embed_enviar') {
            await sendEmbed(interaction);
        }
        
        // Cancelar embed
        if (customId === 'embed_cancelar') {
            embedData.delete(interaction.user.id);
            await interaction.update({
                content: '❌ **Criação de embed cancelada!**',
                embeds: [],
                components: []
            });
        }
    }
};

/**
 * Preview da embed configurada
 */
async function previewEmbed(interaction) {
    const data = embedData.get(interaction.user.id);
    
    if (!data) {
        return interaction.reply({
            content: '❌ Nenhuma embed está sendo configurada. Use `/embed` para criar uma nova.',
            flags: MessageFlags.Ephemeral
        });
    }
    
    if (!data.title && !data.description) {
        return interaction.reply({
            content: '⚠️ Configure pelo menos o **título** ou a **descrição** antes de visualizar!',
            flags: MessageFlags.Ephemeral
        });
    }
    
    const previewEmbed = new EmbedBuilder().setColor(data.color);
    
    if (data.title) previewEmbed.setTitle(data.title);
    if (data.description) previewEmbed.setDescription(data.description);
    if (data.image) previewEmbed.setImage(data.image);
    if (data.thumbnail) previewEmbed.setThumbnail(data.thumbnail);
    if (data.footer) previewEmbed.setFooter({ text: data.footer });
    
    previewEmbed.setTimestamp();
    
    await interaction.reply({
        content: '👁️ **Preview da sua embed:**',
        embeds: [previewEmbed],
        flags: MessageFlags.Ephemeral
    });
}

/**
 * Envia a embed configurada
 */
async function sendEmbed(interaction) {
    const data = embedData.get(interaction.user.id);
    
    if (!data) {
        return interaction.reply({
            content: '❌ Nenhuma embed está sendo configurada. Use `/embed` para criar uma nova.',
            flags: MessageFlags.Ephemeral
        });
    }
    
    if (!data.title && !data.description) {
        return interaction.reply({
            content: '⚠️ Configure pelo menos o **título** ou a **descrição** antes de enviar!',
            flags: MessageFlags.Ephemeral
        });
    }
    
    if (!data.channel) {
        return interaction.reply({
            content: '⚠️ Selecione um **canal de destino** antes de enviar!',
            flags: MessageFlags.Ephemeral
        });
    }
    
    const channel = interaction.guild.channels.cache.get(data.channel);
    
    if (!channel) {
        return interaction.reply({
            content: '❌ Canal não encontrado. Por favor, selecione outro canal.',
            flags: MessageFlags.Ephemeral
        });
    }
    
    const finalEmbed = new EmbedBuilder().setColor(data.color);
    
    if (data.title) finalEmbed.setTitle(data.title);
    if (data.description) finalEmbed.setDescription(data.description);
    if (data.image) finalEmbed.setImage(data.image);
    if (data.thumbnail) finalEmbed.setThumbnail(data.thumbnail);
    if (data.footer) finalEmbed.setFooter({ text: data.footer });
    
    finalEmbed.setTimestamp();
    
    try {
        await channel.send({ embeds: [finalEmbed] });
        
        // Limpar dados e confirmar
        embedData.delete(interaction.user.id);
        
        await interaction.update({
            content: `✅ **Embed enviada com sucesso para ${channel}!**`,
            embeds: [],
            components: []
        });
    } catch (error) {
        console.error('Erro ao enviar embed:', error);
        await interaction.reply({
            content: '❌ Erro ao enviar a embed. Verifique se o bot tem permissão no canal.',
            flags: MessageFlags.Ephemeral
        });
    }
}

/**
 * Cria um ticket privado
 */
async function createTicket(interaction, tipo, emoji) {
    const guild = interaction.guild;
    const user = interaction.user;
    
    // Buscar cargo de suporte da configuração do servidor ou do .env
    const serverConfig = getServerConfig(guild.id);
    const supportRoleId = serverConfig?.supportRoleId || process.env.SUPPORT_ROLE_ID;
    
    // Verificar se o cargo existe no servidor
    const supportRole = supportRoleId ? guild.roles.cache.get(supportRoleId) : null;
    
    // Verificar se o canal atual está em uma categoria
    const parentCategory = interaction.channel.parent;
    
    if (!parentCategory) {
        return interaction.reply({
            content: '❌ O painel deve estar em um canal dentro de uma categoria para criar tickets.',
            flags: MessageFlags.Ephemeral
        });
    }
    
    // Verificar se já existe um ticket aberto do usuário
    const existingTicket = guild.channels.cache.find(
        channel => channel.name === `${tipo}-${user.username.toLowerCase()}` && 
                   channel.parentId === parentCategory.id
    );
    
    if (existingTicket) {
        return interaction.reply({
            content: `❌ Você já tem um ticket de ${tipo} aberto: ${existingTicket}`,
            flags: MessageFlags.Ephemeral
        });
    }
    
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    
    try {
        // Configurar permissões base
        const permissionOverwrites = [
            {
                // Negar acesso a todos (@everyone)
                id: guild.id,
                deny: [PermissionFlagsBits.ViewChannel]
            },
            {
                // Permitir acesso ao usuário que abriu
                id: user.id,
                allow: [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.ReadMessageHistory,
                    PermissionFlagsBits.AttachFiles,
                    PermissionFlagsBits.EmbedLinks
                ]
            }
        ];
        
        // Adicionar permissão do cargo de suporte apenas se existir
        if (supportRole) {
            permissionOverwrites.push({
                id: supportRole.id,
                allow: [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.ReadMessageHistory,
                    PermissionFlagsBits.AttachFiles,
                    PermissionFlagsBits.EmbedLinks,
                    PermissionFlagsBits.ManageMessages
                ]
            });
        }
        
        // Criar o canal do ticket na mesma categoria
        const ticketChannel = await guild.channels.create({
            name: `${tipo}-${user.username}`,
            type: ChannelType.GuildText,
            parent: parentCategory.id,
            permissionOverwrites: permissionOverwrites
        });
        
        // Definir configurações baseadas no tipo
        const titulo = tipo === 'compra' ? 'Comprar Serviço' : 'Suporte Geral';
        const corEmbed = tipo === 'compra' ? 0x57F287 : 0x5865F2;
        const icone = tipo === 'compra' ? '💎' : '🔧';
        
        // Criar embed de boas-vindas do ticket - Design elegante
        const ticketEmbed = new EmbedBuilder()
            .setColor(corEmbed)
            .setAuthor({ 
                name: `${guild.name} — Sistema de Tickets`, 
                iconURL: guild.iconURL({ dynamic: true }) 
            })
            .setTitle(`${icone} Ticket de ${titulo}`)
            .setDescription(
                `╭───────────────────────────╮\n` +
                `   **Bem-vindo(a) ao seu ticket!**\n` +
                `╰───────────────────────────╯\n\n` +
                `> Olá ${user}! Sua solicitação foi recebida.\n\n` +
                `**📋 Informações do Ticket**\n` +
                `┣ **Tipo:** \`${titulo}\`\n` +
                `┣ **Usuário:** ${user}\n` +
                `┣ **Tag:** \`${user.tag}\`\n` +
                `┣ **ID:** \`${user.id}\`\n` +
                `┗ **Aberto em:** <t:${Math.floor(Date.now() / 1000)}:F>\n\n` +
                `**📝 Próximos Passos:**\n` +
                `> 1️⃣ Descreva detalhadamente sua solicitação\n` +
                `> 2️⃣ Aguarde um membro da equipe\n` +
                `> 3️⃣ Seja claro e objetivo\n\n` +
                `\`\`\`diff\n` +
                `+ Nossa equipe responderá em breve!\n` +
                `\`\`\``
            )
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
            .setFooter({ 
                text: `${emoji} Ticket #${ticketChannel.name}`, 
                iconURL: guild.iconURL({ dynamic: true }) 
            })
            .setTimestamp();
        
        // Botões de ação do ticket
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('ticket_fechar')
                    .setLabel('Fechar Ticket')
                    .setEmoji('🔒')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('ticket_claim')
                    .setLabel('Assumir Ticket')
                    .setEmoji('✋')
                    .setStyle(ButtonStyle.Success)
            );
        
        // Enviar mensagem no ticket
        const mentionSupport = supportRole ? ` | ${supportRole}` : '';
        await ticketChannel.send({
            content: `${user}${mentionSupport}`,
            embeds: [ticketEmbed],
            components: [row]
        });
        
        // Confirmar criação do ticket
        await interaction.editReply({
            content: `✅ **Seu ticket foi criado com sucesso!**\n> Acesse: ${ticketChannel}`
        });
        
    } catch (error) {
        console.error('Erro ao criar ticket:', error);
        await interaction.editReply({
            content: '❌ Ocorreu um erro ao criar o ticket. Tente novamente mais tarde.'
        });
    }
}

/**
 * Assumir um ticket (claim)
 */
async function claimTicket(interaction) {
    const channel = interaction.channel;
    const user = interaction.user;
    const guild = interaction.guild;
    
    // Buscar cargo de suporte da configuração do servidor ou do .env
    const serverConfig = getServerConfig(guild.id);
    const supportRoleId = serverConfig?.supportRoleId || process.env.SUPPORT_ROLE_ID;
    
    // Verificar se é um canal de ticket
    if (!channel.name.startsWith('compra-') && !channel.name.startsWith('suporte-')) {
        return interaction.reply({
            content: '❌ Este botão só pode ser usado em canais de ticket.',
            flags: MessageFlags.Ephemeral
        });
    }
    
    // Verificar se o usuário tem o cargo de suporte ou é admin
    const member = interaction.member;
    const hasSupport = supportRoleId ? member.roles.cache.has(supportRoleId) : false;
    const isAdmin = member.permissions.has(PermissionFlagsBits.Administrator);
    
    if (!hasSupport && !isAdmin) {
        return interaction.reply({
            content: '❌ Apenas membros da equipe de suporte podem assumir tickets.',
            flags: MessageFlags.Ephemeral
        });
    }
    
    // Criar embed de claim
    const claimEmbed = new EmbedBuilder()
        .setColor(0x57F287)
        .setTitle('✋ Ticket Assumido!')
        .setDescription(
            `> Este ticket foi assumido por ${user}\n\n` +
            `**👤 Atendente:** ${user.tag}\n` +
            `**⏰ Horário:** <t:${Math.floor(Date.now() / 1000)}:F>`
        )
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: 'O atendimento começará em breve!' })
        .setTimestamp();
    
    await interaction.reply({ embeds: [claimEmbed] });
}

/**
 * Fecha um ticket
 */
async function closeTicket(interaction) {
    const channel = interaction.channel;
    const user = interaction.user;
    
    // Verificar se é um canal de ticket
    if (!channel.name.startsWith('compra-') && !channel.name.startsWith('suporte-')) {
        return interaction.reply({
            content: '❌ Este comando só pode ser usado em canais de ticket.',
            flags: MessageFlags.Ephemeral
        });
    }
    
    // Criar embed de confirmação elegante
    const confirmEmbed = new EmbedBuilder()
        .setColor(0xED4245)
        .setTitle('🔒 Ticket Sendo Fechado')
        .setDescription(
            `╭───────────────────────────╮\n` +
            `   **Obrigado pelo contato!**\n` +
            `╰───────────────────────────╯\n\n` +
            `> Este ticket foi encerrado por ${user}\n\n` +
            `**📋 Informações do Encerramento**\n` +
            `┣ **Fechado por:** ${user.tag}\n` +
            `┣ **Canal:** \`${channel.name}\`\n` +
            `┗ **Data:** <t:${Math.floor(Date.now() / 1000)}:F>\n\n` +
            `\`\`\`diff\n` +
            `- Este canal será deletado em 5 segundos...\n` +
            `\`\`\`\n\n` +
            `*Agradecemos por utilizar nosso sistema de suporte!* 💜`
        )
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: '👋 Até a próxima!' })
        .setTimestamp();
    
    await interaction.reply({ embeds: [confirmEmbed] });
    
    // Aguardar 5 segundos e deletar
    setTimeout(async () => {
        try {
            await channel.delete();
        } catch (error) {
            console.error('Erro ao deletar canal:', error);
        }
    }, 5000);
}

// ========== HANDLERS DE SALAS DE JOGO ==========

/**
 * Handler para entrar na fila
 */
async function handleEntrarFila(interaction) {
    const painelId = interaction.customId.replace('entrar_fila_', '');
    const userId = interaction.user.id;
    
    // Verificar se o jogador já selecionou as opções
    const selecao = playerSelections.get(`${userId}_${painelId}`);
    
    if (!selecao || !selecao.arma) {
        return interaction.reply({
            content: '⚠️ Selecione uma **arma** antes de entrar na fila!',
            ephemeral: true
        });
    }
    
    const salas = queueManager.loadSalas();
    const painel = salas.paineis[painelId];
    
    // Para modo 1x1, verificar se selecionou o gelo
    if (painel.modo === '1x1' && !selecao.gelo) {
        return interaction.reply({
            content: '⚠️ Selecione o **tipo de gelo** antes de entrar na fila!',
            ephemeral: true
        });
    }
    
    // Adicionar à fila
    const resultado = queueManager.adicionarJogadorFila(painelId, userId, selecao);
    
    if (!resultado.success) {
        return interaction.reply({
            content: `❌ ${resultado.message}`,
            ephemeral: true
        });
    }
    
    // Atualizar painel da fila
    const modoInfo = MODOS[painel.modo];
    const embedAtualizado = atualizarEmbedFila(painel.modo, painel.valor, resultado.fila, modoInfo);
    
    await interaction.message.edit({ embeds: [embedAtualizado] });
    
    await interaction.reply({
        content: `✅ ${resultado.message}`,
        ephemeral: true
    });
    
    // Se a fila completou, criar partida
    if (resultado.filaCompleta) {
        try {
            const { canal, partidaId } = await matchManager.criarCanalPartida(
                interaction.guild,
                painelId,
                resultado.fila
            );
            
            // Limpar a fila
            queueManager.limparFila(painelId);
            
            // Limpar seleções dos jogadores
            resultado.fila.forEach(j => {
                playerSelections.delete(`${j.userId}_${painelId}`);
            });
            
            // Resetar embed da fila
            const embedReset = atualizarEmbedFila(painel.modo, painel.valor, [], modoInfo);
            await interaction.message.edit({ embeds: [embedReset] });
            
            // Notificar no canal original
            await interaction.channel.send({
                content: `🎮 Partida iniciada! ${resultado.fila.map(j => `<@${j.userId}>`).join(' ')} - ${canal}`,
                allowedMentions: { parse: [] }
            });
            
        } catch (error) {
            console.error('Erro ao criar partida:', error);
            await interaction.followUp({
                content: '❌ Erro ao criar a partida. Tente novamente.',
                ephemeral: true
            });
        }
    }
}

/**
 * Handler para sair da fila
 */
async function handleSairFila(interaction) {
    const painelId = interaction.customId.replace('sair_fila_', '');
    const userId = interaction.user.id;
    
    const resultado = queueManager.removerJogadorFila(painelId, userId);
    
    if (!resultado.success) {
        return interaction.reply({
            content: `❌ ${resultado.message}`,
            ephemeral: true
        });
    }
    
    // Limpar seleção do jogador
    playerSelections.delete(`${userId}_${painelId}`);
    
    // Atualizar painel
    const salas = queueManager.loadSalas();
    const painel = salas.paineis[painelId];
    const modoInfo = MODOS[painel.modo];
    const embedAtualizado = atualizarEmbedFila(painel.modo, painel.valor, resultado.fila, modoInfo);
    
    await interaction.message.edit({ embeds: [embedAtualizado] });
    
    await interaction.reply({
        content: `✅ ${resultado.message}`,
        ephemeral: true
    });
}

/**
 * Handler para marcar como pronto
 */
async function handlePronto(interaction) {
    const partidaId = interaction.customId.replace('pronto_', '');
    const userId = interaction.user.id;
    
    const resultado = matchManager.marcarPronto(partidaId, userId);
    
    if (!resultado.success) {
        return interaction.reply({
            content: `❌ ${resultado.message}`,
            ephemeral: true
        });
    }
    
    await interaction.reply({
        content: `✅ ${resultado.message}`,
        ephemeral: true
    });
    
    // Atualizar painel da partida
    await matchManager.atualizarPainelPartida(interaction.client, partidaId);
    
    // Se todos prontos, notificar
    if (resultado.todosprontos) {
        await interaction.channel.send({
            content: '🎮 **TODOS PRONTOS! A PARTIDA COMEÇOU!**\n\n' +
                    '📋 *Aguardando confirmação de pagamento pela equipe de suporte...*'
        });
    }
}

/**
 * Handler para cancelar partida (apenas suporte)
 */
async function handleCancelarPartida(interaction) {
    const partidaId = interaction.customId.replace('cancelar_', '');
    
    const salas = queueManager.loadSalas();
    const partida = salas.partidas[partidaId];
    
    if (!partida) {
        return interaction.reply({
            content: '❌ Partida não encontrada!',
            ephemeral: true
        });
    }
    
    // Verificar permissão de suporte
    const member = interaction.member;
    const temPermissao = member.roles.cache.has(partida.cargoSuporteId) ||
                        member.permissions.has(PermissionFlagsBits.Administrator);
    
    if (!temPermissao) {
        return interaction.reply({
            content: '❌ Apenas membros do suporte podem cancelar partidas!',
            ephemeral: true
        });
    }
    
    await interaction.reply({
        content: '⏳ Cancelando partida...',
        ephemeral: true
    });
    
    // Notificar jogadores
    await interaction.channel.send({
        content: `❌ **PARTIDA CANCELADA**\n\n` +
                `Cancelado por: ${interaction.user}\n` +
                `Motivo: Cancelamento manual pelo suporte\n\n` +
                `*Este canal será deletado em 10 segundos...*`
    });
    
    // Aguardar e cancelar
    setTimeout(async () => {
        await matchManager.cancelarPartida(interaction.client, partidaId, interaction.user.id);
    }, 10000);
}

/**
 * Handler para confirmar pagamento (apenas suporte)
 */
async function handleConfirmarPagamento(interaction) {
    const partidaId = interaction.customId.replace('confirmar_pagamento_', '');
    
    const salas = queueManager.loadSalas();
    const partida = salas.partidas[partidaId];
    
    if (!partida) {
        return interaction.reply({
            content: '❌ Partida não encontrada!',
            ephemeral: true
        });
    }
    
    // Verificar permissão de suporte
    const member = interaction.member;
    const temPermissao = member.roles.cache.has(partida.cargoSuporteId) ||
                        member.permissions.has(PermissionFlagsBits.Administrator);
    
    if (!temPermissao) {
        return interaction.reply({
            content: '❌ Apenas membros do suporte podem confirmar pagamentos!',
            ephemeral: true
        });
    }
    
    // Atualizar status da partida
    partida.status = 'aguardando_pagamento';
    partida.pagamentoConfirmadoPor = interaction.user.id;
    partida.pagamentoConfirmadoEm = Date.now();
    queueManager.saveSalas(salas);
    
    await interaction.reply({
        content: '✅ Pagamento confirmado!',
        ephemeral: true
    });
    
    await interaction.channel.send({
        content: `💰 **PAGAMENTO CONFIRMADO**\n\n` +
                `Confirmado por: ${interaction.user}\n` +
                `Horário: <t:${Math.floor(Date.now() / 1000)}:F>\n\n` +
                `✅ *A partida pode prosseguir!*`
    });
    
    await matchManager.atualizarPainelPartida(interaction.client, partidaId);
}

/**
 * Handler para definir vencedor (apenas suporte)
 */
async function handleVencedor(interaction) {
    const partidaId = interaction.customId.replace('vencedor_', '');
    
    const salas = queueManager.loadSalas();
    const partida = salas.partidas[partidaId];
    
    if (!partida) {
        return interaction.reply({
            content: '❌ Partida não encontrada!',
            ephemeral: true
        });
    }
    
    // Verificar permissão de suporte
    const member = interaction.member;
    const temPermissao = member.roles.cache.has(partida.cargoSuporteId) ||
                        member.permissions.has(PermissionFlagsBits.Administrator);
    
    if (!temPermissao) {
        return interaction.reply({
            content: '❌ Apenas membros do suporte podem definir vencedores!',
            ephemeral: true
        });
    }
    
    // Criar menu de seleção de vencedor
    const { StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
    
    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId(`selecionar_vencedor_${partidaId}`)
        .setPlaceholder('Selecione o vencedor')
        .addOptions(
            partida.jogadores.map((j, i) => ({
                label: `Jogador ${i + 1}`,
                description: `User ID: ${j.userId}`,
                value: j.userId,
                emoji: '🏆'
            }))
        );
    
    const row = new ActionRowBuilder().addComponents(selectMenu);
    
    await interaction.reply({
        content: '🏆 Selecione o vencedor da partida:',
        components: [row],
        ephemeral: true
    });
}
