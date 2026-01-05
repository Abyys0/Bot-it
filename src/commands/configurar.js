const { 
    SlashCommandBuilder, 
    EmbedBuilder, 
    PermissionFlagsBits,
    MessageFlags 
} = require('discord.js');
const { saveServerConfig, getServerConfig } = require('../utils/permissions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('configurar')
        .setDescription('Configura o bot para este servidor')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('suporte')
                .setDescription('Define o cargo de suporte do servidor')
                .addRoleOption(option =>
                    option
                        .setName('cargo')
                        .setDescription('Cargo que terá acesso aos comandos do bot')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('ver')
                .setDescription('Mostra as configurações atuais do servidor')
        ),
    
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        
        if (subcommand === 'suporte') {
            const cargo = interaction.options.getRole('cargo');
            
            saveServerConfig(interaction.guild.id, {
                supportRoleId: cargo.id,
                supportRoleName: cargo.name
            });
            
            const embed = new EmbedBuilder()
                .setColor(0x57F287)
                .setTitle('✅ Configuração Salva!')
                .setDescription(
                    `**Cargo de Suporte definido:**\n` +
                    `> ${cargo}\n\n` +
                    `Membros com este cargo poderão:\n` +
                    `• Usar comandos do bot\n` +
                    `• Assumir tickets\n` +
                    `• Acessar funções administrativas`
                )
                .setFooter({ text: `Configurado por ${interaction.user.tag}` })
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        }
        
        if (subcommand === 'ver') {
            const config = getServerConfig(interaction.guild.id);
            
            const embed = new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle('⚙️ Configurações do Servidor')
                .setDescription(
                    config 
                        ? `**Cargo de Suporte:** <@&${config.supportRoleId}> (\`${config.supportRoleName}\`)`
                        : `⚠️ Nenhuma configuração definida.\n\nUse \`/configurar suporte\` para definir o cargo de suporte.`
                )
                .setFooter({ text: interaction.guild.name })
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        }
    }
};
