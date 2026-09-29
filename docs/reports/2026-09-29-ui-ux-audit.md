# Revisão de UI/UX — Abastecimentos (29/09/2026)

## Resumo executivo

| Item | Resultado |
|---|---|
| Produto | PWA pessoal para registrar abastecimentos e acompanhar consumo |
| Implementação | HTML, CSS e JavaScript sem framework |
| Escopo observado | Seleção de perfil, início/histórico, análise, postos e cadastro/edição/exclusão |
| Aparelho prioritário | 433×762 pixels CSS; DPR informado: 2,81 |
| Achados materiais | 4: 1 P0 de integridade, 2 P1 de usabilidade/acessibilidade e 1 oportunidade P2 |
| Alterações na interface | Nenhuma; entrega de avaliação e roadmap |
| Referências externas | Não usei catálogo visual externo do UIZZE; fundamentei as propostas no produto existente e no fluxo descrito |
| Teste em produção | `https://ichipalumbo.github.io/abastecimentos/` com autorização para usar o perfil Luccas |

### Leitura de designer sênior

O app já tem uma base visual coerente: identidade escura, navegação previsível, histórico em cartões e escolha de posto por chips. A oportunidade principal não é “modernizar por modernizar”; é fazer o registro de um abastecimento — a tarefa recorrente e de maior valor — exigir pouca atenção, funcionar com uma mão e continuar claro quando a pessoa está no posto ou dentro do carro.

**Princípio de experiência sugerido:** *registrar primeiro, analisar depois*. A interface deve ajudar a capturar os dados certos sem distrações; histórico e análise ficam disponíveis, mas não competem com a ação principal.

### Viewport e limites da simulação

- O layout foi avaliado em aproximadamente **433×762 CSS px**. DPR 2,81 afeta a densidade física, não a área CSS nem os breakpoints; corresponderia a cerca de 1217×2141 pixels físicos.
- O navegador disponível não permitiu simular o DPR 2,81 nem o teclado virtual. A viewport observada ficou em 434×763 por arredondamento.
- A tela inicial não apresentou rolagem horizontal. Na inspeção local, a folha do formulário tinha aproximadamente **853 px** de conteúdo e **714 px** de área rolável; no fluxo publicado com o posto de teste, o conteúdo chegou a **905 px** para **716 px** visíveis. “Salvar Abastecimento” começou abaixo da dobra, antes de abrir o teclado.

### Teste do fluxo real e limpeza

1. **Estado inicial:** 31 registros e 3 postos no perfil Luccas; gasto exibido no mês: R$ 708,50.
2. **Posto de teste:** criei `Teste UI - 29-09-2026` e conferi sua presença na lista e no seletor do formulário.
3. **Registro de teste:** salvei no posto de teste 10 L, R$ 50 e 93.307 km; os cálculos prévios mostraram R$ 5,000/L e 100 km, e o registro apareceu no histórico.
4. **Edição:** alterei apenas o valor desse registro para R$ 55 e confirmei no histórico o novo total e R$ 5,50/L.
5. **Limpeza:** excluí o registro pelo ID criado e, em seguida, o posto pelo ID criado. Após atualização forçada do servidor, o perfil voltou a **31 registros, 3 postos, R$ 708,50 no mês**, sem registro nem posto de teste.

O teste confirma criação, feedback de salvamento, edição, confirmação de exclusão e atualização dos totais. Os dados criados foram removidos; os registros existentes não foram modificados.

## Achados e recomendações

### [P0] Editar/Excluir em outro mês pode atingir o registro errado

- **Evidência observada sem alterar dados existentes:** no histórico real, o primeiro cartão de setembro e o primeiro de agosto exibem ambos `openEdit(0)` (e o mesmo padrão vale para `askDelete(0)`). Em `script.js`, `renderList` ordena e agrupa os registros, mas usa o índice **local a cada grupo** ao criar os botões; `openEdit`/`askDelete` procuram o índice no array global `records`. Assim, clicar no primeiro cartão de agosto pode abrir/excluir o primeiro registro global, não aquele exibido.
- **Impacto:** risco concreto de editar ou excluir dado pessoal diferente do cartão escolhido, sem que o diálogo identifique a divergência de origem.
- **Correção recomendada:** acionar edição e exclusão por ID estável do registro, não por índice do mês; validar também quando a ordem “Antigo” está selecionada. O diálogo de confirmação deve sempre nomear o **mesmo** registro do cartão de origem. Plano de execução: [Fase 0](./2026-09-29-phase-0-execution-plan.md).
- **Aceite:** para cartões do primeiro, de um mês intermediário e do último mês, nas duas ordenações, o ID carregado na edição e na confirmação de exclusão corresponde ao ID do cartão selecionado; testar com dados sintéticos, sem apagar registros reais.

### [P1] O fluxo principal não mantém a ação “Salvar” acessível

- **Evidência observada:** na viewport principal, o conteúdo do formulário ultrapassa a área visível e o CTA fica abaixo da dobra. O cadastro usa uma folha inferior rolável; abrir o teclado reduz ainda mais a área útil.
- **Impacto na tarefa:** após abastecer, a pessoa precisa lembrar que há mais conteúdo e rolar para concluir. Com o teclado aberto, pode perder referência dos campos restantes ou do botão.
- **Direção de design:** transformar o cadastro na experiência central, com CTA persistente no rodapé da folha e `safe-area`/teclado respeitados. Reduzir a altura do cabeçalho do formulário; deixar data/hora como “Agora” editável; agrupar dados em “Do abastecimento” e “Do veículo”; apresentar preço/litro, distância e km/L como resultados compactos, não como campos editáveis.
- **Aceite:** CTA sempre alcançável; teclado não encobre campo ativo nem botão; erros levam ao campo que precisa de correção sem apagar os valores preenchidos.

### [P1] Hierarquia de leitura é fraca para consulta rápida e acessibilidade

- **Evidência observada:** contraste medido de **2,55:1** para `--muted` (`#5a5a90`) sobre cartão `#1e1e35`, abaixo de 4,5:1 para texto comum. O rótulo `.stat-label` mede aproximadamente **9,28 px**; datas/metadados ficam em torno de 11,5–12 px. O botão de registrar é visualmente um “+”, mas não tem nome acessível; diversos rótulos não estão associados aos campos. Na tela inicial, “Gasto no Mês” é mensal, enquanto “Média km/L” e “R$/L Médio” são calculados sobre todos os registros sem indicação do período.
- **Impacto na tarefa:** no celular, valores e contexto ficam mais difíceis de localizar rapidamente; símbolos isolados dependem de familiaridade e não comunicam a ação a leitor de tela.
- **Direção de design:** reservar contraste e tamanho fortes para valor, litros, km e rótulos essenciais; atenuar apenas metadados dispensáveis. Indicar explicitamente o período das médias ou alinhar o período das três métricas; preservar o tema escuro, mas validar legibilidade em brilho alto/ambiente claro. Dar rótulos explícitos a todos os campos e ações; permitir zoom; usar estados de foco claros.
- **Aceite:** texto AA (4,5:1 normal; 3:1 grande), alvos de toque de pelo menos 44×44 px e nomes acessíveis descritivos. Em teste rápido, encontrar litros, valor total, km e salvar sem depender apenas de cor ou ícone.

### [P2] Há oportunidade de reduzir digitação repetida sem automatizar dados arriscados

- **Evidência observada:** ao iniciar novo registro, o formulário é reiniciado; combustível volta para “Gasolina” e nenhum posto fica selecionado, mesmo existindo uma lista de postos usados. A pessoa precisa conferir essas escolhas em cada abastecimento.
- **Oportunidade, não defeito comprovado:** como o app é pessoal e pode haver repetição de posto/combustível por perfil, escolhas frequentes poderiam encurtar o caminho. Não há evidência suficiente para assumir que o último posto ou combustível é sempre o correto.
- **Direção de design:** oferecer “Recentes”/favoritos de posto e combustível por perfil, mantendo a seleção explícita. Como experimento opcional, testar “Repetir último abastecimento” com revisão visível dos dados; não copiar silenciosamente litros, valor ou hodômetro.
- **Aceite:** medir se a sugestão reduz toques/tempo sem aumentar registros com posto, combustível ou valores incorretos; sempre permitir corrigir antes de salvar.

## Roadmap de evolução

### Fase 0 — Integridade antes de redesenhar

1. Corrigir o vínculo cartão → registro nas ações Editar/Excluir para usar ID estável.
2. Cobrir múltiplos meses e ambas as ordenações com testes de correspondência entre cartão, formulário aberto e diálogo de exclusão.
3. Só depois prosseguir com mudanças de layout: melhorar a fluidez não pode ampliar o risco de uma ação atingir outro registro.

### Fase 1 — Registro rápido e confiável (prioridade após a correção de integridade)

1. Redesenhar o formulário como folha móvel orientada à tarefa, com CTA fixo e compatível com teclado e áreas seguras.
2. Reorganizar os campos para separar o que a pessoa informa do que o sistema calcula. Manter cálculos úteis (preço/L, km rodados, km/L) visíveis, mas compactos.
3. Tornar o caminho de teclado eficiente: teclados numéricos apropriados, avanço “Próximo/Concluir”, foco e validação no campo relevante.
4. Usar data/hora atual como padrão editável e exibir a leitura de hodômetro anterior como contexto, quando disponível.
5. Ao salvar, confirmar com clareza e mostrar um resumo curto do que foi registrado; em falha, manter os dados para tentar novamente.

**Como validar:** executar a tarefa no aparelho real em 433×762, com uma mão e teclado aberto; observar tempo, quantidade de rolagens, erros, correções e abandono. Estabelecer uma linha de base antes de definir metas numéricas.

### Fase 2 — Leitura, acessibilidade e ergonomia

1. Ajustar contraste/tamanhos dos textos essenciais e revisar legibilidade com brilho alto e no exterior.
2. Associar labels e controles, nomear ações de ícone, restaurar zoom e completar semântica/foco dos diálogos.
3. Aumentar áreas de toque e espaçamento entre ações destrutivas e de edição.
4. Na tela inicial, dar mais destaque ao próximo passo (“Registrar”) e reduzir competição visual de metadados secundários; preservar métricas úteis sem sacrificar espaço de histórico.

**Como validar:** inspeção de contraste, árvore acessível, leitor de tela, navegação por teclado e teste de toque no dispositivo.

### Fase 3 — Personalização útil e análise de consumo

1. Testar recentes/favoritos por perfil para posto e combustível; selecionar somente após confirmação da pessoa.
2. Evoluir a análise mensal para responder perguntas práticas: gasto ao longo do tempo, evolução de preço/L e eficiência, com período e contexto explícitos.
3. Manter tendências na área de análise, sem inserir gráficos ou decisões extras no fluxo de registro.

**Como validar:** observar se a pessoa encontra o posto certo mais rápido e se os indicadores ajudam uma decisão real; remover sugestões que aumentem erro ou ruído.

## Fluxo-alvo proposto

1. Abrir “Novo abastecimento” com data/hora atual já preenchida.
2. Informar os dados vistos na bomba/comprovante (combustível, litros e valor) e o km do painel.
3. Confirmar um posto recente/favorito, se aplicável; marcar abastecimento parcial quando necessário.
4. Conferir um resumo compacto dos cálculos e salvar sem precisar procurar o CTA.
5. Receber confirmação clara e voltar ao histórico atualizado.

O fluxo é uma hipótese de design a testar: a ordem final dos campos deve acompanhar como você obtém os dados após abastecer, sem impor escolhas presumidas.

## Limites da inspeção

A primeira inspeção foi feita via `file://` com dados sintéticos porque o mock em `http://localhost:5000/exec` estava indisponível (`ERR_CONNECTION_REFUSED`). Posteriormente, com autorização, testei criação, edição e exclusão no perfil Luccas da página publicada e removi os dados de teste. **Não executei** edição/exclusão em meses antigos, pois a inspeção dos índices mostrou risco de atingir registros reais. DPR 2,81 e teclado virtual não foram emulados; medidas se referem à viewport CSS aproximada de 433×762. O teste no navegador com viewport redimensionada não substitui uma validação no aparelho físico ao ar livre.
