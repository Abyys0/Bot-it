# ❓ Perguntas Frequentes (FAQ)

## 🎮 Sobre o Sistema de Salas

### Como criar painéis de sala?

Use o comando:
```
/criarsala modo:1x1 canal:#nome-do-canal cargo_suporte:@Suporte
```

O bot criará automaticamente:
- Uma categoria para o modo escolhido
- 8 painéis (um para cada valor)
- Sistema de filas configurado

---

### Posso criar múltiplos modos no mesmo servidor?

**Sim!** Você pode criar quantos modos quiser:
```
/criarsala modo:1x1 canal:#1x1-mobile cargo_suporte:@Suporte
/criarsala modo:2x2 canal:#2x2-mobile cargo_suporte:@Suporte
/criarsala modo:3x3 canal:#3x3-misto cargo_suporte:@Suporte
```

Cada modo terá sua própria categoria e painéis independentes.

---

### O que acontece se eu usar `/criarsala` novamente no mesmo canal?

Os novos painéis serão criados e os antigos continuarão funcionando. Porém, é recomendado:
1. Deletar os painéis antigos manualmente
2. Ou usar um canal diferente

---

### Quantos jogadores são necessários para cada modo?

| Modo | Jogadores Necessários |
|------|-----------------------|
| 1x1  | 2                     |
| 2x2  | 4                     |
| 3x3  | 6                     |
| 4x4  | 8                     |

---

### Posso mudar minhas opções depois de entrar na fila?

**Não**. Você precisa:
1. Sair da fila
2. Selecionar novas opções
3. Entrar na fila novamente

---

### A fila fecha automaticamente?

**Sim!** Quando o número mínimo de jogadores é atingido:
- O bot cria um canal privado automaticamente
- Remove os jogadores da fila
- O painel fica disponível para novos jogadores

---

### Posso estar em múltiplas filas ao mesmo tempo?

**Não**. Você só pode estar em:
- Uma fila por vez, OU
- Uma partida ativa

Se tentar entrar em outra fila, receberá um erro.

---

## 🏆 Sobre Partidas

### O canal privado é deletado automaticamente?

**Não automaticamente**. O canal permanece após a partida finalizar. O suporte pode:
- Deletar manualmente se necessário
- Manter para histórico
- Usar o botão "Cancelar" que deleta após 10 segundos

---

### Todos precisam clicar em "Pronto"?

**Sim**. A partida só inicia oficialmente quando todos os jogadores clicarem em "✅ PRONTO".

Até lá, o status será "⏳ Aguardando confirmação".

---

### O que acontece se um jogador não clicar em "Pronto"?

O suporte pode:
1. Aguardar o jogador
2. Cancelar a partida usando o botão "❌ CANCELAR"
3. Entrar em contato com o jogador pelo canal

---

### Posso cancelar uma partida que já iniciei?

**Não**. Apenas o suporte pode cancelar partidas usando o botão "❌ CANCELAR PARTIDA".

---

## 🛡️ Para Equipe de Suporte

### Quais botões apenas o suporte pode usar?

- ❌ **Cancelar Partida**
- 💰 **Confirmar Pagamento**
- 🏆 **Definir Vencedor**

Jogadores que tentarem usar receberão:
```
❌ Apenas membros do suporte podem [ação]!
```

---

### Como defino o vencedor?

1. Clique em "🏆 DEFINIR VENCEDOR"
2. Selecione o jogador vencedor no menu dropdown
3. O bot atualizará automaticamente o painel
4. Uma mensagem de anúncio será enviada

---

### Posso mudar o vencedor depois de definir?

Atualmente **não**. Tome cuidado ao selecionar o vencedor correto.

Se houver erro, você pode:
1. Documentar no canal
2. Fazer a correção manualmente fora do sistema

---

### O que o botão "Confirmar Pagamento" faz?

Ele:
- Marca a partida como "💰 Aguardando pagamento"
- Atualiza o painel
- Envia uma mensagem de confirmação
- **NÃO processa pagamentos automaticamente** - é apenas um registro

---

### Como ver todas as partidas ativas?

Atualmente, você precisa:
- Navegar pelas categorias de modo
- Ver os canais criados (eles ficam dentro das categorias)

**Dica:** Canais de partida sempre começam com o emoji do modo:
- ⚔️1x1-r$5.00
- 🎮2x2-r$10.00
- etc.

---

## ⚙️ Configuração e Administração

### Onde ficam salvos os dados das filas?

No arquivo `config/salas.json` na raiz do projeto.

**⚠️ Importante:** Não edite este arquivo manualmente enquanto o bot estiver rodando!

---

### Posso mudar o cargo de suporte depois?

Você precisará recriar os painéis com o novo cargo. O cargo é definido no momento da criação com:
```
/criarsala ... cargo_suporte:@NovoCargoSuporte
```

---

### Quais permissões o bot precisa?

Para o sistema de salas funcionar, o bot precisa:
- ✅ Gerenciar Canais (criar canais e categorias)
- ✅ Gerenciar Permissões (configurar quem vê os canais)
- ✅ Enviar Mensagens
- ✅ Incorporar Links (embeds)
- ✅ Gerenciar Mensagens (editar painéis)
- ✅ Ler Histórico de Mensagens

---

### Posso personalizar os valores das apostas?

Atualmente não. Os valores fixos são:
- R$ 0,50, R$ 1,00, R$ 2,00, R$ 5,00
- R$ 10,00, R$ 20,00, R$ 50,00, R$ 100,00

Para valores personalizados, seria necessário modificar o código.

---

### Posso adicionar mais opções além de gelo e arma?

Sim, mas requer modificação no código. Veja os arquivos:
- `src/utils/panelTemplates.js` - Para adicionar menus
- `src/handlers/selectHandler.js` - Para processar seleções

---

## 🐛 Problemas Comuns

### "Você já está nesta fila!"

**Causa:** Você já entrou nesta fila.

**Solução:** 
- Clique em "❌ SAIR DA FILA" primeiro
- Ou aguarde a fila fechar

---

### "Selecione uma arma antes de entrar na fila!"

**Causa:** Você não selecionou uma arma.

**Solução:** 
- Use o menu dropdown "🔫 Escolha sua arma"
- Selecione "Full XM8" ou "UMP"
- Depois clique em "Entrar na Fila"

---

### "Selecione o tipo de gelo antes de entrar na fila!" (1x1)

**Causa:** Em salas 1x1, você precisa selecionar o gelo.

**Solução:** 
- Use o menu dropdown "🧊 Escolha o tipo de gelo"
- Selecione "Gelo Normal" ou "Gelo Infinito"

---

### "Você já está em uma partida ativa!"

**Causa:** Você está em uma partida que ainda não foi finalizada.

**Solução:** 
- Finalize sua partida atual primeiro
- Aguarde o suporte definir o vencedor
- Ou peça ao suporte para cancelar a partida antiga

---

### Os painéis não estão atualizando

**Causas possíveis:**
1. Bot offline
2. Problemas de permissão
3. Erro no Discord

**Soluções:**
1. Verifique se o bot está online
2. Recarregue a página do Discord (Ctrl+R)
3. Tente novamente em alguns segundos

---

### O bot não criou a categoria

**Causa:** Falta de permissões.

**Solução:**
1. Verifique se o bot tem permissão "Gerenciar Canais"
2. Verifique se o bot tem permissão na categoria pai
3. Tente mover o bot para o topo da lista de cargos

---

### Canal privado não foi criado após fila completar

**Causas possíveis:**
1. Erro de permissões
2. Limite de canais do servidor atingido
3. Bug temporário

**Soluções:**
1. Verifique os logs do bot
2. Teste novamente
3. Verifique permissões na categoria

---

### Não consigo ver o canal da partida

**Causa:** Você não está na partida ou não tem o cargo de suporte.

**Lembre-se:** Canais de partida são privados e visíveis apenas para:
- Jogadores da partida
- Membros com o cargo de suporte

---

## 📊 Estatísticas e Dados

### O bot salva histórico de partidas?

Parcialmente. O arquivo `config/salas.json` mantém:
- ✅ Partidas ativas
- ❌ Histórico completo (seria necessário implementar)

Para histórico completo, você precisaria:
1. Não deletar os canais de partida
2. Ou implementar sistema de logs

---

### Posso exportar dados das partidas?

Atualmente não há função de exportação automática. Você pode:
1. Copiar manualmente o arquivo `config/salas.json`
2. Manter os canais de partida como histórico
3. Implementar sistema de logs personalizado

---

## 🔧 Desenvolvimento e Customização

### Onde está o código fonte?

Estrutura principal:
```
src/
├── commands/criarsala.js      # Comando principal
├── utils/queueManager.js       # Lógica de filas
├── utils/matchManager.js       # Lógica de partidas
└── utils/panelTemplates.js     # Templates visuais
```

---

### Como adicionar novos modos?

Edite `src/utils/panelTemplates.js`:

```javascript
const MODOS = {
    '1x1': { nome: '1x1', jogadores: 2, icone: '⚔️' },
    '5x5': { nome: '5x5', jogadores: 10, icone: '⚡' }, // Novo!
};
```

E adicione a opção em `src/commands/criarsala.js`:

```javascript
.addChoices(
    { name: '⚔️ 1x1', value: '1x1' },
    { name: '⚡ 5x5', value: '5x5' }, // Novo!
)
```

---

### Como mudar as cores dos embeds?

Cores estão definidas em:
- `src/utils/panelTemplates.js` - Painéis de fila
- `src/utils/matchManager.js` - Painéis de partida

Exemplo:
```javascript
.setColor(0x5865F2) // Azul Discord
.setColor(0x00FF00) // Verde
.setColor(0xFF0000) // Vermelho
```

---

## 📞 Suporte

### Encontrei um bug, o que fazer?

1. Verifique os logs do bot no console
2. Verifique o arquivo `config/salas.json`
3. Tente reiniciar o bot
4. Reporte na seção de Issues do GitHub

---

### Como atualizar o bot?

```bash
git pull
npm install
npm start
```

**⚠️ Aviso:** Atualizações podem resetar configurações. Faça backup de:
- `.env`
- `config/salas.json`
- `config/pix.json`

---

### Posso hospedar em serviços gratuitos?

**Sim!** O bot funciona em:
- ✅ Render.com (Free Tier)
- ✅ Railway.app
- ✅ Heroku
- ✅ VPS própria

**Nota:** Certifique-se que o arquivo `config/salas.json` persista entre reinicializações!

---

## 💰 Sobre Pagamentos

### O bot processa pagamentos automaticamente?

**Não**. O sistema apenas:
- Mostra informações
- Permite suporte marcar como "pago"
- Registra vencedores

Você precisa processar pagamentos manualmente via PIX/outro método.

---

### Como integrar com gateway de pagamento?

Isso requer desenvolvimento customizado. Você precisaria:
1. Escolher um gateway (MercadoPago, PagSeguro, etc.)
2. Implementar API do gateway
3. Modificar o código do bot

Recomendamos contratar um desenvolvedor se não tiver experiência.

---

Tem mais perguntas? Abra um ticket de suporte! 🎫
