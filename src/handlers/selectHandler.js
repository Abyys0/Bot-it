const { 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle,
    ChannelType,
    PermissionFlagsBits,
    MessageFlags
} = require('discord.js');
const { getServerConfig } = require('../utils/permissions');
const queueManager = require('../utils/queueManager');
const matchManager = require('../utils/matchManager');

// Armazenamento compartilhado de seleções (será sobrescrito pela importação do buttonHandler)
let playerSelections = new Map();

module.exports = {
    async execute(interaction) {
        const customId = interaction.customId;
        
        // Obter playerSelections do buttonHandler na primeira execução
        if (!module.exports.playerSelectionsInitialized) {
            try {
                const buttonHandler = require('./buttonHandler');
                playerSelections = buttonHandler.playerSelections;
                module.exports.playerSelectionsInitialized = true;
            } catch (e) {
                console.error('Erro ao importar playerSelections:', e);
            }
        }
        
        // Menu de tickets
        if (customId === 'ticket_menu') {
            const selectedOption = interaction.values[0];
            
            if (selectedOption === 'ticket_compra') {
                await createTicket(interaction, 'compra', '🛒');
            } else if (selectedOption === 'ticket_suporte') {
                await createTicket(interaction, 'suporte', '💬');
            }
        }
        
        // === HANDLERS DE SALAS DE JOGO ===
        
        // Seleção de gelo (1x1)
        if (customId.startsWith('gelo_')) {
            await handleSelecaoGelo(interaction);
        }
        
        // Seleção de vencedor
        if (customId.startsWith('selecionar_vencedor_')) {
            await handleSelecaoVencedor(interaction);
        }
    }
};

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
        
        // Definir título e cores baseado no tipo
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
            content: `✅ Seu ticket foi criado com sucesso: ${ticketChannel}`
        });
        
    } catch (error) {
        console.error('Erro ao criar ticket:', error);
        await interaction.editReply({
            content: '❌ Ocorreu um erro ao criar o ticket. Tente novamente mais tarde.'
        });
    }
}

// ========== HANDLERS DE SALAS DE JOGO ==========

/**
 * Handler para seleção de tipo de gelo (1x1)
 */
async function handleSelecaoGelo(interaction) {
    const painelId = interaction.customId.replace('gelo_', '');
    const userId = interaction.user.id;
    const gelo = interaction.values[0]; // 'normal' ou 'infinito'
    
    // Obter ou criar seleção do jogador
    const key = `${userId}_${painelId}`;
    let selecao = playerSelections.get(key) || {};
    
    selecao.gelo = gelo;
    playerSelections.set(key, selecao);
    
    const geloTexto = gelo === 'infinito' ? '♾️ Gelo Infinito' : '❄️ Gelo Normal';
    
    await interaction.reply({
        content: `✅ Você selecionou: **${geloTexto}**`,
        ephemeral: true
    });
}

/**
 * Handler para seleção de vencedor
 */
async function handleSelecaoVencedor(interaction) {
    const partidaId = interaction.customId.replace('selecionar_vencedor_', '');
    const vencedorId = interaction.values[0];
    
    const resultado = matchManager.definirVencedor(partidaId, vencedorId);
    
    if (!resultado.success) {
        return interaction.update({
            content: `❌ ${resultado.message}`,
            components: []
        });
    }
    
    await interaction.update({
        content: `✅ Vencedor definido: <@${vencedorId}>`,
        components: []
    });
    
    // Atualizar painel da partida
    await matchManager.atualizarPainelPartida(interaction.client, partidaId);
    
    // Anunciar vencedor no canal
    await interaction.channel.send({
        content: `🏆 **VENCEDOR DA PARTIDA**\n\n` +
                `👑 <@${vencedorId}> venceu a partida!\n` +
                `📊 Definido por: ${interaction.user}\n` +
                `⏰ Horário: <t:${Math.floor(Date.now() / 1000)}:F>\n\n` +
                `✅ *Partida finalizada com sucesso!*`
    });
}
