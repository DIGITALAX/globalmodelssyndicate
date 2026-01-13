import { getDictionary } from "@/app/[lang]/dictionaries";
import CollectionEntry from "@/app/components/Collection/modules/CollectionEntry";
import Wrapper from "@/app/components/Common/modules/Wrapper";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ collectionContract: string; collectionId: string }>;
}): Promise<Metadata> {
  const baseUrl = "https://gms.globaldesignernetwork.com";
  const { collectionContract, collectionId } = await params;
  return {
    alternates: {
      canonical: `${baseUrl}/collection/${collectionContract}/${collectionId}/`,
    },
  };
}

export default async function Collection() {
  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");
  return <Wrapper dict={dict} page={<CollectionEntry dict={dict} />}></Wrapper>;
}
