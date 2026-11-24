import json
import re
import unittest
from pathlib import Path
from urllib.parse import unquote, urlsplit

RAIZ = Path(__file__).resolve().parents[1]
PROTOCOLO = "docs/skills/00-sempre.md"
ESTADOS = {"a_fazer", "em_andamento", "bloqueada", "na_previa", "concluida"}


class BaseColaborativa(unittest.TestCase):
    def test_entradas_apontam_para_o_protocolo(self):
        for arquivo in ("AGENTS.md", "CLAUDE.md", "GEMINI.md"):
            with self.subTest(arquivo=arquivo):
                self.assertIn(f"]({PROTOCOLO})", (RAIZ / arquivo).read_text("utf-8"))
        protocolo = (RAIZ / PROTOCOLO).read_text("utf-8")
        for leitura in ("../HANDOFF.md", "../todo.json", "README.md"):
            with self.subTest(leitura=leitura):
                self.assertIn(f"]({leitura})", protocolo)

    def test_links_locais_da_documentacao(self):
        documentos = [*RAIZ.glob("*.md"), *(RAIZ / "docs").rglob("*.md")]
        for documento in documentos:
            for link in re.findall(r"\]\(([^\s)]+)\)", documento.read_text("utf-8")):
                destino = urlsplit(link)
                if destino.scheme or destino.netloc or not destino.path:
                    continue
                with self.subTest(documento=documento.relative_to(RAIZ), link=link):
                    self.assertTrue((documento.parent / unquote(destino.path)).exists())

    def test_tarefas_tem_ids_unicos_e_estados_validos(self):
        tarefas = json.loads((RAIZ / "docs/todo.json").read_text("utf-8"))["tarefas"]
        self.assertIsInstance(tarefas, list)
        identificadores = set()
        for tarefa in tarefas:
            identificador = tarefa["id"]
            with self.subTest(tarefa=identificador):
                self.assertRegex(identificador, r"^EF-\d{3,}$")
                self.assertNotIn(identificador, identificadores)
                self.assertTrue(tarefa["titulo"].strip())
                self.assertIn(tarefa["status"], ESTADOS)
                responsavel = tarefa["responsavel"]
                if responsavel is not None:
                    self.assertIsInstance(responsavel, str)
                    self.assertTrue(responsavel.strip())
                identificadores.add(identificador)

    def test_previa_tem_pagina_em_portugues(self):
        pagina = (RAIZ / "preview/index.html").read_text("utf-8")
        self.assertIn('<html lang="pt-BR">', pagina)
        self.assertIn("<h1>ExplicaFé</h1>", pagina)
