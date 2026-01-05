# 📝 Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

---

## [2.0.0] - 2026-01-05

### ✨ Adicionado

#### Sistema Completo de Salas de Jogo
- **Comando `/criarsala`**: Cria painéis de salas de jogo para diferentes modos
  - Suporte para modos: 1x1, 2x2, 3x3, 4x4
  - 8 valores pré-configurados (R$ 0,50 até R$ 100,00)
  - Criação automática de categorias por modo
  
- **Sistema de Filas Inteligente**
  - Filas independentes por modo e valor
  - Contadores em tempo real
  - Atualização automática dos painéis
  - Validações de jogador único por fila/partida
  
- **Painéis Interativos de Fila**
  - Modo 1x1: Seleção de tipo de gelo (Normal/Infinito)
  - Todos os modos: Seleção de arma (Full XM8/UMP)
  - Botões de entrar/sair da fila
  - Exibição de jogadores na fila com suas opções
  
- **Sistema de Partidas**
  - Criação automática de canais privados
  - Permissões configuradas automaticamente
  - Painéis com informações completas da partida
  - Sistema de confirmação "Pronto" para jogadores
  - Status em tempo real da partida
  
- **Ferramentas de Gerenciamento para Suporte**
  - Botão de cancelar partida
  - Botão de confirmar pagamento
  - Seleção de vencedor com menu dropdown
  - Atualização automática de painéis
  
- **Novos Arquivos**
  - `src/commands/criarsala.js` - Comando principal
  - `src/utils/queueManager.js` - Gerenciamento de filas
  - `src/utils/matchManager.js` - Gerenciamento de partidas
  - `src/utils/panelTemplates.js` - Templates de embeds
  - `config/salas.json` - Armazenamento de dados
  
- **Documentação Completa**
  - `SISTEMA_SALAS.md` - Documentação técnica completa
  - `GUIA_RAPIDO.md` - Guia rápido para usuários
  - `EXEMPLOS_VISUAIS.md` - Exemplos visuais do sistema
  - `FAQ.md` - Perguntas frequentes
  - `CHANGELOG.md` - Este arquivo

### 🔄 Modificado

- **`src/handlers/buttonHandler.js`**
  - Adicionados handlers para botões de fila
  - Adicionados handlers para botões de partida
  - Sistema compartilhado de seleções de jogadores
  
- **`src/handlers/selectHandler.js`**
  - Adicionados handlers para seleção de gelo
  - Adicionados handlers para seleção de arma
  - Adicionados handlers para seleção de vencedor
  - Integração com sistema de filas
  
- **`README.md`**
  - Atualizado com informações do sistema de salas
  - Novos comandos documentados
  - Estrutura de arquivos atualizada
  - Links para documentações adicionais

### 🎨 Melhorias Visuais

- Embeds elegantes e organizadas
- Cores contextuais (azul/verde/amarelo/vermelho)
- Ícones e emojis para melhor UX
- Separadores visuais em ASCII art
- Timestamps e formatação de datas

### 🔒 Segurança

- Validação de permissões para ações de suporte
- Canais privados com permissões restritas
- Verificação de estado do jogador antes de ações
- Prevenção de múltiplas entradas em filas

---

## [1.0.0] - Data Anterior

### ✨ Funcionalidades Iniciais

- Sistema de tickets (compra e suporte)
- Comando `/painel` para painéis de suporte
- Sistema de configuração PIX (`/config_pix`)
- Exibição de chave PIX com QR Code (`/pix`)
- Sistema de permissões baseado em cargo
- Eventos de interação
- Handlers de botões e selects básicos

### 📁 Estrutura Inicial

- Comandos básicos
- Sistema de eventos
- Handlers de interação
- Utilitários de permissão
- Configurações em JSON

---

## Tipos de Mudanças

- ✨ **Adicionado**: Novas funcionalidades
- 🔄 **Modificado**: Mudanças em funcionalidades existentes
- 🐛 **Corrigido**: Correções de bugs
- ❌ **Removido**: Funcionalidades removidas
- 🔒 **Segurança**: Melhorias de segurança
- 📚 **Documentação**: Mudanças na documentação
- 🎨 **Estilo**: Mudanças que não afetam funcionalidade
- ⚡ **Performance**: Melhorias de performance
- 🧪 **Testes**: Adição ou modificação de testes

---

## Versionamento

Este projeto segue [Semantic Versioning](https://semver.org/):
- **MAJOR** (X.0.0): Mudanças incompatíveis na API
- **MINOR** (0.X.0): Novas funcionalidades compatíveis
- **PATCH** (0.0.X): Correções de bugs compatíveis

---

## Próximas Versões (Roadmap)

### [2.1.0] - Planejado
- [ ] Sistema de histórico de partidas
- [ ] Exportação de dados em CSV/JSON
- [ ] Estatísticas de jogadores
- [ ] Rankings por modo

### [2.2.0] - Planejado
- [ ] Integração com APIs de pagamento
- [ ] Notificações automáticas
- [ ] Sistema de replay/revisão
- [ ] Suporte a torneios

### [3.0.0] - Futuro
- [ ] Dashboard web
- [ ] API REST
- [ ] Sistema de economia/pontos
- [ ] Achievements e badges

---

**Nota:** Datas em formato ISO 8601 (YYYY-MM-DD)
