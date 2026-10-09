# Almanaque Gastrobar · site

Esqueleto em Next.js do site do Almanaque Gastrobar.

## Rodar

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

## Onde mexer

| O que | Arquivo |
| --- | --- |
| Contato, horários, entrega, pagamento, reservas | `lib/site.ts` |
| Cardápio (itens, preços, opções, fotos) | `lib/menu.ts` |
| Cores, fontes e layout | `app/globals.css` |
| Mensagem do pedido e da reserva no WhatsApp | `lib/whatsapp.ts` |
| Prazo de 1 hora da comanda | `lib/site.ts` > `validadeComandaMin` |
| Fotos do espaço | `public/fotos/` e `components/Espaco.tsx` |
| Fotos dos pratos | `public/pratos/` e o campo `foto` em `lib/menu.ts` |
| Logo | `public/brand/` |
| Data, lua e previsão do dia | `lib/almanaque.ts` |
| Frase dos pratos da vitrine | campo `causo` em `lib/menu.ts` |

## Seções

O site é montado como uma edição de almanaque: cada seção é um capítulo numerado (Nº 01, Nº 02...).

1. **Início**: cabeçalho "Edição de hoje" com a data, a fase da lua (vista do hemisfério sul) e a previsão da casa para o dia; o letreiro acendendo e "zumbindo"; a fachada como porta em arco com a plaquinha Aberto/Fechado balançando; no computador, uma luz de lampião segue o mouse.
2. **Faixa**: tira laranja inclinada correndo com pratos e drinques.
3. **Nº 01 · A casa**: o verbete "al·ma·na·que" como num dicionário antigo, a história e os quatro pilares.
4. **Nº 02 · O cardápio**: abas no papel creme do manual. Cada item tem o botão Pedir.
5. **Nº 03 · Feito com alma**: "Primeira vez aqui? Comece por estes." Quatro lâminas; sem foto, cada prato vira uma inicial gigante sobre um prato desenhado.
6. **Nº 04 · Reservas**: canhoto de reserva com picote, enviado pelo WhatsApp.
7. **Nº 05 · O lugar**: as fotos como retratos revelados, levemente tortos.
8. **Nº 06 · Como chegar**: mapa do Google com cartão por cima (Abrir no Google Maps e Traçar rota), horários com o dia de hoje em destaque e contatos.
9. **Rodapé**: "Fim desta edição."

## Comanda

O cliente monta a comanda pelo cardápio, escolhe retirada ou entrega e envia tudo pronto pelo WhatsApp. A comanda fica salva no aparelho e é esvaziada 1 hora depois da última alteração.

O que falta preencher está em `PREENCHER.md`. Instruções para o Claude Code estão em `CLAUDE.md`.
