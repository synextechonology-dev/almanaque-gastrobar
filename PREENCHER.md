# Almanaque Gastrobar: o que falta preencher

Tudo abaixo precisa vir do Almanaque. Onde houver arquivo indicado, é lá que a informação entra.

## 1. Pedidos (entrega e retirada) · `lib/site.ts` > `pedidos`

- [ ] O Almanaque faz **entrega**? Se não fizer, `aceitaEntrega: false` e o site oferece só retirada.
- [ ] **Taxa de entrega**: valor fixo, por bairro ou combinada no WhatsApp? (hoje aparece "a confirmar")
- [ ] **Área de entrega**: quais bairros ou até quantos km?
- [ ] **Pedido mínimo** para entrega, se houver.
- [ ] **Tempo médio** de entrega e de retirada.
- [ ] **Formas de pagamento** aceitas na entrega e na retirada (hoje: Pix, crédito, débito, dinheiro). Pix é pago na hora ou antecipado? Se for antecipado, mandar a chave Pix.
- [ ] Pedidos pelo site valem **em todo o horário de funcionamento**, inclusive no almoço de domingo?
- [ ] Quais itens **não saem para entrega**? (chope, drinques com espuma, sobremesa com sorvete, vinho...). Hoje todos podem ser pedidos, menos a pipoca de cortesia.
- [ ] O Almanaque quer receber pedidos **com a casa fechada** (respondidos quando abrir) ou prefere bloquear?

## 2. Cardápio · `lib/menu.ts`

O cardápio foi transcrito igual ao PDF oficial, sem correções. Confirmar só o que o site acrescentou:

- [ ] **Ponto da carne**: o site pergunta o ponto (mal passado, ao ponto, bem passado) no L'Entrecôte de Paris, no Tornedor do Alma, nos cortes bovinos do "Grelhados acompanhados" e no grelhado adicionado ao risoto. A cozinha trabalha com esses três pontos?
- [ ] **Burrata**: o cliente escolhe entre focaccia tostada ou pão de azeite. Confere?
- [ ] **Fritas nos burgers**: o adicional (+10 tradicionais / +12 cajun) vale para o Alma Chicken Sanduíche também?
- [ ] O cardápio do **almoço de domingo** é o mesmo da noite?
- [ ] Quais **4 pratos** ficam na vitrine "Feito com alma"? (hoje: Tornedor do Alma, Burrata, Milanesa, Risoto Suã) · `destaques` no fim de `lib/menu.ts`

## 3. Fotos · `public/`

- [ ] **Fotos dos pratos** em boa resolução (mínimo 1200 px no lado maior), salvas em `public/pratos/` com o nome do prato. Depois é só preencher `foto: "/pratos/nome.jpg"` no item.
- [ ] **Fotos do espaço em alta resolução.** As três enviadas têm só 340 px de largura e ficam borradas em telas grandes. Pedir os arquivos originais ao fotógrafo.
- [ ] A foto da **lateral** tem bandeiras da Copa: decoração temporária. Usar outra ou manter?
- [ ] Uma foto do **balcão ou do bar** para o quarto espaço da galeria "O espaço".

## 4. Marca · `public/brand/`

- [ ] **Logo em SVG** (versões laranja, creme e petróleo). As PNGs atuais foram extraídas do manual e têm 521 px: servem, mas um SVG fica nítido em qualquer tela.
- [ ] **Slogan**: o manual diz "Boa comida, boas histórias." e a mensagem enviada dizia "Boas comidas, Boas histórias.". O site usa a versão do manual. Confirmar.
- [ ] **Música**: o manual traz música (microfone, karaokê) como um dos quatro pilares da casa, e o site mostra o ícone. Tem música ao vivo ou karaokê de fato? Se tiver dia fixo, dá para criar uma faixa "Hoje na casa".

## 5. Reservas · `lib/site.ts` > `reservas`

- [ ] O Almanaque **aceita reservas**? Se não, `ativo: false` e a seção some.
- [ ] Limite de pessoas por reserva (hoje 20).
- [ ] Antecedência mínima? Tolerância de atraso? Aceita reserva para o almoço de domingo?

## 6. Contato e domínio · `lib/site.ts`

- [ ] **Domínio** final do site (para `url`, SEO e compartilhamento).
- [ ] Link exato do **Google Maps** (perfil do Google Meu Negócio), se houver.
- [ ] O WhatsApp **(14) 99885-7779** é o mesmo que recebe pedidos e reservas?

## 7. Textos novos do site · confirmar com o Almanaque

O site ganhou textos que não estão no cardápio impresso. Nada aqui afirma fato que não veio do cardápio ou do manual, mas o dono precisa aprovar:

- [ ] **Previsões do dia** (cabeçalho do início), em `lib/almanaque.ts` > `PREVISOES`. Ex.: sexta "chope gelado, casa cheia e história nova. Melhor reservar."
- [ ] **Frases da vitrine** "Comece por estes" (campo `causo` em `lib/menu.ts`). Ex.: Tornedor "Secreta mesmo: nem adianta perguntar."
- [ ] **Pilar Música**: o site diz "Trilha boa pra conversa render." Se tiver karaokê ou música ao vivo, dá pra ser mais específico.
- [ ] **Legenda da foto da esquina**: "A esquina, num dia de jogo." (por causa das bandeiras da Copa). Se a foto for trocada, trocar a legenda em `components/Espaco.tsx`.
- [ ] **Mapa**: conferir no celular se o pino do Google cai na porta certa. Se o Almanaque tiver perfil no Google Meu Negócio, usar o link exato dele em `lib/site.ts` (`linkMapa`, `linkRota`, `linkMapaEmbed`).
