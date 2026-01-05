# 🎨 Exemplos Visuais do Sistema

## 📺 Fluxo Completo

### 1️⃣ Criando os Painéis

**Admin usa o comando:**
```
/criarsala modo:1x1 canal:#1x1-mobile cargo_suporte:@Suporte
```

**Resultado:**
```
✅ Painéis de 1x1 criados com sucesso em #1x1-mobile!
📊 Total de painéis criados: 8
🛡️ Cargo de suporte: @Suporte
📁 Categoria: 🎮 1X1
```

---

### 2️⃣ Painel de Fila (Exemplo: 1x1 - R$ 5,00)

```
╔═══════════════════════════════════════╗
║  ⚔️ 1X1 - R$ 5.00                    ║
╚═══════════════════════════════════════╝

**╔═══════ INFORMAÇÕES ═══════╗**

**💰 Valor:** R$ 5.00
**🎮 Modo:** 1x1
**👥 Jogadores:** 0/2

**╠═══════ FILA ═══════╣**
*Nenhum jogador na fila*

**╚═══════════════════════╝**

⚠️ *Escolha suas opções e entre na fila!*

[Dropdown: 🧊 Escolha o tipo de gelo]
  ❄️ Gelo Normal
  ♾️ Gelo Infinito

[Dropdown: 🔫 Escolha sua arma]
  🔫 Full XM8
  🔫 UMP

[✅ ENTRAR NA FILA] [❌ SAIR DA FILA]
```

---

### 3️⃣ Painel com Jogadores na Fila

```
╔═══════════════════════════════════════╗
║  ⚔️ 1X1 - R$ 5.00                    ║
╚═══════════════════════════════════════╝

**╔═══════ INFORMAÇÕES ═══════╗**

**💰 Valor:** R$ 5.00
**🎮 Modo:** 1x1
**👥 Jogadores:** 2/2  ✅ COMPLETO

**╠═══════ FILA ═══════╣**

**1.** @Jogador1
   └ 🔫 Full XM8 • 🧊 Gelo Infinito

**2.** @Jogador2
   └ 🔫 UMP • 🧊 Gelo Normal

**╚═══════════════════════╝**

🎮 *Iniciando partida...*
```

---

### 4️⃣ Notificação de Partida Criada

```
🎮 Partida iniciada! @Jogador1 @Jogador2 - #⚔️1x1-r$5.00
```

---

### 5️⃣ Canal Privado da Partida

**Nome do Canal:** `⚔️1x1-r$5.00`

**Mensagem Inicial:**
```
@Jogador1 @Jogador2 | @Suporte

╔═══════════════════════════════════════╗
║  ⚔️ Partida 1X1 - R$ 5.00            ║
╚═══════════════════════════════════════╝

**╔═══════ INFORMAÇÕES DA PARTIDA ═══════╗**

**💰 Valor da Aposta:** R$ 5.00
**🎮 Modo:** 1x1
**👥 Jogadores:** 2/2

**╠═══════ JOGADORES ═══════╣**

**1.** @Jogador1 ⏳
   └ 🧊 Gelo Infinito
   └ 🔫 Full XM8

**2.** @Jogador2 ⏳
   └ 🧊 Gelo Normal
   └ 🔫 UMP

**╠═══════ STATUS ═══════╣**
📊 **Status:** ⏳ Aguardando confirmação
⏰ **Criado:** há alguns segundos

**╚═══════════════════════════════╝**

⚠️ *Todos devem clicar em "PRONTO" para iniciar!*

[✅ PRONTO] [❌ CANCELAR PARTIDA]

[💰 CONFIRMAR PAGAMENTO] [🏆 DEFINIR VENCEDOR]
```

---

### 6️⃣ Quando Todos Estão Prontos

```
╔═══════════════════════════════════════╗
║  ⚔️ Partida 1X1 - R$ 5.00            ║
╚═══════════════════════════════════════╝

**╔═══════ INFORMAÇÕES DA PARTIDA ═══════╗**

**💰 Valor da Aposta:** R$ 5.00
**🎮 Modo:** 1x1
**👥 Jogadores:** 2/2

**╠═══════ JOGADORES ═══════╣**

**1.** @Jogador1 ✅
   └ 🧊 Gelo Infinito
   └ 🔫 Full XM8

**2.** @Jogador2 ✅
   └ 🧊 Gelo Normal
   └ 🔫 UMP

**╠═══════ STATUS ═══════╣**
📊 **Status:** 🎮 Em andamento
⏰ **Criado:** há 2 minutos

**╚═══════════════════════════════╝**

---

🎮 **TODOS PRONTOS! A PARTIDA COMEÇOU!**

📋 *Aguardando confirmação de pagamento pela equipe de suporte...*
```

---

### 7️⃣ Suporte Confirma Pagamento

```
💰 **PAGAMENTO CONFIRMADO**

Confirmado por: @Staff_Member
Horário: há alguns segundos

✅ *A partida pode prosseguir!*
```

---

### 8️⃣ Suporte Define Vencedor

**Suporte clica em "🏆 DEFINIR VENCEDOR"**

```
🏆 Selecione o vencedor da partida:

[Dropdown]
  🏆 Jogador 1 (User ID: 123456...)
  🏆 Jogador 2 (User ID: 789012...)
```

**Após seleção:**

```
🏆 **VENCEDOR DA PARTIDA**

👑 @Jogador1 venceu a partida!
📊 Definido por: @Staff_Member
⏰ Horário: há alguns segundos

✅ *Partida finalizada com sucesso!*
```

---

### 9️⃣ Painel Atualizado com Vencedor

```
╔═══════════════════════════════════════╗
║  ⚔️ Partida 1X1 - R$ 5.00            ║
╚═══════════════════════════════════════╝

**╔═══════ INFORMAÇÕES DA PARTIDA ═══════╗**

**💰 Valor da Aposta:** R$ 5.00
**🎮 Modo:** 1x1
**👥 Jogadores:** 2/2

**╠═══════ JOGADORES ═══════╣**

**1.** @Jogador1 ✅ 🏆
   └ 🧊 Gelo Infinito
   └ 🔫 Full XM8

**2.** @Jogador2 ✅
   └ 🧊 Gelo Normal
   └ 🔫 UMP

**╠═══════ STATUS ═══════╣**
📊 **Status:** ✅ Finalizada
⏰ **Criado:** há 15 minutos

🏆 **Vencedor:** @Jogador1

**╚═══════════════════════════════╝**
```

---

## 🔄 Fluxo de Cancelamento

### Se o Suporte Cancelar

```
❌ **PARTIDA CANCELADA**

Cancelado por: @Staff_Member
Motivo: Cancelamento manual pelo suporte

*Este canal será deletado em 10 segundos...*
```

---

## 📊 Exemplo de Múltiplos Painéis

Quando você usa `/criarsala modo:1x1`, o bot cria 8 painéis:

```
Canal: #1x1-mobile

[Painel 1] ⚔️ 1X1 - R$ 0.50
[Painel 2] ⚔️ 1X1 - R$ 1.00
[Painel 3] ⚔️ 1X1 - R$ 2.00
[Painel 4] ⚔️ 1X1 - R$ 5.00
[Painel 5] ⚔️ 1X1 - R$ 10.00
[Painel 6] ⚔️ 1X1 - R$ 20.00
[Painel 7] ⚔️ 1X1 - R$ 50.00
[Painel 8] ⚔️ 1X1 - R$ 100.00
```

Cada um com suas próprias filas independentes!

---

## 🏗️ Estrutura de Categorias Criadas

Quando você cria painéis para diferentes modos:

```
Discord Server
├── 🎮 1X1
│   ├── #1x1-mobile
│   ├── #⚔️1x1-r$5.00 (partida ativa)
│   └── #⚔️1x1-r$10.00 (partida ativa)
│
├── 🎮 2X2
│   ├── #2x2-emulador
│   └── #🎮2x2-r$20.00 (partida ativa)
│
├── 🎮 3X3
│   └── #3x3-misto
│
└── 🎮 4X4
    └── #4x4-tatico
```

---

## 💡 Dicas Visuais

### Cores dos Painéis
- **🔵 Azul** - Fila normal (aguardando jogadores)
- **🟢 Verde** - Fila completa (iniciando partida)
- **🟡 Amarelo** - Partida em andamento
- **🔵 Azul escuro** - Partida finalizada

### Ícones de Status
- ⏳ = Aguardando
- ✅ = Pronto/Confirmado
- 🏆 = Vencedor
- ❌ = Cancelado
- 💰 = Pagamento
- 🎮 = Em jogo

---

✨ **Sistema totalmente visual e intuitivo!**
