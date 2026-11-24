# Integração, testes e prévia

- `main` guarda a base de referência. Integre mudanças por pull request com
  os testes aprovados.
- `trabalho/<tarefa>` isola cada mudança. Abra o PR para `main` e indique
  a tarefa correspondente.
- `preview` é a branch compartilhada de publicação da prévia. Integre por
  PR a referência escolhida (uma branch de trabalho ou `main`). Confira o
  diff para preservar outros trabalhos já presentes na prévia. Nunca promova
  toda a branch `preview` para `main` quando só um escopo foi revisado.

Execute `python3 -m unittest discover -s tests -v` na raiz. O workflow
**Testes** roda nos pushes e nos pull requests para `main` e `preview`.
Os jobs usam runners padrão do GitHub e executam enquanto o repositório for público.

O endereço fixo da prévia é **https://ric-lab.github.io/ExpliCaF-/**.
Para ativá-la, uma pessoa com permissão administrativa deve confirmar que
GitHub Pages está disponível no plano atual, sem cobrança e com a visibilidade
desejada. No GitHub, em **Settings → Pages → Build and deployment**, selecione
**GitHub Actions** como fonte. Em **Settings → Environments**, configure
`github-pages` para aceitar deploy somente de `preview`, se a configuração
estiver disponível. Se o plano exigir mudança paga, mantenha a prévia pendente.

O workflow **Prévia no GitHub Pages** valida e publica o painel montado com os arquivos públicos após
um push em `preview`. Também pode ser executado manualmente selecionando
`preview`. Confirme a execução em **Actions** e abra o endereço fixo para
validar a página servida.

A publicação oficial exige aprovação explícita registrada pelo responsável
no GitHub. A integração em `main` apenas atualiza a base de referência.
