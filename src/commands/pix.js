const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../../config/pix.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pix')
        .setDescription('Envia a chave PIX configurada com QR Code'),
    
    async execute(interaction) {
        // Verificar se o PIX está configurado
        if (!fs.existsSync(configPath)) {
            return interaction.reply({
                content: '❌ O PIX ainda não foi configurado. Use `/config_pix` primeiro.',
                ephemeral: true
            });
        }
        
        const pixConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        
        await interaction.deferReply();
        
        try {
            // Gerar o payload do PIX (formato EMV)
            const pixPayload = generatePixPayload(pixConfig);
            
            // Gerar QR Code como buffer
            const qrCodeBuffer = await QRCode.toBuffer(pixPayload, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });
            
            // Criar attachment do QR Code
            const attachment = new AttachmentBuilder(qrCodeBuffer, { name: 'pix-qrcode.png' });
            
            // Tipo formatado
            const tipoFormatado = {
                cpf: 'CPF',
                cnpj: 'CNPJ',
                email: 'E-mail',
                telefone: 'Telefone',
                aleatoria: 'Chave Aleatória'
            };
            
            // Criar embed
            const embed = new EmbedBuilder()
                .setColor(0x00D4AA)
                .setTitle('💰 Pagamento via PIX')
                .setDescription(
                    '**Escaneie o QR Code abaixo ou copie a chave PIX para realizar o pagamento.**\n\n' +
                    '⚠️ Após o pagamento, envie o comprovante neste canal.'
                )
                .addFields(
                    { name: '🔑 Tipo da Chave', value: tipoFormatado[pixConfig.tipo], inline: true },
                    { name: '👤 Titular', value: pixConfig.nome, inline: true },
                    { name: '🏙️ Cidade', value: pixConfig.cidade, inline: true },
                    { name: '📋 Chave PIX', value: `\`\`\`${pixConfig.chave}\`\`\`` }
                )
                .setImage('attachment://pix-qrcode.png')
                .setFooter({ text: 'PIX - Pagamento instantâneo' })
                .setTimestamp();
            
            await interaction.editReply({
                embeds: [embed],
                files: [attachment]
            });
            
        } catch (error) {
            console.error('Erro ao gerar QR Code PIX:', error);
            await interaction.editReply({
                content: '❌ Ocorreu um erro ao gerar o QR Code do PIX.'
            });
        }
    }
};

/**
 * Gera o payload do PIX no formato EMV QR Code
 * Baseado no padrão do Banco Central do Brasil
 */
function generatePixPayload(config) {
    const { chave, nome, cidade } = config;
    
    // Função auxiliar para formatar campo EMV
    const formatEmv = (id, value) => {
        const length = value.length.toString().padStart(2, '0');
        return `${id}${length}${value}`;
    };
    
    // Merchant Account Information (PIX)
    const gui = formatEmv('00', 'br.gov.bcb.pix');
    const pixKey = formatEmv('01', chave);
    const merchantAccountInfo = formatEmv('26', gui + pixKey);
    
    // Payload completo
    let payload = '';
    payload += formatEmv('00', '01'); // Payload Format Indicator
    payload += merchantAccountInfo; // Merchant Account Information
    payload += formatEmv('52', '0000'); // Merchant Category Code
    payload += formatEmv('53', '986'); // Transaction Currency (BRL)
    payload += formatEmv('58', 'BR'); // Country Code
    payload += formatEmv('59', nome.substring(0, 25).toUpperCase()); // Merchant Name (max 25)
    payload += formatEmv('60', cidade.substring(0, 15).toUpperCase()); // Merchant City (max 15)
    payload += formatEmv('62', formatEmv('05', '***')); // Additional Data Field
    
    // CRC16 (checksum)
    payload += '6304';
    const crc = calculateCRC16(payload);
    payload += crc;
    
    return payload;
}

/**
 * Calcula o CRC16 para o payload PIX
 */
function calculateCRC16(payload) {
    const polynomial = 0x1021;
    let crc = 0xFFFF;
    
    for (let i = 0; i < payload.length; i++) {
        crc ^= (payload.charCodeAt(i) << 8);
        for (let j = 0; j < 8; j++) {
            if ((crc & 0x8000) !== 0) {
                crc = ((crc << 1) ^ polynomial) & 0xFFFF;
            } else {
                crc = (crc << 1) & 0xFFFF;
            }
        }
    }
    
    return crc.toString(16).toUpperCase().padStart(4, '0');
}
