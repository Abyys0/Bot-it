const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log('═══════════════════════════════════════');
        console.log(`🤖 Bot ${client.user.tag} está online!`);
        console.log(`📊 Servidores: ${client.guilds.cache.size}`);
        console.log(`👥 Usuários: ${client.users.cache.size}`);
        console.log('═══════════════════════════════════════');
        
        // Definir status do bot
        client.user.setPresence({
            activities: [{ name: '📞 Suporte | /painel', type: 3 }],
            status: 'online'
        });
    }
};
