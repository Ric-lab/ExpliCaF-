# Provas de conceito e seus limites

Executadas em arquivos temporários na sessão de nuvem do Codex em
24/11/2026. FFmpeg 7.1.5, Node 24.22.3, Chromium 156 e Python 3.12.
Os números abaixo medem provas pequenas nesta máquina. Nenhum arquivo
de mídia, dependência, credencial ou workflow foi adicionado ao Git.

| Prova | Resultado observado |
| --- | --- |
| SVG → MP4 com FFmpeg | Dois SVGs originais, câmera por zoom, transição entre quadros, legenda em português com libass e três entradas de áudio (voz de teste, tom de fundo e efeito). Codificação em cerca de 4,8 s de relógio com duas threads solicitadas ao encoder. Saída de 3,50 s, 150.097 bytes, H.264/yuv420p, 1080×1920, 30 fps, AAC 48 kHz. Um quadro de transição em 1,75 s foi inspecionado visualmente e mostrou a legenda e a composição. |
| Junção com FFmpeg | Concat por cópia de duas cópias da amostra gerou MP4 de 7,021333 s e 298.938 bytes. Ambos os vídeos decodificaram integralmente sem erro. A diferença de 21,333 ms precisa ser considerada ao montar por cópia; a tolerância auditiva nas junções ainda precisa ser avaliada. |
| Kokoro ONNX 0.6.1 em CPU | ONNX int8 e banco de vozes de cerca de 136 MiB somados. Sem chave. Gerou WAV mono de 24 kHz: `pf_dora` 6,88 s, `pm_alex` 7,19 s e `pm_santa` 7,44 s. Cerca de 40,7 s de relógio ao todo, incluindo carga do modelo. Os três WAVs decodificaram sem erro. Naturalidade, prosódia e pronúncia de nomes ainda precisam ser avaliadas por escuta. |
| Síntese → legenda → MP4 | A saída de `pf_dora` foi usada como locução. A duração medida via FFprobe definiu o fim de um bloco SRT. FFmpeg combinou voz, trilha e efeito com dois SVGs em MP4 de 7,50 s, 318.478 bytes, 1080×1920/30 fps, H.264/AAC. Decodificação integral sem erro. Isso valida sincronização por bloco, sem medir acerto palavra a palavra. |
| HyperFrames 0.9.90 | Pacote instalado do npm em diretório temporário com scripts de instalação desativados. Uma composição HTML/CSS/SVG de 1 s, 1080×1920, passou no lint com zero avisos após declarar IDs estáveis e `data-no-timeline` para a cena estática. Com cache e configuração graváveis, o render compilou a composição e identificou 30 quadros; a captura falhou no sandbox do Chromium. Chromium independente reproduziu o problema. Nenhum MP4 do HyperFrames foi validado. |

## Como reproduzir os pontos principais

No FFmpeg, use dois SVGs 1080×1920 originais. Aplique `zoompan` a cada um,
com `s=1080x1920:fps=30` e `d=60` quadros por cena. Use
`xfade=transition=fade:duration=0.5:offset=1.5`, depois `subtitles` com
um SRT em UTF-8. Combine voz e fundo com `sidechaincompress` e adicione um
efeito com `adelay`, `amix` e `alimiter`. O encode usou `libx264`,
`-preset fast`, `yuv420p`, AAC 48 kHz e `-movflags +faststart`.

Para a voz, instale `kokoro-onnx==0.6.1` e `soundfile` em um ambiente
Python isolado. Baixe os dois arquivos da
[release de modelos do wrapper](https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.1).
Estes são hashes calculados nesta prova para identificar os arquivos. A
implantação deve conferir também a proveniência e a licença da revisão.

| Arquivo | SHA-256 |
| --- | --- |
| `kokoro-v1.0.int8.onnx` | `ae315a79b623f244700e4afb9246c46a26066782e049ba174bf3ba433970ee9c` |
| `voices-v1.0.bin` | `bca610b8308e8d99f32e6fe4197e7ec01679264efed0cac9140fe9c29f1fbf7d` |

A chamada foi `Kokoro(modelo, vozes).create(texto, voice="pf_dora",
speed=1.0, lang="pt-br")`. O texto usado foi “A câmera se aproxima.
Você percebeu a diferença? A água avançou devagar, mas ninguém esperava
tamanha mudança.” Cada voz recebeu o mesmo texto.

Para validar a saída e exercitar junção, use comandos equivalentes a:

```bash
ffprobe -v error -show_entries stream=codec_name,width,height,pix_fmt,r_frame_rate,sample_rate:format=duration,size -of compact amostra.mp4
ffmpeg -v error -xerror -i amostra.mp4 -f null -
printf "file 'amostra.mp4'\nfile 'amostra.mp4'\n" > lista.txt
ffmpeg -v error -f concat -safe 1 -i lista.txt -c copy filme.mp4
```

O próximo teste deve usar conteúdo original curto, música revisada, fala
avaliada e duas junções distintas. Ainda faltam um render com navegador
funcional, medição de RAM e armazenamento de uma cena representativa e
a repetição por outra IA. [Critérios do piloto](arquitetura.md)
