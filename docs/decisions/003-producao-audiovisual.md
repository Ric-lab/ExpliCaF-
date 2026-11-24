# 003 · Arquitetura de produção audiovisual

**Data** · 24/11/2026. **Estado** · proposta aguardando aprovação.

**Proposta** · Arquivos abertos e versionados para roteiro, storyboard,
cenas e licenças, Kokoro ONNX em CPU e FFmpeg como núcleo de entrega.
Testar HyperFrames como camada visual em uma máquina compatível e manter
SVG/FFmpeg como rota inicial de menor dependência. A produção começa
sob demanda em ambiente de nuvem já disponível.

**Motivo** · As três ferramentas podem continuar a partir dos mesmos
arquivos e CLI. A prova confirmou síntese local pt-BR, render vertical e
junção. O render com Chromium ainda requer um executor compatível.
A [pesquisa](../producao/README.md) documenta condições e alternativas.

**Decisões pendentes** · Autorizar o piloto de 20–30 s (EF-007), escolher
a voz após escuta, confirmar o executor e o renderizador visual, definir
a guarda de ativos grandes irreproduzíveis e decidir a política de
distribuição de binários. A publicação continua condicionada à aprovação
do responsável e aos direitos de cada item.
