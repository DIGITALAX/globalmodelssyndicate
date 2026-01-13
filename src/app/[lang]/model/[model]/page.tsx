import { tParams } from "../../layout";
import { getDictionary } from "../../dictionaries";
import ModelEntry from "@/app/components/Model/modules/ModelEntry";
import { Metadata } from "next";
import { getModel } from "../../../../../graphql/gms/getModels";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; model: string }>;
}): Promise<Metadata> {
  const { lang, model } = await params;
  const baseUrl = "https://gms.globaldesignernetwork.com";

  const result = await getModel(model);
  const modelData = result?.data?.models?.[0];

  if (!modelData) {
    return {
      title: "Model Not Found | Global Models Syndicate",
      description: "Web3 Fashion Model Profile",
    };
  }

  const title = `${modelData.metadata?.title || "Model"} | Web3 Fashion | Global Models Syndicate`;
  const description =
    modelData.metadata?.description ||
    "Indie web3 fashion model.";

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${lang}/model/${model}/`,
      languages: {
        en: `${baseUrl}/en/model/${model}/`,
        es: `${baseUrl}/es/model/${model}/`,
        pt: `${baseUrl}/pt/model/${model}/`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${lang}/model/${model}/`,
      siteName: "Global Models Syndicate",
      locale: lang,
      type: "profile",
      images: modelData.metadata?.image
        ? [
            {
              url: `https://thedial.infura-ipfs.io/ipfs/${modelData.metadata.image}`,
              width: 1200,
              height: 630,
              alt: modelData.metadata.title || "Model",
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      site: "@digitalax_",
      title,
      description,
      images: modelData.metadata?.image
        ? [`https://thedial.infura-ipfs.io/ipfs/${modelData.metadata.image}`]
        : [],
    },
  };
}

export default async function Model({ params }: { params: tParams }) {
  const { lang } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return <ModelEntry dict={dict} />;
}
