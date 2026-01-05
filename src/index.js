require('dotenv').config();
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const http = require('http');

// Servidor HTTP para health check do Render
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot Discord está online! 🤖');
}).listen(PORT, () => {
    console.log(`🌐 Servidor HTTP rodando na porta ${PORT}`);
});

// Criar cliente do Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ]
});

// Collection para armazenar comandos
client.commands = new Collection();

// Carregar comandos
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const commands = [];

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
        console.log(`✅ Comando carregado: ${command.data.name}`);
    } else {
        console.log(`⚠️ O comando em ${filePath} está faltando "data" ou "execute"`);
    }
}

// Carregar eventos
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
    console.log(`✅ Evento carregado: ${event.name}`);
}

// Registrar comandos slash
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('🔄 Registrando comandos slash...');
        
        if (process.env.GUILD_ID) {
            // Registrar comandos no SERVIDOR ESPECÍFICO (instantâneo)
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                { body: commands }
            );
            console.log('✅ Comandos slash registrados no servidor! (Disponível imediatamente)');
        } else {
            // Registrar comandos GLOBAIS (demora até 1 hora para propagar)
            await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID),
                { body: commands }
            );
            console.log('✅ Comandos slash registrados globalmente! (Pode levar até 1 hora para aparecer)');
        }
    } catch (error) {
        console.error('❌ Erro ao registrar comandos:', error);
    }
})();

// Login do bot
client.login(process.env.DISCORD_TOKEN);
