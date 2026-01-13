import { getDictionary } from "../[lang]/dictionaries";
import Wrapper from "../components/Common/modules/Wrapper";
import MarketEntry from "../components/Market/modules/MarketEntry";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = "https://gms.globaldesignernetwork.com";
  return {
    alternates: {
      canonical: `${baseUrl}/market/`,
    },
  };
}

export default async function Market() {
  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");
  return <Wrapper dict={dict} page={<MarketEntry dict={dict} />}></Wrapper>;
}
