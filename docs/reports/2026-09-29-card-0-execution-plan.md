# Plano de execução — Cartão 0: contrato e baseline mobile (29/09/2026)

> **Status:** Cartão 0 executado e decisões I–IV aprovadas pelo usuário em 29/09/2026; verificação no aparelho permanece para o Cartão 4. Evidências e inventário no [relatório de execução](./2026-09-29-card-0-baseline-and-contract.md).
> **Origem:** [auditoria de coerência visual e feedback mobile](./2026-09-29-mobile-ui-consistency-audit-and-plan.md), Cartão 0 do roadmap; distinto da antiga *Fase 0* de integridade dos registros.
> **Base técnica:** `main` após a integração da PR #16 (`3a72940`). Nenhuma alteração de UI ou `GAS/` está prevista neste cartão.

## Objetivo e limite

Produzir uma referência verificável do app **como está** antes dos Cartões 1–3: imagens e medidas das superfícies relevantes, inventário das ações/ícones/textos e estados, e um contrato de linguagem visual e de recuperação de erros **submetido à aprovação**. Não chamar de melhoria pronta o que for apenas proposta. Não redesenhar telas, substituir ícones, alterar cópia, modificar regras de negócio ou testar escrita no backend real.

O uso prioritário é registrar abastecimento no posto, em uma mão, em viewport **433×762 CSS px** (DPR 2,81 no aparelho do usuário). A simulação no navegador mede dimensões CSS; ergonomia com teclado, brilho, safe areas e DPR real requer conferência posterior no aparelho.

## Preparação e ambiente

1. Confirmar a `main` atualizada, worktree limpo e a versão que será inspecionada; criar branch de documentação a partir dela (esta branch contém somente o plano). Na execução, anotar commit e data das capturas; se a `main` avançar, revisar diferenças antes de comparar resultados.
2. Iniciar `node dev\mock\server.js` na raiz e abrir `http://localhost:5000/?mock=1&reset=1`; confirmar `/__mock/health` e o selo **AMBIENTE DE TESTE**. Usar perfis/fixtures fictícios; `POST /__mock/reset` mais `&reset=1` limpa servidor e caches entre cenários. Para estados especiais usar `scenario=empty`, `read-error`, `write-error` e `slow`, conforme o [README](../../README.md). Não usar `file://` nem fazer mutações na versão publicada.
3. Usar a UI publicada somente para contraste visual **de leitura**, depois de conferir versão/cache; registrar quando ela diferir da `main` em vez de misturar as evidências. Não salvar screenshots com informações reais identificáveis: recortar/redigir ou usar exclusivamente o mock para evidências versionadas.

## Execução planejada

| Passo | Trabalho | Evidência esperada |
| --- | --- | --- |
| 1. Baseline de superfícies | Capturar seleção de perfil, Início (com registros, vazio e erro), Análise (resumo/tendência/vazio), Postos (lista/vazio), formulário novo e edição, confirmação/cancelamento de exclusão de registro e posto, cadastro/edição de posto e adição inline. Incluir tela com teclado simulado se ferramenta permitir, indicando que não é teclado físico. | Imagens identificadas por versão, viewport, cenário, perfil fictício e estado; nenhuma gravação em produção. |
| 2. Medidas e ergonomia | Em 433×762 e 320×568 medir overflow horizontal, rolagem da folha, visibilidade do CTA Salvar, FAB/barra/toast, tamanho de alvos, quebra de nomes e valores longos. Verificar 375×667 e 390×844 por amostragem; reflow a zoom/texto 200%, orientação paisagem e foco de teclado onde aplicável. Registrar valores observados, não estimativas. | Tabela `superfície × viewport × estado` com dimensões CSS, sobreposição/corte, anúncio/foco e ressalvas (DPR, teclado, aparelho). |
| 3. Inventário rastreável | Percorrer `index.html`, conteúdo gerado por `script.js` e tokens de `styles.css` para mapear cada ícone funcional/ilustrativo, ação, label, aviso/toast, erro e texto de vazio/loading/sucesso. Incluir navegação, FAB, cartões, ordenação/atualização, formulário, postos, confirmação, Análise e troca de perfil; registrar também falha de leitura com/sem cache e gravação de resultado incerto. | Tabela de inventário com `ID`, superfície, disparo/estado, texto atual, ícone/formato, nome acessível/role, origem (arquivo/função), consequência/recuperação e sugestão **não aprovada**. |
| 4. Matriz de feedback | Exercitar mock em `default`, `empty`, `read-error`, `write-error`, `slow`; registrar salvar novo/edição, excluir/cancelar, atualizar, posto novo/edição/exclusão e validação de campo. Observar se progresso termina somente após resposta, se toast anterior apaga o próximo, se entrada persiste após falha e se existe saída clara sem repetir escrita incerta. | Matriz `operação × idle/loading/sucesso/erro/sem dados` com duração observada, posicionamento, anúncio e ação segura; lacunas explícitas, não sucesso presumido. |
| 5. Contrato proposto | Sintetizar a linguagem **do app existente**, preservando tema escuro, FAB vetorial aprovado, ações com texto/nome acessível, foco e dados do formulário. Propor vocabulário consistente para aviso breve, progresso e erro contextual; regra de retry distinta entre leitura e escrita incerta; papel de SVG, glifo e emoji; pesos/tamanhos e hierarquia para 433×762. Vincular cada decisão a evidência e a um cartão posterior, com alternativa e trade-off. | Seção “proposto / pendente de aprovação”, exemplos concretos de antes/depois **sem editar o app**, e registro de opções rejeitadas; nenhuma decisão atribuída implicitamente ao usuário. |

## Decisões para aprovação após a coleta

| Decisão pendente | Opções a apresentar com evidência | Não fazer antes da aprovação |
| --- | --- | --- |
| Ícones funcionais | SVG local consistente para navegação/ações com emojis ilustrativos, ou conjunto misto delimitado por superfície; manter o FAB aprovado. | Substituição global de emojis, inclusão de biblioteca externa ou clonagem de outro app. |
| Escrita com resposta incerta | Orientar a conferir histórico/postos antes de reenviar; diferenciar erros de validação confirmados pelo servidor. Para leitura, oferecer nova tentativa explícita. | Retry automático de criar/editar/excluir após falha de rede. |
| Hierarquia/densidade | Quais informações do cabeçalho mensal/chips são primárias no primeiro olhar e quais continuam acessíveis em segundo nível. | Remover métricas ou mudar cálculos apenas para reduzir densidade. |
| Avisos e vocabulário | Confirmação curta não bloqueante; progresso ligado à requisição; erro persistente junto à ação afetada e instrução de recuperação; rótulos únicos por ação. | Definir duração/posição do toast sem medir FAB, teclado e safe area. |

O documento de execução deve marcar cada decisão como **aprovada, rejeitada ou pendente** e registrar quem decidiu e quando. Não iniciar os Cartões 1–3 com políticas ambíguas; pedir as escolhas ao usuário uma por vez após apresentar evidências e recomendação. Não tratar as sugestões da auditoria como aprovação.

## Entregas e critério de aceite do Cartão 0

- Relatório **datado** em `docs/reports/` com commit-base, ambiente, método, imagens sintéticas (se versionadas, em subpasta de assets vinculada ao relatório) e medidas; nenhuma imagem de dados reais. Inventário em tabelas Markdown ou CSV junto ao relatório, não espalhado na raiz.
- Cobertura rastreável de **todas as ações visíveis e seus textos/ícones**, incluindo elementos renderizados dinamicamente, e mensagens de loading, vazio, sucesso, erro de leitura, erro de escrita e validação; lacunas de estado marcadas como “inexistente” em vez de omitidas.
- Matriz de feedback revisada contra o comportamento real, sem confundir simulação com aparelho físico/produção. Registrar resultados observados e pendências de verificação em dispositivo 433×762 DPR 2,81.
- Contrato visual e política de erros vinculados a achados/estados, com **aprovação explícita** das quatro decisões acima ou bloqueio documentado para os cartões dependentes. Cartão 0 pode concluir a coleta antes da aprovação, mas não declara o contrato aprovado sem resposta.
- Diff limitado a documentação/evidências sintéticas; nenhuma modificação de `index.html`, `script.js`, `styles.css`, `shim.js`, fixtures ou `GAS/` para “facilitar” a auditoria. Se faltar cenário, registrar a limitação e propor ajuste separado.

**Checagem de saída:** revisar links, tabela de cobertura e `git diff --check`. Documentação pura não exige build nem bateria de testes; os Cartões 1–3 devem executar os testes Node existentes e a inspeção visual de regressão quando alterarem código. O Cartão 4 fará o finish gate no aparelho, estados e acessibilidade. Este plano não atesta conformidade WCAG.
