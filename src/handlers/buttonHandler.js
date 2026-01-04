const { 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle,
    ChannelType,
    PermissionFlagsBits
} = require('discord.js');

module.exports = {
    async execute(interaction) {
        const customId = interaction.customId;
        
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
    }
};

/**
 * Cria um ticket privado
 */
async function createTicket(interaction, tipo, emoji) {
    const guild = interaction.guild;
    const user = interaction.user;
    const supportRoleId = process.env.SUPPORT_ROLE_ID;
    
    // Verificar se o canal atual está em uma categoria
    const parentCategory = interaction.channel.parent;
    
    if (!parentCategory) {
        return interaction.reply({
            content: '❌ O painel deve estar em um canal dentro de uma categoria para criar tickets.',
            ephemeral: true
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
            ephemeral: true
        });
    }
    
    await interaction.deferReply({ ephemeral: true });
    
    try {
        // Criar o canal do ticket na mesma categoria
        const ticketChannel = await guild.channels.create({
            name: `${tipo}-${user.username}`,
            type: ChannelType.GuildText,
            parent: parentCategory.id,
            permissionOverwrites: [
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
                },
                {
                    // Permitir acesso ao cargo de suporte
                    id: supportRoleId,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory,
                        PermissionFlagsBits.AttachFiles,
                        PermissionFlagsBits.EmbedLinks,
                        PermissionFlagsBits.ManageMessages
                    ]
                }
            ]
        });
        
        // Criar embed de boas-vindas do ticket
        const ticketEmbed = new EmbedBuilder()
            .setColor(tipo === 'compra' ? 0x57F287 : 0x5865F2)
            .setTitle(`${emoji} Ticket de ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`)
            .setDescription(
                `Olá ${user}! Bem-vindo ao seu ticket.\n\n` +
                `**Tipo:** ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}\n` +
                `**Aberto por:** ${user.tag}\n` +
                `**Data:** <t:${Math.floor(Date.now() / 1000)}:F>\n\n` +
                `Por favor, descreva detalhadamente o que você precisa e aguarde um membro da equipe de suporte.`
            )
            .setFooter({ text: 'Clique no botão abaixo para fechar o ticket' })
            .setTimestamp();
        
        // Botão de fechar ticket
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('ticket_fechar')
                    .setLabel('Fechar Ticket')
                    .setEmoji('🔒')
                    .setStyle(ButtonStyle.Danger)
            );
        
        // Enviar mensagem no ticket
        await ticketChannel.send({
            content: `${user} | <@&${supportRoleId}>`,
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
            ephemeral: true
        });
    }
    
    // Criar embed de confirmação
    const confirmEmbed = new EmbedBuilder()
        .setColor(0xED4245)
        .setTitle('🔒 Fechando Ticket')
        .setDescription(
            `Ticket fechado por ${user}\n\n` +
            `Este canal será deletado em **5 segundos**...`
        )
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
