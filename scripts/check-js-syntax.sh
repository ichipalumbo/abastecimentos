#!/usr/bin/env bash
set -euo pipefail

shopt -s nullglob

js_files=(js/*.js)

if (( ${#js_files[@]} == 0 )); then
  echo "Nenhum arquivo JavaScript encontrado em js/*.js."
  exit 0
fi

node --check "${js_files[@]}"
