# UNIGO — landing e app demonstrativo

Projeto independente em React + TypeScript + Vite, em `UNIGO-new`. O projeto anterior foi preservado.

## Executar

```sh
npm install
npm run dev -- --host 127.0.0.1 --port 5188
```

- `/`: landing ilustrada.
- `/entrar`, `/cadastro`, `/recuperar`: formulários frontend.
- `/app`: aplicativo demonstrativo; também acessível pelo botão de conclusão do login/cadastro.

## Aplicativo

- Mapa Leaflet + OpenStreetMap com referência do campus e pontos aproximados de saída.
- Busca por ponto de saída, data e horário mínimo.
- Detalhes da carona, solicitação, aceite simulado, cancelamento e conclusão.
- Disponibilidade calculada por carona e data; solicitações pendentes não consomem vagas. O cancelamento de um aceite libera a vaga da ocorrência correspondente.
- Publicação de caronas pontuais ou recorrentes em dias úteis.
- Referência de contribuição a partir da distância em linha reta (Haversine), dividida entre os ocupantes, com parâmetro demonstrativo de R$ 1/km. Não é distância rodoviária, tarifa oficial ou cálculo de custos reais. O motorista escolhe o valor.
- Chat local liberado após aceite; alternância passageiro/motorista permite testar ambos os lados.
- Histórico, feedback categorizado e selo após três conclusões na mesma carona recorrente demonstrativa.
- Persistência em `localStorage`, chave `unigo-app-demo-v1`. Dados incompatíveis são recuperados com uma nova demonstração.
- Sidebar no desktop e navegação inferior no celular. Modais Radix com controle de foco e Escape.

### Roteiro para testar

1. Abra `/app` e escolha **Ver carona**.
2. Solicite a vaga. Ela aparece em **Minhas caronas**, aguardando aceite.
3. Troque o seletor superior para **Motorista** e clique **Simular aceite**.
4. Abra a conversa. Alterne o perfil para escrever como cada participante.
5. Conclua a demonstração e registre o feedback.
6. Em **Oferecer carona**, publique uma saída e atualize a página para conferir a persistência.

## Limites do protótipo

Não há backend, sessão autenticada, validação acadêmica, conta real, reserva real, comunicação entre navegadores ou envio de denúncias à coordenação. Credenciais dos formulários não são persistidas. Os perfis e preços iniciais são exemplos, não dados de pessoas reais. As menções à UniFio não anunciam parceria oficial.

Pagamentos continuam fora do aplicativo, diretamente entre participantes. Não há carteira, comissão ou processamento financeiro.

O mapa depende da disponibilidade externa de tiles do OpenStreetMap; carregamento e falha possuem mensagens próprias e a lista de caronas permanece utilizável. O ponto do campus é uma referência cartográfica, não um portão de embarque. Roteamento rodoviário e sugestão baseada em API de estradas permanecem pendentes; não são simulados como resultados reais.

## Identidade e arquitetura

Paleta: `#0d1321`, `#1d2d44`, `#3e5c76`, `#748cab`, `#f0ebd8`. Outfit e Manrope locais; Phosphor para ícones; Radix para primitivas; Motion e Three.js na landing.

- `src/Root.tsx`: separação lazy de landing, autenticação e aplicativo.
- `src/app/Workspace.tsx` + CSS: telas e fluxos do app.
- `src/app/model.ts`: dados demonstrativos, persistência, disponibilidade e cálculo linear.
- `src/app/RideMap.tsx`: mapa lazy, marcadores, carregamento e fallback.
- `src/app/PriceReference.tsx`: contribuição e explicação do cálculo.
- `src/AuthPage.tsx`: autenticação simulada, sem armazenamento de credenciais.
- `src/LandingNav.tsx`, `src/AuthJourney.tsx`: navegação e narrativa de acesso.
- `src/CampusArchitecture.tsx`: campus SVG estilizado a partir da foto oficial, não réplica técnica.
- `src/CompactCar.ts`, `src/CarModel.tsx`: geometria original e renderer Three.js sob demanda.

O 3D permanece em chunk separado e renderiza sob demanda. Assets Kenney antigos em `public/models/` não são utilizados. Em eventual hospedagem, configurar fallback SPA para `index.html`.

## Referências

- Primitivas/sidebar: https://21st.dev/community/components/s/sidebar — inspiração de organização, sem copiar marca ou bloco integral.
- Leaflet: https://leafletjs.com/examples/quick-start/
- OpenStreetMap: https://www.openstreetmap.org/copyright
- Referência cartográfica do campus: https://www.openstreetmap.org/way/355386390
- Foto oficial usada como referência do SVG: https://www.unifio.edu.br/wp-content/uploads/2024/07/Campus-da-UNIFIO.jpg

## Verificação

```sh
npm run build
npm run lint
npx playwright install chromium
# Com servidor em 5188:
npx playwright test --reporter=list --workers=1 --timeout=60000
node scripts/audit-app.mjs
```

A suíte contém 19 testes: landing, geometria das rotas, navegação, autenticação, 3D, responsividade e fluxos do app. A auditoria do mapa grava `artifacts/app-audit.json` e `artifacts/app-map-settled.png`, contando tiles efetivamente carregados em vez de apenas esperar o contêiner aparecer.

O build ainda informa um aviso de tamanho no chunk 3D carregado sob demanda. Lighthouse e medições de Core Web Vitals em produção não foram realizados.
