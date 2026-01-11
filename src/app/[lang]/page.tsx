import Entry from "../components/Common/modules/Entry";
import { getDictionary } from "./dictionaries";
import { tParams } from "./layout";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: tParams;
}): Promise<Metadata> {
  const { lang } = await params;
  const baseUrl = "https://gms.globaldesignernetwork.com";

  const titles: Record<string, string> = {
    en: "Global Models Syndicate | Indie Punk Models - Intensely DIY, Radical CC0",
    es: "Global Models Syndicate | Modelos Indie Punk - Intensamente DIY, CC0 Radical",
    pt: "Global Models Syndicate | Modelos Indie Punk - Intensamente DIY, CC0 Radical",
  };

  const descriptions: Record<string, string> = {
    en: "Who knew there was so much contained and conveyed in a simple pose? Who knew too that the trick to kinesthetic self sovereignty is simply to go shopping? This isn't the interface we most intimately wear, it's the infinite interface that is a part of who we are.",
    es: "¿Quién sabía que había tanto contenido y transmitido en una simple pose? ¿Quién sabía también que el truco para la soberanía cinestésica del yo es simplemente ir de compras? Esta no es la interfaz que vestimos más íntimamente, es la interfaz infinita que es parte de quienes somos.",
    pt: "Quem sabia que havia tanto contido e transmitido em uma simples pose? Quem sabia também que o truque para a soberania cinestésica do eu é simplesmente ir às compras? Esta não é a interface que vestimos mais intimamente, é a interface infinita que faz parte de quem somos.",
  };

  return {
    title: titles[lang] || titles.en,
    description: descriptions[lang] || descriptions.en,
    alternates: {
      canonical: `${baseUrl}/${lang}/`,
      languages: {
        en: `${baseUrl}/en/`,
        es: `${baseUrl}/es/`,
        pt: `${baseUrl}/pt/`,
      },
    },
    openGraph: {
      title: titles[lang] || titles.en,
      description: descriptions[lang] || descriptions.en,
      url: `${baseUrl}/${lang}/`,
      siteName: "Global Models Syndicate",
      locale: lang,
      type: "website",
      images: [
        {
          url: `${baseUrl}/images/globalmodelssyndicate.png`,
          width: 1200,
          height: 630,
          alt: "Global Models Syndicate - Web3 Fashion",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@digitalax_",
      title: titles[lang] || titles.en,
      description: descriptions[lang] || descriptions.en,
      images: [`${baseUrl}/images/globalmodelssyndicate.png`],
    },
  };
}

export default async function IndexPage({ params }: { params: tParams }) {
  const { lang } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return <Entry dict={dict} />;
}
