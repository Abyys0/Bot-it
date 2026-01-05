const fs = require('fs');
const path = require('path');

const salasPath = path.join(__dirname, '../../config/salas.json');

const MODOS = {
    '1x1': { nome: '1x1', jogadores: 2, icone: '⚔️' },
    '2x2': { nome: '2x2', jogadores: 2, icone: '🎮' },
    '3x3': { nome: '3x3', jogadores: 2, icone: '🏆' },
    '4x4': { nome: '4x4', jogadores: 2, icone: '👥' }
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

/**
 * Adiciona um jogador à fila
 */
function adicionarJogadorFila(painelId, userId, opcoes) {
    const salas = loadSalas();
    
    if (!salas.filas[painelId]) {
        salas.filas[painelId] = [];
    }
    
    // Verificar se jogador já está na fila
    const jaEstaFila = salas.filas[painelId].find(p => p.userId === userId);
    if (jaEstaFila) {
        return { success: false, message: 'Você já está nesta fila!' };
    }
    
    // Verificar se jogador está em outra partida
    for (const partidaId in salas.partidas) {
        const partida = salas.partidas[partidaId];
        if (partida.jogadores.some(j => j.userId === userId)) {
            return { success: false, message: 'Você já está em uma partida ativa!' };
        }
    }
    
    // Adicionar à fila
    salas.filas[painelId].push({
        userId: userId,
        opcoes: opcoes,
        timestamp: Date.now()
    });
    
    saveSalas(salas);
    
    const painel = salas.paineis[painelId];
    const modoInfo = MODOS[painel.modo];
    const filaAtual = salas.filas[painelId];
    
    return {
        success: true,
        message: `Você entrou na fila! (${filaAtual.length}/${modoInfo.jogadores})`,
        filaCompleta: filaAtual.length >= modoInfo.jogadores,
        fila: filaAtual,
        painel: painel
    };
}

/**
 * Remove um jogador da fila
 */
function removerJogadorFila(painelId, userId) {
    const salas = loadSalas();
    
    if (!salas.filas[painelId]) {
        return { success: false, message: 'Fila não encontrada!' };
    }
    
    const index = salas.filas[painelId].findIndex(p => p.userId === userId);
    
    if (index === -1) {
        return { success: false, message: 'Você não está nesta fila!' };
    }
    
    salas.filas[painelId].splice(index, 1);
    saveSalas(salas);
    
    return {
        success: true,
        message: 'Você saiu da fila!',
        fila: salas.filas[painelId]
    };
}

/**
 * Obtém informações da fila
 */
function obterInfoFila(painelId) {
    const salas = loadSalas();
    
    if (!salas.filas[painelId]) {
        return { jogadores: 0, fila: [] };
    }
    
    const painel = salas.paineis[painelId];
    const modoInfo = MODOS[painel.modo];
    
    return {
        jogadores: salas.filas[painelId].length,
        maxJogadores: modoInfo.jogadores,
        fila: salas.filas[painelId],
        painel: painel
    };
}

/**
 * Limpa a fila e retorna os jogadores que estavam nela
 */
function limparFila(painelId) {
    const salas = loadSalas();
    
    if (!salas.filas[painelId]) {
        return [];
    }
    
    const jogadores = [...salas.filas[painelId]];
    salas.filas[painelId] = [];
    saveSalas(salas);
    
    return jogadores;
}

/**
 * Verifica se um jogador está em alguma fila
 */
function jogadorEmFila(userId) {
    const salas = loadSalas();
    
    for (const painelId in salas.filas) {
        const fila = salas.filas[painelId];
        if (fila.some(p => p.userId === userId)) {
            return { emFila: true, painelId: painelId };
        }
    }
    
    return { emFila: false };
}

module.exports = {
    adicionarJogadorFila,
    removerJogadorFila,
    obterInfoFila,
    limparFila,
    jogadorEmFila,
    loadSalas,
    saveSalas
};
