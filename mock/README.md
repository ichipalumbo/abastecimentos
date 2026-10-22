Instruções para rodar o servidor mock localmente

Pré-requisitos:
- Node.js 14+

Passos:
1. Abra o terminal na pasta `mock`
2. Instale dependências:

```bash
npm init -y
npm install express cors
```

3. Inicie o mock:

```bash
node server.js
```

4. Abra `index.html` no navegador (ou rode um servidor estático). A `shim.js` está configurada para apontar para `http://localhost:5000/exec` quando `LOCAL_MOCK` está `true`.

Observe: o `mock/mock-data.json` contém dados iniciais para `Luccas` e `Josy`.
