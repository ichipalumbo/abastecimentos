# Fase 3 — personalização útil e análise de consumo (29/09/2026)

## Decisão e escopo

Branch `feat/phase-3-personalization-analytics`, criada a partir da `main` atualizada (`efb6d2c`), após o merge da Fase 2. O usuário escolheu **recentes por perfil sem seleção automática**, em vez de favoritos persistidos. Nenhuma mudança no Google Apps Script ou em `GAS/`.

## Implementação

- Cadastro: até três postos usados recentemente aparecem primeiro entre os cadastrados do perfil, separados dos demais. O combustível do último abastecimento válido é oferecido como atalho, mas só é aplicado após toque. Novos registros exigem uma escolha explícita de combustível; a edição mantém o valor salvo. Registros de outro perfil nunca entram nas sugestões.
- Análise: visão de até seis meses **com registros**, em ordem cronológica, alternando gasto, preço médio por litro e eficiência média km/L. O indicador é identificado por números, unidades e barras proporcionais; meses sem consumo completo exibem `—` em km/L. Resumos permanecem referentes ao histórico inteiro, e cartões mensais continuam disponíveis abaixo da tendência.
- Estado vazio e ausência de histórico são explicados na própria área de tendência. A ação de registrar e os cálculos do formulário permanecem fora da tela de análise.

## Verificação

- `node --test tests\record-actions.test.js`: 12/12 passaram, incluindo isolamento de sugestões por perfil, seleção explícita de combustível e alternância das métricas.
- `node --check script.js` e `git diff --check` passaram.
- Inspeção local em 433×762 com dados sintéticos: o cadastro abriu com combustível vazio e sugestão de Etanol sem aplicá-la; os postos recentes apareceram primeiro. Gasto, R$/L e km/L foram alternados na Análise. Sem overflow horizontal em 320, 375, 433 e 768 px. Nenhuma gravação foi enviada ao backend.
- Pendente: validação no aparelho físico com teclado virtual e dados pessoais reais; observar se as sugestões reduzem o tempo sem induzir escolha incorreta.
