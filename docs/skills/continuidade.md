# Continuidade entre ferramentas

O [TODO](../todo.json) é o catálogo de tarefas. Use IDs estáveis, um responsável
atual (ou `null`) e os estados `a_fazer`, `em_andamento`, `bloqueada`,
`na_previa` e `concluida`. Adicione o link do PR à tarefa quando houver um.

O [HANDOFF](../HANDOFF.md) indica o ponto de retomada. Mantenha nele a fase,
a tarefa prioritária pelo ID, o próximo passo exato e links para o histórico.
Atualize-o no mesmo trabalho que altera o estado do projeto.

Crie um registro histórico por entrega em `docs/handoffs/AAAA-MM-DD-tarefa.md`.
Inclua ferramenta, branch, objetivo, mudanças, resultados dos testes, falhas
e soluções, além das pendências que afetam a retomada. Use o PR para apontar
o commit final. Em trabalho paralelo, prefira registrar a divisão de escopos
em uma issue ou PR e concilie o TODO e o HANDOFF na integração.
