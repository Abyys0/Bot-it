const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');
const { createQueuePanel } = require('../utils/panelTemplates');
const { loadSalas, saveSalas } = require('../utils/queueManager');

// Valores das apostas (do maior para o menor)
const VALORES = ['100.00', '50.00', '25.00', '10.00', '5.00', '2.00', '1.00', '0.50'];

// Modos de jogo
const MODOS = {
    '1x1': { nome: '1x1', jogadores: 2, icone: '⚔️' },
    '2x2': { nome: '2x2', jogadores: 2, icone: '🎮' },
    '3x3': { nome: '3x3', jogadores: 2, icone: '🏆' },
    '4x4': { nome: '4x4', jogadores: 2, icone: '👥' }
};

// Configuração das categorias e seus canais
const TIPOS_SALA = {
    'mobile': {
        nome: 'Mobile',
        emoji: '📱',
        categoria: 'MOBILE',
        canais: ['1x1-mobile', '2x2-mobile', '3x3-mobile', '4x4-mobile']
    },
    'emulador': {
        nome: 'Emulador',
        emoji: '💻',
        categoria: 'EMULADOR',
        canais: ['1x1-emulador', '2x2-emulador', '3x3-emulador', '4x4-emulador']
    },
    'misto': {
        nome: 'Misto',
        emoji: '🔀',
        categoria: 'MISTO',
        canais: ['2x2-misto', '3x3-misto', '4x4-misto'] // Misto não tem 1x1
    },
    'tatico': {
        nome: 'Tático',
        emoji: '🎯',
        categoria: 'TÁTICO',
        canais: ['1x1-tático', '2x2-tático', '3x3-tático', '4x4-tático']
    }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('criarsalas')
        .setDescription('Cria automaticamente todos os painéis de salas em uma categoria')
        .addRoleOption(option =>
            option.setName('cargo_suporte')
                .setDescription('Cargo que terá permissões de suporte')
                .setRequired(true)),
    
    async execute(interaction) {
        // Verificar permissões
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({
                content: '❌ Você precisa ser administrador para usar este comando!',
                ephemeral: true
            });
        }
        
        const cargoSuporte = interaction.options.getRole('cargo_suporte');
        
        // Criar menu de seleção
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId(`criarsalas_menu_${cargoSuporte.id}`)
            .setPlaceholder('📂 Escolha o tipo de sala para criar')
            .addOptions([
                {
                    label: 'Mobile',
                    description: 'Criar painéis em todos os canais de Mobile',
                    value: 'mobile',
                    emoji: '📱'
                },
                {
                    label: 'Emulador',
                    description: 'Criar painéis em todos os canais de Emulador',
                    value: 'emulador',
                    emoji: '💻'
                },
                {
                    label: 'Misto',
                    description: 'Criar painéis em todos os canais de Misto',
                    value: 'misto',
                    emoji: '🔀'
                },
                {
                    label: 'Tático',
                    description: 'Criar painéis em todos os canais de Tático',
                    value: 'tatico',
                    emoji: '🎯'
                }
            ]);
        
        const row = new ActionRowBuilder().addComponents(selectMenu);
        
        const embed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle('🎮 Criação Automática de Salas')
            .setDescription(
                '**Selecione o tipo de sala para criar os painéis:**\n\n' +
                '📱 **Mobile** - Canais: 1x1, 2x2, 3x3, 4x4\n' +
                '💻 **Emulador** - Canais: 1x1, 2x2, 3x3, 4x4\n' +
                '🔀 **Misto** - Canais: 2x2, 3x3, 4x4\n' +
                '🎯 **Tático** - Canais: 1x1, 2x2, 3x3, 4x4\n\n' +
                `🛡️ **Cargo de Suporte:** ${cargoSuporte}\n\n` +
                '⚠️ *Cada canal receberá 8 painéis (um para cada valor de aposta)*'
            )
            .setFooter({ text: 'Sistema de Salas • Bot-it' })
            .setTimestamp();
        
        await interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true
        });
    }
};

// Exportar a função de criação para uso no handler
module.exports.criarSalasPorTipo = async function(interaction, tipo, cargoSuporteId) {
    const guild = interaction.guild;
    const tipoConfig = TIPOS_SALA[tipo];
    
    if (!tipoConfig) {
        return { success: false, message: 'Tipo de sala inválido!' };
    }
    
    // Encontrar a categoria
    const categoria = guild.channels.cache.find(
        c => c.type === 4 && c.name.toUpperCase().includes(tipoConfig.categoria)
    );
    
    if (!categoria) {
        return { 
            success: false, 
            message: `Categoria "${tipoConfig.categoria}" não encontrada!` 
        };
    }
    
    const salas = loadSalas();
    let canaisCriados = 0;
    let paineisCriados = 0;
    const erros = [];
    
    // Para cada canal configurado
    for (const nomeCanal of tipoConfig.canais) {
        // Encontrar o canal
        const canal = guild.channels.cache.find(
            c => c.type === 0 && c.name === nomeCanal && c.parentId === categoria.id
        );
        
        if (!canal) {
            erros.push(`Canal #${nomeCanal} não encontrado`);
            continue;
        }
        
        // Extrair o modo do nome do canal (1x1, 2x2, etc)
        const modoMatch = nomeCanal.match(/(\d+x\d+)/);
        if (!modoMatch) {
            erros.push(`Não foi possível identificar o modo em #${nomeCanal}`);
            continue;
        }
        
        const modo = modoMatch[1];
        const modoInfo = MODOS[modo];
        
        if (!modoInfo) {
            erros.push(`Modo ${modo} não suportado`);
            continue;
        }
        
        // Criar painéis para cada valor
        for (const valor of VALORES) {
            try {
                const { embed, components } = createQueuePanel(modo, tipoConfig.nome, valor, modoInfo);
                
                const message = await canal.send({
                    embeds: [embed],
                    components: components
                });
                
                // Salvar informações do painel
                const painelId = `${modo}_${tipoConfig.nome}_${valor.replace('.', '')}`;
                salas.paineis[painelId] = {
                    modo: modo,
                    tipo: tipoConfig.nome,
                    valor: valor,
                    messageId: message.id,
                    channelId: canal.id,
                    guildId: guild.id,
                    cargoSuporteId: cargoSuporteId,
                    categoriaId: categoria.id
                };
                
                // Inicializar fila vazia
                salas.filas[painelId] = [];
                
                paineisCriados++;
                
                // Aguardar um pouco para evitar rate limit
                await new Promise(resolve => setTimeout(resolve, 500));
                
            } catch (error) {
                console.error(`Erro ao criar painel em #${nomeCanal}:`, error);
                erros.push(`Erro em #${nomeCanal} (${valor})`);
            }
        }
        
        canaisCriados++;
    }
    
    saveSalas(salas);
    
    return {
        success: true,
        canaisCriados,
        paineisCriados,
        erros,
        tipo: tipoConfig.nome,
        emoji: tipoConfig.emoji
    };
};

// Exportar configuração dos tipos
module.exports.TIPOS_SALA = TIPOS_SALA;
