# Inventário de ações, ícones e estados — Cartão 0 (29/09/2026)

> Snapshot da `main` em `3a72940`; conferido contra o [baseline sintético](./2026-09-29-card-0-baseline-and-contract.md). **Contrato aprovado, ainda não implementado**: o inventário descreve o produto atual, não um patch pronto. `I` = ícone; `N` = nome acessível; “ausente” indica estado sem representação útil no fluxo normal. Variantes por registro/posto compartilham o mesmo controle, com contexto acrescentado ao nome acessível. Fonte: [`index.html`](../../index.html), [`script.js`](../../script.js), [`styles.css`](../../styles.css).

## Ações e elementos funcionais

| ID | Superfície → gatilho/estado | Texto atual; I | N/semântica atual | Origem e efeito/recuperação; aplicação futura |
| --- | --- | --- | --- | --- |
| U1 | Entrada → selecionar Luccas/Josy | Luccas IDEA / Josy LOGAN; carros SVG, logo ⛽ ilustrativo | Botões com nomes visíveis; imagens SVG dentro | `index.html` seleção; `script.js:selectUser`; manter identificação explícita, não usar emoji como único nome. |
| U2 | Home → Trocar usuário | “🔄 Trocar usuário”; emoji | Nome pelo texto, botão | `index.html`; `logout` mantém perfis separados; manter verbo explícito. |
| N1 | Barra → Início / Análise / Postos | “⛽ Início”, “📊 Análise”, “🏪 Postos”; emojis funcionais | `<nav aria-label="Navegação principal">`, botões, `aria-current` | `index.html`, `switchTab`; candidato a piloto de ícones com rótulos preservados. |
| N2 | Ação principal → abrir registro | Somente “+”; SVG vetorial | Botão “Registrar abastecimento” via `aria-label` | `index.html:192`, `openModal`; preservá-lo como referência, instruções visuais precisam identificá-lo. |
| H1 | Histórico → ordenar | “⬇️ Recente” / “⬆️ Antigo”; emoji | Botão, texto e `title` de ordenação | `index.html`, `toggleSortOrder`; distinguir direção/resultado na cópia. |
| H2 | Histórico → recarregar | “🔄 Atualizar”; emoji | Botão, `title` | `index.html`, `refreshData`; leitura segura para retry, falta contexto da falha. |
| H3 | Cartão de registro → editar | “✏️ Editar”; glifo | `aria-label="Editar abastecimento: <posto>, <data>"` | `renderList`/`openEdit`; manter contexto e correspondência por ID. |
| H4 | Cartão de registro → excluir | “🗑️ Excluir”; glifo | `aria-label="Excluir abastecimento: <posto>, <data>"` | `renderList`/`askDelete`; preservar confirmação contextual, sem retry automático. |
| C1 | Confirmação de registro → Cancelar / Excluir | “Cancelar”, “Excluir”; 🗑️ ilustrativo | `role="alertdialog"`, título + descrição, foco devolvido | `index.html`, `confirmDeleteRecord`; cancelar não grava; distinguir falha incerta de sucesso. |
| A1 | Análise → Gasto / R$/L / km/L | Texto (sem ícone nos tabs); resumos com 💸 💧 ⚡ 🏷️ | `role="group"` e `aria-pressed` por botão | `index.html`, `renderTrend`; preserve unidade e botão selecionado; emojis informativos, não únicos. |
| P1 | Postos → + Novo Posto | “+ Novo Posto”; + tipográfico | Botão com texto | `index.html`, `openAddPosto`; ação secundária, rótulo explícito. |
| P2 | Card posto → Editar / Remover | “✏️” / “🗑️”; glifos | `aria-label="Editar posto <nome>"` / “Remover posto <nome>” | `renderAdminPostos`, `openEditPosto`, `askDeletePosto`; nome acessível contextual. |
| P3 | Formulário de posto → Nome / Salvar | “✅ Adicionar Posto”, “💾 Salvar Alterações”, “⏳ Salvando...” | Campo com `<label>`; botão desabilitado durante requisição | `index.html`, `savePostoModal`; distinguir confirmação do servidor de falha de rede. |
| P4 | Formulário de posto → Fechar | “✕” | `aria-label="Fechar posto"` | `index.html`, `closePostoModal`; restaura foco. |
| C2 | Confirmação posto → Cancelar / Remover | “Cancelar”, “Remover”; 🏪 ilustrativo | `role="alertdialog"`, título + descrição, foco devolvido | `index.html`, `confirmDeletePosto`; cópia difere de “Excluir” registro por objeto. |
| F1 | Registro → Fechar cadastro | “✕” | `aria-label="Fechar cadastro"` | `index.html`, `closeModal`; preserva controle de foco; fecha sem enviar. |
| F2 | Registro → data, combustível, parcial | “📅 Data e hora”, “⛽ Combustível”, “Abastecimento parcial?”, “Parcial” | Data e select com `<label>`, checkbox com label | `index.html`, `submitForm`; combustível obrigatório, toggle explícito, emojis nos labels não únicos. |
| F3 | Registro → reutilizar combustível | “Último: <combustível> · usar” (sem ícone) | Botão nomeado pelo texto | `renderRecentFuel`/`useRecentFuel`; exige toque, não pré-selecionar. |
| F4 | Registro → litros, valor, hodômetro | “💧 Litros”, “💰 Valor total R$”, “📍 KM total no painel” | Labels/inputs obrigatórios; `previous-km` tem `aria-live=polite` | `index.html`, `submitForm`; validações em toast global, não em campo. |
| F5 | Registro → prévia calculada | “Preço por litro”, “KM rodados”, “Consumo estimado” | Inputs somente leitura com labels | `index.html`, `calcKm`; informação secundária sem alterar fórmulas. |
| F6 | Registro → posto existente | Nome do posto; seleção visual | Botões `aria-pressed` (nome textual) | `renderPostoPicker`/`selectPosto`; opcional, não selecionar automaticamente. |
| F7 | Registro → sugestão/adição posto | “＋ Novo” / “＋ Adicionar Posto”, “✓”, “✕”; glifos | Novo tem texto; salvar/cancelar inline têm `aria-label` | `renderPostoPicker`, `saveInlineAddPosto`, `cancelInlineAddPosto`; adição inline não mostra progresso/desabilitação. |
| F8 | Registro → salvar novo/edição | “✅ Salvar Abastecimento” / “💾 Salvar Alterações” → “⏳ Salvando...” | Botão submit desabilitado durante chamada | `index.html`, `submitForm`; em falha conserva dados e botão reativa; evitar segunda escrita sem conferir histórico. |

## Conteúdo, estados e mensagens

| ID | Superfície/estado | Texto e I atuais | N/semântica, origem e recuperação; aplicação futura |
| --- | --- | --- | --- |
| S1 | Entrada/load inicial | “Abastecimentos”, “Carregando dados...”; ⛽ + spinner | `#splash`/`#loader-overlay` em `index.html`, `showLoader`/`checkLoadsDone`; progresso visual sem instrução adicional. |
| S2 | Histórico loading/default | “Carregando registros...”; spinner; resumo “Gasto no mês”, “Média km/L geral”, “R$/L médio geral” | `selectUser`, `renderStats`, `renderList`; informações com unidade, preço e médias sem esconder cálculos. |
| S3 | Histórico vazio | “Nenhum abastecimento ainda. Toque em Registrar para começar!”; ⛽ | `renderList`; “Registrar” não aparece visualmente no FAB. Propor instrução que o identifique. |
| S4 | Histórico leitura falha sem cache | “Erro ao carregar: <err.message>”; ❌ | `loadRecords`; HTML com mensagem bruta, sem ação contextual; retry leitura hoje só no topo. |
| S5 | Histórico leitura falha com cache | “❌ Erro ao atualizar registros” | `loadRecords`; toast `alert` temporário; dados antigos persistem. Distinguir obsoleto/erro. |
| S6 | Postos loading/default | Spinner; lista “🏪 <nome>” | `index.html`, `renderAdminPostos`; faltam data de atualização e progresso específico. |
| S7 | Postos vazio | “Nenhum posto cadastrado. Clique em + Novo Posto para adicionar.”; 🏪 | `renderAdminPostos`; trocar “Clique” por verbo adequado a toque/clique. |
| S8 | Postos leitura falha sem cache | Placeholder/spinner anterior, sem erro | `loadPostos`; **ausente** estado de falha e retry contextual. |
| S9 | Postos leitura falha com cache | “❌ Erro ao atualizar postos” | `loadPostos`; toast `alert` temporário; distinguir cache. |
| S10 | Análise default | Quatro resumos, evolução Gasto/R$/L/km/L, Por Mês; 💸 💧 ⚡ 🏷️ e ⚠️ parcial | `renderAnalytics`, `renderTrend`; rótulos `summary-lbl` 0,65rem, `month-stat-lbl` 0,61rem; validar leitura real e unidade. |
| S11 | Análise vazia/erro sem cache | Placeholders/spinners persistem em resumo/tendência; por mês vazio | `switchTab` só chama `renderAnalytics` quando há registros. Texto de vazio em `renderTrend`/`renderAnalytics` **inacessível** neste fluxo. |
| S12 | Salvar registro progresso/sucesso | “⏳ Salvando...” → “✅ Abastecimento salvo! <litros> L • <valor> • <km> km” / “💾 Alterações salvas!” | `submitForm`; toast `status` depois da resposta de sucesso, próximo refresh pode gerar outro estado; comprimento variável. |
| S13 | Excluir registro progresso/sucesso | “⏳ Excluindo...” → “🗑️ Registro excluído” | `confirmDeleteRecord`; toast `status`, progresso some por timer mesmo com requisição em curso. |
| S14 | Posto novo/editar/remover sucesso | “✅ Posto adicionado!”, “💾 Posto atualizado!”, “🗑️ Posto removido” | `savePostoModal`, `saveInlineAddPosto`, `confirmDeletePosto`; toast `status` após servidor; inline sem progresso. |
| S15 | Escrita confirmada como erro pelo servidor | “❌ <res.error>” | `submitForm`, postos, exclusões; toast `alert`, às vezes mensagem técnica; não confundir com erro de transporte. |
| S16 | Escrita com resposta incerta / conexão | “❌ Falha na conexão” | `withFailureHandler` em registro/postos/exclusões; toast `alert` por ~3,2s ou menos se timer anterior; **ausente** instrução para conferir lista antes de reenvio. |
| S17 | Validação em registro | “⚠️ Selecione o combustível”, “⚠️ Confira Litros/Valor total/KM total”, “⚠️ Confira <label obrigatório>”; toast global | `submitForm` + listener `invalid` em `script.js:40`; foco retorna ao campo inválido, mas múltiplos eventos podem sobrescrever a mensagem; **ausente** erro inline. |
| S18 | Validação de posto/identidade | “⚠️ Digite o nome do posto”, “❌ Registro indisponível / não encontrado ou duplicado. Atualize o histórico.” | `savePostoModal`, `saveInlineAddPosto`, `findRecordForAction`; toast e bloqueio sem fallback inseguro. |
| S19 | Atualização forçada | “🔄 Forçando atualização...”, eventualmente “Erro ao atualizar registros/postos” | `refreshData`; chamadas paralelas de leitura geram avisos concorrentes, sem resumo persistente do resultado. |
| S20 | Toast visual e acessível | Fundo por tipo, `role=status` para sucesso/progresso; `role=alert` para erro, `aria-live` coerente | `index.html:365`, `showToast`, `.toast` CSS; sem foco deslocado, `pointer-events:none`; timers não cancelados; aviso pode cobrir botão sem bloquear toque. |

**Decisões aprovadas pelo usuário em 29/09/2026:** SVGs locais para navegação/ações, emojis apenas ilustrativos, sem mudar o FAB; em escrita incerta, conferir lista antes de tentar de novo, sem retry automático; posto/data, valor e litros primários, métricas restantes acessíveis e reagrupadas só após teste; sucesso breve, progresso até resposta e erro persistente contextual. Detalhes e limites no [contrato](./2026-09-29-card-0-baseline-and-contract.md).
