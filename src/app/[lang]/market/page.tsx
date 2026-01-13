import MarketEntry from "@/app/components/Market/modules/MarketEntry";
import { getDictionary } from "../dictionaries";
import { tParams } from "../layout";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: tParams;
}): Promise<Metadata> {
  const { lang } = await params;
  const baseUrl = "https://gms.globaldesignernetwork.com";

  const titles: Record<string, string> = {
    en: "Market - Do you pose in web3 fashion? | Global Models Syndicate",
    es: "Mercado - ¿Posás en la moda web3? | Global Models Syndicate",
    pt: "Mercado - Você posa na moda web3? | Global Models Syndicate",
  };

  const descriptions: Record<string, string> = {
    en: "Market of modelos. Who knew there was so much contained and conveyed in a simple pose? Who knew too that the trick to kinesthetic self sovereignty is simply to go shopping? This isn't the interface we most intimately wear, it's the infinite interface that is a part of who we are.",
    es: "Mercado de modelos. ¿Quién sabía que había tanto contenido y transmitido en una simple pose? ¿Quién sabía también que el truco para la soberanía cinestésica del yo es simplemente ir de compras? Esta no es la interfaz que vestimos más íntimamente, es la interfaz infinita que es parte de quienes somos.",
    pt: "Mercado de modelos. Quem sabia que havia tanto contido e transmitido em uma simples pose? Quem sabia também que o truque para a soberania cinestésica do eu é simplesmente ir às compras? Esta não é a interface que vestimos mais intimamente, é a interface infinita que faz parte de quem somos.",
  };

  return {
    title: titles[lang] || titles.en,
    description: descriptions[lang] || descriptions.en,
    alternates: {
      canonical: `${baseUrl}/${lang}/market/`,
      languages: {
        en: `${baseUrl}/en/market/`,
        es: `${baseUrl}/es/market/`,
        pt: `${baseUrl}/pt/market/`,
      },
    },
    openGraph: {
      title: titles[lang] || titles.en,
      description: descriptions[lang] || descriptions.en,
      url: `${baseUrl}/${lang}/market/`,
      siteName: "Global Models Syndicate",
      locale: lang,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      site: "@digitalax_",
      title: titles[lang] || titles.en,
      description: descriptions[lang] || descriptions.en,
    },
  };
}

export default async function Market({ params }: { params: tParams }) {
  const { lang } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return <MarketEntry dict={dict} />;
}
