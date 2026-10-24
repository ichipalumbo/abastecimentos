# Auditoria UI/UX — Abastecimentos

Data da análise: 28 de setembro de 2026  
Escopo: interface mobile da PWA, fluxos de seleção de veículo, histórico, análise, postos e cadastro de abastecimento.

## Resumo executivo

O app possui uma boa base visual para uso mobile: tema escuro consistente, hierarquia de cards clara, navegação inferior persistente, área de toque confortável em controles importantes e cálculos de apoio no formulário.

Os maiores ganhos de experiência vêm de três frentes: corrigir a associação entre ações e registros, reduzir a ambiguidade e o risco de erro no cadastro e elevar o nível de acessibilidade dos componentes interativos.

## Pontos fortes

- Estrutura mobile-first coerente, com navegação inferior e CTA de registro sempre disponível.
- Hierarquia visual clara entre cabeçalho, indicadores, histórico e detalhes do registro.
- Uso consistente de superfícies, bordas, raios e cores no tema escuro.
- Alvos de toque adequados em vários controles principais, como fechamento de modal, chips de posto e ações de posto.
- Boas pistas de sistema: carregamento, estados vazios, confirmação de exclusão e cálculos de preço/litro, quilometragem e eficiência.
- Separação das áreas de histórico, análise e gerenciamento de postos é apropriada para o escopo atual.

## Achados e recomendações priorizadas

### P0 — Corrigir antes de evoluir a interface

#### 1. Ações podem operar no registro errado

**Problema:** os botões de editar e excluir recebem o índice local do grupo mensal renderizado, mas as ações posteriores consultam o array global `records`. Quando há mais de um mês ou a ordenação muda, o índice deixa de representar o mesmo registro.

**Impacto:** risco alto de editar ou excluir abastecimento diferente do escolhido; isso quebra confiança no produto.

**Recomendação:** passar e usar sempre o `ID` estável do registro. Localizar o item por ID imediatamente antes de editar, confirmar exclusão ou persistir a alteração.

**Referência:** `script.js`, renderização das ações de registro e funções `openEdit`/`askDelete`.

#### 2. Botão principal sem nome acessível

**Problema:** o botão verde “+” de registrar não tem texto visível, `aria-label` ou `title`.

**Impacto:** leitores de tela anunciam um botão sem nome; usuários novos também podem não inferir a ação imediatamente.

**Recomendação:** incluir `aria-label="Registrar abastecimento"`; considerar uma dica de primeira visita ou rótulo curto em telas mais largas.

**Referência:** `index.html`, navegação inferior.

#### 3. Formulário permite erro sem prevenção suficiente

**Problema:** campos de litros e valor aceitam texto livre; o aviso de odômetro menor/igual ao anterior não impede o salvamento; erros são apresentados principalmente por toast.

**Impacto:** registros inconsistentes, cálculo de consumo incorreto e recuperação difícil para o usuário.

**Recomendação:**

- Validar números positivos e formato decimal antes do envio.
- Exibir mensagem junto ao campo inválido e mover o foco para ele.
- Bloquear ou pedir confirmação explícita para KM menor/igual ao registro anterior.
- Destacar claramente a consequência de marcar abastecimento parcial.

**Referência:** `index.html`, campos do formulário; `script.js`, `calcKm` e submissão.

### P1 — Melhorar o fluxo central de cadastro

#### 4. Tornar a seleção de posto explícita

**Problema:** o abastecimento pode ser salvo sem posto, gerando “Posto não informado” no histórico.

**Recomendação:** tornar o posto obrigatório ou disponibilizar uma opção explícita “Não informado”. Para listas maiores, incluir busca ou recente/favorito no seletor.

#### 5. Reordenar o formulário conforme o contexto de uso

**Problema:** o posto aparece depois de cálculos e dados de hodômetro, embora seja uma informação natural no momento do abastecimento.

**Recomendação de sequência:**

1. Data e hora
2. Posto
3. Combustível e tipo de abastecimento
4. Litros e valor total
5. Odômetro
6. Resumo calculado
7. Salvar

#### 6. Diferenciar entrada de resultado calculado

**Problema:** preço por litro, KM rodados e km/L prévia parecem inputs convencionais apesar de serem somente leitura.

**Recomendação:** agrupá-los em um card “Resumo deste abastecimento”, com valores e explicações curtas. Isso reduz a impressão de que o usuário precisa preencher ou corrigir esses campos.

#### 7. Remover ambiguidade do controle “Parcial?”

**Problema:** um interruptor com o rótulo “Parcial” exige interpretar se ligado significa sim ou não e não explica o impacto no cálculo.

**Recomendação:** usar escolha explícita entre “Completo” e “Parcial”, acompanhada do texto “Abastecimentos parciais não entram no cálculo de consumo do intervalo”.

#### 8. Proteger dados não salvos ao fechar o modal

**Problema:** tocar no fundo do modal fecha o formulário e pode descartar dados preenchidos sem confirmação.

**Recomendação:** detectar alterações; se houver conteúdo modificado, pedir confirmação antes de descartar. Manter o fechamento direto quando nada foi alterado.

#### 9. Dar retorno de sucesso acionável

**Problema:** o toast confirma a ação, mas não oferece recuperação imediata.

**Recomendação:** após salvar ou excluir, mostrar feedback contextual como “Abastecimento de R$ 150,00 salvo” e, em exclusões, uma ação “Desfazer” com janela curta.

### P1 — Melhorar leitura e valor dos dados

#### 10. Contextualizar os indicadores da home

**Problema:** gasto mensal, média de km/L e preço médio são úteis, mas não indicam tendência ou período de cálculo de forma suficiente.

**Recomendação:** mostrar comparação com período anterior ou uma tendência simples. Exemplo: “R$ 420,00 · 8% acima de agosto”. Especificar o período de km/L, como “últimos 3 abastecimentos”.

#### 11. Incluir filtro de período na Análise

**Problema:** a home usa o mês atual e a análise soma o histórico completo. A mudança de escopo não é evidente.

**Recomendação:** adicionar filtro “Este mês”, “3 meses”, “12 meses” e “Todo o período”, sempre exibindo qual seleção está ativa.

#### 12. Transformar análise em apoio à decisão

**Problema:** a seção mensal apresenta totais, mas não evidencia evolução ou anomalias.

**Recomendação:** adicionar série temporal simples para preço/L e km/L, além de destaques como “melhor eficiência”, “maior preço/L” e “variação em relação ao mês anterior”.

#### 13. Simplificar o cabeçalho mensal do histórico

**Problema:** o grupo mensal reúne quatro micro-métricas em chips, que competem visualmente com os registros.

**Recomendação:** priorizar gasto total e litros no cabeçalho. Exibir preço médio e eficiência em detalhe expansível ou no toque do mês.

### P2 — Consistência visual, responsividade e acessibilidade

#### 14. Aumentar tamanho e contraste de textos auxiliares

**Problema:** diversos rótulos usam tamanhos próximos de 9–11 px e cor muito discreta sobre fundo escuro.

**Impacto:** leitura difícil em ambiente externo, com brilho baixo ou por pessoas com visão reduzida.

**Recomendação:** elevar textos secundários para ao menos 12–14 px e validar contraste AA do WCAG, especialmente para `--muted` e rótulos de formulário.

#### 15. Criar estados de foco visíveis

**Problema:** há feedback de toque (`:active`) em muitos botões, mas não há padrão global de `:focus-visible`.

**Recomendação:** aplicar anel de foco consistente a botões, chips, links e controles customizados. Isso beneficia teclado, desktop e tecnologias assistivas.

#### 16. Tornar modais semanticamente acessíveis

**Recomendação:**

- Adicionar `role="dialog"`, `aria-modal="true"` e associação com o título.
- Mover o foco ao primeiro controle útil ao abrir.
- Reter foco dentro do modal.
- Devolver foco ao acionador ao fechar.
- Adicionar rótulos acessíveis aos botões de fechar e aos ícones de editar/excluir.

#### 17. Adicionar breakpoints responsivos

**Problema:** o layout depende de grids fixos de duas e três colunas, sem regras específicas para telas muito estreitas ou grandes.

**Recomendação:**

- Abaixo de 360 px, empilhar campos em duas colunas quando necessário.
- Limitar a largura do conteúdo a aproximadamente 720 px em telas grandes.
- Em tablet/desktop, usar painel lateral ou grade para análise, sem esticar excessivamente cards e textos.

#### 18. Padronizar componentes e remover estilos inline

**Problema:** cabeçalhos e toolbars usam estilos diretamente no HTML, dificultando consistência e manutenção.

**Recomendação:** criar classes reutilizáveis para barra de seção, ações secundárias, cabeçalho de página e espaçamentos.

### P2 — Arquitetura de informação e linguagem

#### 19. Clarificar se a escolha inicial representa pessoa ou veículo

**Problema:** a pergunta “Quem vai abastecer hoje?” apresenta simultaneamente pessoa e veículo (“Luccas / IDEA”).

**Recomendação:** se o filtro é o carro, usar “Selecione o veículo”; se é o perfil, separar perfil e veículo. Exibir o veículo selecionado de maneira consistente no cabeçalho da home.

#### 20. Usar emoji com moderação

**Problema:** emojis dão personalidade, mas mudam de aparência entre sistemas e disputam atenção com informações numéricas.

**Recomendação:** manter emojis em momentos de tom leve, mas adotar ícones SVG consistentes para navegação, ações, estado e indicadores funcionais.

#### 21. Completar estados vazios em todas as áreas

**Recomendação:** Análise e Postos devem orientar o próximo passo quando não houver dados. Exemplo: “Registre seu primeiro abastecimento para acompanhar preço e consumo” com CTA direto.

## Roadmap recomendado

| Fase | Entregas | Resultado esperado |
| --- | --- | --- |
| 1. Confiabilidade | Correção de ações por ID, validação de formulário, nome acessível do CTA | Evita erro de dados e melhora a confiança no app |
| 2. Cadastro | Nova ordem dos campos, seleção de posto, resumo calculado, proteção contra descarte | Menos tempo e menos dúvidas ao registrar |
| 3. Dados | Filtros de período, comparativos e tendências | Análise que orienta decisões reais |
| 4. Qualidade | Acessibilidade de modais/foco, contraste, breakpoints e padronização visual | Experiência inclusiva e consistente em mais dispositivos |

## Referências principais no código

- `index.html`: seleção de veículo, métricas da home, navegação, formulário e modais.
- `script.js`: ordenação, renderização de histórico, cálculo de métricas, formulário e estados de carregamento.
- `styles.css`: tokens visuais, tamanhos tipográficos, navegação inferior, modais, campos e feedbacks.
