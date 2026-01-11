import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Footer from "./components/Common/modules/Footer";

export const metadata: Metadata = {
  title: "Global Models Syndicate",
  description:
    "A network dedicated for models exploring breakout looks and rising in prominence in web3 fashion and the open metaverse.",
  robots: {
    googleBot: {
      index: true,
      follow: true,
    },
  },
  keywords:
    "Web3, Web3 Fashion, Moda Web3, Open Source, CC0, Emma-Jane MacKinnon-Lee, Open Source LLMs, DIGITALAX, F3Manifesto, digitalax.xyz, f3manifesto.xyz, Women, Life, Freedom.",
  twitter: {
    card: "summary_large_image",
    site: "@digitalax_",
    title: "Global Models Syndicate",
    description:
      "A network dedicated for models exploring breakout looks and rising in prominence in web3 fashion and the open metaverse.",
  },
  openGraph: {
    title: "Global Models Syndicate",
    description:
      "A network dedicated for models exploring breakout looks and rising in prominence in web3 fashion and the open metaverse.",
  },
  creator: "Emma-Jane MacKinnon-Lee",
  publisher: "Emma-Jane MacKinnon-Lee",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Global Models Syndicate",
              url: "https://gms.globaldesignernetwork.com/",
              logo: {
                "@type": "ImageObject",
                url: "https://gms.globaldesignernetwork.com/images/globalmodelssyndicate.png",
                width: 1200,
                height: 630,
                caption: "Global Models Syndicate Logo - Web3 Fashion",
              },
              founder: {
                "@type": "Person",
                name: "Emma-Jane MacKinnon-Lee",
                url: "https://emmajanemackinnonlee.com/",
                sameAs: [
                  "https://emmajanemackinnonlee.com/",
                  "https://emmajanemackinnon.com/",
                  "https://emmajanemackinnonlee.xyz/",
                  "https://emmajanemackinnonlee.net/",
                  "https://emmajanemackinnonlee.ai/",
                  "https://emmajanemackinnonlee.org/",
                  "https://emmajanemackinnonlee.dev/",
                  "https://emmajanemackinnonlee.info/",
                  "https://emmajanemackinnonlee-f3manifesto.com/",
                  "https://emmajanemackinnonlee-digitalax.com/",
                  "https://emmajanemackinnonlee-web3fashion.com/",
                  "https://icoinedweb3fashion.com/",
                  "https://syntheticfutures.xyz/",
                  "https://web3fashion.xyz/",
                  "https://emancipa.xyz/",
                  "https://highlangu.com/",
                  "https://digitalax.xyz/",
                  "https://cc0web3fashion.com/",
                  "https://cc0web3.com/",
                  "https://cuntism.net/",
                  "https://dhawu.com/",
                  "https://globaldesignernetwork.com/",
                  "https://runway.globaldesignernetwork.com/",
                  "https://casadeespejos.com/",
                  "https://emancipa.net/",
                  "https://dhawu.emancipa.xyz/",
                  "https://highlangu.emancipa.xyz/",
                  "https://twitter.com/emmajane1313",
                  "https://medium.com/@casadeespejos",
                  "https://www.flickr.com/photos/emmajanemackinnonlee/",
                ],
              },
              sameAs: [
                "https://twitter.com/digitalax_",
                "https://lens.xyz/u/globaldesignernetwork",
              ],
              description:
                "A network dedicated for models exploring breakout looks and rising in prominence in web3 fashion and the open metaverse.",
              keywords:
                "web3 fashion, digitalax, CC0 fashion, indie designers, blockchain fashion, decentralized fashion, smart contracts fashion",
            }),
          }}
        />
      </head>
      <body className="selection:bg-yellow-300 selection:text-gray-900">
        <Providers>
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
