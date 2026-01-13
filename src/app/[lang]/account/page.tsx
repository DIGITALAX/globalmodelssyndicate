import { getDictionary } from "../dictionaries";
import { tParams } from "../layout";
import AccountEntry from "@/app/components/Account/modules/AccountEntry";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: tParams;
}): Promise<Metadata> {
  const { lang } = await params;
  const baseUrl = "https://gms.globaldesignernetwork.com";

  const titles: Record<string, string> = {
    en: "Account - Model Dashboard | Global Models Syndicate",
    es: "Cuenta - Panel de Modelo | Global Models Syndicate",
    pt: "Conta - Painel do Modelo | Global Models Syndicate",
  };

  const descriptions: Record<string, string> = {
    en: "Model dashboard. Who knew there was so much contained and conveyed in a simple pose? Who knew too that the trick to kinesthetic self sovereignty is simply to go shopping? This isn't the interface we most intimately wear, it's the infinite interface that is a part of who we are.",
    es: "Panel de Model. ¿Quién sabía que había tanto contenido y transmitido en una simple pose? ¿Quién sabía también que el truco para la soberanía cinestésica del yo es simplemente ir de compras? Esta no es la interfaz que vestimos más íntimamente, es la interfaz infinita que es parte de quienes somos.",
    pt: "Painel do Model. Quem sabia que havia tanto contido e transmitido em uma simples pose? Quem sabia também que o truque para a soberania cinestésica do eu é simplesmente ir às compras? Esta não é a interface que vestimos mais intimamente, é a interface infinita que faz parte de quem somos.",
  };

  return {
    title: titles[lang] || titles.en,
    description: descriptions[lang] || descriptions.en,
    alternates: {
      canonical: `${baseUrl}/${lang}/account/`,
      languages: {
        en: `${baseUrl}/en/account/`,
        es: `${baseUrl}/es/account/`,
        pt: `${baseUrl}/pt/account/`,
      },
    },
    openGraph: {
      title: titles[lang] || titles.en,
      description: descriptions[lang] || descriptions.en,
      url: `${baseUrl}/${lang}/account/`,
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
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function Account({ params }: { params: tParams }) {
  const { lang } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return <AccountEntry dict={dict} />;
}
