import type { Metadata, Viewport } from "next";
import { Abril_Fatface, Josefin_Sans, Kaushan_Script } from "next/font/google";
import { site, enderecoCompleto } from "@/lib/site";
import { ComandaProvider } from "@/lib/comanda";
import "./globals.css";

// Tipografia do manual de identidade: títulos, destaque pincelado e apoio.
const titulo = Abril_Fatface({ subsets: ["latin"], weight: "400", variable: "--f-titulo", display: "swap" });
const script = Kaushan_Script({ subsets: ["latin"], weight: "400", variable: "--f-script", display: "swap" });
const apoio = Josefin_Sans({ subsets: ["latin"], weight: ["300", "400", "600", "700"], variable: "--f-apoio", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.nome} · Boa comida, boas histórias · Santa Cruz do Rio Pardo`,
  description:
    "Gastrobar no Centro de Santa Cruz do Rio Pardo: grelhados no ponto, risotos, burgers, drinques autorais e carta de vinhos. Monte sua comanda, peça pelo WhatsApp ou guarde sua mesa.",
  openGraph: {
    title: site.nome,
    description: `${site.slogan} ${site.descricao}`,
    images: ["/fotos/fachada-frente.jpg"],
    locale: "pt_BR",
    type: "website",
  },
  icons: { icon: "/brand/favicon.png" },
};

export const viewport: Viewport = {
  themeColor: "#001317",
  width: "device-width",
  initialScale: 1,
};

// Dados estruturados para o Google (horários, endereço, cardápio, reservas).
const DIAS_SCHEMA = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: site.nome,
  slogan: site.slogan,
  url: site.url,
  telephone: `+${site.whatsapp}`,
  image: `${site.url}/fotos/fachada-frente.jpg`,
  servesCuisine: ["Bistrô", "Grelhados", "Risotos", "Hambúrgueres", "Drinks"],
  priceRange: "$$$",
  acceptsReservations: site.reservas.ativo,
  hasMenu: `${site.url}/#cardapio`,
  sameAs: [site.instagram],
  address: {
    "@type": "PostalAddress",
    streetAddress: site.endereco.rua,
    addressLocality: site.endereco.cidade,
    addressRegion: site.endereco.uf,
    postalCode: site.endereco.cep,
    addressCountry: "BR",
  },
  openingHoursSpecification: Object.entries(site.horarios).flatMap(([dia, turnos]) =>
    turnos.map((t) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: DIAS_SCHEMA[Number(dia)],
      opens: t.abre,
      closes: t.fecha === "00:00" ? "23:59" : t.fecha,
    }))
  ),
  description: `${site.descricao} ${enderecoCompleto}`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${titulo.variable} ${script.variable} ${apoio.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <ComandaProvider>{children}</ComandaProvider>
      </body>
    </html>
  );
}
