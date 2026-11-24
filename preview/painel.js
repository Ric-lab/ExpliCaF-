const github = "https://github.com/Ric-lab/ExpliCaF-";
const app = document.querySelector("#aplicativo");
const etapas = {
  planejado: "Planejado", em_producao: "Em produção", em_revisao: "Em revisão", finalizado: "Finalizado",
};
const estados = {
  a_fazer: "A fazer", em_andamento: "Em andamento", bloqueada: "Bloqueada",
  na_previa: "Na prévia", concluida: "Concluída",
};
const estadosEtapa = {
  pendente: "Pendente", em_andamento: "Em andamento", em_revisao: "Em revisão", concluida: "Concluída",
};
const tipos = {
  roteiro: "Roteiro", storyboard: "Storyboard", imagem: "Imagens",
  narracao: "Narrações", legenda: "Legendas", video: "Prévia do vídeo",
};
const abas = {
  resumo: "Visão geral", materiais: "Materiais", cenas: "Cenas", revisao: "Revisão e histórico",
};
let dados;
let filtro = "";
let busca = "";

function el(tag, texto = "", classe = "") {
  const elemento = document.createElement(tag);
  elemento.textContent = texto;
  if (classe) elemento.className = classe;
  return elemento;
}

function link(texto, url, classe = "") {
  const ancora = el("a", texto, classe);
  ancora.href = url;
  return ancora;
}

function selo(texto, alerta = false) {
  return el("span", texto, alerta ? "selo alerta" : "selo");
}

function bloco(titulo, ...conteudo) {
  const area = el("section", "", "bloco");
  area.append(el("h4", titulo), ...conteudo);
  return area;
}

function vazio(texto) {
  return el("p", texto, "vazio");
}

function listaTextos(valores) {
  const lista = el("ul");
  for (const valor of valores) lista.append(el("li", valor));
  return lista;
}

function parecer(item) {
  if (!item.revisao) return "Sem versão para revisar";
  if (!item.parecer || item.parecer.revisao !== item.revisao) return "Aguardando revisão";
  return item.parecer.acao === "aprovado" ? "Aprovado" : "Alterações solicitadas";
}

function rota(ep, aba = "resumo", cena) {
  return "#" + [ep.id, aba, cena?.id].filter(Boolean).join("/");
}

function tarefaCartao(tarefa) {
  const titulo = el("div", "", "linha-titulo");
  titulo.append(el("strong", tarefa.titulo), selo(estados[tarefa.status], tarefa.status === "bloqueada"));
  const cartao = el("article", "", "bloco");
  const responsavel = tarefa.responsavel || "Sem responsável";
  cartao.append(titulo, el("p", [tarefa.id, tarefa.escopo, responsavel].filter(Boolean).join(" · "), "muted"));
  if (tarefa.bloqueio) cartao.append(el("p", tarefa.bloqueio));
  return cartao;
}

function tarefasLista(tarefas) {
  const lista = el("div", "", "tarefas");
  for (const tarefa of tarefas) lista.append(tarefaCartao(tarefa));
  if (!tarefas.length) lista.append(vazio("Nenhuma tarefa neste recorte."));
  return lista;
}

function painelTarefas() {
  const painel = el("section", "", "painel corpo");
  painel.append(el("h3", "Tarefas da produção"));
  const controles = el("div", "", "filtros");
  const selecao = el("select");
  selecao.setAttribute("aria-label", "Filtrar tarefas por status");
  selecao.append(new Option("Pendentes", "pendentes"), new Option("Todas as tarefas", "todas"));
  for (const [id, nome] of Object.entries(estados)) selecao.append(new Option(nome, id));
  controles.append(selecao);
  const resultados = el("div");
  function atualizar() {
    const valor = selecao.value;
    const filtradas = dados.tarefas.filter(t => valor === "todas" || t.status === valor ||
      (valor === "pendentes" && t.status !== "concluida"));
    resultados.replaceChildren(tarefasLista(filtradas));
  }
  selecao.addEventListener("change", atualizar);
  atualizar();
  painel.append(controles, resultados);
  return painel;
}

function resumo() {
  const secao = el("section", "", "resumo");
  secao.setAttribute("aria-label", "Resumo da produção");
  const numeros = [
    [dados.episodios.length, "Episódios"],
    [dados.episodios.filter(ep => ep.status === "em_producao").length, "Em produção"],
    [dados.episodios.filter(ep => parecer(ep) === "Aprovado").length, "Aprovados"],
    [dados.tarefas.filter(t => t.status !== "concluida").length, "Tarefas pendentes"],
  ];
  for (const [numero, rotulo] of numeros) {
    const contador = el("div", "", "contador");
    contador.append(el("strong", String(numero)), el("span", rotulo));
    secao.append(contador);
  }
  return secao;
}

function semAcentos(texto) {
  return texto.normalize("NFD").replace(/\p{Mark}/gu, "").toLowerCase();
}

function listaEpisodios(atual) {
  const painel = el("section", "", "painel lateral");
  const cabecalho = el("div", "", "cabecalho-lista");
  cabecalho.append(el("h3", "Episódios"), selo("Ordem cronológica"));
  const controles = el("div", "", "filtros");
  const pesquisa = el("input");
  pesquisa.type = "search";
  pesquisa.placeholder = "Buscar episódio ou passagem";
  pesquisa.setAttribute("aria-label", pesquisa.placeholder);
  pesquisa.value = busca;
  const selecao = el("select");
  selecao.setAttribute("aria-label", "Filtrar episódios por status");
  selecao.append(new Option("Todos os status", ""));
  for (const [id, nome] of Object.entries(etapas)) selecao.append(new Option(nome, id));
  selecao.value = filtro;
  controles.append(pesquisa, selecao);
  const resultados = el("div");
  function atualizar() {
    busca = pesquisa.value;
    filtro = selecao.value;
    const termo = semAcentos(busca.trim());
    const episodios = dados.episodios.filter(ep => (!filtro || ep.status === filtro) &&
      semAcentos([ep.id, ep.titulo, ...ep.referencias].join(" ")).includes(termo));
    const lista = el("ol", "", "lista");
    for (const ep of episodios) {
      const item = el("li");
      const ancora = link("", rota(ep), "episodio");
      if (atual?.id === ep.id) ancora.setAttribute("aria-current", "true");
      const linha = el("span");
      linha.append(el("strong", ep.titulo), el("small", etapas[ep.status]));
      ancora.append(el("span", ep.id, "indice"), linha);
      item.append(ancora);
      lista.append(item);
    }
    resultados.replaceChildren(episodios.length ? lista : vazio("Nenhum episódio encontrado."));
  }
  pesquisa.addEventListener("input", atualizar);
  selecao.addEventListener("change", atualizar);
  atualizar();
  painel.append(cabecalho, controles, resultados);
  return painel;
}

function mostrarTexto(item) {
  const detalhes = el("details");
  detalhes.append(el("summary", "Ler " + item.titulo));
  const corpo = el("pre");
  let carregado = false;
  detalhes.addEventListener("toggle", async () => {
    if (!detalhes.open || carregado) return;
    carregado = true;
    corpo.textContent = "Carregando…";
    try {
      const resposta = await fetch(item.url);
      if (!resposta.ok) throw new Error(resposta.status);
      corpo.textContent = await resposta.text();
    } catch {
      carregado = false;
      corpo.textContent = "Não foi possível abrir o arquivo.";
    }
  });
  detalhes.append(corpo);
  return detalhes;
}

function material(item, legendas) {
  const cartao = el("article", "", "bloco cartao-material");
  cartao.append(el("strong", item.titulo));
  const imagem = /\.(png|jpe?g|webp|avif)$/.test(item.formato);
  const tag = imagem ? "img" : {narracao: "audio", video: "video"}[item.tipo];
  if (tag) {
    const midia = el(tag);
    midia.src = item.url;
    if (imagem) {
      midia.alt = item.titulo;
      midia.loading = "lazy";
    } else {
      midia.controls = true;
      midia.preload = "metadata";
    }
    if (tag === "video") {
      midia.playsInline = true;
      for (const legenda of legendas) {
        const trilha = el("track");
        Object.assign(trilha, {kind: "captions", srclang: "pt-BR", label: legenda.titulo, src: legenda.url});
        midia.append(trilha);
      }
    }
    cartao.append(midia);
  } else {
    cartao.append(mostrarTexto(item));
  }
  cartao.append(el("p", item.credito, "muted"), link("Abrir arquivo", item.url));
  return cartao;
}

function materiais(item) {
  const lista = el("div", "", "materiais");
  const legendas = item.materiais.filter(m => m.tipo === "legenda" && m.formato === ".vtt");
  for (const [tipo, titulo] of Object.entries(tipos)) {
    const encontrados = item.materiais.filter(m => m.tipo === tipo);
    lista.append(encontrados.length
      ? bloco(titulo, ...encontrados.map(m => material(m, legendas)))
      : bloco(titulo, el("p", "Nenhum material disponível.", "muted")));
  }
  return lista;
}

function etapasLista(item) {
  const lista = el("ul", "", "lista etapas");
  for (const [tipo, nome] of Object.entries(tipos)) {
    const estado = estadosEtapa[item.etapas[tipo]] ??
      (item.materiais.some(m => m.tipo === tipo) ? "Material disponível" : "Sem registro");
    const linha = el("li", "", "linha-titulo");
    linha.append(el("span", nome), selo(estado));
    lista.append(linha);
  }
  return bloco("Etapas de produção", lista);
}

function issue(ep, item, acao, caminho) {
  const titulo = acao === "aprovacao" ? "Aprovação" : "Solicitação de alterações";
  const corpo = [
    "Escopo: " + item.id,
    "Episódio: " + ep.titulo,
    "Revisão: " + (item.revisao || "planejamento sem revisão publicada"),
    "Commit da prévia: " + dados.commit,
    "Endereço: " + new URL(caminho, "https://ric-lab.github.io/ExpliCaF-/"),
    "",
    acao === "aprovacao" ? "Confirme a aprovação editorial desta revisão e descreva o que foi conferido." :
      "Descreva o problema, em que cena ou instante ocorre e o resultado esperado.",
    "",
    "Registre apenas informações que possam ser públicas. Aprovação editorial não autoriza publicação oficial.",
  ].join("\n");
  const params = new URLSearchParams({title: "[" + item.id + "] " + titulo, body: corpo});
  return github + "/issues/new?" + params;
}

function revisao(ep, item, caminho) {
  const linha = el("div", "", "linha-titulo");
  linha.append(el("strong", "Aprovação editorial"), selo(parecer(item), item.parecer?.acao === "alteracoes_solicitadas"));
  const acoes = el("div", "", "acoes");
  acoes.append(link("Solicitar alterações", issue(ep, item, "alteracoes", caminho), "botao"));
  if (item.revisao) acoes.append(link("Registrar aprovação", issue(ep, item, "aprovacao", caminho), "botao secundario"));
  const cartao = el("section", "", "bloco");
  cartao.append(linha);
  if (item.revisao) cartao.append(el("p", "Revisão " + item.revisao));
  if (item.parecer) {
    const anterior = item.parecer.revisao !== item.revisao ? "Parecer de revisão anterior" : "Parecer registrado";
    cartao.append(link(anterior + " · @" + item.parecer.revisor, github + "/issues/" + item.parecer.issue));
  }
  cartao.append(acoes, el("p", "As ações abrem uma issue pública no GitHub. A equipe confere o registro e atualiza a revisão no repositório.", "muted"));
  return cartao;
}

function historico(item) {
  const lista = el("ul");
  for (const evento of item.historico) {
    const linha = el("li", evento.data + " · " + evento.descricao + " ");
    if (/^[a-f0-9]{7,40}$/.test(evento.commit)) linha.append(link(evento.commit, github + "/commit/" + evento.commit));
    lista.append(linha);
  }
  return bloco("Histórico de alterações", item.historico.length ? lista :
    el("p", "Nenhuma alteração registrada para este escopo.", "muted"),
    link("Ver histórico do catálogo no GitHub", github + "/commits/preview/docs/editorial/episodios.json"));
}

function problemas(item) {
  return bloco("Problemas identificados", item.problemas.length ?
    listaTextos(item.problemas.map(p => p.titulo + " · " + p.status)) :
    el("p", "Nenhum problema registrado para este escopo.", "muted"));
}

function telaCena(ep, cena) {
  const area = el("div", "", "corpo");
  area.append(link("← Todas as cenas", rota(ep, "cenas")),
    el("h3", cena.titulo), selo(etapas[cena.status]),
    bloco("Referências bíblicas", cena.referencias.length ? listaTextos(cena.referencias) : el("p", "Sem referências registradas.")),
    etapasLista(cena), materiais(cena),
    bloco("Tarefas da cena", tarefasLista(dados.tarefas.filter(t => t.escopo === cena.id))),
    revisao(ep, cena, rota(ep, "cenas", cena)), problemas(cena), historico(cena));
  return area;
}

function telaEpisodio(ep, aba, cena) {
  const painel = el("article", "", "painel");
  painel.id = "episodio";
  const capa = el("div", "", "hero");
  const legenda = el("div");
  const meta = el("div", "", "meta");
  meta.append(el("span", ep.id), selo(etapas[ep.status]), selo(parecer(ep)));
  legenda.append(meta, el("h3", ep.titulo), el("p", ep.referencias.join(" · ")));
  capa.append(legenda);
  const navegacao = el("nav", "", "tabs");
  navegacao.setAttribute("aria-label", "Seções do episódio");
  for (const [id, nome] of Object.entries(abas)) {
    const ancora = link(nome, rota(ep, id));
    if (aba === id) ancora.setAttribute("aria-current", "page");
    navegacao.append(ancora);
  }
  painel.append(capa, navegacao);
  if (cena) {
    painel.append(telaCena(ep, cena));
    return painel;
  }
  const area = el("div", "", "corpo");
  if (aba === "materiais") area.append(materiais(ep));
  if (aba === "revisao") area.append(revisao(ep, ep, rota(ep, aba)), problemas(ep), historico(ep));
  if (aba === "cenas") {
    if (!ep.cenas.length) area.append(vazio("Nenhuma cena cadastrada para este episódio."));
    for (const item of ep.cenas) {
      area.append(bloco(item.titulo, el("p", item.id + " · " + etapas[item.status]),
        link("Revisar cena", rota(ep, "cenas", item), "botao secundario")));
    }
  }
  if (aba === "resumo") {
    area.append(
      bloco("Referências bíblicas", listaTextos(ep.referencias)),
      bloco("Foco de pesquisa", el("p", ep.foco)),
      bloco("Continuidade", el("p", ep.continuidade)),
      etapasLista(ep),
      bloco("Tarefas do episódio", tarefasLista(dados.tarefas.filter(t => t.escopo === ep.id))),
    );
  }
  painel.append(area);
  return painel;
}

function renderizar() {
  const [id, tab, cenaId] = location.hash.slice(1).split("/");
  const tarefas = id === "tarefas";
  const secao = tarefas ? "tarefas" : "episodios";
  for (const item of ["tarefas", "episodios"]) {
    const menu = document.querySelector("#menu-" + item);
    if (item === secao) menu.setAttribute("aria-current", "page");
    else menu.removeAttribute("aria-current");
  }
  if (tarefas) {
    app.replaceChildren(resumo(), painelTarefas());
    return;
  }
  const ep = dados.episodios.find(item => item.id === id) ?? dados.episodios[0];
  const grade = el("div", "", "grade");
  grade.append(listaEpisodios(ep));
  if (ep) {
    const aba = Object.hasOwn(abas, tab) ? tab : "resumo";
    const cena = aba === "cenas" ? ep.cenas.find(item => item.id === cenaId) : undefined;
    grade.append(telaEpisodio(ep, aba, cena));
  }
  app.replaceChildren(resumo(), grade);
}

try {
  const resposta = await fetch("dados.json");
  if (!resposta.ok) throw new Error(resposta.status);
  dados = await resposta.json();
  const rodape = document.querySelector("#versao");
  if (dados.commit === "local") rodape.textContent = "Prévia local";
  else rodape.append("Versão dos dados · ", link(dados.commit.slice(0, 7), github + "/commit/" + dados.commit));
  renderizar();
  window.addEventListener("hashchange", renderizar);
} catch {
  const erro = el("p", "Não foi possível carregar os dados. Recarregue a página para tentar novamente.", "vazio");
  erro.setAttribute("role", "alert");
  app.replaceChildren(erro);
} finally {
  app.removeAttribute("aria-busy");
}
