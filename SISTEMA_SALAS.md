# 🎮 Sistema de Salas de Jogo - Bot Discord

## 📋 Visão Geral

Sistema completo de gerenciamento de salas de jogo com filas automáticas, painéis interativos e criação de canais privados para partidas.

## ✨ Funcionalidades

### 1️⃣ Comando /criarsala

Cria painéis de salas de jogo em um canal específico.

**Parâmetros:**
- `modo`: Tipo de sala (1x1, 2x2, 3x3, 4x4)
- `canal`: Canal onde os painéis serão enviados
- `cargo_suporte`: Cargo com permissões de suporte

**Comportamento:**
- Cria uma categoria automaticamente para o modo escolhido
- Envia painéis separados para cada valor (R$ 0,50 até R$ 100,00)
- Cada painel possui opções específicas do modo

### 2️⃣ Painéis de Fila

#### Modo 1x1 (Opções especiais)
- 🧊 **Tipo de Gelo:** Gelo Normal ou Gelo Infinito
- 🔫 **Arma:** Full XM8 ou UMP
- ✅ **Entrar na Fila**
- ❌ **Sair da Fila**

#### Outros Modos (2x2, 3x3, 4x4)
- 🔫 **Arma:** Full XM8 ou UMP
- ✅ **Entrar na Fila**
- ❌ **Sair da Fila**

### 3️⃣ Sistema de Filas

**Como funciona:**
1. Jogador seleciona suas opções (gelo e/ou arma)
2. Clica em "Entrar na Fila"
3. Painel atualiza mostrando jogadores na fila
4. Quando a fila completa (2 jogadores mínimo), a partida inicia automaticamente

**Requisitos para fechamento:**
- 1x1: 2 jogadores
- 2x2: 4 jogadores
- 3x3: 6 jogadores
- 4x4: 8 jogadores

### 4️⃣ Canal Privado da Partida

Quando a fila completa, o bot:
1. ✅ Cria um canal privado com nome: `⚔️1x1-r$5.00`
2. 🔒 Configura permissões (apenas jogadores e suporte podem ver)
3. 📊 Envia painel com informações completas da partida
4. 🔔 Menciona todos os jogadores
5. 🗑️ Remove jogadores da fila (mas painel permanece ativo)

#### Painel da Partida Inclui:
- 💰 Valor da aposta
- 🎮 Modo de jogo
- 👥 Lista de jogadores com suas opções
- ⏰ Horário de criação
- ✅ Status de "Pronto" de cada jogador

### 5️⃣ Botões do Canal Privado

#### Para Jogadores:
- **✅ PRONTO**: Confirma que está pronto para jogar
  - Quando todos clicam, partida inicia

#### Para Suporte (Apenas):
- **❌ CANCELAR PARTIDA**: Cancela a partida e deleta o canal
- **💰 CONFIRMAR PAGAMENTO**: Marca pagamento como confirmado
- **🏆 DEFINIR VENCEDOR**: Abre menu para selecionar o vencedor

### 6️⃣ Status da Partida

- ⏳ **Aguardando confirmação**: Jogadores clicando em "Pronto"
- 🎮 **Em andamento**: Todos prontos, partida iniciada
- 💰 **Aguardando pagamento**: Suporte confirmou pagamento
- ✅ **Finalizada**: Vencedor definido
- ❌ **Cancelada**: Partida cancelada pelo suporte

## 📁 Estrutura de Arquivos

```
config/
  └─ salas.json          # Armazena dados de painéis, filas e partidas

src/
  ├─ commands/
  │   └─ criarsala.js    # Comando para criar painéis
  │
  ├─ handlers/
  │   ├─ buttonHandler.js   # Gerencia botões (entrar/sair/pronto/cancelar)
  │   └─ selectHandler.js   # Gerencia menus (gelo/arma/vencedor)
  │
  └─ utils/
      ├─ queueManager.js     # Gerenciamento de filas
      ├─ matchManager.js     # Gerenciamento de partidas
      └─ panelTemplates.js   # Templates dos painéis
```

## 🚀 Como Usar

### Passo 1: Criar Painéis
```
/criarsala modo:1x1 canal:#1x1-mobile cargo_suporte:@Suporte
```

### Passo 2: Jogadores Entram na Fila
1. Selecionam tipo de gelo (apenas 1x1)
2. Selecionam arma
3. Clicam em "Entrar na Fila"

### Passo 3: Partida Inicia Automaticamente
- Quando o número de jogadores for atingido
- Canal privado é criado
- Jogadores recebem notificação

### Passo 4: Confirmação dos Jogadores
- Cada jogador clica em "PRONTO"
- Quando todos prontos, partida inicia oficialmente

### Passo 5: Suporte Gerencia
- Confirma pagamento
- Define vencedor ao final
- Pode cancelar se necessário

## ⚙️ Configuração

O sistema utiliza o arquivo `config/salas.json` para armazenar:

```json
{
  "paineis": {
    "1x1_050": {
      "modo": "1x1",
      "valor": "0.50",
      "messageId": "...",
      "channelId": "...",
      "guildId": "...",
      "cargoSuporteId": "...",
      "categoriaId": "..."
    }
  },
  "filas": {
    "1x1_050": [
      {
        "userId": "123...",
        "opcoes": {
          "gelo": "infinito",
          "arma": "Full XM8"
        },
        "timestamp": 1234567890
      }
    ]
  },
  "partidas": {
    "partida_123": {
      "id": "partida_123",
      "painelId": "1x1_050",
      "canalId": "...",
      "modo": "1x1",
      "valor": "0.50",
      "jogadores": [...],
      "status": "em_andamento",
      "vencedorId": null
    }
  }
}
```

## 🎨 Valores Disponíveis

Os painéis são criados automaticamente para os seguintes valores:
- R$ 0,50
- R$ 1,00
- R$ 2,00
- R$ 5,00
- R$ 10,00
- R$ 20,00
- R$ 50,00
- R$ 100,00

## 🔒 Permissões

### Cargo de Suporte tem acesso a:
- ❌ Cancelar partidas
- 💰 Confirmar pagamentos
- 🏆 Definir vencedores
- 👁️ Ver todos os canais privados de partida

### Jogadores podem:
- ✅ Entrar/Sair da fila
- ✅ Marcar como pronto
- 👁️ Ver apenas suas próprias partidas

## 📊 Fluxo Completo

```
1. Admin usa /criarsala
   ↓
2. Painéis criados no canal
   ↓
3. Jogadores selecionam opções
   ↓
4. Jogadores entram na fila
   ↓
5. Fila completa → Canal privado criado
   ↓
6. Jogadores clicam em "PRONTO"
   ↓
7. Partida inicia
   ↓
8. Suporte confirma pagamento
   ↓
9. Partida acontece
   ↓
10. Suporte define vencedor
    ↓
11. Partida finalizada ✅
```

## 🐛 Troubleshooting

### Painéis não aparecem
- Verifique permissões do bot no canal
- Certifique-se que o canal está em uma categoria

### Fila não fecha automaticamente
- Verifique se o número correto de jogadores entrou
- Confira os logs do console

### Canal privado não criado
- Verifique permissões do bot para criar canais
- Verifique se a categoria existe

## 💡 Dicas

- **Organize por categorias**: Cada modo tem sua própria categoria
- **Valores separados**: Cada valor tem seu próprio painel
- **Painéis fixos**: Use pins para fixar painéis importantes
- **Monitoramento**: Acompanhe o arquivo `config/salas.json` para debug

---

✅ Sistema implementado e pronto para uso!
