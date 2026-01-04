const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../../config/pix.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config_pix')
        .setDescription('Configura a chave PIX para pagamentos')
        .addStringOption(option =>
            option
                .setName('chave')
                .setDescription('A chave PIX (CPF, CNPJ, E-mail, Telefone ou Chave Aleatória)')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('tipo')
                .setDescription('O tipo da chave PIX')
                .setRequired(true)
                .addChoices(
                    { name: 'CPF', value: 'cpf' },
                    { name: 'CNPJ', value: 'cnpj' },
                    { name: 'E-mail', value: 'email' },
                    { name: 'Telefone', value: 'telefone' },
                    { name: 'Chave Aleatória', value: 'aleatoria' }
                )
        )
        .addStringOption(option =>
            option
                .setName('nome')
                .setDescription('Nome do titular da conta')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('cidade')
                .setDescription('Cidade do titular')
                .setRequired(true)
        ),
    
    async execute(interaction) {
        const chave = interaction.options.getString('chave');
        const tipo = interaction.options.getString('tipo');
        const nome = interaction.options.getString('nome');
        const cidade = interaction.options.getString('cidade');
        
        // Garantir que a pasta config existe
        const configDir = path.dirname(configPath);
        if (!fs.existsSync(configDir)) {
            fs.mkdirSync(configDir, { recursive: true });
        }
        
        // Salvar configuração
        const pixConfig = {
            chave,
            tipo,
            nome,
            cidade,
            configuradoPor: interaction.user.tag,
            configuradoEm: new Date().toISOString()
        };
        
        fs.writeFileSync(configPath, JSON.stringify(pixConfig, null, 2));
        
        // Criar embed de confirmação
        const tipoFormatado = {
            cpf: 'CPF',
            cnpj: 'CNPJ',
            email: 'E-mail',
            telefone: 'Telefone',
            aleatoria: 'Chave Aleatória'
        };
        
        const embed = new EmbedBuilder()
            .setColor(0x57F287)
            .setTitle('✅ PIX Configurado com Sucesso!')
            .setDescription('A chave PIX foi configurada e está pronta para uso.')
            .addFields(
                { name: '🔑 Tipo', value: tipoFormatado[tipo], inline: true },
                { name: '📋 Chave', value: `\`${chave}\``, inline: true },
                { name: '👤 Titular', value: nome, inline: true },
                { name: '🏙️ Cidade', value: cidade, inline: true }
            )
            .setFooter({ text: `Configurado por ${interaction.user.tag}` })
            .setTimestamp();
        
        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};
