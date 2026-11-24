# Central de produção

A central é uma prévia estática em [ExplicaFé no GitHub Pages](https://ric-lab.github.io/ExpliCaF-/).
O workflow monta a página a partir do commit de `preview`. O rodapé
identifica esse commit. A atualização dos dados acompanha a próxima
publicação bem-sucedida.

## Como testar

| Função | Como conferir |
| --- | --- |
| Episódios e status | Abra **Episódios**, confira a ordem de EP-01 a EP-06, busque “Noé” ou uma passagem e filtre por status. |
| Referências e etapas | Selecione um episódio e abra **Visão geral**. Confira a passagem, o foco, a transição, as etapas e as tarefas do escopo. |
| Tarefas e responsáveis | Abra **Tarefas** e alterne entre pendentes, bloqueadas e todas. Confira o ID, o responsável registrado e a justificativa de bloqueio. |
| Roteiro, storyboard, imagens, narração, legendas e vídeo | Em **Materiais**, abra os documentos, use os controles de áudio e vídeo e ative a faixa de legendas quando houver VTT. O painel indica quando o material ainda não existe. |
| Cena individual | Em **Cenas**, escolha **Revisar cena**. A URL preserva episódio, aba e cena. As cenas iniciais ainda aguardam cadastro; o navegador foi testado com dados temporários. |
| Solicitação de alteração | Em **Revisão e histórico** ou na cena, clique em **Solicitar alterações**. Confira escopo, versão e commit preenchidos no GitHub. Revise antes de enviar; o formulário é público. |
| Aprovação | Abra uma cena ou episódio com número de revisão e clique em **Registrar aprovação**. Uma issue autorizada e registrada no catálogo aparece como parecer da revisão correspondente depois da publicação. Para testar sem registrar uma decisão real, confira o rascunho e feche-o. |
| Problemas e histórico | Abra **Revisão e histórico** ou uma cena. Veja ocorrências registradas e os links para commits ou para o histórico do catálogo. |
| Celular | Repita a busca, abra uma aba de episódio e role até seus detalhes. As colunas se empilham em telas estreitas. |

## Fontes e manutenção

- [Catálogo de episódios](../editorial/episodios.json) é a fonte dos títulos,
  ordem, referências, fases, cenas, materiais, problemas e pareceres.
- [TODO](../todo.json) é a fonte das tarefas e responsáveis. `escopo`
  opcional aponta para um ID de episódio ou cena. Tarefas gerais ficam
  na aba **Tarefas**.
- `etapas` é um mapa opcional com chaves `roteiro`, `storyboard`,
  `imagem`, `narracao`, `legenda` e `video` e valores `pendente`,
  `em_andamento`, `em_revisao` ou `concluida`.
- Para incluir uma cena, adicione `id` no formato EP-01-C01, `titulo`,
  `status`, `referencias` e os mesmos campos opcionais de aprovação,
  problemas, histórico e materiais do episódio. A ordem do JSON
  determina a ordem exibida.
- Materiais têm `tipo`, `titulo`, `arquivo`, `credito` e
  `publicar: true`. O arquivo precisa estar em `docs/producao/publico/`
  e ter extensão compatível. Roteiros e storyboards textuais são exibidos
  como texto, preservando a formatação original. SRT pode ser lido e
  baixado. VTT também pode ser ativado no player de vídeo do mesmo escopo.
- Problemas têm `titulo` e `status`. Eventos têm `data`, `descricao`
  e `commit`. Para uma nova versão revisável, altere `revisao` (por
  exemplo, de `r1` para `r2`). Pareceres de uma versão anterior ficam
  como histórico de revisão, sem aprovar a nova.

## Revisão e segurança

O painel abre uma issue pré-preenchida no GitHub. Só a pessoa autenticada
pode enviar o formulário. Depois do envio, a equipe confere a identidade,
o escopo e a versão; para aprovação, confirme que o autor é o responsável
autorizado. Registre no catálogo o `parecer` com `acao` (`aprovado` ou
`alteracoes_solicitadas`), `revisao`, `revisor` (login GitHub) e
`issue` (número). O GitHub fornece identidade e trilha de auditoria. O
painel exibe o parecer versionado, sem consultar a API, editar arquivos ou
publicar vídeos. A autorização de publicação oficial segue o
[protocolo](../skills/00-sempre.md).

O site e o repositório são públicos. Campos exibidos devem estar liberados.
A montagem aplica lista explícita de campos e arquivos e bloqueia materiais
fora da pasta pública. Nunca inclua segredos, anotações privadas, mídias
restritas ou links assinados no Git, no catálogo ou nas issues.

## Conferência de desenvolvimento

A partir da raiz, em um ambiente que já possua Python 3:

```bash
python3 -m unittest discover -s tests -v
node --check preview/painel.js
python3 scripts/montar_painel.py /tmp/explicafe-central
python3 -m http.server 8765 --bind 127.0.0.1 --directory /tmp/explicafe-central
```

Escolha um diretório de saída que ainda não exista. O pacote gerado é uma
projeção descartável e não deve ser versionado. Para publicar no endereço
fixo, a origem do GitHub Pages deve ser GitHub Actions, conforme a
[skill de integração](../skills/integracao.md).
