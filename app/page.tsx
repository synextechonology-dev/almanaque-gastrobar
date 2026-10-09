import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Historia from "@/components/Historia";
import Cardapio from "@/components/Cardapio";
import DaCozinha from "@/components/DaCozinha";
import Reservas from "@/components/Reservas";
import Espaco from "@/components/Espaco";
import Visita from "@/components/Visita";
import Footer from "@/components/Footer";
import Comanda from "@/components/Comanda";
import BotaoComanda from "@/components/BotaoComanda";
import Faixa from "@/components/Faixa";
import Revelar from "@/components/Revelar";

/*
 * Ordem das seções e fundos (proporção do manual: 60% petróleo, 25% creme, 15% laranja):
 * Hero (noite + foto) → Faixa (laranja) → História (petróleo) → Cardápio (noite com papel creme)
 * → Da cozinha (creme) → Reservas (laranja) → O espaço (noite) → Visita (petróleo) → Rodapé (noite)
 */
export default function Home() {
  return (
    <>
      <a className="pular" href="#cardapio">
        Pular para o cardápio
      </a>
      <Header />
      <main>
        <Hero />
        <Faixa />
        <Historia />
        <Cardapio />
        <DaCozinha />
        <Reservas />
        <Espaco />
        <Visita />
      </main>
      <Footer />
      <BotaoComanda />
      <Comanda />
      <Revelar />
    </>
  );
}
