/**
 * Verifica se o membro tem o cargo de suporte configurado no .env
 * @param {GuildMember} member - O membro do servidor
 * @returns {boolean} - true se tem o cargo, false se não tem
 */
function hasSuportRole(member) {
    const supportRoleId = process.env.SUPPORT_ROLE_ID;
    
    if (!supportRoleId) {
        console.error('⚠️ SUPPORT_ROLE_ID não está configurado no .env');
        return false;
    }
    
    return member.roles.cache.has(supportRoleId);
}

module.exports = {
    hasSuportRole
};
