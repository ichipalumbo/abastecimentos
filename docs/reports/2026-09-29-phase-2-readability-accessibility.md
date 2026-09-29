# Fase 2 — leitura, acessibilidade e ergonomia (29/09/2026)

## Escopo e decisão

Execução da [Fase 2 do roadmap](./2026-09-29-ui-ux-audit.md) na branch `feat/phase-2-readability-accessibility`, criada a partir da `main` atualizada (`af52c72`). Preservar o tema escuro, as métricas e os fluxos de registro. Não modificar o backend nem `GAS/`.

## Mudanças

- Texto secundário passou a ter contraste suficiente sobre cartões; rótulos das métricas cresceram de cerca de 9 px para 13 px e datas/litros do histórico para 14 px. A tela inicial distingue gasto **no mês** das médias **gerais**, com menos destaque para metadados do agrupamento.
- A ação principal da navegação ganhou texto visível “Registrar” e nome acessível “Registrar abastecimento”. Os controles de ordenação, troca de usuário e edição/exclusão têm área de toque de no mínimo 44 px; as ações do histórico estão mais afastadas.
- Restaurado o zoom no viewport. Campos de posto e botões somente de ícone receberam nomes; os controles do histórico incluem posto e data no nome acessível. A navegação indica a página atual.
- Cadastro, posto e confirmações passaram a expor nome/descrição e foco gerenciado: foco inicial, Tab contido, Escape para fechar e retorno ao acionador. Diálogos fechados ficam invisíveis também para navegação por teclado. Avisos de erro usam papel de alerta; demais mensagens usam status.

## Validação e limites

- `node --test tests\record-actions.test.js`: **9/9** passaram (inclusive correspondência por ID e retorno de foco); `node --check script.js` e `git diff --check` passaram.
- Navegador local com registros sintéticos: árvore acessível mostrou nomes distintos de edição/exclusão por posto e data. No cadastro e na confirmação, foco iniciou no controle de fechar/cancelar; Shift+Tab circulou para o último controle; Escape fechou e devolveu foco ao acionador.
- Em 433×762 CSS px, `--muted` sobre cartões mediu **6,75:1** (AA para texto comum); rótulos de estatística mediram 13 px. Ações do histórico mediram 44 px, sem overflow horizontal em larguras 320, 375, 433, 768 e 1280 px. A interface inicial foi inspecionada visualmente no navegador local.
- **Pendente no aparelho real:** testar zoom, leitor de tela, brilho alto/uso externo, toque com uma mão, teclado virtual e DPR 2,81. O mock local não estava disponível; nenhuma escrita foi enviada à API real.
