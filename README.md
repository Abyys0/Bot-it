# 🤖 Bot-it - Bot Discord de Suporte e Salas de Jogo

Bot para Discord com sistema completo de suporte, tickets, pagamentos via PIX e **gerenciamento de salas de jogo competitivas**.

## 📋 Funcionalidades

- **🎫 Sistema de Tickets**
  - Painel fixo com botões de Compra e Suporte
  - Tickets privados (visíveis apenas para quem abriu e equipe de suporte)
  - Tickets criados na mesma categoria do painel
  - Fechamento de ticket com deleção automática

- **🎮 Sistema de Salas de Jogo** ⭐ NOVO
  - Criação automática de painéis de fila por modo, tipo e valor
  - Suporte para modos: 1x1, 2x2, 3x3, 4x4
  - Suporte para tipos: Mobile, Emulador, Misto, Tático
  - Valores de R$ 100,00 até R$ 0,50
  - Opções personalizadas por modo:
    - 1x1: Seleção de Gelo (Normal/Infinito)
    - 2x2/3x3/4x4: Modo Normal ou Full XM8 & UMP
  - Filas automáticas com fechamento em 2 jogadores
  - Criação de canais privados para partidas
  - Sistema de confirmação "Pronto" para jogadores
  - Painéis de gerenciamento para suporte (pagamento, vencedor, cancelar)
  - **[📖 Ver documentação completa do sistema de salas](SISTEMA_SALAS.md)**
  - **[⚡ Ver guia rápido de uso](GUIA_RAPIDO.md)**

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

### Comandos de Suporte
| Comando | Descrição |
|---------|-----------|
| `/painel` | Envia o painel de suporte no canal atual |
| `/config_pix` | Configura a chave PIX para pagamentos |
| `/pix` | Envia a chave PIX configurada com QR Code |

### Comandos de Salas de Jogo ⭐
| Comando | Descrição |
|---------|-----------|
| `/criarsala` | Cria painéis de salas de jogo (1x1, 2x2, 3x3, 4x4) |

> ⚠️ **Nota:** Todos os comandos só podem ser usados por membros com o cargo de suporte configurado.

## 🎮 Como funciona o Sistema de Salas

1. **Criação dos Painéis**
   ```
   /criarsala modo:1x1 canal:#1x1-mobile cargo_suporte:@Suporte
   ```
   - Cria categoria automaticamente
   - Envia painéis para cada valor (R$0,50 até R$100,00)
   - Configura sistema de filas

2. **Jogadores Entram na Fila**
   - Selecionam tipo de gelo (apenas 1x1)
   - Selecionam arma (Full XM8 ou UMP)
   - Clicam em "Entrar na Fila"

3. **Partida Inicia Automaticamente**
   - Quando a fila completa (2+ jogadores)
   - Bot cria canal privado
   - Jogadores confirmam com botão "Pronto"

4. **Suporte Gerencia**
   - Confirma pagamento
   - Define vencedor
   - Pode cancelar se necessário

📖 **[Ver documentação completa](SISTEMA_SALAS.md)** | ⚡ **[Ver guia rápido](GUIA_RAPIDO.md)**

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
│   │   ├── pix.js
│   │   └── criarsala.js          ⭐ Novo
│   ├── events/
│   │   ├── ready.js
│   │   └── interactionCreate.js
│   ├── handlers/
│   │   ├── buttonHandler.js       (atualizado)
│   │   └── selectHandler.js       (atualizado)
│   ├── utils/
│   │   ├── permissions.js
│   │   ├── queueManager.js        ⭐ Novo
│   │   ├── matchManager.js        ⭐ Novo
│   │   └── panelTemplates.js      ⭐ Novo
│   └── index.js
├── config/
│   ├── pix.json
│   ├── servers.json
│   └── salas.json                 ⭐ Novo
├── .env
├── .env.example
├── .gitignore
├── package.json
├── README.md
├── SISTEMA_SALAS.md               ⭐ Novo
└── GUIA_RAPIDO.md                 ⭐ Novo
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