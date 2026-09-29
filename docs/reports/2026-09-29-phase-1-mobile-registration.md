# Fase 1 — registro móvel rápido e confiável (29/09/2026)

## Objetivo e escopo

Partindo da [auditoria UI/UX](./2026-09-29-ui-ux-audit.md), tornar o cadastro utilizável em 433×762 CSS px no carro, com o teclado aberto. Não alterar a API nem os arquivos em `GAS/`: esta fase modifica apenas o cliente web em `index.html`, `styles.css` e `script.js`.

## Contrato de interação

- Preservar os campos e payload existentes, mantendo data/hora atual como padrão editável e sem escolher posto automaticamente.
- Separar os dados informados (data, combustível, litros, valor, hodômetro e posto) da prévia calculada (preço/L, distância e consumo); mostrar o hodômetro anterior somente quando existir.
- Manter Salvar em rodapé fixo da folha, com o conteúdo rolando independentemente. Quando a viewport visual encolher com o teclado, manter o campo ativo e o rodapé visíveis.
- Levar entradas inválidas ao campo correspondente sem perder o formulário; em erro de rede, manter os valores para nova tentativa; após sucesso, exibir litros, valor e km no feedback.

## Execução e verificação

Implementado em 29/09/2026 na branch `feat/phase-1-mobile-registration`. O rodapé agora é persistente, o conteúdo da folha rola, os campos numéricos usam teclado adequado e Enter avança de litros para valor e para km. Campos e cálculos permanecem associados à mesma lógica de registro e edição.

- `node --test tests\record-actions.test.js`: 8 testes passaram, incluindo regressões da Fase 0, valor inválido, hodômetro anterior e manutenção de dados após falha.
- Navegador local com registros sintéticos: prévia de 32,5 L, R$ 195 e 42.500 km mostrou R$ 6,000/L, 500 km e ~15,38 km/L, com hodômetro anterior 42.000 km. Uma entrada `12abc` não enviou requisição, permaneceu no campo e recebeu foco e aviso.
- Verificado em 375×667, 433×762 e 1280×800 CSS px, sem overflow horizontal. Em viewport reduzida a 433×400 para simular espaço ocupado pelo teclado, o hodômetro focado e o rodapé permaneceram dentro da área visível. Esta simulação **não** reproduz teclado físico/virtual nem DPR 2,81.
- Sem alterações em `GAS/` e sem requisições de escrita à API real. O mock local não estava disponível; é necessária validação manual no aparelho físico com teclado aberto e leitura em ambiente externo antes de considerar a ergonomia concluída. A Fase 2 continua responsável pelo contraste e demais controles fora do formulário.
