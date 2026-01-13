import { getDictionary } from "../[lang]/dictionaries";
import AccountEntry from "../components/Account/modules/AccountEntry";
import Wrapper from "../components/Common/modules/Wrapper";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = "https://gms.globaldesignernetwork.com";
  return {
    alternates: {
      canonical: `${baseUrl}/account/`,
    },
  };
}

export default async function Account() {
  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");
  return <Wrapper dict={dict} page={<AccountEntry dict={dict} />}></Wrapper>;
}
