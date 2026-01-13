import { getDictionary } from "../[lang]/dictionaries";
import Wrapper from "../components/Common/modules/Wrapper";
import type { Metadata } from "next";
import IndieModelsEntry from "../components/IndieModels/modules/IndieModelsEntry";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = "https://gms.globaldesignernetwork.com";
  return {
    alternates: {
      canonical: `${baseUrl}/indie-models/`,
    },
  };
}

export default async function IndieModels() {
  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");
  return (
    <Wrapper dict={dict} page={<IndieModelsEntry dict={dict} />}></Wrapper>
  );
}
