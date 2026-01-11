import ModalsEntry from "../components/Modals/modules/ModalsEntry";

export type tParams = Promise<{ lang: string }>;
export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "es" }, { lang: "pt" }];
}

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: tParams;
}>) {
  return (
    <>
      {children}
      <ModalsEntry params={params} />
    </>
  );
}
