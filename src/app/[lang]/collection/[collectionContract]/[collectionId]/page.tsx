import { getDictionary } from "@/app/[lang]/dictionaries";
import { tParams } from "@/app/[lang]/layout";
import { Metadata } from "next";
import { getCollection } from "../../../../../../graphql/gms/getCollections";
import CollectionEntry from "@/app/components/Collection/modules/CollectionEntry";

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    lang: string;
    collectionContract: string;
    collectionId: string;
  }>;
}): Promise<Metadata> {
  const { lang, collectionContract, collectionId } = await params;
  const baseUrl = "https://gms.globaldesignernetwork.com";

  const result = await getCollection(
    parseInt(collectionId),
    collectionContract
  );
  const collectionData = result?.data?.collections?.[0];

  if (!collectionData) {
    return {
      title: "Collection Not Found | Global Models Syndicate",
      description: "Web3 Fashion Collection",
    };
  }

  const title = `${collectionData.metadata?.title || "Collection"} | ${
    collectionData.modelProfile?.metadata?.title || "Model"
  } | Global Models Syndicate`;
  const description =
    collectionData.metadata?.description ||
    "Web3 Fashion Model Collection. Indie DIY. Radical CC0. Minted on ETH + ZK aligned chains.";

  const mediaUrl = collectionData.metadata?.media
    ? `https://thedial.infura-ipfs.io/ipfs/${collectionData.metadata.media}`
    : null;

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${lang}/collection/${collectionContract}/${collectionId}/`,
      languages: {
        en: `${baseUrl}/en/collection/${collectionContract}/${collectionId}/`,
        es: `${baseUrl}/es/collection/${collectionContract}/${collectionId}/`,
        pt: `${baseUrl}/pt/collection/${collectionContract}/${collectionId}/`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${lang}/collection/${collectionContract}/${collectionId}/`,
      siteName: "Global Models Syndicate",
      locale: lang,
      type: "article",
      images: mediaUrl
        ? [
            {
              url: mediaUrl,
              width: 1200,
              height: 630,
              alt: collectionData.metadata?.title || "Collection",
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      site: "@digitalax_",
      title,
      description,
      images: mediaUrl ? [mediaUrl] : [],
    },
  };
}

export default async function Collection({ params }: { params: tParams }) {
  const { lang } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return <CollectionEntry dict={dict} />;
}
