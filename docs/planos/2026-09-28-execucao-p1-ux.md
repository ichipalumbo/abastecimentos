# Plano detalhado de execução — achados P1 de UI/UX

Base: [Auditoria de UI/UX](../auditorias/AUDITORIA_UI_UX.md)  
Escopo: planejar os dois blocos P1 da auditoria: melhorar o fluxo central de cadastro e transformar a leitura dos dados em apoio à decisão. Este documento registra o plano; as alterações ainda não foram implementadas.

## Objetivo e limites

Entregar um cadastro mais previsível e uma análise com escopo, comparativos e tendências explícitos, preservando:

- o contrato atual dos campos enviados ao backend;
- a semântica existente de abastecimento parcial e dos cálculos;
- os fluxos P0 já corrigidos;
- o comportamento offline com `mock/server.js`.

Não fazem parte deste plano os itens P2 de acessibilidade estrutural, contraste global, breakpoints, padronização visual ampla, arquitetura de informação ou troca de emojis por ícones.

## Convenções para executar o plano

- Executar uma etapa por vez e validar seu critério antes de avançar.
- Usar IDs estáveis dos registros; não reintroduzir dependência em índices locais.
- Preferir dados derivados no frontend a mudanças no backend. Se o filtro exigir contrato novo, interromper a etapa e revisar o plano antes de editar.
- O repositório não possui testes automatizados específicos para os fluxos de UI. Usar o mock local e registrar cenários manuais reproduzíveis.
- Alterações em `styles.css` devem ficar restritas aos componentes novos ou ao layout diretamente necessário para este P1.

## P1.1 — Melhorar o fluxo central de cadastro

### Etapa 1 — Confirmar contrato de postos e decisão de seleção

**Ações**

1. Conferir como `postos`, `selectedPostoNome`, `renderPostoPicker`, `openModal` e `submitForm` carregam, selecionam e persistem o posto.
2. Confirmar se o backend aceita posto vazio e se já existe uma representação de “não informado”.
3. Escolher, com base no contrato encontrado, entre tornar a seleção obrigatória ou criar uma opção explícita `Não informado`; não aceitar um estado vazio silencioso.
4. Verificar que criação/edição e o cadastro inline preservam o mesmo valor selecionado.

**Arquivos que podem ser lidos:** `script.js`, `index.html`, `mock/server.js`, `mock/mock-data.json`.  
**Arquivos a modificar:** nenhum.  
**Não modificar nesta etapa:** todos os arquivos de produção e dados.

**Validação:** cada registro novo e editado deve resultar em um posto explícito ou na opção explícita de ausência, sem alterar o nome do campo enviado. Contrato incompatível bloqueia a etapa seguinte.

### Etapa 2 — Tornar a seleção de posto explícita

**Ações**

1. Ajustar o picker para exibir claramente a seleção atual e a opção `Não informado`, conforme decidido na etapa anterior.
2. Marcar o estado visual e acessível da opção selecionada.
3. Validar o posto no início de `submitForm`, sem chamar `addRecord`/`updateRecord` enquanto a escolha obrigatória não estiver resolvida.
4. Em edição, carregar corretamente o posto salvo, inclusive o estado explícito de ausência.

**Arquivos a modificar:** `index.html` e `script.js`; `styles.css` somente para o estado visual do picker.  
**Não modificar nesta etapa:** `mock/server.js`, `mock/mock-data.json`, `shim.js`, `manifest.json` e estilos não relacionados ao picker.

**Validação:** criação sem escolha, com posto existente, com `Não informado` e edição de cada caso devem produzir o valor esperado e nenhuma persistência ambígua.

### Etapa 3 — Reordenar o formulário para o contexto de abastecimento

**Ações**

1. Reorganizar a marcação para a sequência: data/hora, posto, combustível/tipo, litros/valor, hodômetro, resumo calculado e salvar.
2. Manter os mesmos IDs, nomes, handlers, mensagens de erro e valores persistidos.
3. Garantir que o picker de posto continue disponível e funcional antes dos demais dados de consumo.

**Arquivo a modificar:** `index.html`; `styles.css` somente se a ordem exigir ajuste de espaçamento ou agrupamento existente.  
**Não modificar nesta etapa:** `script.js`, backend, mock e `shim.js`, salvo dependência comprovada e registrada no plano.

**Validação:** em mobile e desktop, a ordem visual e a ordem de foco por teclado seguem a sequência definida; cálculos e validações P0 continuam funcionando.

### Etapa 4 — Diferenciar entradas de resultados calculados

**Ações**

1. Agrupar preço por litro, KM rodados e prévia de km/L em um card/seção `Resumo deste abastecimento`.
2. Apresentar esses valores como somente leitura, com rótulos e explicações curtas que indiquem a origem calculada.
3. Preservar os IDs `f-precol`, `f-kmtrip` e `f-kmlprev`, pois os cálculos existentes dependem deles.

**Arquivos a modificar:** `index.html` e `styles.css`; `script.js` apenas se a nova estrutura exigir atualização de renderização, sem alterar fórmulas.
**Não modificar nesta etapa:** `mock/server.js`, `mock/mock-data.json`, `shim.js` e regras de cálculo.

**Validação:** o usuário não precisa preencher os resultados; alterações em litros, valor, data ou hodômetro atualizam a prévia existente, e nenhum valor calculado é enviado como campo de entrada novo.

### Etapa 5 — Substituir a ambiguidade de “Parcial?”

**Ações**

1. Substituir o toggle ambíguo por uma escolha explícita entre `Completo` e `Parcial`, mantendo uma representação compatível com `Parcial?`.
2. Manter junto da escolha o texto de consequência: abastecimentos parciais não entram no cálculo de consumo do intervalo.
3. Definir um estado inicial explícito e preservar o valor durante edição.

**Arquivos a modificar:** `index.html`, `script.js` e `styles.css` somente onde necessário para sincronizar a nova escolha com o campo persistido.
**Não modificar nesta etapa:** `mock/server.js`, `mock/mock-data.json`, `shim.js` e fórmulas de análise.

**Validação:** criação e edição de registros completos e parciais enviam exatamente a flag esperada; a análise continua excluindo parciais do cálculo de eficiência.

### Etapa 6 — Proteger dados ao fechar o modal

**Ações**

1. Definir uma função de detecção de alterações comparando o estado inicial do formulário com os valores atuais, incluindo posto, parcial e campos editáveis.
2. Manter fechamento direto quando o formulário não foi alterado.
3. Ao clicar no fundo, no botão de fechar ou em uma ação equivalente com alterações pendentes, pedir confirmação explícita antes de descartar.
4. Limpar o snapshot somente após salvar, cancelar o descarte ou fechar sem alterações.

**Arquivo a modificar:** `script.js`; `index.html` apenas se a confirmação exigir um elemento existente; `styles.css` somente para a apresentação dessa confirmação.
**Não modificar nesta etapa:** backend, mock, `shim.js`, cálculos e fluxo de persistência.

**Validação:** abrir/fechar sem editar fecha imediatamente; alterar qualquer campo e fechar preserva o modal até confirmar descarte; cancelar a confirmação preserva todos os dados digitados.

### Etapa 7 — Dar retorno de sucesso acionável

**Ações**

1. Tornar o feedback de sucesso específico, incluindo posto, valor ou identificação suficiente do abastecimento salvo.
2. Após exclusão, avaliar o estado atual de persistência e implementar `Desfazer` somente se houver forma segura de restaurar o mesmo registro por ID dentro de uma janela curta.
3. Não exibir `Desfazer` se o contrato não permitir restauração confiável; nesse caso, registrar a limitação e manter confirmação explícita.

**Arquivos a modificar:** `script.js`, `index.html` e `styles.css` se o toast/ação precisar de estrutura.
**Não modificar nesta etapa:** contrato do backend sem evidência de que a restauração é suportada; `mock-data.json` como mecanismo de estado.

**Validação:** salvar e excluir exibem contexto correto; falha de backend ou conexão não mostra sucesso; quando disponível, `Desfazer` restaura somente o ID excluído e expira após a janela definida.

### Etapa 8 — Validar o fluxo completo de cadastro

**Ações**

1. Testar criação e edição com posto existente, `Não informado` (se adotado), cada tipo de abastecimento, completo/parcial e campos inválidos P0.
2. Testar fechamento sem alterações, descarte confirmado/cancelado, sucesso, erro de backend e falha de conexão.
3. Comparar os dados antes/depois por ID e confirmar que os cálculos derivados permanecem consistentes.

**Arquivos a modificar:** nenhum; apenas validação manual.
**Não modificar nesta etapa:** todos os arquivos do projeto.

**Validação:** nenhum cenário descarta dados sem confirmação, nenhuma entrada inválida persiste, e cada sucesso/erro apresenta retorno coerente.

## P1.2 — Melhorar leitura e valor dos dados

### Etapa 9 — Definir modelo único de período e métricas

**Ações**

1. Mapear como `renderStats` calcula a home e como `renderAnalytics` calcula o histórico completo.
2. Criar uma regra única para limites de período, datas inválidas, registros sem litros/valor e abastecimentos parciais.
3. Definir os períodos da análise: `Este mês`, `3 meses`, `12 meses` e `Todo o período`, incluindo o período ativo inicial.
4. Definir comparativos: período imediatamente anterior de duração equivalente e mês anterior para séries mensais.

**Arquivos que podem ser lidos:** `script.js`, `index.html`, `styles.css`, `mock/mock-data.json`.  
**Arquivos a modificar:** nenhum.  
**Não modificar nesta etapa:** backend, `shim.js` e dados mock.

**Validação:** para um conjunto fixo de datas, cada período inclui/exclui os registros previstos e a regra fica aplicável tanto à home quanto à análise.

### Etapa 10 — Contextualizar indicadores da home

**Ações**

1. Ajustar `renderStats` para exibir o período de gasto mensal e a janela usada na média de km/L.
2. Calcular e exibir comparação com o período anterior quando houver dados suficientes, incluindo direção e percentual sem divisão por zero.
3. Manter estado vazio honesto quando não houver base de comparação.

**Arquivos a modificar:** `script.js` e `index.html`; `styles.css` somente para o texto auxiliar nos cards.
**Não modificar nesta etapa:** persistência, backend, estrutura de registros e regras de cálculo P0.

**Validação:** a home identifica o período de cada métrica; comparações positivas, negativas, zero e sem base são exibidas sem NaN, sinal invertido ou texto enganoso.

### Etapa 11 — Adicionar filtro de período à Análise

**Ações**

1. Adicionar controles para os quatro períodos definidos, com seleção ativa visível.
2. Fazer o controle chamar a renderização usando o mesmo conjunto filtrado para cards, meses e destaques.
3. Preservar a escolha durante trocas de aba e recarregamentos, sem gravar uma preferência incompatível com outro usuário.
4. Atualizar subtítulo/estado vazio para informar o período selecionado.

**Arquivos a modificar:** `index.html` e `script.js`; `styles.css` somente para o controle e estado ativo.
**Não modificar nesta etapa:** backend, `mock/server.js`, estrutura dos registros e páginas não relacionadas.

**Validação:** cada opção mostra apenas o intervalo correspondente, `Todo o período` mantém o comportamento atual e a opção ativa permanece evidente após atualizar a lista.

### Etapa 12 — Transformar a análise em apoio à decisão

**Ações**

1. Acrescentar série temporal simples por mês para preço/L e km/L usando somente dados válidos e completos para cada métrica.
2. Adicionar destaques de melhor eficiência, maior preço/L e variação contra o mês anterior, com tratamento para ausência de dados.
3. Manter o detalhamento mensal atual como fonte legível; não depender apenas de cor, barra ou emoji para comunicar valores.

**Arquivos a modificar:** `script.js`, `index.html` e `styles.css` para os componentes de tendência.
**Não modificar nesta etapa:** backend, formato persistido e fórmulas que já definem `KM/L Trip`.

**Validação:** dados com meses crescentes, regressivos, empates, parciais e lacunas produzem destaques corretos; nenhum mês sem base é apresentado como zero ou como tendência falsa.

### Etapa 13 — Simplificar o cabeçalho mensal do histórico

**Ações**

1. Alterar o cabeçalho de `renderList` para priorizar total gasto e litros.
2. Mover preço médio e eficiência para detalhe expansível ou interação explícita, sem escondê-los de forma inacessível.
3. Preservar a associação dos cartões e ações por ID implementada no P0.

**Arquivos a modificar:** `script.js`, `index.html` se houver estrutura compartilhada e `styles.css` para o detalhe mensal.
**Não modificar nesta etapa:** backend, ordenação, IDs dos registros e cálculos persistidos.

**Validação:** em meses com muitos registros, gasto/litros têm prioridade visual; abrir o detalhe revela preço médio e eficiência corretos; editar/excluir continuam apontando para o cartão acionado.

### Etapa 14 — Validar filtros, comparativos e tendências

**Ações**

1. Executar a análise com dados de um único mês, vários meses, períodos sem registros, registros parciais e valores incompletos.
2. Repetir em cada filtro e após alternar entre home, análise e histórico.
3. Conferir os valores exibidos manualmente contra uma tabela de referência calculada a partir do mock.

**Arquivos a modificar:** nenhum; apenas validação manual.
**Não modificar nesta etapa:** todos os arquivos do projeto.

**Validação:** período ativo, totais, médias, comparativos, destaques e séries são consistentes entre si; estados vazios explicam o próximo passo e não simulam dados.

## Resultado da execução

- Status: plano criado; implementação pendente.
- Arquivos alterados: este plano.
- Validações executadas: inspeção da [auditoria de UI/UX](../auditorias/AUDITORIA_UI_UX.md), do plano P0 e dos pontos relevantes em `index.html`, `script.js` e `styles.css`.
- Pendências/bloqueios: a decisão entre tornar o posto obrigatório e oferecer `Não informado`, bem como a viabilidade de `Desfazer`, deve ser confirmada na etapa de contrato antes da implementação.
