import json
import tempfile
import unittest
from pathlib import Path

from scripts.montar_painel import RAIZ, montar


class PainelPublico(unittest.TestCase):
    def test_catalogo_real_e_ordem_dos_episodios(self):
        with tempfile.TemporaryDirectory() as temporario:
            saida = Path(temporario) / "site"
            montar(RAIZ, saida, "a" * 40)
            dados = json.loads((saida / "dados.json").read_text("utf-8"))
            catalogo = json.loads((RAIZ / "docs/editorial/episodios.json").read_text("utf-8"))
            tarefas = json.loads((RAIZ / "docs/todo.json").read_text("utf-8"))
            self.assertEqual([e["id"] for e in dados["episodios"]],
                             [e["id"] for e in catalogo["episodios"]])
            self.assertEqual([t["id"] for t in dados["tarefas"]],
                             [t["id"] for t in tarefas["tarefas"]])
            self.assertEqual(dados["commit"], "a" * 40)
            self.assertFalse((saida / "docs").exists())

    def test_publica_apenas_materiais_autorizados(self):
        with tempfile.TemporaryDirectory() as temporario:
            raiz = Path(temporario)
            episodio, cena = self.fixture(raiz)
            cena["materiais"] = [
                {"tipo": "roteiro", "titulo": "Roteiro de teste", "arquivo": "docs/producao/publico/amostra.md",
                 "credito": "Texto da equipe", "publicar": True, "campo_privado": "interno"},
                {"tipo": "roteiro", "arquivo": "privado.md", "publicar": False},
            ]
            cena["parecer"] = {"acao": "aprovado", "revisao": "r1", "revisor": "editor", "issue": 42}
            (raiz / "docs/producao/publico/amostra.md").write_text("Texto original.", "utf-8")
            self.gravar(raiz, episodio)
            montar(raiz, raiz / "site", "local")
            dados = json.loads((raiz / "site/dados.json").read_text("utf-8"))
            exposta = dados["episodios"][0]["cenas"][0]
            self.assertEqual(exposta["parecer"]["issue"], 42)
            self.assertEqual(len(exposta["materiais"]), 1)
            self.assertNotIn("campo_privado", exposta["materiais"][0])
            self.assertEqual((raiz / "site/midia/amostra.md").read_text("utf-8"), "Texto original.")
            self.assertFalse((raiz / "site/privado.html").exists())

    def test_recusa_material_fora_da_pasta_publica(self):
        with tempfile.TemporaryDirectory() as temporario:
            raiz = Path(temporario)
            episodio, cena = self.fixture(raiz)
            for arquivo in ("docs/interno.md", "docs/producao/publico/../../interno.md",
                            "docs/producao/publico/atalho.md"):
                with self.subTest(arquivo=arquivo):
                    cena["materiais"] = [{"tipo": "roteiro", "arquivo": arquivo,
                                          "credito": "Teste", "publicar": True}]
                    self.gravar(raiz, episodio)
                    destino = Path(tempfile.mkdtemp(dir=raiz)) / "site"
                    with self.assertRaisesRegex(ValueError, "Material público inválido"):
                        montar(raiz, destino, "local")

    def fixture(self, raiz):
        (raiz / "preview").mkdir()
        (raiz / "docs/editorial").mkdir(parents=True)
        (raiz / "docs/producao/publico").mkdir(parents=True)
        for nome in ("index.html", "estilo.css", "painel.js", "privado.html"):
            (raiz / "preview" / nome).write_text("teste", "utf-8")
        (raiz / "docs/todo.json").write_text('{"tarefas": []}', "utf-8")
        interno = raiz / "docs/interno.md"
        interno.write_text("Restrito", "utf-8")
        (raiz / "docs/producao/publico/atalho.md").symlink_to(interno)
        cena = {"id": "EP-01-C01", "titulo": "Cena de teste", "referencias": [],
                "status": "em_revisao", "revisao": "r1"}
        episodio = {"id": "EP-01", "titulo": "Episódio de teste", "referencias": [],
                    "foco": "", "continuidade": "", "status": "planejado", "cenas": [cena]}
        return episodio, cena

    def gravar(self, raiz, episodio):
        (raiz / "docs/editorial/episodios.json").write_text(
            json.dumps({"episodios": [episodio]}), "utf-8")
