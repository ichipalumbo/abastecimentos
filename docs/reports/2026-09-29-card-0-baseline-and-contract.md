# Cartão 0 — baseline e contrato proposto (29/09/2026)

> **Status:** coleta concluída no mock; **contrato pendente de aprovação**. Não houve mudança de interface ou de `GAS/`. Este é o Cartão 0 da [auditoria mobile](./2026-09-29-mobile-ui-consistency-audit-and-plan.md), não a antiga Fase 0 de integridade.

## Método e limites

`main` integrada na PR #16 (`3a72940`); baseline nesta branch no commit `4eff8a7`. App estático, CSS próprio, mock Node 18+ em `http://localhost:5000/?mock=1` (`/__mock/health` respondeu `environment: mock`), navegador integrado. Perfil Luccas e outros nomes nas imagens são **fixtures sintéticas**, não capturas de produção. Cobertura: `default`, `empty`, `read-error`, `write-error`, `slow`; após uma criação fictícia, `POST /__mock/reset` restaurou a memória e `&reset=1` descartou caches do navegador. Nenhuma escrita foi enviada ao GAS.

Viewport solicitada 433×762 CSS px (o navegador às vezes informou 434×763 por arredondamento); casos adicionais 320×568, 375×667, 390×844 e paisagem 762×433. O DPR reportado pelo navegador foi ~1, **não** o 2,81 do aparelho principal. As dimensões abaixo são de `getBoundingClientRect` em pixels CSS, não do tamanho dos PNGs reamostrados pela ferramenta. Screenshots só representam o mock; não testei no carro, com sol, teclado físico móvel, safe area real, leitor de tela ou zoom do navegador. Escalar apenas a fonte raiz para 32px não substitui zoom/texto 200% real: a largura do documento continuou 434 CSS px, mas reflow completo segue **não verificado**.

### Capturas de estados sintéticos

| Superfície | Evidências versionadas |
| --- | --- |
| Seleção, Início e Análise | [Seleção](./assets/card-0-profile-433.png), [Início 433](./assets/card-0-home-433.png), [Início 320](./assets/card-0-home-320.png), [Análise](./assets/card-0-analysis-433.png) |
| Postos e formulário | [Lista de postos](./assets/card-0-postos-433.png), [registro 433](./assets/card-0-registration-433.png), [registro 320](./assets/card-0-registration-320.png), [edição de registro](./assets/card-0-edit-record-433.png), [novo posto](./assets/card-0-new-posto-433.png), [edição de posto](./assets/card-0-edit-posto-433.png), [adição inline](./assets/card-0-inline-posto-433.png) |
| Confirmações | [Exclusão de registro](./assets/card-0-confirm-record-433.png), [remoção de posto](./assets/card-0-confirm-posto-433.png); cancelar fechou o diálogo sem mutação |
| Vazios, loading e erros | [Histórico vazio](./assets/card-0-empty-home-433.png), [Análise vazia](./assets/card-0-empty-analysis-433.png), [Postos vazios](./assets/card-0-empty-postos-433.png), [Leitura falha](./assets/card-0-read-error-433.png), [Carregamento lento](./assets/card-0-slow-loading-433.png), [Escrita de posto falha](./assets/card-0-write-error-433.png) |

## Medidas e observações

| Estado / viewport CSS | Observado | Interpretação |
| --- | --- | --- |
| Início 320×568, 375×667, 390×844, 433×762, paisagem 762×433 | `scrollWidth = innerWidth` em cada caso; FAB 56×56; ações Editar/Excluir ~44px de altura; ordenação/Atualizar ~44px; abas ~59px de altura (safe area simulada 0). | Sem overflow horizontal nesses cenários; a captura a 320 mostra o FAB sobrepondo a linha de métricas do mês no limite da dobra, acessível ao rolar. Conferir foco/separação no aparelho. |
| Registro 320×568 | Folha 568px; região rolável dos campos 411px de altura, com 433px adicionais de conteúdo para rolar; botão Salvar 54px e rodapé fixo visíveis entre y≈502–556px. | CTA permanece acessível sem desaparecer na dobra; odômetro/posto exigem rolar. |
| Registro 433×762 | Folha ~760px; região de campos ~604px, com ~232px adicionais para rolar; Salvar ~54px, y≈694–748px. | Conferir sobreposição com teclado real antes de aprovar posição final de aviso. |
| Registro 375×667, 390×844 e paisagem 762×433 | Sem largura extra no documento; rolagem adicional da região de campos ~325px, ~148px e ~507px, respectivamente. | Paisagem exige mais rolagem; não houve validação de teclado móvel nem de nomes/valores excepcionalmente longos. |
| Toast de erro sobre o modal de posto, 433×762 | Toast y≈647–688px, botão Adicionar Posto y≈678–732px: **sobreposição ~10px**; `pointer-events: none`; `role="alert"`. | Não intercepta toque, mas a mensagem compete visualmente com o CTA. |
| Análise `empty` | `#summary-grid`, `#trend-chart` e `#monthly-list` permanecem com placeholder/loading vazio após a resposta. | Não há estado vazio explícito na Análise (o `renderAnalytics([])` tem texto de vazio, mas não é chamado pelo fluxo normal sem registros). |

## Três achados materiais, por impacto

1. **P1 — feedback temporário pode sumir e falha de escrita não orienta recuperação.** `showToast` cria timeout de 3200ms em toda chamada sem cancelar o anterior (`script.js`), independente de progresso/sucesso/erro. Teste isolado na UI: primeiro aviso em t=0, segundo em t≈2200ms; em t≈3400ms o segundo ainda estava no DOM, mas já sem `.show` (visível por ~1,2s, não 3,2s). No mock `write-error`, salvar registro manteve valores `20`, `110`, `52000`, reabilitou botão e mostrou apenas “Falha na conexão”; posto novo manteve nome e não foi incluído. Nenhum retry automático foi oferecido (correto para resposta incerta), mas o erro some e não diz para conferir histórico/postos antes de reenviar. **Menor correção futura (Cartão 1):** cancelar temporizador anterior, vincular progresso ao resultado, manter erro contextual até uma ação explícita e orientar verificação antes de repetir escrita cujo resultado é desconhecido.
2. **P1 — ausência de estado recuperável ao falhar leitura / lista vazia.** Em `read-error` sem cache, Início exibiu texto bruto da resposta e “Atualizar” ficou longe da mensagem; Postos preservou placeholder de carregamento sem erro; em `empty`, Análise reteve placeholder sem texto orientador, embora haja registros zero confirmados. Falha de postos com cache mostra somente toast. **Menor correção futura (Cartão 1):** estados distintos de vazio, carregando e falha; retry explícito apenas para leituras; mensagem contextual ao lado do componente, sem apresentar informação antiga como recém-carregada.
3. **P2 — ícones/texto não formam ainda uma gramática única de ação.** FAB SVG simétrico é identificado por `aria-label="Registrar abastecimento"`, mas vazio do histórico manda tocar em “Registrar” (texto inexistente no controle visual); vazio de postos usa “Clique”; mesmo verbo destrutivo alterna “Excluir” e “Remover”. Navegação usa emojis, ações glifos coloridos, Análise outros emojis e os rótulos secundários são pequenos em CSS (`summary-lbl` 0,65rem; `month-stat-lbl` 0,61rem). Na captura de 320px, FAB cobre parte das métricas do mês na dobra; rolar recupera o conteúdo. **Menor correção futura (Cartões 2–3):** piloto por superfície com texto e nome acessível preservados; unificar vocabulário e conferir tipografia/hierarquia no telefone real, sem trocar cores/ícones apenas por preferência.

**Pontos positivos a preservar:** histórico com data, posto, valor e litros legíveis; FAB separado da barra, 56px e alinhado; formulário mantém dados após falha; confirmação contextual de exclusão de registro/posto, foco controlado e cancelamento; escolha recente de combustível/posto exige toque explícito; selo de teste evita confundir mock com produção.

## Inventário e matriz

O [inventário rastreável](./2026-09-29-card-0-inventory.md) cobre controles visíveis, seus nomes acessíveis, mensagens e estados, inclusive conteúdo gerado por JS. “Ausente” significa estado não implementado, **não** uma medição omitida. Matriz de respostas:

| Operação | Loading / sucesso observado | Falha / vazio observado | Recuperação atual e risco |
| --- | --- | --- | --- |
| Carregar registros | `slow`: overlay ativo até chegar resposta (~1,4s por chamada), depois lista; `default`: registros fictícios | `read-error`: 503, texto bruto no histórico sem cache; com cache, toast de erro | Atualizar leitura é seguro; botão está no topo, não junto do erro. |
| Carregar postos | `default`: postos/chips; `empty`: instrução “Clique” | `read-error`: sem cache, placeholder de loading permanece; com cache, toast de erro | Sem ação contextual ou indicação de dado obsoleto. |
| Análise | `default`: quatro resumos, tendência e métricas por mês | `empty`: placeholders retidos; estado de falha sem dados também não é específico | Gasto/R$/L/km/L disponíveis mesmo sem séries; não existe erro/vazio útil. |
| Registro novo/edição | Botão “⏳ Salvando...” desabilitado; no mock `default`, novo registro retornou sucesso e apareceu no histórico; edição tem mesmo fluxo de `submitForm` | `write-error`: erro `alert` transitório, entrada intacta e botão reabilitado; validação nativa dispara toast global por campo inválido (no teste vazio o último aviso era “Confira KM total...” enquanto foco caiu em combustível) | Não repetir automaticamente; verificar o histórico antes de reenviar resposta de rede incerta. A edição não foi gravada neste levantamento. |
| Excluir registro; remover posto | Confirmação com objeto e Cancelar (testados); sucesso/falha inspecionados em `confirmDeleteRecord` / `confirmDeletePosto` e cobertos pela API mock em testes existentes | Falha de rede dá “Falha na conexão” no toast; progresso “Excluindo...” dura no máximo 3200ms mesmo se resposta atrasar | Confirmar é destrutivo; nunca automatizar retry. Confirmação executada somente para dados sintéticos em testes da API, não pelo navegador deste baseline. |
| Criar/editar posto (modal/inline) | “⏳ Salvando...” apenas no modal; sucesso “Posto adicionado/atualizado” (fluxo mock/API previamente testado) | `write-error` de posto novo: modal aberto, nome intacto, toast `alert`, botão ativo; adição inline não desabilita ação nem indica progresso | Conferir lista antes de repetir; distinguir operação inline do modal. |
| Ordenar/Atualizar, navegação, perfil | Ordenação e tabs funcionam; “Forçando atualização...” usa toast; troca de perfil mantém escolha explícita | Refresh pode disparar duas leituras e toasts sucessivos; falha não informa qual dado ainda é atual | Leitura pode ser repetida manualmente; timestamps não devem prometer sucesso onde falhou. |

Não foi possível obter evidência de teclado físico, leitor de tela, safe areas reais, quebra de nomes/valores extremos nem DPI 2,81 nesta execução. São pendências para o *finish gate* no aparelho; não declarar AA/WCAG com base nas medidas atuais.

## Contrato de interface **proposto — nenhuma decisão aprovada**

| Decisão | Recomendação baseada nas evidências | Alternativa / custo | Cartão |
| --- | --- | --- | --- |
| **I. Ícones** | Piloto de SVGs locais com mesmo traço/tamanho para navegação e ações; emoji fica como ilustração informativa, FAB existente permanece. Texto de ação/nome acessível não é removido. | Manter mistura delimitada por superfície preserva familiaridade e reduz mudanças, mas peso/alinhamento podem continuar variando por plataforma. | 2 |
| **II. Escrita incerta** | Erro persistente: “Não foi possível confirmar. Confira o histórico (ou a lista de postos) antes de tentar novamente.” Retry explícito somente de leitura; erro confirmado de validação aponta campo. | Botão de reenviar escrita agiliza mas pode duplicar dados se a resposta se perdeu após o servidor confirmar. Sem idempotência no GAS, **não recomendado**. | 1 |
| **III. Densidade** | Manter posto/data, valor e litros no primeiro olhar; preservar km/L, km rodados e R$/L acessíveis. Testar agrupar médias mensais em nível secundário sem remover métricas. | Manter tudo exposto favorece análise rápida, mas compete com registro e leitura externa; exigir prova em 433×762 antes de esconder qualquer número. | 3 |
| **IV. Avisos/cópia** | Sucesso curto após confirmação, progresso até resposta, erro persistente junto à ação, verbos estáveis: “Registrar abastecimento”, “Atualizar”, “Excluir registro”, “Remover posto”, “Tentar novamente” só para leitura. Medir toast com FAB/CTA/teclado antes de definir posição/duração. | Toast para todos os estados é menos código, mas pode sumir antes de ser lido e conflitar com modal. | 1/3 |

**Registro de decisões:** I pendente; II pendente; III pendente; IV pendente. Sem aprovação do usuário até agora; datas/responsável de aprovação a preencher após consulta, uma escolha por vez. Nenhuma proposta aqui autoriza implementação visual ou alterações em `GAS/`.

**Saída do Cartão 0:** baseline e inventário disponíveis; aceite do **contrato** bloqueado nas quatro decisões. Depois da aprovação, Cartões 1–3 podem começar em branches próprias a partir da `main` atualizada; Cartão 4 medirá aparelho real e regressão.
