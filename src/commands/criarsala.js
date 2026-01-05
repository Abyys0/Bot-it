const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const salasPath = path.join(__dirname, '../../config/salas.json');

const VALORES = ['100.00', '50.00', '20.00', '10.00', '5.00', '2.00', '1.00', '0.50'];
const MODOS = {
    '1x1': { nome: '1x1', jogadores: 2, icone: '⚔️' },
    '2x2': { nome: '2x2', jogadores: 4, icone: '🎮' },
    '3x3': { nome: '3x3', jogadores: 6, icone: '🏆' },
    '4x4': { nome: '4x4', jogadores: 8, icone: '👥' }
};

function loadSalas() {
    try {
        const data = fs.readFileSync(salasPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { paineis: {}, filas: {}, partidas: {} };
    }
}

function saveSalas(data) {
    fs.writeFileSync(salasPath, JSON.stringify(data, null, 2));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('criarsala')
        .setDescription('Cria painéis de salas de jogo em um canal')
        .addStringOption(option =>
            option.setName('modo')
                .setDescription('Modo de jogo (1x1, 2x2, 3x3, 4x4)')
                .setRequired(true)
                .addChoices(
                    { name: '⚔️ 1x1', value: '1x1' },
                    { name: '🎮 2x2', value: '2x2' },
                    { name: '🏆 3x3', value: '3x3' },
                    { name: '👥 4x4', value: '4x4' }
                ))
        .addChannelOption(option =>
            option.setName('canal')
                .setDescription('Canal onde os painéis serão enviados')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText))
        .addRoleOption(option =>
            option.setName('cargo_suporte')
                .setDescription('Cargo que terá permissões de suporte')
                .setRequired(true)),
    
    async execute(interaction) {
        const modo = interaction.options.getString('modo');
        const canal = interaction.options.getChannel('canal');
        const cargoSuporte = interaction.options.getRole('cargo_suporte');
        
        // Verificar permissões
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({
                content: '❌ Você precisa ser administrador para usar este comando!',
                ephemeral: true
            });
        }
        
        await interaction.deferReply({ ephemeral: true });
        
        try {
            const modoInfo = MODOS[modo];
            const { createQueuePanel } = require('../utils/panelTemplates');
            const salas = loadSalas();
            
            // Usar a categoria atual do canal (se houver) para criar partidas depois
            const categoriaId = canal.parentId;
            
            // Enviar painéis para cada valor
            for (const valor of VALORES) {
                const { embed, components } = createQueuePanel(modo, valor, modoInfo);
                
                const message = await canal.send({
                    embeds: [embed],
                    components: components
                });
                
                // Salvar informações do painel
                const painelId = `${modo}_${valor.replace('.', '')}`;
                salas.paineis[painelId] = {
                    modo: modo,
                    valor: valor,
                    messageId: message.id,
                    channelId: canal.id,
                    guildId: interaction.guild.id,
                    cargoSuporteId: cargoSuporte.id,
                    categoriaId: categoriaId // Usar a categoria do canal atual
                };
                    valor: valor,
                    messageId: message.id,
                    channelId: canal.id,
                    guildId: interaction.guild.id,
                    cargoSuporteId: cargoSuporte.id,
                    categoriaId: categoria.id
                };
                
                // Inicializar fila vazia
                salas.filas[painelId] = [];
                
                // Aguardar um pouco entre mensagens para evitar rate limit
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            
            saveSalas(salas);
            
            const categoriaInfo = categoriaId 
                ? `📁 Partidas serão criadas na categoria atual` 
                : `⚠️ Canal sem categoria - partidas serão criadas sem categoria`;
            
            await interaction.editReply({
                content: `✅ Painéis de **${modoInfo.nome}** criados com sucesso em ${canal}!\n` +
                        `📊 Total de painéis criados: ${VALORES.length}\n` +
                        `🛡️ Cargo de suporte: ${cargoSuporte}\n` +
                        `${categoriaInfo}`
            });
            
        } catch (error) {
            console.error('Erro ao criar painéis:', error);
            await interaction.editReply({
                content: '❌ Ocorreu um erro ao criar os painéis. Verifique as permissões do bot!'
            });
        }
    }
};
