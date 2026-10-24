# Auditoria de UI/UX, Acessibilidade WCAG 2.2 AA e Roadmap de Evolução — Abastecimentos

> **Data:** 24 de outubro de 2026  
> **Status:** Diagnóstico técnico aprovado e plano diretor de execução  
> **Produto:** Abastecimentos (PWA mobile-first para registro de combustível e gestão veicular)  
> **Ambiente Avaliado:** `index.html`, `styles.css`, `script.js`, `shim.js`, cenários de mock local e testes automatizados  

---

## 1. Contexto do Projeto e Premissas

| Dimensão | Especificação |
|---|---|
| **Tipo de Produto** | Progressive Web App (PWA) pessoal estático (HTML/CSS/JS puro sem frameworks). |
| **Público-alvo** | Motoristas e proprietários de veículos em contexto de mobilidade urbana e rodoviária. |
| **Cenário de Uso** | Operação em pé na pista do posto de combustível ou no banco do motorista; operação com uma única mão; sob incidência de luz solar direta; tempo restrito (< 45 segundos por registro). |
| **Aparelho Prioritário** | Viewport nominal de 433 × 762 CSS px (DPR 2,81; ~1217 × 2141 px físicos), com tolerância rigorosa para telas compactas de 320 × 568 CSS px. |
| **Premissas Inegociáveis** | Nenhuma regra de persistência ou cálculo de consumo no backend Google Apps Script (`GAS/`) deve ser desestabilizada. O app deve manter suporte integral offline com dados sintéticos ou em cache. |

---

## 2. Diagnóstico Detalhado por Lente e Severidade

### 🔴 Severidade Crítica (P0)
*Falhas que provocam corrupção silenciosa de dados, quebram diretrizes normativas de acessibilidade (WCAG 2.2 AA) ou deixam o usuário sem recuperação diante de falhas de rede.*

---

#### Item 1.1 — Falha Severa de Contraste Visual em Avatares e Chips de Metadados
- **Onde ocorre:** Tela de Seleção de Usuário (`index.html:48-69`, `styles.css:240-255`) e Chips de Histórico (`styles.css:593-619`).
- **Problema identificado:** Violação direta de **WCAG 2.2 — Critério 1.4.11 (Non-text Contrast, mínimo 3:1)** e **Critério 1.4.3 (Contrast Minimum, mínimo 4.5:1)**.
  1. No avatar do carro vermelho (`.car-red svg`), o SVG aplica `#cb0f01` sobre fundo `#322a52` a `#241e3a`. O contraste apurado é de míseros **1.35:1** (praticamente invisível). O carro prata (`#918982`) atinge apenas **2.4:1**.
  2. Nos chips de histórico `.chip.blue` (`#6c8fff` sobre fundo dim `#292e50`) e `.chip.purple` (`#a78bfa`), a relação de contraste fica em **3.8:1** e **4.1:1**, abaixo dos 4.5:1 exigidos para fontes de 12px.
- **Impacto no usuário:** Sob o sol forte no posto, o usuário não consegue identificar a silhueta do veículo para selecionar o perfil correto e tem dificuldade em ler combustível e distâncias nos cartões.
- **Solução recomendada:**
  - Clarear os ícones dos veículos e tokens de texto dos chips para garantir contraste mínimo de 4.8:1 contra suas superfícies.
- **Antes vs. Depois:**
  ```css
  /* ANTES (styles.css:251-252) */
  .us-avatar.car-red svg { color: #cb0f01; }      /* 1.35:1 - Inaceitável */
  .us-avatar.car-silver svg { color: #918982; }   /* 2.4:1 - Reprovado */

  /* DEPOIS */
  .us-avatar.car-red svg { color: #ff5c5c; }      /* > 4.8:1 sobre #241e3a */
  .us-avatar.car-silver svg { color: #e2e2f4; }   /* > 10:1 sobre #241e3a */
  ```

---

#### Item 1.2 — Submissão Permitida de Hodômetro Regressivo (Corrupção de Dados)
- **Onde ocorre:** Formulário de Registro/Edição (`script.js:841-869` e `script.js:1108-1113`).
- **Problema identificado:** Violação da **Heurística de Nielsen nº 5 (Prevenção de Erros)** e **Heurística nº 9 (Reconhecimento e Recuperação de Erros)**.
  - Se o usuário digita uma quilometragem menor ou igual à anterior (ex.: digita 9.300 km em vez de 93.000 km), `calcKm()` apenas atualiza o input de prévia para `"⚠️ KM ≤ anterior"`.
  - A rotina de submissão `submitForm()` valida apenas se o campo é inteiro e positivo (`value > 0`), permitindo que o abastecimento seja enviado com hodômetro inconsistente, corrompendo irreversivelmente os cálculos de km rodados e eficiência na planilha.
- **Impacto no usuário:** Erros acidentais de digitação passam batidos e geram relatórios e médias de consumo completamente distorcidos no histórico vitalício.
- **Solução recomendada:**
  - Bloquear a submissão caso `kmTotal <= prevKmTotal`, adicionando classe de erro no campo (`aria-invalid="true"`), com foco automático e toast explicativo de erro.
- **Antes vs. Depois:**
  ```javascript
  // ANTES (script.js:863-868)
  const valid = decimal ? /^\d+(?:[.,]\d+)?$/.test(String(input.value).trim()) : Number.isInteger(value);
  if (valid && value > 0) continue;

  // DEPOIS
  if (id === 'f-kmtotal') {
    if (prevKmTotal !== null && kmTot <= prevKmTotal) {
      showToast(`⚠️ O KM atual (${kmTot}) não pode ser menor que o anterior (${prevKmTotal})`, 'err');
      input.focus();
      input.classList.add('is-invalid');
      input.setAttribute('aria-invalid', 'true');
      return;
    }
  }
  ```

---

#### Item 1.3 — Feedback Assíncrono com Race Condition e Timer Não Cancelável
- **Onde ocorre:** Sistema de Toast e Notificações (`script.js:1126-1132` e `styles.css:1625-1645`).
- **Problema identificado:** Violação da **Heurística de Nielsen nº 1 (Visibilidade do Estado do Sistema)** e **WCAG 2.2 — 2.2.1 (Timing Adjustable)**.
  - `showToast()` executa `setTimeout(..., 3200)` sem cancelar a execução anterior via `clearTimeout`. Um aviso transitório (ex.: `"⏳ Excluindo..."`) sucedido por confirmação ou erro fecha a nova mensagem prematuramente.
  - Além disso, `.toast` possui `pointer-events: none;`, impossibilitando botões interativos de "Tentar novamente" em caso de falha de conexão.
- **Impacto no usuário:** Em conexões 3G instáveis no posto, mensagens de erro ou sucesso piscam e desaparecem em milissegundos. O motorista fica sem saber se o registro foi salvo e corre o risco de submeter o abastecimento duas vezes.
- **Solução recomendada:**
  - Manter referência do timer ativo e executar `clearTimeout` a cada chamada.
  - Aumentar o tempo de leitura para 5 a 6 segundos em erros e permitir interação no toast quando houver retry.
- **Antes vs. Depois:**
  ```javascript
  // ANTES (script.js:1126)
  function showToast(msg, type) {
    const el = document.getElementById('toast');
    el.textContent = msg; el.className = `toast show ${type||''}`;
    setTimeout(() => el.className = 'toast', 3200);
  }

  // DEPOIS
  let toastTimeoutId = null;
  function showToast(msg, type) {
    const el = document.getElementById('toast');
    if (toastTimeoutId) clearTimeout(toastTimeoutId);
    el.setAttribute('role', type === 'err' ? 'alert' : 'status');
    el.setAttribute('aria-live', type === 'err' ? 'assertive' : 'polite');
    el.textContent = msg;
    el.className = `toast show ${type || ''}`;
    const delay = type === 'err' ? 5500 : 3500;
    toastTimeoutId = setTimeout(() => { el.className = 'toast'; }, delay);
  }
  ```

---

### 🟡 Severidade Moderada (P1)
*Atritos de usabilidade perceptíveis, dissonância cognitiva em microcópias e tipografia com legibilidade deficiente em campo.*

---

#### Item 2.1 — Tipografia de Rótulos e Metadados Abaixo do Limiar de Legibilidade (< 11px)
- **Onde ocorre:** Rótulos de formulário (`styles.css:1224`), títulos de seção (`styles.css:451`), cartões mensais (`styles.css:816`) e resumo analítico (`styles.css:706`).
- **Problema identificado:** Violação de **Consistência Visual e Legibilidade Mobile**.
  - São múltiplos seletores com fontes entre `0.61rem` (~9.76px) e `0.68rem` (~10.88px).
- **Impacto no usuário:** Sob iluminação natural forte ou vibração no interior do veículo, as informações de contexto ficam ilegíveis, forçando esforço visual desnecessário.
- **Solução recomendada:**
  - Adotar piso tipográfico de **12px (0.75rem)** para metadados secundários e **13px–14px (0.8125rem–0.875rem)** para rótulos de campos ativos.
- **Antes vs. Depois:**
  ```css
  /* ANTES */
  .form-label { font-size: 0.68rem; }
  .month-stat-lbl { font-size: 0.61rem; }

  /* DEPOIS */
  .form-label { font-size: 0.8125rem; font-weight: 600; }
  .month-stat-lbl { font-size: 0.75rem; }
  ```

---

#### Item 2.2 — Inconsistência Semântica nos Empty States e Apelo à Ação
- **Onde ocorre:** Estados vazios do Histórico (`script.js:370-374`) e de Postos (`script.js:575-578`).
- **Problema identificado:** Violação da **Heurística de Nielsen nº 2 (Correspondência com o Mundo Real)** e **nº 4 (Consistência e Padrões)**.
  1. O estado vazio instrui: *"Toque em **Registrar** para começar!"*, mas não existe botão com esse texto visível (apenas o botão flutuante verde com glifo `+`).
  2. O estado vazio de postos diz: *"**Clique** em + Novo Posto"*, vocabulário desktop inadequado para um PWA touch.
- **Impacto no usuário:** Dúvida de navegação inicial. O usuário procura pelo rótulo textual citado e não o encontra de imediato na barra de abas.
- **Solução recomendada:**
  - Incorporar botão de ação primária contextual dentro do próprio empty state e padronizar o vocabulário para toque móvel.
- **Antes vs. Depois:**
  ```html
  <!-- ANTES -->
  <p>Nenhum abastecimento ainda.<br>Toque em <strong>Registrar</strong> para começar!</p>

  <!-- DEPOIS -->
  <p>Nenhum abastecimento registrado ainda.</p>
  <button type="button" class="btn-action btn-edit" style="margin: 16px auto; max-width: 220px;" onclick="openModal()">
    + Novo Abastecimento
  </button>
  ```

---

#### Item 2.3 — Sobrecarga Semântica da Cor Âmbar e Iconografia Híbrida
- **Onde ocorre:** Chips de listagem (`script.js:434-437`), botões de navegação e diálogos de confirmação (`index.html:181-197, 333-362`).
- **Problema identificado:** Violação de **Consistência Visual (UI)** e **WCAG 2.2 — 1.4.1 (Uso de Cor)**.
  1. A cor âmbar (`--amber: #fbbf24;`) é utilizada simultaneamente para **alerta/atenção** (`⚠️ Parcial`) e para **informação financeira rotineira** (`R$ 5,89/L`).
  2. O modal de exclusão de posto usa o ícone `🏪` e o verbo *"Remover"*, enquanto o de abastecimento usa `🗑️` e o verbo *"Excluir"*.
- **Impacto no usuário:** Dificuldade em distinguir alertas operacionais (que cancelam cálculo de km/L) de dados normais de preço.
- **Solução recomendada:**
  - Reservar âmbar estritamente para estados de atenção/aviso (`⚠️ Parcial`). Mudar preço por litro para azul (`var(--blue)` / `var(--blue-dim)`).
  - Unificar a terminologia destrutiva para o verbo *"Excluir"* com ícone de lixeira em ambos os diálogos.

---

### 🟢 Severidade Baixa / Cosmética (P2)
*Refinamentos de micro-interações, affordance e semântica de formulário.*

---

#### Item 3.1 — Uso de Inputs Editáveis Readonly para Exibição de Cálculos
- **Onde ocorre:** Grid de prévia calculada no modal (`index.html:271-285`).
- **Problema identificado:** Elementos `<input class="calc" readonly>` confundem a navegação sequencial por teclado virtual e leitores de tela.
- **Solução:** Migrar para elementos semânticos `<output>` ou badges informativas com rótulo descritivo.

#### Item 3.2 — Falta de Destaque Visual em Linha para Campos com Erro
- **Onde ocorre:** Submissão do formulário com campos inválidos (`script.js:857-868`).
- **Problema identificado:** O script emite o toast de erro e foca o campo, mas não aplica borda de alerta (`.has-error`) permanente até a digitação.
- **Solução:** Adicionar classe CSS de erro (`border-color: var(--red)`) e removê-la no evento `input`.

---

## 3. Matriz de Priorização (Esforço × Impacto)

```
        IMPACTO
          ▲
          │   [1.2 Hodômetro]         [1.3 Toast & Retry]
     ALTO │   [1.1 Contraste SVGs]    [2.1 Tipografia ≥ 12px]
          │
          │   [2.2 CTA nos Empty]     [2.3 Cores & Ícones]
    MÉDIO │                           [3.2 Erro em Linha]
          │   [3.1 Output semântico]
    BAIXO │
          └──────────────────────────────────────────────► ESFORÇO
                   BAIXO (1-2h)               MÉDIO (1-2d)
```

---

## 4. Roadmap de Execução Estratégica

### 🚀 Sprint 1: Integridade e Hotfixes Vitais (Quick Wins) — [CONCLUÍDA EM 24/10/2026]
> **Objetivo:** Blindar a consistência do banco de dados e garantir acessibilidade visual básica imediata.  
> **Status:** Concluída com 18 testes automatizados validados.

- [x] **Tarefa 1.1:** Implementar trava de hodômetro regressivo no `submitForm()` impedindo envio de `kmTotal <= prevKmTotal` com feedback em linha e foco guiado.
- [x] **Tarefa 1.2:** Ajustar variáveis de cor dos avatares (`#ff6b6b` para Luccas e `#e2e2f4` para Josy) e chips para cumprir ratio ≥ 4.5:1.
- [x] **Tarefa 1.3:** Refatorar `showToast()` com armazenamento e cancelamento de `toastTimeoutId` (`clearTimeout`) e duração diferenciada para erro (5,5s).
- **Critério de Aceite da Sprint 1:**
  - [x] Teste automatizado validando rejeição de hodômetro menor que o anterior (`submitForm blocks regressivo odometer and marks field invalid`).
  - [x] Verificação no DevTools comprovando contraste ≥ 4.5:1 em todos os avatares e chips.
  - [x] Toast de erro não é interrompido por chamadas assíncronas concorrentes (`showToast cancels existing active timer and applies extended duration for errors`).

---

### 🎨 Sprint 2: Ergonomia Mobile, Acessibilidade e Empty States — [CONCLUÍDA EM 24/10/2026]
> **Objetivo:** Otimizar o conforto de leitura em telas de 320px a 433px e guiar novos fluxos.  
> **Status:** Concluída com piso tipográfico de 12px, CTAs de ação direta e elementos `<output>` semânticos validados.

- [x] **Tarefa 2.1:** Elevar a escala tipográfica mínima em `styles.css`: `.form-label`, `.month-stat-lbl`, `.section-sub` e `.summary-lbl` com piso de 12px (0.75rem) e labels ativos a 13px (0.8125rem).
- [x] **Tarefa 2.2:** Redesenhar os Empty States do histórico e postos com botão CTA direto (`+ Novo Abastecimento` e `+ Novo Posto`) e terminologia móvel ("Toque").
- [x] **Tarefa 2.3:** Trocar `<input readonly>` de cálculos no modal por tags semânticas `<output>` com atributos `for="..."`.
- **Critério de Aceite da Sprint 2:**
  - [x] Nenhuma regra CSS no arquivo contém declaração de texto legível inferior a `0.75rem` (12px).
  - [x] Usuário sem registros consegue iniciar o primeiro abastecimento tocando diretamente no botão central `.btn-empty-action`.
  - [x] Teclado virtual não estaciona em campos de resultado somente leitura ao navegar com tecla "Próximo".

---

### 🛡️ Sprint 3: Gramática Visual, Recuperação de Falhas e Consistência
> **Objetivo:** Padronizar vocabulário operacional, semântica de cores e estados resilientes de rede.  
> **Estimativa:** Médio esforço (2 a 3 dias).

- [ ] **Tarefa 3.1:** Desacoplar a cor âmbar: manter âmbar exclusivo para `⚠️ Parcial` e usar azul/neutro para métricas de `R$/L`.
- [ ] **Tarefa 3.2:** Unificar vocabulário destrutivo para *"Excluir"* e ícone `🗑️` tanto para registros quanto para postos cadastrados.
- [ ] **Tarefa 3.3:** Adicionar feedback visual em linha (`.is-invalid` com borda vermelha e `aria-invalid="true"`) em campos de validação rejeitados no formulário.
- [ ] **Tarefa 3.4:** Adicionar botão explícito de "Tentar novamente" nas mensagens de falha de carregamento da Home quando a rede falhar sem cache.
- **Critério de Aceite da Sprint 3:**
  - A cor amarela não é usada em nenhuma tag puramente informativa.
  - Ações destrutivas possuem semântica, cor e microcópia idênticas em toda a aplicação.
  - Falhas de conexão exibem caminho claro de recuperação sem obrigar o recarregamento total da página.

---

### 🏁 Sprint 4: Finish Gate e Homologação Mobile
> **Objetivo:** Validação física em condições de uso real e garantia de não-regressão.  
> **Estimativa:** 1 dia.

- [ ] Teste em aparelho físico sob luz solar direta em viewport 433 × 762 (DPR 2,81) e caso compacto 320 × 568.
- [ ] Validação de foco, navegação por teclado e leitor de tela (TalkBack / VoiceOver).
- [ ] Execução da suíte completa de testes automatizados (`node --test tests/*.test.js`).
- [ ] Conclusão de relatório datado de encerramento em `docs/reports/`.
