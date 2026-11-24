"""Monta a prévia pública a partir dos arquivos compartilhados."""

import argparse
import json
import re
import shutil
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[1]
PUBLICO = "docs/producao/publico/"
EXTENSOES = {
    "roteiro": {".md", ".txt"},
    "storyboard": {".md", ".txt", ".png", ".jpg", ".webp"},
    "imagem": {".png", ".jpg", ".jpeg", ".webp", ".avif"},
    "narracao": {".wav", ".mp3", ".ogg", ".m4a"},
    "legenda": {".srt", ".vtt"},
    "video": {".mp4", ".webm"},
}
ETAPAS = {"planejado", "em_producao", "em_revisao", "finalizado"}
ESTADOS_ETAPA = {"pendente", "em_andamento", "em_revisao", "concluida"}
ACOES = {"aprovado", "alteracoes_solicitadas"}


def carregar(raiz, arquivo):
    return json.loads((raiz / arquivo).read_text(encoding="utf-8"))


def exigir(condicao, mensagem):
    if not condicao:
        raise ValueError(mensagem)


def selecionar(raiz, destino, escopo, campos):
    resultado = {k: escopo[k] for k in campos}
    identificador = escopo["id"]
    revisao = escopo.get("revisao")
    exigir(revisao is None or re.fullmatch(r"[a-zA-Z0-9._-]{1,64}", revisao),
           f"Revisão inválida em {identificador}")
    resultado["revisao"] = revisao
    parecer = escopo.get("parecer")
    if parecer:
        exigir(parecer["acao"] in ACOES and parecer.get("revisao") and
               type(parecer.get("issue")) is int and parecer["issue"] > 0 and
               re.fullmatch(r"[a-zA-Z0-9][a-zA-Z0-9-]{0,38}", parecer["revisor"]),
               f"Parecer inválido em {identificador}")
        resultado["parecer"] = {k: parecer[k] for k in ("acao", "revisao", "issue", "revisor")}
    resultado["problemas"] = [
        {k: problema[k] for k in ("titulo", "status")} for problema in escopo.get("problemas", [])
    ]
    resultado["historico"] = [
        {k: evento[k] for k in ("data", "descricao", "commit")} for evento in escopo.get("historico", [])
    ]
    etapas = escopo.get("etapas", {})
    exigir(all(tipo in EXTENSOES and estado in ESTADOS_ETAPA for tipo, estado in etapas.items()),
           f"Etapa inválida em {identificador}")
    resultado["etapas"] = etapas
    materiais = []
    for item in escopo.get("materiais", []):
        tipo = item["tipo"]
        # A marcação explícita é o contrato de publicação, inclusive para texto.
        if item.get("publicar") is not True:
            continue
        caminho = item["arquivo"]
        origem = (raiz / caminho).resolve()
        pasta = (raiz / PUBLICO).resolve()
        exigir(tipo in EXTENSOES and caminho.startswith(PUBLICO) and
               origem.is_relative_to(pasta) and pasta == raiz / PUBLICO.rstrip("/") and
               re.fullmatch(r"[a-zA-Z0-9_./-]+", caminho) and
               not any(parte.startswith(".") for parte in Path(caminho).parts) and
               origem.is_file() and origem.suffix.lower() in EXTENSOES[tipo] and
               isinstance(item.get("credito"), str) and item["credito"].strip(),
               f"Material público inválido em {identificador}: {caminho}")
        relativo = origem.relative_to(pasta)
        alvo = destino / "midia" / relativo
        alvo.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(origem, alvo)
        materiais.append({"tipo": tipo, "titulo": item["titulo"], "credito": item["credito"],
                          "url": "midia/" + relativo.as_posix(),
                          "formato": origem.suffix.lower()})
    resultado["materiais"] = materiais
    return resultado


def montar(raiz, destino, commit):
    exigir(re.fullmatch(r"[0-9a-f]{40}|local", commit), "Commit inválido")
    exigir(not destino.exists(), "Use um diretório de saída que ainda não exista")
    destino.mkdir(parents=True)
    for nome in ("index.html", "estilo.css", "painel.js"):
        origem = raiz / "preview" / nome
        exigir(origem.is_file() and not origem.is_symlink(), f"Arquivo do painel inválido: {nome}")
        shutil.copyfile(origem, destino / nome)
    catalogo = carregar(raiz, "docs/editorial/episodios.json")["episodios"]
    episodios = []
    escopos = set()
    for episodio in catalogo:
        eid = episodio["id"]
        exigir(re.fullmatch(r"EP-\d{2,}", eid) and eid not in escopos and
               episodio["status"] in ETAPAS, f"Episódio inválido: {eid}")
        escopos.add(eid)
        saida = selecionar(raiz, destino, episodio,
                           ("id", "titulo", "referencias", "foco", "continuidade", "status"))
        saida["cenas"] = []
        for cena in episodio.get("cenas", []):
            cid = cena["id"]
            exigir(re.fullmatch(rf"{eid}-C\d{{2,}}", cid) and cid not in escopos and
                   cena["status"] in ETAPAS, f"Cena inválida: {cid}")
            escopos.add(cid)
            saida["cenas"].append(selecionar(raiz, destino, cena,
                                ("id", "titulo", "referencias", "status")))
        episodios.append(saida)

    tarefas = []
    for tarefa in carregar(raiz, "docs/todo.json")["tarefas"]:
        exigir(tarefa.get("escopo") is None or tarefa["escopo"] in escopos,
               f"Escopo de tarefa desconhecido: {tarefa['id']}")
        tarefas.append({k: tarefa[k] for k in
                       ("id", "titulo", "responsavel", "status", "escopo", "bloqueio") if k in tarefa})
    payload = {"commit": commit, "episodios": episodios, "tarefas": tarefas}
    (destino / "dados.json").write_text(json.dumps(payload, ensure_ascii=False) + "\n", encoding="utf-8")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("saida", type=Path)
    parser.add_argument("--commit", default="local")
    args = parser.parse_args()
    montar(RAIZ, args.saida.resolve(), args.commit)
