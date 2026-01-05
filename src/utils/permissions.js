const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../../config/servers.json');

/**
 * Obtém a configuração de um servidor específico
 * @param {string} guildId - ID do servidor
 * @returns {object|null} - Configuração do servidor ou null
 */
function getServerConfig(guildId) {
    if (!fs.existsSync(configPath)) {
        return null;
    }
    
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    return config[guildId] || null;
}

/**
 * Salva a configuração de um servidor
 * @param {string} guildId - ID do servidor
 * @param {object} data - Dados a serem salvos
 */
function saveServerConfig(guildId, data) {
    let config = {};
    
    if (fs.existsSync(configPath)) {
        config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    }
    
    config[guildId] = { ...config[guildId], ...data };
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

/**
 * Verifica se o membro tem o cargo de suporte do servidor
 * @param {GuildMember} member - O membro do servidor
 * @returns {boolean} - true se tem o cargo, false se não tem
 */
function hasSuportRole(member) {
    // Primeiro, tenta buscar do config do servidor
    const serverConfig = getServerConfig(member.guild.id);
    
    if (serverConfig && serverConfig.supportRoleId) {
        return member.roles.cache.has(serverConfig.supportRoleId);
    }
    
    // Fallback para o .env (compatibilidade)
    const supportRoleId = process.env.SUPPORT_ROLE_ID;
    
    if (!supportRoleId) {
        // Se não tem cargo configurado, verifica se é admin
        return member.permissions.has('Administrator');
    }
    
    return member.roles.cache.has(supportRoleId);
}

module.exports = {
    hasSuportRole,
    getServerConfig,
    saveServerConfig
};
