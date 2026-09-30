# Auditoria de coerência visual e feedback mobile — 29/09/2026

> **Status:** diagnóstico e plano para aprovação; nenhuma mudança de UI ou backend nesta rodada.
> **Base:** `main` em `8f9ec43` (Fases 0–3 integradas). Referência de estrutura: auditoria do outro app fornecida na raiz (`2026-09-23-diag-auditoria-ui-ux-mobile.md`), **não** suas decisões de produto, código ou métricas.

## Leitura em 30 segundos

O app tem um fluxo reconhecível de registro, tema escuro consistente, FAB vetorial alinhado, navegação de três abas, rótulos de métricas e confirmações de exclusão. As Fases 0–3 não precisam ser refeitas. Há três achados materiais para uma rodada **transversal**:

| ID | Prioridade | Achado observado | Etapa dona | Status |
| --- | --- | --- | --- | --- |
| A | P1 | Mensagens assíncronas somem sem recuperação persistente; texto de erro por vezes genérico ou cru | 1 — feedback e recuperação | Não iniciado |
| B | P2 | Mistura de emojis coloridos, glifos e SVG nas mesmas ações; hierarquia e nomenclatura variam | 2 — iconografia e linguagem | Não iniciado |
| C | P2 | Textos auxiliares pequenos e informação densa em espaços móveis; algumas instruções não correspondem ao controle atual | 3 — leitura e acabamento | Não iniciado |

**Ordem:** A antes de B/C, pois uma falha durante salvamento ou atualização afeta a confiança no dado; depois padronizar a linguagem visual; por fim ajustar densidade sem esconder dados úteis. Sem prazo estimado antes de testar no aparelho.

## Método, limites e o que preservar

- Inspeção de `index.html`, `styles.css`, `script.js` e relatórios das fases anteriores; avaliação visual **somente leitura** do perfil Luccas na página publicada em viewport nominal de 433×762 CSS px. No navegador a largura medida pode arredondar para 434 px. Não foi criado posto nem registro de teste: os achados abaixo não exigiram escrita.
- **Diferença de versão:** a página publicada observada ainda mostrava Análise sem a tendência da Fase 3 e o seletor de combustível sem “Selecione”. Logo, a versão online **não foi usada** para afirmar que a Fase 3 está correta/incorreta; os itens específicos da Fase 3 vêm do código em `main` e de inspeções locais anteriores. Revalidar em produção após a publicação/cache atualizar.
- O mock local `file://...?mock=1` não alcançou `localhost:5000/exec`; estados com registros sintéticos não equivalem a API real. Não simulei DPR 2,81, brilho externo, teclado do aparelho, safe areas reais ou leitor de tela físico.
- **Preservar:** paleta escura, FAB verde separado da barra, abas identificadas por ícone **e texto**, ações Editar/Excluir com confirmação contextual, foco e nomes acessíveis existentes, dados mantidos quando salvar falha, sugestões de combustível/posto **sem seleção automática**, e métricas da Análise com números e unidades. Não transformar o app em clone de outro produto.

## Referências de mercado e critérios verificáveis

| Referência pública | O que a fonte confirma | Aplicação proposta (inferência, não cópia de tela) |
| --- | --- | --- |
| [Fuelio — Google Play](https://play.google.com/store/apps/details?id=com.kajda.fuelio) | Registra quantidade abastecida e odômetro; histórico, custos, gráficos e cálculo de consumo com tanque cheio. | Valor, litros, km e contexto de parcial/consumo têm mais valor que decorar cada número com um emoji. Identificar métricas sem dados suficientes. |
| [Drivvo — Google Play](https://play.google.com/store/apps/details?id=br.com.ctncardoso.ctncar) | Registros de abastecimento/despesas e acompanhamento do veículo. | Tratar registro e consulta como tarefas distintas; não trazer visualização analítica para a folha de cadastro. |
| [Simply Auto — Google Play](https://play.google.com/store/apps/details?id=mrigapps.andriod.fuelcons) | Registros e visualizações de estatísticas/custos. | Priorizar consulta legível e unidades explícitas antes de introduzir mais indicadores. |
| [Material 3 — Snackbar](https://m3.material.io/components/snackbar/overview), [Android — snackbar](https://developer.android.com/develop/ui/compose/components/snackbar) | Padrão de feedback breve e não bloqueante com ação opcional. | Usar aviso transitório para confirmação simples; erro que exige ação fica recuperável em contexto. Não exigir um componente nativo ou copiar estilo Material. |
| [NN/g — correção de erros em formulários](https://www.nngroup.com/articles/errors-forms-design-guidelines/) | Erros devem ser perceptíveis, específicos e próximos ao campo/ação, com caminho de correção. | Informar qual campo/ação falhou e o que fazer; conservar entradas. |
| [W3C — status messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html), [contraste de texto](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [contraste não textual](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html), [tamanho de alvo](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) | Anúncios programáticos sem deslocar foco, contraste 4,5:1 (texto comum), 3:1 (texto grande/controles necessários); WCAG 2.2 AA define alvo mínimo de 24×24 CSS px ou exceções. | Manter meta de projeto **≥44×44 CSS px** para ações móveis; verificar contraste por par real de cores, foco e `role=status`/`alert`. 44 px é escolha de ergonomia, não limiar WCAG obrigatório. |

As páginas de lojas documentam funcionalidades; **não** foi feita comparação visual lado a lado de telas autenticadas, nem importação de assets. O relatório do outro app ensina rastreabilidade, matriz de estados e decisões explícitas — não impõe sua marca ou arquitetura a este.

## Achados e menor correção proposta

### A — Feedback assíncrono e recuperação (P1)

**Evidência:** [`showToast`](../../script.js) substitui o texto e arma `setTimeout(..., 3200)` a cada chamada sem cancelar o timer anterior. Se “Excluindo...” for seguido de sucesso ou erro, o timer antigo pode esconder a nova mensagem cedo; o estado de progresso também some sem necessariamente representar o fim da operação. [`toast`](../../styles.css) usa fonte de 0,83rem (~13,3 px), estreita o texto, fixa-se sobre o conteúdo e não oferece ação (`pointer-events: none`). O `role` alterna entre `status`/`alert`, ponto positivo. Falhas de conexão em cadastro/posto exibem apenas “Falha na conexão”; [`loadRecords`](../../script.js) injeta `err.message` cru no vazio e não oferece retry ali; falha no carregamento de postos sem cache não exibe orientação contextual. A tela tem “Atualizar”, mas não junto ao erro. Na página publicada, o estado de erro de carregamento foi observado em inspeção local quando o mock estava indisponível; **não** afirmar que houve falha de produção nessa sessão.

**Impacto:** confirmação de escrita ou falha pode passar despercebida, e o usuário não sabe se deve reenviar — risco de duplicar abastecimento. Conteúdo técnico não ajuda a recuperar uma conexão no posto.

**Correção mínima a validar:** definir estados `progresso`, `sucesso`, `erro recuperável` e `erro de campo`; progresso só termina ao receber resposta; sucesso breve após confirmação do servidor; erro com ação explícita “Tentar novamente” **somente** quando o retry é seguro/idempotente, senão orientar verificar o histórico antes de repetir; erro de campo ao lado do campo. Limitar comprimento e localização do aviso sem cobrir FAB, rodapé de Salvar ou teclado; cancelar timer anterior; manter dados e semântica de anúncio, sem inventar conclusão quando a rede falha. Planejar cópia dos erros do backend em `GAS/` antes de alterar servidor; a proposta atual é frontend apenas.

### B — Gramática de ícones e ações (P2)

**Evidência:** a barra usa ⛽/📊/🏪, o FAB usa SVG; o histórico combina ✏️/🗑️ com texto; cartões de Análise têm 💸/💧/⚡/🏷️, e a mesma cor âmbar serve para “Parcial” e preço/L em [`renderList`](../../script.js). O diálogo de exclusão de posto usa 🏪, enquanto o de registro usa 🗑️. Emojis de plataforma têm cor, proporção e peso próprios; isso é uma inconsistência **observável**, não prova de que todo emoji seja defeito. O “+” do FAB já foi corrigido após feedback do usuário: não regredir esse resultado.

**Impacto:** o peso visual das marcas muda de tela para tela; significado de cor/ícone precisa ser reaprendido. Ações “editar/excluir” ainda são compreensíveis pelo texto — não substituí-las por pictogramas mudos.

**Correção mínima a validar:** inventariar todas as instâncias por **função** (navegação, ação, dado, estado, decoração); escolher um vocabulário de ícones vetoriais coerentes para **ações e navegação**, com grade, espessura, alinhamento e tamanhos documentados. Preservar texto nas abas e botões; deixar emojis somente como ilustração deliberada ou substituí-los progressivamente, nunca trocar todos de uma vez. Definir cor por função (azul navegação/ação, verde sucesso/eficiência, vermelho exclusão/erro, âmbar aviso), e nunca depender só da cor. Não importar um pacote por padrão; primeiro comparar SVG local/licença/tamanho e consistência. Validar em Android/iOS e DPR 2,81, além de fallback de fonte/emoji.

### C — Leitura rápida e microcopy (P2)

**Evidência:** [`.section-title`](../../styles.css) usa 0,68rem (~10,9 px), [`.month-stat-lbl`](../../styles.css) 0,61rem (~9,8 px), [`.month-count`](../../styles.css) 0,66rem; [`.trend-row`](../../styles.css) 0,76rem (~12,2 px), e a própria Análise usa `summary-lbl` 0,65rem. São tamanhos de **código**, não medidas de legibilidade ao ar livre. No primeiro cartão real da página publicada em 433×762, cabeçalho de mês, quatro números, chips e duas ações competem em área pequena; a barra/FAB compartilha a faixa do próximo cartão (rolagem permite acessá-lo). O vazio de histórico ainda diz “Toque em **Registrar**”, enquanto o controle atual mostra só “+” e tem nome acessível “Registrar abastecimento”; vazio de postos diz “**Clique**” num app mobile. Mensagens alternam “Excluir”/“Remover”, “Atualizar”/“Forçando atualização”, “Falha na conexão”/erro técnico.

**Impacto:** custos, litros, datas, unidade e próximo passo ficam mais lentos de localizar em movimento; instruções diferentes para a mesma ação quebram confiança mesmo quando o fluxo funciona.

**Correção mínima a validar:** criar inventário texto→superfície→ação→estado; definir rótulos únicos (“Registrar abastecimento”, “Atualizar”, “Excluir posto”, “Tentar novamente”), frases em português simples e unidades sempre perto dos valores. Priorizar posto/data, valor e litros na primeira leitura; mover médias do cabeçalho mensal para segundo nível se teste de uso justificar, sem esconder resultado nem alterar cálculo. Tornar texto secundário essencial legível sob brilho alto, revalidando contraste, reflow a 200% e quebra de nomes/valores longos. Trocar instruções de vazios para apontarem ao FAB identificável, sem depender só do símbolo “+”.

## Plano de execução — cartões incrementais

| Cartão | Entrega | Arquivos prováveis | Aceite binário |
| --- | --- | --- | --- |
| 0. Contrato e baseline | Capturas/medidas de Home, Análise, Postos, registro e diálogos; planilha simples de inventário de ícones, textos e estados; decidir linguagem visual e política de erros **antes** de editar | Este relatório, `index.html`, `script.js`, `styles.css` | Inventário cobre ações visíveis e mensagens de sucesso/erro/loading/vazio; nenhuma decisão de produto é inferida |
| 1. Feedback confiável | Timer e anúncios coerentes; erro persistente/contextual com caminho de recuperação seguro; cópia para falha de rede e carregamento sem cache | `script.js`, `index.html`, `styles.css`, testes existentes | Erro de escrita não vira sucesso; texto não some cedo por timer anterior; retry não duplica registro; falha sem cache tem ação; toast não cobre ações ou captura toque indevido |
| 2. Iconografia e estados | Piloto de ícones em **uma** superfície (barra + ações do histórico) e tokens de tamanho/traço/cor; só então expandir para análise/postos/formulário | `index.html`, `script.js`, `styles.css`, `icon.svg` apenas se necessário | Ações continuam com nome acessível/texto; peso/alinhamento coerentes em 320/433; nenhuma mensagem depende só de cor/emoji; FAB preservado |
| 3. Microcopy e densidade | Vocabulário único para botões, avisos, vazios e erros; tamanhos dos textos essenciais e agrupamento visual dos cartões sem novos indicadores | `index.html`, `script.js`, `styles.css`, testes existentes | “Registrar”/“+” e “Clique” não confundem; preço/L, litros, km, data e valor encontrados rapidamente; 200% de zoom sem corte |
| 4. Finish gate | Inspeção de estados, leitores de tela e aparelho; registrar antes/depois e decisões adotadas/recusadas em relatório datado | `docs/reports/` | Cenários e medições abaixo registrados; sem regressão dos testes de Fases 0–3 |

**Dependências:** 0 → 1/2/3 → 4; 2 e 3 podem ser agrupados por superfície, mas não lançar revisão visual global sem piloto. Se o trabalho virar fase nova, criar branch própria a partir da `main` atualizada; commits por cartão, sem abrir PR pelo assistente.

### Matriz mínima de validação

| Cenário | O que observar |
| --- | --- |
| 433×762, DPR 2,81 no aparelho principal | Brilho externo, polegar, percepção do ícone, toast, FAB, campo e CTA com teclado aberto |
| 320×568; 375×667; 390×844; paisagem | Nomes longos de posto, valores monetários grandes, mês com muitos registros, reflow/rolagem/áreas seguras |
| Registro vazio/preenchido/parcial; edição; exclusão cancelada/confirmada | Texto da ação, estado, ícone, retorno de foco e diferença entre falha e sucesso |
| Rede lenta/offline: carregar, salvar e excluir | Progresso até resposta, erro persistente, recuperação segura, dados mantidos, **sem repetir escrita incerta automaticamente** |
| Zoom/texto 200%; leitor de tela; `prefers-reduced-motion` | Contraste, nomes, ordem, anúncio sem duplicidade, movimento não essencial removido |
| Publicado após deploy/cache renovado | Conferir que a Fase 3 e a auditoria referem a mesma versão antes de declarar aceite |

Usar dados sintéticos para estados destrutivos. Se teste em produção se mostrar indispensável, criar posto identificável, registrar apenas dados de teste nele, anotar IDs e estado inicial, excluir **somente** esses IDs e conferir limpeza. Não testar exclusão de registros reais; nenhuma escrita foi realizada nesta auditoria.

## Decisões que exigem aprovação antes da implementação

1. **Ícones:** usar SVGs locais para navegação/ações e limitar emojis à ilustração, ou manter alguns emojis funcionais? O FAB aprovado fica como referência de alinhamento, não determina sozinho o estilo de toda a UI.
2. **Erros de escrita com resposta incerta:** apresentar “Verifique o histórico antes de tentar novamente” e não oferecer retry automático? Para leituras, retry pode ser imediato.
3. **Densidade:** quais dados do cabeçalho de mês e dos chips do histórico são indispensáveis na primeira vista? Não remover métricas só porque são pequenas.
4. **Avisos:** padronizar “Tentar novamente” e exibir erro persistente junto à superfície afetada, preservando confirmações breves? Duração exata e posição dependem de medição com teclado/FAB.

## Fora de escopo

Sem alteração de regras de consumo, dados/IDs, backend `GAS/`, autenticação, novas funcionalidades (lembretes, mapa, comprovante), cópia do design de Fuelio/Drivvo/Simply Auto/Prô Josy, substituição total do tema e inclusão automática de biblioteca de ícones. Este documento é um **plano de avaliação e execução**, não um laudo de conformidade WCAG nem validação concluída no dispositivo real.
