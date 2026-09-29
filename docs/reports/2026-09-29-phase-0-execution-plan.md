# Plano de execução — Fase 0: integridade dos registros (29/09/2026)

## Status e decisão

**Status: planejado; implementação ainda não iniciada.** Este é o relatório pré-execução. O objetivo é corrigir a correspondência entre cada cartão do histórico e as ações Editar/Excluir, antes de alterar layout, formulário ou demais itens do [roadmap UI/UX](./2026-09-29-ui-ux-audit.md).

## Diagnóstico e risco

Em `script.js`, `renderList` ordena os dados por data, agrupa por mês e cria botões usando `idx` de `rows.map`. Esse índice reinicia em cada mês; `openEdit(idx)` e `askDelete(idx)` leem `records[idx]`, cuja ordem nem precisa coincidir com a ordem exibida. Na página publicada, o primeiro cartão de setembro e o primeiro de agosto apontavam ambos para `openEdit(0)`. O mesmo vale para Excluir. **Não acionar esses botões em registros antigos de produção até a correção ser validada.**

Também é necessário considerar mudança de ordenação, refresh do cache e um registro que deixe de existir depois da renderização. Um ID ausente ou ambíguo deve impedir a ação e apresentar erro, jamais escolher outro registro.

## Escopo fechado

- **Incluído:** vínculo cartão → registro para Editar/Excluir, seleção por `ID`, proteção para ID ausente/duplicado ou registro não encontrado, confirmação exibindo os dados do cartão correto, testes de regressão e verificação no layout prioritário de 433×762 CSS px.
- **Fora do escopo:** redesenho do formulário, contraste, novas métricas, mudança de backend e migração de dados. Não modificar registros reais para provar a correção.
- **Superfície principal:** `script.js`; o HTML/CSS só muda se um teste demonstrar necessidade diretamente ligada à Fase 0.

## Estratégia de implementação

1. **Reproduzir com dados sintéticos:** montar registros com IDs únicos em pelo menos três meses, com duas entradas no mesmo mês e ordem do array `records` diferente da ordem cronológica. Inspecionar o ID efetivo do cartão e o ID aberto/confirmado nas ordenações Recente e Antigo; registrar o comportamento antes da correção.
2. **Trocar índices locais por IDs:** manter o agrupamento e a ordem visual, mas associar os handlers ao `ID` de cada registro após renderizar, sem interpolar IDs não confiáveis em código inline. As funções de editar e perguntar sobre exclusão devem resolver um único registro por ID no estado atual; a confirmação de exclusão usa o mesmo ID. Não mudar payloads de atualização/exclusão do backend.
3. **Falhar de modo explícito:** se o ID estiver ausente, for duplicado ou não existir mais no estado atual, não abrir formulário nem confirmação e exibir erro compatível com o feedback já usado pelo app. Não recorrer ao índice como fallback.
4. **Validar sem operações destrutivas:** com dados sintéticos, comparar ID, posto, data, valor e hodômetro do cartão com formulário e confirmação. Conferir que Cancelar não dispara requisição; para o comando de exclusão, usar stub local da API e verificar o ID enviado, nunca o backend de produção.
5. **Verificar regressões:** testar carregamento de registros, troca de perfil, ordenação, atualização/cache, abertura/fechamento de modais e visualização em 433×762; depois fazer inspeção **somente de leitura** da versão publicada, quando a correção estiver implantada.

## Matriz de testes e critérios de aceite

| Cenário | Resultado obrigatório |
|---|---|
| Primeiro e segundo cartão do mês atual; primeiro do mês intermediário e do mais antigo | Editar abre o ID e os dados do cartão clicado |
| Mesmos cartões em Recente e Antigo, inclusive quando `records` estiver embaralhado | Correspondência correta sem depender da posição no array |
| Excluir em cada mês; cancelar; confirmar com API simulada | Diálogo descreve o cartão; cancelar não chama API; confirmar envia só o ID selecionado |
| ID removido após renderização, ausente ou duplicado | Ação bloqueada com erro visível; nenhum outro registro é editado/excluído |
| Recarregar histórico e alternar de perfil | Handlers não ficam ligados ao perfil anterior ou a elementos antigos |
| Viewport 433×762 CSS px | Ações permanecem operáveis sem regressão visual/horizontal |

**Critério de saída:** todos os cenários acima passam com dados sintéticos, sem requisições destrutivas a produção. Revisar o diff para garantir que só o bug e testes diretamente relacionados foram alterados.

## Ambiente e segurança

O repositório não contém runner de testes nem o diretório `mock/` citado no README; não assumir que o servidor mock está disponível. Usar o navegador com dados sintéticos e API simulada, ou um teste pequeno com ferramentas já existentes no ambiente, sem instalar novas dependências só para planejar. Antes de executar, verificar se há alterações simultâneas no worktree; preservar `.agents/` e quaisquer mudanças preexistentes.

**Rollback se falhar na implementação:** interromper publicação, preservar as alterações de outros autores e corrigir o patch ou reverter apenas os arquivos próprios por meio de diff revisado. Não usar reset destrutivo e não usar a conta real como massa de teste.

## Entrega esperada da execução

Código corrigido, evidência dos testes com os IDs sintéticos em ambas as ordenações, lista de arquivos alterados e registro de eventuais limitações. Atualizar este plano com a data da execução e o resultado somente depois de implementar e verificar; manter a auditoria original como histórico.
