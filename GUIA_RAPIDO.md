# 🎮 Guia Rápido - Sistema de Salas

## 📝 Para Administradores

### Criar Painéis de Sala

Use o comando `/criarsala` com os seguintes parâmetros:

```
/criarsala modo:1x1 canal:#1x1-mobile cargo_suporte:@Suporte
```

**Parâmetros:**
- `modo`: Escolha entre 1x1, 2x2, 3x3 ou 4x4
- `canal`: Selecione o canal onde os painéis serão enviados
- `cargo_suporte`: Cargo que poderá gerenciar as partidas

**O que acontece:**
✅ Cria uma categoria automaticamente (ex: "🎮 1X1")
✅ Move o canal para dentro da categoria
✅ Envia 8 painéis (um para cada valor: R$0,50 até R$100,00)
✅ Configura o sistema de filas automaticamente

---

## 👥 Para Jogadores

### Como Entrar em uma Partida

1. **Escolha o valor** que deseja apostar (role pelos painéis)

2. **Selecione suas opções:**
   - 🧊 **Tipo de Gelo** (apenas em salas 1x1)
     - Gelo Normal ❄️
     - Gelo Infinito ♾️
   - 🔫 **Arma**
     - Full XM8
     - UMP

3. **Clique em "✅ ENTRAR NA FILA"**
   - Você verá seu nome aparecer no painel
   - O painel mostra quantos jogadores faltam

4. **Aguarde outros jogadores**
   - Quando a fila completar, a partida inicia automaticamente!

### Saindo da Fila

Se mudou de ideia, clique em **"❌ SAIR DA FILA"**

---

## 🎯 Durante a Partida

### Canal Privado

Quando a fila completa:
- 📢 Bot cria um canal privado
- 🔔 Você será mencionado
- 👁️ Apenas você, outros jogadores e suporte podem ver

### No Canal da Partida

1. **Leia as informações** exibidas no painel
   - Valor da aposta
   - Modo de jogo
   - Lista de jogadores
   - Opções de cada jogador

2. **Clique em "✅ PRONTO"** quando estiver pronto
   - Aguarde os outros jogadores
   - Quando todos clicarem, a partida inicia!

3. **Jogue a partida** 🎮

4. **Aguarde o suporte** definir o vencedor

---

## 🛡️ Para a Equipe de Suporte

### Botões Disponíveis

#### ❌ CANCELAR PARTIDA
- Cancela a partida
- Deleta o canal após 10 segundos
- Use em caso de problemas ou desistência

#### 💰 CONFIRMAR PAGAMENTO
- Marca que o pagamento foi verificado
- Libera a partida para continuar

#### 🏆 DEFINIR VENCEDOR
- Abre um menu de seleção
- Escolha o jogador que venceu
- Finaliza a partida automaticamente

### Fluxo de Trabalho Sugerido

1. **Monitore os canais privados** de partida
2. **Verifique os pagamentos** dos jogadores
3. **Clique em "💰 CONFIRMAR PAGAMENTO"** após verificação
4. **Acompanhe a partida**
5. **Defina o vencedor** usando o botão "🏆 DEFINIR VENCEDOR"
6. **Verifique o pagamento ao vencedor**

---

## 📊 Modos Disponíveis

| Modo | Jogadores | Ícone |
|------|-----------|-------|
| 1x1  | 2         | ⚔️    |
| 2x2  | 4         | 🎮    |
| 3x3  | 6         | 🏆    |
| 4x4  | 8         | 👥    |

## 💰 Valores Disponíveis

- R$ 0,50
- R$ 1,00
- R$ 2,00
- R$ 5,00
- R$ 10,00
- R$ 20,00
- R$ 50,00
- R$ 100,00

---

## ⚠️ Regras Importantes

### Para Jogadores:
- ✅ Selecione suas opções ANTES de entrar na fila
- ✅ Clique em "PRONTO" quando estiver realmente pronto
- ❌ Não entre em múltiplas filas ao mesmo tempo
- ❌ Não saia da fila após a partida iniciar

### Para Suporte:
- ✅ Verifique pagamentos antes de confirmar
- ✅ Defina o vencedor correto
- ✅ Use "Cancelar" apenas quando necessário
- ❌ Não abuse das permissões

---

## 💡 Dicas

### Para Jogadores:
- 🔍 **Escolha bem suas opções** - não dá para mudar depois!
- ⏱️ **Seja rápido** ao clicar em "Pronto" para não atrasar
- 💬 **Comunique-se** no chat do canal privado se houver problemas

### Para Administradores:
- 📌 **Fixe os painéis** importantes
- 📂 **Organize as categorias** por tipo de jogo
- 🔄 **Recrie painéis** se necessário usando `/criarsala` novamente

### Para Suporte:
- 📋 **Mantenha logs** das partidas importantes
- ⚡ **Seja ágil** nas confirmações
- 🤝 **Seja justo** ao definir vencedores

---

## 🆘 Problemas Comuns

### "Você já está nesta fila!"
→ Você já entrou nesta fila. Saia primeiro se quiser mudar.

### "Você já está em uma partida ativa!"
→ Termine sua partida atual antes de entrar em outra.

### "Selecione uma arma antes de entrar na fila!"
→ Use o menu dropdown para escolher sua arma.

### "Selecione o tipo de gelo antes de entrar na fila!" (1x1)
→ Use o menu dropdown para escolher o tipo de gelo.

### "Apenas membros do suporte podem..."
→ Este botão é exclusivo para a equipe de suporte.

---

## 📞 Precisa de Ajuda?

Abra um ticket de suporte usando o painel de atendimento!

✅ **Sistema pronto para uso!**
