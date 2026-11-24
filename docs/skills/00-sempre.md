# Protocolo obrigatório

## Antes de trabalhar

1. Confira o estado local com `git status --short --branch`. Preserve arquivos
   não rastreados, mudanças locais e commits ainda não enviados.
2. Execute `git fetch origin`. Compare sua branch com a remota e com a branch
   de destino antes de editar. Em uma branch limpa com upstream, use
   `git pull --ff-only`. Em caso de divergência ou sobreposição, examine os
   commits e coordene a integração pelo GitHub. Se a sincronização falhar,
   registre o bloqueio e aguarde acesso antes de editar.
3. Leia [HANDOFF.md](../HANDOFF.md), [todo.json](../todo.json) e as
   [skills pertinentes](README.md) nas versões sincronizadas. Consulte as
   decisões relacionadas e os PRs abertos. Ao ouvir “continue o projeto”,
   retome o próximo passo registrado, respeitando bloqueios e aprovações.
4. Quando houver tarefas simultâneas, use branches de trabalho distintas.
   Registre no GitHub a tarefa, a branch e o escopo dos arquivos antes de
   editar áreas compartilhadas.

## Durante o trabalho

- Codex, Claude Code e Google Antigravity têm a mesma responsabilidade.
  A atribuição de uma tarefa indica quem está atuando naquele momento.
- Preserve o trabalho dos colegas. Examine conflitos e coordene
  sobreposições. Nunca use push forçado para apagar divergências.
- O GitHub é a fonte única da verdade. Compartilhe alterações, testes e
  conhecimento pelo GitHub sem depender do histórico privado de uma IA.
- Registre decisões duráveis em `docs/decisions/`, instruções e soluções
  reutilizáveis nas skills, e erros e aprendizados da sessão no handoff
  histórico. Use links para evitar duplicação.
- Escreva toda documentação em português do Brasil. Priorize GitHub,
  navegador e ambientes das IAs, sem exigir instalação no computador
  do responsável.
- Nunca contrate serviços nem habilite recursos que possam gerar cobranças.
  Publicação oficial exige aprovação explícita do responsável pelo projeto,
  registrada no GitHub para o escopo aprovado.
- Use o endereço fixo da prévia definido na skill de integração. Nunca use
  `[skip ci]` em alterações que precisem ser testadas ou publicadas.

## Ao entregar ou interromper

1. Rode os testes pertinentes e registre os resultados reais.
2. Atualize o TODO, o HANDOFF atual e o registro histórico da sessão.
3. Faça commit e envie a branch pelo GitHub. Se o push falhar, registre e
   comunique que a entrega está local. Em um PR ou registro do GitHub, indique
   o commit de referência depois de criá-lo.
4. Informe as skills lidas, os testes, a branch e o próximo passo. Confirme o
   resultado do Actions e o conteúdo servido antes de anunciar a prévia.
