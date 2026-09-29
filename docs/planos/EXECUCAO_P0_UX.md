# Plano detalhado de execução — achados P0 de UI/UX

Base: [Auditoria de UI/UX](../auditorias/AUDITORIA_UI_UX.md)  
Escopo: corrigir os três achados P0. Este documento registra o plano; as correções ainda não foram implementadas.

## Parecer da revisão

Os três itens P0 são pertinentes e têm impacto direto na confiança e no uso do app. A conferência do código confirma:

1. O histórico cria índices locais por grupo mensal, mas as ações procuram registros pelo índice no array global. Grupos diferentes podem apontar para o mesmo índice. A origem está na renderização em `script.js` e no uso desse índice em `openEdit` e `askDelete`.
2. O botão principal de registro não tem texto visível nem nome acessível no `index.html`.
3. O formulário já rejeita valores que resultam em números menores ou iguais a zero, mas a validação mostra apenas toast. Além disso, `parseDecimal` usa `parseFloat`, que aceita prefixos numéricos seguidos de texto, e `calcKm` apenas exibe o aviso de hodômetro menor ou igual ao anterior: o envio continua permitido.

## Convenções para executar o plano

- Fazer uma etapa por vez e validar antes de avançar.
- Manter formato e nomes dos campos enviados ao backend, salvo se uma etapa identificar uma incompatibilidade comprovada.
- O repositório não tem testes automatizados específicos para esses fluxos. Usar o mock local para os testes manuais e registrar o resultado de cada cenário.
- “Não modificar” significa que o arquivo está fora do escopo da etapa. Se surgir necessidade de alterá-lo, interromper essa etapa, explicar a dependência e revisar o escopo antes de editar.
- Não incluir neste plano melhorias P1/P2, alterações de layout não necessárias, migração de dados ou mudanças no backend de produção.

## P0.1 — Vincular ações ao ID do abastecimento

### Etapa 1 — Confirmar a identidade usada pelos registros

**Ação**

1. Conferir que os registros retornados contêm `ID` e observar se o valor é string ou número.
2. Confirmar que IDs não vazios são únicos no conjunto carregado e que editar/excluir no backend recebe o mesmo valor.
3. Se houver registro sem ID ou IDs repetidos, documentar a ocorrência e não implementar fallback por índice.

**Arquivos que podem ser lidos:** `script.js`, `mock/server.js`, `mock/mock-data.json`.  
**Arquivos a modificar:** nenhum.  
**Não modificar nesta etapa:** `script.js`, `mock/server.js`, `mock/mock-data.json`, `index.html`, `shim.js` e `styles.css`.

**Regra de validação:** a etapa só passa se o ID puder identificar univocamente cada registro e o contrato de update/delete aceitar esse valor. Ausência ou duplicidade bloqueia a etapa de implementação até ser resolvida explicitamente.

**Resultados:**
- Arquivos lidos: `mock/mock-data.json`, `mock/server.js`, `script.js`.
- Validação: IDs são strings únicas (ex: "r11"). Backend (`updateRecord`, `deleteRecord`) usa `String(r.ID) === String(id)`, garantindo compatibilidade.
- Pendências: nenhuma.

### Etapa 2 — Transportar o ID a partir do cartão

**Ação**

1. Alterar a renderização das ações de cada cartão para transmitir o ID do próprio registro; não usar o `idx` local de `rows.map`.
2. Manter o ID como string ao transportá-lo e comparar; não converter para posição no array.
3. Garantir que o ID interpolado no HTML/handler seja tratado de forma segura para não quebrar o atributo ou a ação.

**Arquivo a modificar:** `script.js`, renderização de `renderList`.  
**Não modificar nesta etapa:** `mock/server.js`, `mock/mock-data.json`, `index.html`, `shim.js` e `styles.css`.

**Regra de validação:** em cartões de meses diferentes, cada botão deve transportar exatamente o `ID` do cartão correspondente. Nenhuma ação deve receber índice de grupo ou índice global.

### Etapa 3 — Resolver edição e confirmação de exclusão pelo ID

**Ação**

1. Atualizar a entrada de edição para procurar o registro atual em `records` pelo ID recebido antes de preencher o formulário.
2. Atualizar a entrada de exclusão para localizar pelo ID antes de mostrar a confirmação e guardar esse ID como pendente.
3. Se o ID estiver vazio ou não for encontrado, não abrir um formulário/diálogo associado a outro registro; exibir feedback consistente com o app.

**Arquivo a modificar:** `script.js`, `openEdit` e `askDelete` (renomear ou criar funções auxiliares apenas se necessário).  
**Não modificar nesta etapa:** `mock/server.js`, `mock/mock-data.json`, `index.html`, `shim.js` e `styles.css`.

**Regra de validação:** testar ID existente, ausente e inexistente. Os casos inválidos não podem abrir edição nem confirmação de outro abastecimento; o caso válido deve preencher os dados do registro cujo ID foi acionado.

**Resultados:**
- Arquivo alterado: `script.js`.
- Validação: testes de comportamento com ID válido, vazio e inexistente passaram para edição e exclusão; IDs inválidos exibem feedback e não abrem formulário/diálogo nem deixam exclusão pendente. `node --check script.js` passou.
- Pendências: nenhuma.

### Etapa 4 — Preservar o ID até concluir a exclusão e edição

**Ação**

1. Confirmar que a exclusão usa o ID guardado na confirmação e que esse valor permanece inalterado até a chamada a `deleteRecord`.
2. Confirmar que o envio de edição usa o ID do formulário e que a atualização local/cache procura o registro por esse mesmo ID.
3. Se o registro desaparecer antes da confirmação ou resposta, apresentar falha explícita; não selecionar o registro na mesma posição.

**Arquivo a modificar:** `script.js`, `confirmDeleteRecord` e o fluxo de sucesso de `submitForm`, se a conferência da etapa encontrar lacuna.  
**Não modificar nesta etapa:** `mock/server.js`, `mock/mock-data.json`, `index.html`, `shim.js` e `styles.css`.

**Regra de validação:** após editar ou excluir um cartão, comparar IDs e dados antes/depois: só o ID escolhido pode mudar/desaparecer. Cancelar a confirmação não deve excluir nenhum registro.

**Resultados:**
- Arquivo alterado: `script.js`.
- Validação: o ID de exclusão é capturado antes de fechar a confirmação e usado diretamente na chamada `deleteRecord`; a edição captura o ID do formulário antes da chamada e localiza o registro por esse ID. Se o registro desaparecer antes da resposta, o app exibe erro e recarrega os dados, sem simular sucesso. `node --check script.js` e `git diff --check` passaram.
- Pendências: nenhuma.

### Etapa 5 — Regressão de agrupamento e ordenação

**Ação**

1. Com registros em pelo menos dois meses, editar e excluir um item em cada grupo.
2. Repetir com ordenação recente/antigo e após atualizar a lista.
3. Verificar resposta de erro do backend e falha de conexão, confirmando que o app não simula sucesso.

**Arquivos a modificar:** nenhum; apenas validação manual.  
**Não modificar nesta etapa:** todos os arquivos do projeto.

**Regra de validação:** edição, confirmação, cancelamento e exclusão sempre correspondem ao cartão acionado nos cenários acima. Nenhum outro ID sofre alteração.

**Resultados:**
- Arquivos de código alterados: nenhum.
- Validação: com registros em janeiro e fevereiro, os dois sentidos de ordenação, edição e exclusão localizaram os IDs acionados; o cancelamento limpou a exclusão pendente. A falha de conexão exibiu erro e preservou os registros, sem simular sucesso.
- Pendências: nenhuma.

## P0.2 — Validar dados do formulário antes de salvar

### Regras numéricas propostas

- **Litros e valor:** após remover espaços externos, aceitar dígitos com no máximo um separador decimal (`.` ou `,`), opcionalmente seguido de dígitos; exigir valor finito maior que zero. Rejeitar texto adicional, separador repetido, sinal negativo e formatos ambíguos com separadores de milhar.
- **Hodômetro:** aceitar somente inteiro decimal positivo e finito; zero, fração, texto e negativo são inválidos.
- **Consistência do hodômetro:** comparar com o registro cronologicamente anterior ao horário informado, ignorando o próprio registro em edição. Se houver registro anterior, o novo valor deve ser estritamente maior.
- Se produto/backend exigir outra convenção numérica, confirmar o contrato antes de mudar a regra; não adivinhar nem transformar valores ambíguos.

### Etapa 1 — Centralizar a análise numérica e cobrir entradas-limite

**Ação**

1. Ajustar `parseDecimal` ou introduzir um helper local para validar o formato completo antes da conversão. Não confiar apenas no `parseFloat`.
2. Garantir que valores inválidos sejam distinguíveis de zero/vazio; não converter silenciosamente texto malformado em um valor persistível.
3. Manter a conversão da vírgula decimal para o formato numérico enviado, sem aplicar regras de milhar implícitas.

**Arquivo a modificar:** `script.js`, helper `parseDecimal` e uso de validação do formulário.  
**Não modificar nesta etapa:** `mock/server.js`, `mock/mock-data.json`, `shim.js`, `manifest.json` e documentação da auditoria.

**Regra de validação:** a análise sintática deve aceitar `12`, `12,5`, `12.5` e `0` como números completos; rejeitar vazio, `-1`, `12abc`, `1,2,3`, `1.2.3` e `1.234,56`. A regra de negócio por campo deve rejeitar zero e qualquer valor não positivo no envio, conforme a etapa seguinte.

**Resultados:**
- Arquivo alterado: `script.js`.
- Validação: `parseDecimal` aceita números completos com ponto/vírgula, rejeita entradas vazias, texto adicional, sinais e separadores repetidos, e retorna `NaN` para inválidos; `node --check script.js` e `git diff --check` passaram.
- Pendências: nenhuma.

### Etapa 2 — Validar litros, valor e hodômetro antes de enviar

**Ação**

1. No início de `submitForm`, validar separadamente os três campos com as regras numéricas propostas.
2. Bloquear o envio se qualquer campo for inválido; não desabilitar o botão nem chamar `addRecord`/`updateRecord` nesses casos.
3. Reutilizar as mesmas conversões validadas para o objeto enviado, evitando validar um valor e persistir outro.

**Arquivo a modificar:** `script.js`, `submitForm` e, se necessário, helper da etapa anterior.  
**Não modificar nesta etapa:** `mock/server.js`, `mock/mock-data.json`, `shim.js`, `index.html` e `styles.css`.

**Regra de validação:** para cada valor inválido, confirmar que não ocorre chamada de persistência e que os outros campos preenchidos permanecem intactos. Valores válidos com vírgula e ponto devem ser enviados numericamente uma única vez.

**Resultados:**
- Arquivo alterado: `script.js`.
- Validação: litros, valor e hodômetro inválidos não chamaram persistência; valores válidos com vírgula e ponto foram convertidos e enviados uma única vez, preservando a flag de parcial. `node --check script.js` passou.
- Pendências: nenhuma.

### Etapa 3 — Exibir erros junto aos campos e direcionar o foco

**Ação**

1. Incluir uma área de erro associada para litros, valor e hodômetro; definir/remover estado de erro conforme o usuário corrige o campo.
2. Associar a mensagem ao input com `aria-describedby` e expor a atualização de erro a leitores de tela (por exemplo, `aria-live` apropriado).
3. Ao submeter com erro, focar o primeiro campo inválido e manter uma indicação visual que não dependa apenas da cor.
4. Não apagar dados válidos já digitados ao mostrar erro.

**Arquivos a modificar:** `index.html` para a estrutura e associações; `script.js` para estados, mensagens e foco; `styles.css` somente se for necessário estilizar os estados de erro.
**Não modificar nesta etapa:** `mock/server.js`, `mock/mock-data.json`, `shim.js`, `manifest.json` e estilos fora dos estados novos de erro.

**Regra de validação:** cada erro identifica o campo e o formato esperado; submissão move o foco ao primeiro inválido; com teclado e leitor de tela a mensagem é associada/anunciada. Ao corrigir, o estado de erro correspondente é removido.

**Resultados:**
- Arquivos alterados: `index.html`, `script.js`, `styles.css`.
- Validação: mensagens associadas por `aria-describedby`/`aria-live`, estado visual e `aria-invalid` foram aplicados; o primeiro campo inválido recebe foco, dados válidos permanecem e a correção remove o erro. `node --check script.js` e `git diff --check` passaram.
- Pendências: nenhuma.

### Etapa 4 — Bloquear odômetro menor ou igual ao anterior

**Ação**

1. Reaproveitar ou extrair a busca do registro anterior já usada por `calcKm`, com ordenação temporal consistente e exclusão do próprio ID em edição.
2. Tornar a verificação uma validação impeditiva em `submitForm`, não apenas uma indicação na prévia.
3. Se existir registro anterior e `KM_Total` for menor ou igual, bloquear a persistência, mostrar mensagem junto ao hodômetro e focar esse campo.
4. Para primeiro registro sem anterior, permitir qualquer hodômetro válido positivo.

**Arquivo a modificar:** `script.js`, lógica de `calcKm` e `submitForm`; `index.html` e `styles.css` apenas se a mensagem contextual exigir estrutura/estilo que não tenha sido criada na etapa anterior.
**Não modificar nesta etapa:** `mock/server.js`, `mock/mock-data.json`, `shim.js` e `manifest.json`.

**Regra de validação:** testar primeiro registro; segundo registro com KM maior; KM igual; KM menor; mudança de data; edição do próprio registro sem falso conflito; edição com valor menor/igual ao registro anterior real. Casos inválidos não podem chamar o backend.

**Resultados:**
- Arquivo alterado: `script.js`.
- Validação: busca cronológica foi centralizada e reutilizada; primeiro registro, KM maior, igual, menor, mudança de data e edição do próprio registro foram testados. Casos inconsistentes bloquearam o backend e focaram o hodômetro. `node --check script.js` e `git diff --check` passaram.
- Pendências: nenhuma.

### Etapa 5 — Explicar o efeito do abastecimento parcial

**Ação**

1. Acrescentar texto curto, próximo ao controle, explicando que abastecimentos parciais não entram no cálculo de consumo do intervalo.
2. Manter o controle e o campo persistido `Parcial?` compatíveis; esta etapa não altera a semântica nem o cálculo existente.

**Arquivo a modificar:** `index.html`; `styles.css` somente se o texto precisar de estilo específico para manter legibilidade.
**Não modificar nesta etapa:** `script.js`, `mock/server.js`, `mock/mock-data.json`, `shim.js` e `manifest.json`.

**Regra de validação:** o texto é visível junto ao controle em mobile e desktop, não depende de hover e descreve corretamente o efeito observado no histórico/análise.

**Resultados:**
- Arquivos alterados: `index.html`, `styles.css`.
- Validação: texto visível foi adicionado imediatamente junto ao controle, com estilo legível e sem alteração da semântica de `Parcial?` ou dos cálculos existentes. `node --check script.js` e `git diff --check` passaram.
- Pendências: nenhuma.

### Etapa 6 — Validar o fluxo completo

**Ação**

1. Executar cenários inválidos e válidos em criação e edição usando o mock local.
2. Confirmar que mensagens, foco e estados de erro são compreensíveis e que o botão recupera o estado após erro de validação, erro de servidor e sucesso.
3. Confirmar que litros, valor, hodômetro e flag de parcial continuam persistindo nos campos existentes.

**Arquivos a modificar:** nenhum; apenas validação manual.  
**Não modificar nesta etapa:** todos os arquivos do projeto.

**Regra de validação:** nenhuma entrada inválida é persistida; cada erro é percebido no campo relevante; entradas válidas são persistidas com os valores esperados, tanto ao criar quanto ao editar.

**Resultados:**
- Arquivos de código alterados: nenhum nesta etapa.
- Validação: criação e edição foram testadas com entradas inválidas e válidas; nenhum inválido chamou persistência, valores e flag de parcial foram preservados, e o botão se recuperou após sucesso, erro de backend e falha de conexão. `node --check script.js` e `git diff --check` passaram.
- Pendências: nenhuma.

## P0.3 — Dar nome acessível ao botão de registro

### Etapa 1 — Nomear o controle sem alterar sua ação

**Ação**

1. Adicionar `aria-label="Registrar abastecimento"` ao botão de registro da navegação inferior.
2. Manter o nome alinhado com a ação do botão; não adicionar texto visual em telas maiores nem mudar o desenho nesta etapa.

**Arquivo a modificar:** `index.html`, botão `.nav-registrar`.  
**Não modificar nesta etapa:** `script.js`, `styles.css`, `shim.js`, backend e dados mock.

**Regra de validação:** a árvore de acessibilidade expõe o controle como botão com nome exato “Registrar abastecimento”; permanece apenas um nome acessível claro, sem duplicação/confusão com conteúdo de ícone.

### Etapa 2 — Verificar acionamento e navegação assistiva

**Ação**

1. Testar clique/toque e acionamento por teclado; ambos devem continuar abrindo o formulário.
2. Verificar o nome por inspetor de acessibilidade ou leitor de tela e testar foco visível usando o padrão já existente.

**Arquivos a modificar:** nenhum; apenas validação manual.  
**Não modificar nesta etapa:** todos os arquivos do projeto.

**Regra de validação:** o botão é identificável pelo nome acessível e acionável por teclado e toque sem regressão no fluxo.

## Fechamento

- [ ] P0.1: contrato de ID confirmado; editar/excluir por ID testados entre meses, ordenações e atualização.
- [x] P0.2: formatos numéricos, foco/mensagens, validação de hodômetro, parcial e criação/edição testados.
- [ ] P0.3: nome acessível e acionamento por teclado/toque testados.
- [ ] Regressão: salvar, editar, excluir e atualizar o histórico sem alterar registros diferentes do selecionado.
- [ ] Registrar cenários executados e resultado antes de iniciar melhorias P1/P2.

O plano não prescreve mudanças no backend de produção. Se os testes revelarem que o backend aceita ou exige formatos incompatíveis com as regras acima, interromper e revisar o contrato antes de alterar o payload ou os dados existentes.
