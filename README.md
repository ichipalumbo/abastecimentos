# abastecimentos

## Visão geral

Este projeto é uma PWA leve para controlar abastecimentos de veículos, com histórico de registros, análises de consumo, cadastro de postos e suporte a desenvolvimento local via mock backend.

O app original usa Google Apps Script para backend, mas o repositório também inclui um servidor de mock local (`mock/server.js`) para testes offline e desenvolvimento rápido.

## Principais funcionalidades

- Cadastro de abastecimentos com data, posto, preço, litros e quilometragem
- Histórico agrupado por mês/ano
- Apresentação de métricas rápidas (mês atual, km/l, preço médio)
- Ordenação de histórico por recente/antigo
- Cache local para reduzir requisições e permitir atualização manual
- Localização para Brasil (formatação de moeda, datas e números)
- Página de gerenciamento de postos
- Mock backend que recalcule valores de `KM_Trip` e `KM/L Trip`

## Estrutura do projeto

- `index.html` - interface principal da aplicação
- `styles.css` - estilos visuais e layout
- `script.js` - lógica do app, carregamento de dados, renderização, cache e controle de navegação
- `shim.js` - adaptador que emula `google.script.run` e envia requisições para o backend correto
- `mock/server.js` - servidor de mock Express para desenvolvimento local
- `mock/mock-data.json` - dados de exemplo usados pelo mock backend
- `manifest.json` - configuração da PWA

## Uso local

1. Inicie o mock backend:

```powershell
cd mock
npm install
npm start
```

2. Abra a aplicação no navegador apontando para um servidor local ou abra `index.html` via Live Server.

3. O `shim.js` detecta automaticamente `localhost` e usa o mock backend em vez do Apps Script.

## Como funciona o mock

- Em desenvolvimento local, `shim.js` usa `http://localhost:5000/exec`
- Em produção, o app usa o endpoint real do Apps Script
- O mock backend responde às ações do frontend e recalcula automaticamente os campos derivados de quilometragem

## Notas importantes

- Não inclua chaves secretas ou tokens sensíveis neste repositório. O token atual em `shim.js` é só para desenvolvimento/local.
- Se for publicar o app online, verifique se `shim.js` não está apontando para `localhost`.

## Contato

- Projeto mantido por Luccas
