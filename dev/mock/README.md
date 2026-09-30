# Mock local

Execute `node dev\mock\server.js` **na raiz do repositório** e abra <http://localhost:5000/?mock=1>. Node.js 18+ é suficiente; sem instalação. O servidor escuta somente `127.0.0.1:5000`, serve os seis arquivos públicos do app e expõe `POST /exec` para as oito ações definidas em `shim.js`. Não lê nem grava dados reais e não serve `GAS/`, `tests/` ou `dev/` via HTTP.

`fixtures.json` contém perfis, postos e abastecimentos **totalmente fictícios**. As alterações ficam apenas em memória, isoladas por cenário, e desaparecem ao reiniciar o processo. `POST /__mock/reset` restaura as fixtures, e `GET /__mock/health` retorna os cenários disponíveis. Após resetar, abra o app com `&reset=1` para descartar caches locais antigos antes do novo teste.

Os parâmetros `scenario=empty`, `read-error`, `write-error` e `slow` estão detalhados no [README principal](../../README.md). Para acrescentar um cenário, atualize `server.js`, os testes em `tests/mock-server.test.js` e a tabela de cenários no README principal. Preserve o contrato do `google.script.run` em `shim.js` e a separação entre perfis. Este mock reproduz a forma das respostas para testar UI, **não** substitui testes das regras de negócio em `GAS/`.
