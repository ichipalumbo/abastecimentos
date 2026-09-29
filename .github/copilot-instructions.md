# Instruções do repositório

## Ambiente (Windows / PowerShell)

- O terminal é Windows PowerShell 5.1: não usar `&&`, `||`, `??` ou `?.`; encadear com `;` e checar sucesso com `if ($?) { ... }`.
- Não passar scripts Node/JS inline com `node -e "..."` contendo aspas ou regex: o PowerShell quebra o parse. Preferir Python ou um arquivo temporário.
- Para scripts inline longos, usar here-string piped: `@'` ... `'@ | python -`.
- Antes de comandos Python com saída acentuada, definir `$env:PYTHONIOENCODING='utf-8'` para evitar caracteres trocados no terminal. Os arquivos do repositório são UTF-8.
- O Python já tem `pyyaml` instalado (`import yaml`).

## Custom agents

- Agentes ficam em `.github/agents/*.agent.md`.
- No frontmatter YAML, coloque entre aspas duplas os valores que contenham `: `, `#` ou aspas; use aspas simples por dentro.
- Validar o frontmatter após editar:

  ```powershell
  $env:PYTHONIOENCODING='utf-8'; python -c "import yaml,io,glob;[print(f, yaml.safe_load(io.open(f,encoding='utf-8').read().split('---')[1])) for f in glob.glob('.github/agents/*.agent.md')]"
  ```

## Documentação

- Auditorias em `docs/auditorias/`, planos de execução em `docs/planos/`, índice em `docs/README.md`.
