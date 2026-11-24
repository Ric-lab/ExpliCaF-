# Comparativo técnico e condições de uso

Foram lidos os repositórios oficiais vinculados abaixo, além dos metadados
do pacote HyperFrames no npm. A data-base é 24/11/2026. Algumas páginas
comerciais e de suporte retornaram HTTP 403 no proxy. Valores de planos e
direitos de serviços que não puderam ser conferidos ficam fora do orçamento
do projeto. Licenças de software, modelos, gravações e itens de terceiros
precisam ser avaliadas separadamente.

## Composição e render

| Opção | Licença e execução | Qualidade, automação e limitações |
| --- | --- | --- |
| HyperFrames 0.9.90 | Apache-2.0 para o framework; Node ≥22, Chromium e FFmpeg. Render local/na VM sem conta HeyGen. Serviços de nuvem, Pro, compartilhamento e Lambda são opções separadas. | HTML/CSS/SVG e animações posicionáveis no tempo, mídia e áudio em trilhas e CLI para lint e render. Bom ajuste para as três IAs e para iteração visual. Chromium e fontes são dependências efetivas. Fixar versões, desabilitar telemetria para execução do projeto, evitar CDN e verificar licenças de plugins como GSAP ou de templates. [Código, documentação e licença](https://github.com/heygen-com/hyperframes) |
| Remotion 4 | Licença própria com código disponível. A versão 4.0.400 concede uso comercial gratuito a indivíduos, organizações sem fins lucrativos e organizações com fins lucrativos de até três empregados, nas condições do texto. Outra elegibilidade cobre avaliação não comercial. Conferir a entidade e a release escolhida. | React, componentes reutilizáveis, composição quadro a quadro e boa API de render. Requer Node, Chromium e dependências de mídia; render distribuído via Lambda implica infraestrutura AWS. Alternativa forte se React melhorar a manutenção e a elegibilidade for confirmada. Render não ensaiado aqui. [Licença da v4.0.400](https://github.com/remotion-dev/remotion/blob/v4.0.400/LICENSE.md) · [API de render](https://github.com/remotion-dev/remotion/blob/main/packages/docs/docs/renderer/render-media.mdx) |
| FFmpeg nativo | LGPL 2.1+ na configuração padrão, GPL quando componentes GPL são habilitados, como no binário testado com libx264. A distribuição de binário tem obrigações próprias; avaliar também regras de codecs na distribuição escolhida. | Excelente para mixagem, normalização, legenda, transição, encode, montagem e validação com FFprobe. Com SVG cobre câmera 2D e cenas simples. Layout interativo e animação elaborada ficam trabalhosos em grafos de filtros. [Licença](https://github.com/FFmpeg/FFmpeg/blob/master/LICENSE.md) · [Filtros](https://github.com/FFmpeg/FFmpeg/blob/master/doc/filters.texi) |
| HTML/CSS/SVG/Canvas + Playwright | Playwright Apache-2.0. Instalar browser e dependências; retém controle sobre a implementação. | CSS e SVG favorecem tipografia e vetores; Canvas favorece partículas e efeitos de pixels. Implementar captura com tempo explícito, carregamento de fontes, frame pacing, áudio e inspeção. WebCodecs fornece encode/decode de baixo nível e requer muxing próprio e verificação de suporte. Frágil como primeira rota em navegador de usuário. [Playwright](https://github.com/microsoft/playwright) · [WebCodecs no MDN](https://github.com/mdn/content/blob/main/files/en-us/web/api/webcodecs_api/index.md) |
| Motion Canvas, Manim ou Blender | Motion Canvas e Manim Community MIT; Blender GPL. Cada um pede ambiente específico. | Alternativas de nicho para motion vetorial, diagramas e 3D. Motion Canvas usa TypeScript e canvas; Manim tem boa composição de diagramas; Blender amplia iluminação e câmera com maior custo de criação e render. Podem entregar clipes a incorporar pelo manifesto. [Motion Canvas](https://github.com/motion-canvas/motion-canvas) · [Manim](https://github.com/ManimCommunity/manim) · [Blender](https://github.com/blender/blender) |

## Imagens, ilustrações e efeitos

- **SVG/CSS original** · Primeira escolha para personagens estilizados,
  mapas, cartelas e humor visual. Facilita paleta consistente, reuso dos
  elementos e animação por camada. A elaboração de poses e expressões
  ainda exige direção de arte.
- **Geração de imagem nas ferramentas já disponíveis** · Adequada para
  fundos ou ilustrações pontuais. Tratar cada saída como arquivo aprovado
  com proveniência, termos aplicáveis, hash e revisão visual. Recursos e
  limites da interface mudam por ferramenta e plano. O fluxo de produção
  aceita o arquivo pronto sem automatizar a interface ou depender de API.
- **ComfyUI com SDXL 1.0** · Alternativa para geração em lote com grafo,
  versões e sementes registradas. Requer Python, pesos grandes, espaço e
  tempo de inferência. CPU aumenta a espera, GPU depende da infraestrutura.
  A licença CreativeML Open RAIL++-M do SDXL tem restrições de uso;
  checkpoints, nós, LoRAs e fontes podem ter outros termos. A repetição
  da semente ajuda, mas depende do ambiente. Não foi executado e não é
  requisito do piloto. [ComfyUI](https://github.com/Comfy-Org/ComfyUI) ·
  [Licença do SDXL](https://github.com/Stability-AI/generative-models/blob/main/model_licenses/LICENSE-SDXL1.0)

## Voz, legendas e recursos das IAs

| Opção | Custo e direitos | Consequência operacional |
| --- | --- | --- |
| Kokoro ONNX | Wrapper MIT e pesos Kokoro publicados sob Apache-2.0. Fixar os arquivos e conferir a origem de cada voz e os termos aplicáveis à distribuição. Sem cota de API; o limite é o executor. | Três IDs pt-BR testados em CPU. Avaliar naturalidade, intenção, nomes bíblicos, números e humor por escuta. Sem garantia de timestamps por palavra e sem depender de clonagem. [Kokoro](https://github.com/hexgrad/kokoro) · [Wrapper ONNX](https://github.com/thewh1teagle/kokoro-onnx) |
| Piper | Motor GPL-3.0. O projeto alerta que direitos das vozes e da cadeia de treinamento são separados. A lista cita opções pt-BR, mas a revisão do model card e da licença do artefato é necessária. | Alternativa de CPU e automação simples; naturalidade varia por voz. Não executado neste estudo. [Motor](https://github.com/OHF-Voice/piper1-gpl) · [Guia de uso comercial](https://github.com/OHF-Voice/piper1-gpl/blob/main/docs/COMMERCIAL_USE.md) |
| Whisper.cpp / WhisperX | Whisper.cpp e o Whisper original, incluindo pesos do Whisper, usam MIT. WhisperX acrescenta alinhamento e modelos auxiliares cujos termos e requisitos devem ser conferidos. | ASR local em português com modelo multilíngue mede e ajuda a alinhar. Para locução sintética, o texto aprovado continua sendo a fonte. Ferramenta pode errar nomes e números ou produzir timestamps aproximados. Não testado. [Whisper.cpp](https://github.com/ggml-org/whisper.cpp) · [Whisper](https://github.com/openai/whisper) · [WhisperX](https://github.com/m-bain/whisperX) |
| TTS por API (OpenAI, Google Cloud, Azure) | Cotas e preços são próprios da API, do SKU, da região e da conta. As páginas comerciais não puderam ser conferidas nesta sessão. Contar com **zero chamadas disponíveis** no orçamento do piloto. | Pode oferecer melhor prosódia, vozes direcionáveis e marcas de tempo conforme o serviço. Exige rede, autenticação e, conforme o serviço, projeto com faturamento. Fica como alternativa condicionada a verificação e aprovação. [OpenAI](https://platform.openai.com/docs/pricing) · [Google Cloud](https://cloud.google.com/text-to-speech/pricing) · [Azure](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/speech-services/) |
| F5-TTS e vozes clonadas | F5-TTS separa código MIT de pesos pré-treinados CC BY-NC. Uso comercial de uma voz clonada também exige tratar licença, autorização e consentimento. | Fora da base comercial proposta. Voz própria ou licenciada é suficiente para discutir naturalidade. [Licenças do F5-TTS](https://github.com/SWivid/F5-TTS#license) |

**Codex** pode colaborar por Git e terminal e o projeto oficial documenta
login ChatGPT e chave de API como caminhos separados. Geração de imagens
estava disponível como ferramenta nesta sessão, mas não foi usada como
dependência de produção. **Claude Code** pode trabalhar no mesmo checkout
com Git e CLI. O acesso pelo plano e suas cotas são distintos da API
Anthropic. **Antigravity** pode trabalhar com o mesmo contrato Git e web
quando seu ambiente permitir checkout e terminal. Disponibilidade de
modelos, geração de mídia e cotas do Antigravity precisam de confirmação
na conta. Gemini API é uma superfície separada, com conjunto próprio de
planos e cotas. A prova nesta sessão foi em Codex, sem acesso às contas
Claude ou Antigravity. Nenhuma assinatura implica créditos, chaves ou
sintetizadores automatizados de API disponíveis. [Codex](https://github.com/openai/codex) · [Claude Code](https://github.com/anthropics/claude-code) · [Antigravity](https://antigravity.google/) · [Gemini API](https://ai.google.dev/gemini-api/docs/pricing)

## Nuvem, cotas e arquivos grandes

- **Sessões das IAs** · Usar sob demanda dentro do acesso já disponível,
  com instalações no executor e cache descartável. Não assumir GPU,
  persistência, identidade, saída de rede, tempo ilimitado ou execução
  agendada. Se um executor falhar, outro pode recuperar o manifesto e os
  ativos previamente aprovados. As cotas das três contas não estavam
  disponíveis para auditoria.
- **Codespaces** · Alternativa de nuvem pelo navegador, com GitHub e
  ambiente configurável. Free pessoal inclui 120 horas de computação
  e 15 GB-mês; uma máquina de dois núcleos usa multiplicador 2, ou
  cerca de 60 horas de relógio com a cota inteira nessa máquina.
  Contas Pro pessoais têm 180 horas e 20 GB-mês; organizações não têm
  essa cota gratuita. Excedente depende do faturamento da conta.
  Só usar se o titular confirmar a cota e bloqueio de excedente.
  [Cobrança e cotas](https://github.com/github/docs/blob/main/content/billing/concepts/product-billing/github-codespaces.md)
- **Colab** · Possível para experimentos com GPU por notebook, mas a
  FAQ comercial não pôde ser aberta. Capacidade, duração da sessão e
  condições de automação ficaram sem verificação. Por depender de
  sessão intermediária e capacidade eventual, fica fora do fluxo
  proposto. [Ferramentas do Colab](https://github.com/googlecolab/colabtools) ·
  [FAQ](https://research.google.com/colaboratory/faq.html)
- **Actions** · Runners padrão em repositórios públicos são gratuitos
  para computação elegível. A tabela consultada mostra no plano Free
  500 MB de artefatos e 10 GB de cache por repositório. Em uso privado
  elegível, a tabela atual apresenta US$ 12/mês de computação incluída
  no modelo aplicável; isso equivale a 2.000 min a US$ 0,006/min Linux.
  O limite publicado é 6 h por job hospedado e 20 jobs simultâneos
  no runner padrão para Free, conforme a tabela. Artefatos são
  temporários (padrão de 90 dias), sujeitos a políticas de retenção e
  armazenamento. Proposta: testes rápidos e temporários, runner público
  padrão, sem cache grande ou upload recorrente sem checagem do orçamento
  e das condições de uso. GitHub restringe cargas desproporcionais e uso
  de Actions como distribuição de mídia. [Cobrança](https://github.com/github/docs/blob/main/content/billing/concepts/product-billing/github-actions.md) · [Tabela](https://github.com/github/docs/blob/main/data/reusables/billing/actions-included-quotas.md) · [Limites](https://github.com/github/docs/blob/main/content/actions/reference/limits.md) · [Retenção](https://github.com/actions/upload-artifact#retention-period) · [Termos](https://github.com/github/docs/blob/main/content/site-policy/github-terms/github-terms-for-additional-products-and-features.md)
- **Git e arquivos** · GitHub alerta a partir de 50 MiB e bloqueia arquivos
  acima de 100 MiB no Git comum. LFS concede 10 GiB de armazenamento e
  10 GiB de tráfego por mês para Free/Pro conforme a tabela consultada,
  e novas versões e downloads consomem cota. Deixar LFS desativado até
  confirmar controles de gasto. Releases permitem arquivos individuais
  menores que 2 GiB segundo a documentação e podem servir para uma
  entrega aprovada ligada a uma versão, respeitando a finalidade do
  serviço. Releases públicos expõem os binários. Pages tem limite de
  1 GB de site publicado e serve para storyboard/prévia leve. [Git](https://github.com/github/docs/blob/main/content/repositories/working-with-files/managing-large-files/about-large-files-on-github.md) · [LFS](https://github.com/github/docs/blob/main/content/billing/concepts/product-billing/git-lfs.md) · [Valores de referência](https://github.com/github/docs/blob/main/data/variables/large_files.yml) · [Releases](https://github.com/github/docs/blob/main/content/repositories/releasing-projects-on-github/about-releases.md) · [Pages](https://github.com/github/docs/blob/main/content/pages/getting-started-with-github-pages/github-pages-limits.md)
- **Política proposta** · Git guarda fonte, ativos pequenos publicáveis,
  hashes SHA-256, origem, licença e URI de ativos grandes. Saída
  intermediária fica temporária. Preserve os ativos grandes
  irreproduzíveis com cópia em destino já autorizado, de preferência
  fora de Git, com teste de recuperação. Drive existente, armazenamento
  de objetos ou outro destino ficam condicionados a cotas da conta,
  controles de acesso, tráfego, credenciais e autorização. Sem destino
  comprovado, limitar o piloto a insumos pequenos e regeneráveis.
  A 6–10 Mb/s de vídeo, dois minutos dão cerca de 90–150 MB e uma hora,
  2,7–4,5 GB, antes do áudio. São estimativas de bitrate, não tamanhos
  medidos no piloto.

## Direitos de imagem, som e texto

Registrar titular, licença e versão, origem, data, alterações, créditos,
permissão para adaptação, distribuição comercial e plataformas, incluindo
o filme. Priorizar vetores próprios, efeitos próprios, obras comprovadas
em domínio público e CC0. CC BY exige atribuição; conferir compatibilidade
de CC BY-SA antes de adaptar e evitar NC e ND nos usos incompatíveis.
Freesound e Wikimedia Commons têm regras por item. A licença de uma
composição musical e a licença da gravação são verificações distintas.
Música das bibliotecas de redes sociais pode ter autorização restrita à
plataforma. Meme popular, fonte de letra, áudio, foto e saída de IA ainda
precisam de revisão de ativos e termos. Preferir humor visual original.
Antes de publicar, verificar também regras de rotulagem de conteúdo
sintético por plataforma e a [biblioteca bíblica](../editorial/referencias.md).
[Creative Commons](https://creativecommons.org/share-your-work/cclicenses/) · [Freesound](https://freesound.org/help/faq/) · [Wikimedia Commons](https://commons.wikimedia.org/wiki/Commons:Licensing)
