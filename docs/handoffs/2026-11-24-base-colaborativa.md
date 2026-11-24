# Base colaborativa · 24/11/2026

- Ferramenta e tarefa · Codex, EF-001.
- Branches · `main` para a base inicial, `preview` para a prévia.
- Inspeção · O checkout estava vazio, sem alterações locais. A consulta ao
  remoto não retornou referências. O acordo entre agentes do King Rico
  serviu de referência.
- Entrega · Entradas das três ferramentas, memória compartilhada, testes de
  consistência e workflow de publicação exclusiva da página de prévia.
- A consulta administrativa à API do GitHub retornou `Forbidden`.
  A configuração de Pages e a verificação da URL ficam em EF-002.
- Verificação local · Quatro testes passaram. Os dois YAML foram lidos e os
  gatilhos, a dependência entre jobs e o diretório do artefato foram conferidos.
- Custo · A página do repositório confirma visibilidade pública. Os jobs
  usam runners padrão e são condicionados à visibilidade pública.
- Referência publicada · Commit inicial `42ac0ff` em `main` e `preview`.
- GitHub Actions · Testes aprovados em [main](https://github.com/Ric-lab/ExpliCaF-/actions/runs/45411962171)
  e [preview](https://github.com/Ric-lab/ExpliCaF-/actions/runs/45411962067).
- A [primeira execução da prévia](https://github.com/Ric-lab/ExpliCaF-/actions/runs/45411962041)
  passou pelos testes e parou em `configure-pages` com `Not Found`.
  EF-002 registra a configuração administrativa pendente.
