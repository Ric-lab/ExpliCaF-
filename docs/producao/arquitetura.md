# Arquitetura proposta

## Fluxo de um episódio

O Git guarda o roteiro aprovado, as referências bíblicas, um storyboard em
Markdown ou cartões gerados e um manifesto JSON. O mesmo ID identifica a
cena no storyboard, na fala, na composição e na legenda. O storyboard
pode ser revisado como página estática sem abrir um editor de vídeo.
Os agentes seguem as [skills editoriais](../skills/README.md).

| Etapa | Entrada e saída propostas |
| --- | --- |
| Roteiro e pesquisa | Markdown com versão, referências e falas aprovadas. Estilo, pronúncia, fatos narrados, interpretação e contexto são revisados antes da síntese. |
| Storyboard e linha do tempo | JSON validado com cenas, ordem, texto de tela, câmera, animação, cortes, humor visual, mídias, faixas de áudio e blocos removíveis. IDs e camadas estáveis permitem alterações pequenas e revisão do diff. |
| Ilustração e movimento | Componentes HTML/CSS/SVG com poses, fundos e mapas originais. Camadas de primeiro plano e fundo permitem zoom, panorâmica, parallax e entradas cômicas. Ilustração mais elaborada pode entrar como imagem com origem documentada. Canvas fica reservado a efeitos que precisam de pintura por quadro. A composição responde ao tempo da cena. |
| Narração | Síntese pt-BR por trecho com voz fixa, pausas e dicionário de pronúncia. Preservar o texto editorial separado da grafia auxiliar usada pelo sintetizador. WAV como intermediário, com taxa nativa preservada até normalizar na mixagem. Uma gravação humana pode substituir o fornecedor de voz no mesmo contrato. |
| Legendas | Usar duração e posição reais dos trechos de voz como primeira sincronização, com blocos de leitura revisados. Se houver destaque palavra por palavra, testar alinhamento com ASR local e conciliar com o texto aprovado. Exportar SRT e gerar ASS ou camada gráfica para queima opcional. |
| Som e trilha | Faixas separadas para voz, música e efeitos. Automatizar atenuação sob a fala, fades, limitação de picos e conferência de inteligibilidade e loudness. Usar som original ou ativos liberados para todos os destinos e para a compilação. |
| Render e validação | HyperFrames como candidato para compor a imagem por quadro. FFmpeg para normalização, mixagem, legendas e entrega MP4 H.264/yuv420p + AAC 48 kHz, 1080×1920, 30 fps, com faststart. FFprobe verifica formato, duração e streams. A revisão humana confere leitura em tela pequena, sincronia, transições, áudio e áreas encobertas por cada plataforma. |

A unidade de tempo visual é o quadro a 30 fps. Tempos de voz e legenda
derivam do áudio efetivamente montado. Converta o relógio de áudio para
quadros em um único ponto para evitar deriva causada por arredondamentos
por cena. Trave a versão de código, ferramentas, fontes, modelos, vozes
e ativos. Registre o commit e hashes no recibo do render. Compare quadros
e especificações entre execuções, pois igualdade binária entre máquinas
depende também de versões, fontes e ambiente de render.

Um comando de alto nível deve validar direitos e dependências, gerar
apenas as falas e cenas alteradas, montar a prévia, renderizar e auditar.
A chave de reaproveitamento inclui texto, versão da voz, configuração
e hash dos ativos. Uma etapa com falha encerra o comando sem marcar o
resultado como final. O resultado de uma cena pode ser refeito sem
regravar as outras. Nenhum envio para plataformas acontece no render.

## Compilação contínua

Monte episódios avulsos e filme a partir do mesmo material. Ganchos de fim,
recapitulações longas e chamadas de plataforma ficam em faixas ou cenas
removíveis. O manifesto da compilação define ordem, cortes e sobreposições,
recalcula os tempos das legendas e permite uma mixagem global de voz e
música. O filme piloto conserva o formato vertical. Um filme horizontal
exigiria recomposição e aprovação próprias.

FFmpeg pode concatenar por cópia se vídeos e áudio tiverem parâmetros e
bases de tempo compatíveis e os cortes já estiverem prontos. A prova
acusou a diferença esperada de alguns milissegundos entre a soma nominal
e o arquivo unido. Cortes precisos, fades globais, transições e tratamento
do atraso AAC pedem montagem a partir das faixas intermediárias,
verificação das junções e nova codificação quando necessário.

## Agentes, execução e aprovação

Qualquer uma das três IAs pode assumir pesquisa, roteiro, cenas ou revisão.
O HANDOFF aponta o commit, os arquivos e os ativos por ID. As decisões
ficam nos PRs e no Git. A CLI proposta é comum aos três, e recursos
exclusivos de uma ferramenta entram como fornecedores opcionais de arquivos.
O executor pode ser a sessão de nuvem já disponível, desde que disponha de
CPU, disco, rede para baixar dependências e tempo suficiente. Use GitHub
Actions padrão para validação e testes de render curtos vinculados ao
projeto, respeitando os [termos de uso](comparativo.md). O render de
produção começa sob demanda em sessão de nuvem com capacidade verificada.

Após aprovação, testar um trecho original de **20–30 s**, com duas ou três
cenas, uma piada visual, uma fala pt-BR, uma transição e uma junção em
compilação. A aprovação do piloto exige uma execução por comando, quatro
entregáveis verificáveis (MP4, SRT, storyboard e relatório), ausência de
credenciais pagas, direitos registrados, voz revisada por um falante,
legendas conferidas, consumo medido de CPU/RAM/disco e junção sem cortes
audíveis ou duplicação de chamada. Confirmar o fluxo em uma segunda IA
com checkout limpo. A estimativa para episódios de dois minutos só deve
ser feita após esse teste com cenas representativas.
