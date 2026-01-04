# 🤖 Bot-it - Bot Discord de Suporte

Bot para Discord com sistema completo de suporte, tickets e pagamentos via PIX.

## 📋 Funcionalidades

- **🎫 Sistema de Tickets**
  - Painel fixo com botões de Compra e Suporte
  - Tickets privados (visíveis apenas para quem abriu e equipe de suporte)
  - Tickets criados na mesma categoria do painel
  - Fechamento de ticket com deleção automática

- **💰 Sistema PIX**
  - Configuração de chave PIX (CPF, CNPJ, E-mail, Telefone ou Chave Aleatória)
  - Geração automática de QR Code
  - Exibição formatada com informações do titular

- **🔒 Sistema de Permissões**
  - Todos os comandos restritos ao cargo de suporte
  - Configuração via arquivo `.env`

## 🚀 Instalação

### Pré-requisitos

- [Node.js](https://nodejs.org/) v16.9.0 ou superior
- [npm](https://www.npmjs.com/) (incluído com Node.js)
- Uma conta Discord e um bot criado no [Discord Developer Portal](https://discord.com/developers/applications)

### Passo a passo

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/Bot-it.git
   cd Bot-it
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o arquivo `.env`**
   ```bash
   cp .env.example .env
   ```
   
   Edite o arquivo `.env` com suas configurações:
   ```env
   DISCORD_TOKEN=seu_token_aqui
   SUPPORT_ROLE_ID=id_do_cargo_de_suporte
   GUILD_ID=id_do_servidor
   CLIENT_ID=id_do_client_do_bot
   ```

4. **Inicie o bot**
   ```bash
   npm start
   ```

   Para desenvolvimento (com hot reload):
   ```bash
   npm run dev
   ```

## ⚙️ Configuração do Bot no Discord

### Obter o Token do Bot

1. Acesse o [Discord Developer Portal](https://discord.com/developers/applications)
2. Crie uma nova aplicação ou selecione uma existente
3. Vá em "Bot" no menu lateral
4. Clique em "Reset Token" e copie o token gerado

### Obter IDs necessários

1. No Discord, vá em Configurações do Usuário > Avançado > Ativar "Modo Desenvolvedor"
2. **GUILD_ID**: Clique com botão direito no servidor > "Copiar ID do servidor"
3. **CLIENT_ID**: No Developer Portal, copie o "Application ID"
4. **SUPPORT_ROLE_ID**: No servidor, clique com botão direito no cargo de suporte > "Copiar ID"

### Permissões do Bot

Ao convidar o bot, certifique-se de dar as seguintes permissões:
- Gerenciar Canais
- Enviar Mensagens
- Incorporar Links
- Anexar Arquivos
- Ler Histórico de Mensagens
- Gerenciar Mensagens
- Usar Comandos de Aplicativos

Link de convite sugerido:
```
https://discord.com/api/oauth2/authorize?client_id=SEU_CLIENT_ID&permissions=805314614&scope=bot%20applications.commands
```

## 📝 Comandos

| Comando | Descrição |
|---------|-----------|
| `/painel` | Envia o painel de suporte no canal atual |
| `/config_pix` | Configura a chave PIX para pagamentos |
| `/pix` | Envia a chave PIX configurada com QR Code |

> ⚠️ **Nota:** Todos os comandos só podem ser usados por membros com o cargo de suporte configurado.

## 🎫 Como funciona o Sistema de Tickets

1. Use `/painel` em um canal dentro de uma categoria
2. O painel ficará fixo com botões de "Compra" e "Suporte"
3. Quando alguém clicar, um canal privado será criado na mesma categoria
4. Apenas o usuário que abriu e a equipe de suporte podem ver o ticket
5. Para fechar, clique no botão "Fechar Ticket" dentro do canal

## 💰 Como funciona o Sistema PIX

1. Configure o PIX com `/config_pix`
   - Informe o tipo da chave
   - Informe a chave PIX
   - Informe o nome do titular
   - Informe a cidade

2. Use `/pix` para exibir a chave configurada com QR Code

## 📁 Estrutura do Projeto

```
Bot-it/
├── src/
│   ├── commands/
│   │   ├── painel.js
│   │   ├── config_pix.js
│   │   └── pix.js
│   ├── events/
│   │   ├── ready.js
│   │   └── interactionCreate.js
│   ├── handlers/
│   │   └── buttonHandler.js
│   ├── utils/
│   │   └── permissions.js
│   └── index.js
├── config/
│   └── pix.json (gerado automaticamente)
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🛠️ Tecnologias Utilizadas

- [Discord.js](https://discord.js.org/) v14 - Biblioteca para interagir com a API do Discord
- [dotenv](https://www.npmjs.com/package/dotenv) - Gerenciamento de variáveis de ambiente
- [qrcode](https://www.npmjs.com/package/qrcode) - Geração de QR Codes

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

---

Feito com ❤️ para a comunidade Discord