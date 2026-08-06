#!/usr/bin/env python3
"""Validate local <script src="..."> references from index.html."""

from __future__ import annotations

import shutil
import subprocess
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse

REPO_ROOT = Path(__file__).resolve().parents[1]
INDEX_HTML = REPO_ROOT / "index.html"
EXTERNAL_SCHEMES = {"http", "https", "data", "blob", "mailto", "tel"}


class ScriptSrcParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.sources: list[tuple[str, int]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag.lower() != "script":
            return

        attrs_dict = {name.lower(): value for name, value in attrs if name}
        src = attrs_dict.get("src")
        if src:
            self.sources.append((src.strip(), self.getpos()[0]))


def is_external(src: str) -> bool:
    parsed = urlparse(src)
    return src.startswith("//") or parsed.scheme.lower() in EXTERNAL_SCHEMES


def local_path_for(src: str) -> Path:
    parsed = urlparse(src)
    clean_path = unquote(parsed.path)
    if clean_path.startswith("/"):
        clean_path = clean_path.lstrip("/")
    return (REPO_ROOT / clean_path).resolve()


def validate_script_syntax(path: Path) -> str | None:
    node = shutil.which("node")
    if not node:
        return "Node.js não encontrado no PATH; não foi possível validar a sintaxe JavaScript."

    result = subprocess.run(
        [node, "--check", str(path)],
        cwd=REPO_ROOT,
        text=True,
        capture_output=True,
        check=False,
    )
    if result.returncode == 0:
        return None

    output = "\n".join(part for part in (result.stdout.strip(), result.stderr.strip()) if part)
    return output or f"node --check retornou código {result.returncode}."


def main() -> int:
    if not INDEX_HTML.is_file():
        print(f"ERRO: index.html não encontrado em {INDEX_HTML}", file=sys.stderr)
        return 1

    parser = ScriptSrcParser()
    parser.feed(INDEX_HTML.read_text(encoding="utf-8"))

    failures: list[str] = []
    checked = 0
    ignored = 0

    for src, line in parser.sources:
        if is_external(src):
            ignored += 1
            continue

        path = local_path_for(src)
        display = path.relative_to(REPO_ROOT) if path.is_relative_to(REPO_ROOT) else path

        if not path.is_relative_to(REPO_ROOT):
            failures.append(
                f"Linha {line}: '{src}' resolve para fora do repositório ({display})."
            )
            continue

        if not path.is_file():
            failures.append(f"Linha {line}: arquivo referenciado não existe: {src} -> {display}")
            continue

        checked += 1
        if path.suffix.lower() == ".js":
            syntax_error = validate_script_syntax(path)
            if syntax_error:
                failures.append(
                    f"Linha {line}: erro de sintaxe em {display}:\n{syntax_error}"
                )

    if failures:
        print("Validação de <script src> falhou:", file=sys.stderr)
        for failure in failures:
            print(f"- {failure}", file=sys.stderr)
        return 1

    print(
        f"Validação de <script src> concluída: {checked} arquivo(s) local(is) conferido(s), "
        f"{ignored} URL(s) externa(s) ignorada(s)."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
