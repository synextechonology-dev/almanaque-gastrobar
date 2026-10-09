# Almanaque Gastrobar: instruções para o Claude Code

Site de uma página para o Almanaque Gastrobar (Santa Cruz do Rio Pardo, SP). Restaurante rústico e mais caro: o site precisa passar presença e cuidado, sem cara de template. Projeto da Synex.

## Stack

Next.js 15 (App Router) + React 19 + TypeScript + CSS puro (`app/globals.css`). Sem Tailwind e sem biblioteca de UI. Fontes por `next/font/google`.

## Regras da marca (manual em `referencia/`)

- Cores: Petróleo Noite `#001317`, Petróleo `#0E2A2E`, Creme Papel `#F3E9D8`, Laranja Almanaque `#EC6429`, Brasa `#B8441A`, Névoa `#C2CCCF`. Proporção 60% petróleo, 25% creme, 15% laranja. Não criar cores novas.
- Tipografia: Abril Fatface (títulos e nomes de pratos), Kaushan Script (no máximo uma frase pincelada por seção), Josefin Sans (texto, preços, rótulos; rótulos curtos em caixa alta espaçada).
- O "A" gigante é textura de fundo. Ícones em traço fino.
- Tom de voz: fala como quem conta um causo. Ex.: "A mesa do canto tá guardada." Nunca "promoções imperdíveis".
- Os fundos alternam por seção (noite, petróleo, creme, laranja). Não deixar o site numa cor só.

## Cardápio

- `lib/menu.ts` é a única fonte do cardápio. Nomes, descrições e preços são **iguais ao cardápio impresso**, inclusive grafias como "empanento" e "Caccio e Peppe". Não corrigir sem o dono pedir.
- O visual do cardápio segue o modelo do manual: papel creme, nome da seção em Kaushan cor brasa, nome do prato em Abril, preço sem "R$" à direita.
- Opções do prato ficam em `grupos` (tipo `base` define o preço, `adicional` soma, `escolha` não mexe no preço). `aplicaSe` mostra um grupo só depois de outra escolha (ponto da carne).

## Comanda e pedido

- `lib/comanda.tsx`: contexto da comanda, salva no `localStorage`. **A comanda é esvaziada 1 hora depois da última alteração** (`validadeComandaMin` em `lib/site.ts`). Abrir o site não renova o prazo.
- `lib/whatsapp.ts`: monta as mensagens de pedido e de reserva. O pedido informa retirada ou entrega, nome, horário, itens com opções e observações, subtotal, taxa, pagamento (com troco) e endereço.
- Bebida alcoólica na comanda exige confirmar 18 anos.

## O que já está pronto

Conceito "edição de almanaque": capítulos numerados (`components/Capitulo.tsx`), cabeçalho com data, lua e previsão do dia (`lib/almanaque.ts`, `components/Edicao.tsx`), letreiro acendendo, plaquinha Aberto/Fechado na porta (`Plaquinha.tsx`), luz que segue o mouse (`Lanterna.tsx`), faixa correndo (`Faixa.tsx`), verbete na história, vitrine tipográfica, reservas em canhoto, fotos como retratos, mapa com cartão e rota, rodapé "fim desta edição". Blocos com `data-revelar` surgem ao rolar (`Revelar.tsx`, respeita movimento reduzido).

- As fotos atuais têm 340 px: nunca usar em tela cheia nítida. No hero a fachada entra desfocada como luz de fundo.
- `main` usa `overflow-x: clip` por causa da faixa inclinada. Não trocar por `hidden` (quebra as abas fixas do cardápio).
- O fundo desfocado do topo fica em `.topo::before`. `backdrop-filter` no próprio header prende o menu do celular.

## Próximos passos

1. Rodar `npm install` e `npm run dev`, conferir no celular (375 px) e no desktop.
2. Preencher o que está em `PREENCHER.md` (principalmente entrega, taxa, fotos e logo em SVG).
3. Trocar as PNGs do logo pelos SVGs quando chegarem (`public/brand/`).
4. Colocar as fotos dos pratos (campo `foto`). `MOSTRAR_ESPACO_DE_FOTO` em `components/Cardapio.tsx` está `false`: prato sem foto aparece só com texto, sem moldura vazia.
5. Rodar Lighthouse (meta: 90+ em performance e acessibilidade no celular).
6. Deploy na Vercel e apontar o domínio.
