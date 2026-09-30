# Abastecimentos

PWA pessoal para registrar abastecimentos e consultar custos, consumo, histórico e postos. Frontend estático em HTML/CSS/JS; a versão publicada usa uma API Google Apps Script. **O backend local abaixo usa apenas dados fictícios em memória: não acessa a planilha nem a API real.**

## Estrutura

| Local | Finalidade |
| --- | --- |
| `index.html`, `styles.css`, `script.js`, `shim.js`, `manifest.json`, `icon.svg` | Arquivos públicos mantidos na raiz porque o GitHub Pages publica a partir dela e usa URLs relativas. |
| `dev/mock/` | Servidor local e fixtures sintéticas, sem dependências externas. Não publica nem persiste alterações. |
| `tests/` | Testes Node do comportamento do app e da API local. |
| `docs/reports/` | Auditorias e relatórios datados. |
| `docs/reference/` | Material de referência fornecido para auditorias. |
| `GAS/` | Cópia do backend Apps Script; não é necessária para rodar o mock. Ao alterar essa pasta, copiar as mudanças para o GAS manualmente. |

## Testar a interface localmente

Requer **Node.js 18+** (sem `npm install`, Express, Live Server ou variáveis de ambiente):

```powershell
node dev\mock\server.js
```

Abra **<http://localhost:5000/?mock=1>** em outra aba (se seu navegador não resolver `localhost`, use `http://127.0.0.1:5000/?mock=1`). A mensagem **AMBIENTE DE TESTE** indica que a página não usa a API real. Confira <http://localhost:5000/__mock/health> se não carregar; o servidor deve responder `{"status":"ok","environment":"mock",...}`. Para parar, pressione Ctrl+C no terminal. Se a porta 5000 já estiver ocupada, pare o processo que a usa antes de iniciar; o cliente local usa essa porta fixa.

> **Não abra `index.html` com `file://` ou Live Server para avaliar o mock.** O servidor local entrega a página e a API na mesma origem, evitando bloqueios de CORS e impedindo que o navegador acesse o GAS real. Sem o servidor, requisições em modo mock falham; nunca passam para produção.

### Cenários reproduzíveis

| URL local | Resultado |
| --- | --- |
| `/?mock=1` | Histórico e postos fictícios, dois perfis; criação/edição/exclusão somente em memória. |
| `/?mock=1&scenario=empty` | Histórico e postos vazios. |
| `/?mock=1&scenario=read-error` | Leitura da API falha com HTTP 503; útil para estados de erro. |
| `/?mock=1&scenario=write-error` | Leituras funcionam, gravações falham com HTTP 503. |
| `/?mock=1&scenario=slow` | Cada resposta da API atrasa cerca de 1,4 s; testar loading. |

Para restaurar todos os cenários às fixtures originais, mantenha o servidor rodando e execute:

```powershell
Invoke-RestMethod -Method Post http://127.0.0.1:5000/__mock/reset
```

Em seguida, recarregue `/?mock=1&reset=1` (adicione `&reset=1` à URL de outros cenários) para limpar **apenas os caches locais de registros/postos** do app nesse navegador. Também é possível parar e reiniciar o servidor: tudo é descartado, sem arquivos de dados modificados. O modo de teste separa os caches por cenário; o perfil selecionado continua lembrado no navegador até tocar em “Trocar usuário” ou limpar os dados do site.

Não use informações pessoais nas fixtures versionadas. Para medir UI, use 433×762 CSS px (DPR do aparelho principal: 2,81) e 320×568 como caso compacto. Simulação no desktop não substitui brilho externo, teclado virtual, áreas seguras ou toque no dispositivo.

## Testes automatizados

```powershell
node --test tests\*.test.js
```

Os testes da API iniciam seu próprio servidor em porta aleatória, sem alterar o mock aberto em `:5000`. Para a interface, navegue e faça operações somente no endereço local. O mock aproxima o contrato usado por `shim.js`, mas **não é uma réplica integral do cálculo no Google Apps Script**: valide decisões de negócio separadamente no backend.

## Publicação

Os arquivos públicos da raiz continuam no GitHub Pages; `dev/`, `tests/` e `docs/` são apenas material de desenvolvimento. A página publicada sem `?mock=1` usa o endpoint de produção configurado em `shim.js`. **Não publique a página com `?mock=1` como URL de uso real.** A cópia em `GAS/` não foi modificada pela infraestrutura de mock.
