"use client";

import { FunctionComponent, useContext } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ModalContext } from "@/app/providers";
import { HeaderProps } from "../types/common.types";

const Header: FunctionComponent<HeaderProps> = ({ dict }) => {
  const router = useRouter();
  const path = usePathname();
  const context = useContext(ModalContext);
  const isCompactHeader =
    path?.includes("market") ||
    path?.includes("collection") ||
    path?.includes("model") ||
    path?.includes("account");

  return (
    <div className="relative w-full h-fit flex flex-col">
      <div
        className={`relative w-full flex ${
          isCompactHeader
            ? "h-20"
            : "h-[50rem] lg:h-[40rem] lg:h-screen diagonal-layout"
        }`}
      >
        <video
          draggable={false}
          autoPlay
          loop
          muted
          playsInline
          className="w-full absolute wheatpaste-texture top-0 left-0 h-full object-cover"
          poster="/images/fondo.png"
        >
          <source src="/videos/fondo.mp4" />
        </video>
        <button
          onClick={() => context?.setCartOpen(true)}
          className="absolute z-60 top-2 left-0 bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-2 text-sm font-bold transition-colors"
        >
          ({context?.cartItems.length || 0})
        </button>
        <div className="relative bg-yellow-500 hover:bg-yellow-600 w-12 px-3 py-2"></div>
        <div className="absolute inset-0 w-full h-full wheatpaste-overlay pointer-events-none z-0" />
        {!isCompactHeader && (
          <div className="absolute inset-x-0 top-24 bottom-24 w-full overflow-hidden pointer-events-none z-0">
            <div className="absolute -left-6 top-6 w-40 h-56 sm:w-52 sm:h-72 rotate-[-10deg]">
              <div className="relative wheatpaste-texture w-full h-full collage-texture">
                <Image
                  src="/images/digitalax-globalmodelssyndicate-backstage.png"
                  alt="DIGITALAX Global Models Syndicate — Backstage portrait"
                  fill
                  sizes="(max-width: 640px) 160px, 208px"
                  draggable={false}
                  className="object-cover border-4 border-white"
                />
              </div>
            </div>
            <div className="absolute left-[55%] top-2 w-56 h-40 sm:w-72 sm:h-48 rotate-[6deg]">
              <div className="relative w-full h-full collage-texture">
                <video
                  draggable={false}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover border-4 border-white"
                  poster="/images/digitalax-globalmodelssyndicate-runway-backstage.png"
                >
                  <source src="/videos/digitalax-globalmodelssyndicate-runway-backstage.mp4" />
                </video>
              </div>
            </div>
            <div className="absolute right-8 top-[35%] w-40 h-56 sm:w-52 sm:h-72 rotate-[12deg]">
              <div className="relative w-full wheatpaste-texture h-full collage-texture">
                <Image
                  src="/images/digitalax-globalmodelssyndicate-tryon.png"
                  alt="DIGITALAX Global Models Syndicate — Backstage styling"
                  fill
                  sizes="(max-width: 640px) 160px, 208px"
                  draggable={false}
                  className="object-cover border-4 border-white"
                />
              </div>
            </div>
            <div className="absolute left-[22%] bottom-4 w-56 h-44 sm:w-72 sm:h-56 rotate-[-4deg]">
              <div className="relative w-full h-full collage-texture">
                <video
                  draggable={false}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover border-4 border-white"
                  poster="/images/digitalax-globalmodelssyndicate-hairspray-backstage.png"
                >
                  <source src="/videos/digitalax-globalmodelssyndicate-hairspray-backstage.mp4" />
                </video>
              </div>
            </div>
            <div className="absolute right-[12%] bottom-10 w-44 h-32 sm:w-56 sm:h-40 rotate-[-12deg]">
              <div className="relative w-full h-full wheatpaste-texture collage-texture">
                <Image
                  src="/images/digitalax-globalmodelssyndicate-model-lineup.png"
                  alt="DIGITALAX Global Models Syndicate — Model lineup"
                  fill
                  sizes="(max-width: 640px) 176px, 224px"
                  draggable={false}
                  className="object-cover border-4 border-white"
                />
              </div>
            </div>
            <div className="absolute left-[15%] top-[15%] w-44 h-32 sm:w-56 sm:h-40 rotate-[8deg]">
              <div className="relative w-full h-full wheatpaste-texture collage-texture">
                <Image
                  src="/images/globalmodelssyndicate-pose-camera.png"
                  alt="DIGITALAX Global Models Syndicate — Pose camera"
                  fill
                  sizes="(max-width: 640px) 176px, 224px"
                  draggable={false}
                  className="object-cover border-4 border-white"
                />
              </div>
            </div>
            <div className="absolute right-[35%] top-[18%] w-36 h-52 sm:w-44 sm:h-64 rotate-[-6deg]">
              <div className="relative w-full h-full wheatpaste-texture collage-texture">
                <Image
                  src="/images/digitalax-globalmodelssyndicate-backstage-shot.png"
                  alt="DIGITALAX Global Models Syndicate — Backstage shot"
                  fill
                  sizes="(max-width: 640px) 144px, 176px"
                  draggable={false}
                  className="object-cover border-4 border-white"
                />
              </div>
            </div>
            <div className="absolute left-[48%] top-[55%] w-48 h-32 sm:w-60 sm:h-40 rotate-[2deg]">
              <div className="relative w-full h-full wheatpaste-texture collage-texture">
                <Image
                  src="/images/digitalax-globalmodelssyndicate-getting-ready-backstage.png"
                  alt="DIGITALAX Global Models Syndicate — Getting ready backstage"
                  fill
                  sizes="(max-width: 640px) 192px, 240px"
                  draggable={false}
                  className="object-cover border-4 border-white"
                />
              </div>
            </div>
            <div className="absolute right-[4%] top-[8%] w-40 h-28 sm:w-52 sm:h-36 rotate-[14deg]">
              <div className="relative w-full h-full collage-texture">
                <Image
                  src="/images/digitalax-globalmodelssyndicate-midnight-backstage.png"
                  alt="DIGITALAX Global Models Syndicate — Midnight backstage"
                  fill
                  sizes="(max-width: 640px) 160px, 208px"
                  draggable={false}
                  className="object-cover border-4 border-white"
                />
              </div>
            </div>
            <div className="absolute left-[30%] top-[25%] w-40 h-52 sm:w-52 sm:h-60 rotate-[-2deg]">
              <div className="relative w-full wheatpaste-texture h-full collage-texture">
                <Image
                  src="/images/digitalax-globalmodelssyndicate-photograph-backstage.png"
                  alt="DIGITALAX Global Models Syndicate — Backstage photograph"
                  fill
                  sizes="(max-width: 640px) 160px, 208px"
                  draggable={false}
                  className="object-cover border-4 border-white"
                />
              </div>
            </div>
            <div className="absolute left-[5%] bottom-[12%] w-40 h-56 sm:w-52 sm:h-72 rotate-[10deg]">
              <div className="relative w-full wheatpaste-texture h-full collage-texture">
                <Image
                  src="/images/digitalax-globalmodelssyndicate-modelling.png"
                  alt="DIGITALAX Global Models Syndicate — Modelling"
                  fill
                  sizes="(max-width: 640px) 160px, 208px"
                  draggable={false}
                  className="object-cover border-4 border-white"
                />
              </div>
            </div>
            <div className="absolute right-[30%] bottom-[6%] w-44 h-32 sm:w-56 sm:h-40 rotate-[6deg]">
              <div className="relative w-full wheatpaste-texture h-full collage-texture">
                <Image
                  src="/images/globalmodelssyndicate-pose-backstage.png"
                  alt="DIGITALAX Global Models Syndicate — Pose backstage"
                  fill
                  sizes="(max-width: 640px) 176px, 224px"
                  draggable={false}
                  className="object-cover border-4 border-white"
                />
              </div>
            </div>
            <div className="absolute left-[63%] bottom-[25%] w-44 h-32 sm:w-56 sm:h-40 rotate-[-14deg]">
              <div className="relative w-full wheatpaste-texture h-full collage-texture">
                <Image
                  src="/images/globalmodelssyndicate-headphone-session.png"
                  alt="DIGITALAX Global Models Syndicate — Headphone session"
                  fill
                  sizes="(max-width: 640px) 176px, 224px"
                  draggable={false}
                  className="object-cover border-4 border-white"
                />
              </div>
            </div>
          </div>
        )}
        <div className="absolute top-0 left-0 flex w-full h-fit text-center items-center justify-center text-[5vw] font-hid z-50 bg-transparent">
          GLOBAL MODELS SYNDICATE
        </div>
        <div className="absolute bottom-0 left-0 flex w-full h-fit px-4 py-3 items-center justify-between z-10 bg-transparent">
          <div className="relative w-full h-fit flex flex-row gap-6 flex-wrap items-center justify-between">
            {[
              { titulo: dict?.account, ref: "/account", pathMatch: "account" },
              {
                titulo: dict?.models,
                ref: "/indie-models",
                pathMatch: "indie-models",
              },
              { titulo: dict?.market, ref: "/market", pathMatch: "market" },
              {
                titulo: dict?.realm,
                ref: path?.includes("/es/")
                  ? "https://runway.globaldesignernetwork.com/es/"
                  : path.includes("/pt/")
                  ? "https://runway.globaldesignernetwork.com/pt/"
                  : "https://runway.globaldesignernetwork.com/",
                pathMatch: "",
              },
              {
                titulo: dict?.for,
                ref: "https://cc0web3fashion.com/forum/",
                pathMatch: "",
              },
            ].map((item, i) => {
              const isOnThisPage =
                item.pathMatch && path?.includes(item.pathMatch);
              const isHomePage =
                path === "/" ||
                path === "/en" ||
                path === "/es" ||
                path === "/pt";

              return (
                <div
                  key={i}
                  onClick={() => {
                    if (item.ref.startsWith("/")) {
                      const lang = path.split("/")[1];
                      if (isOnThisPage) {
                        if (lang === "en" || lang === "es" || lang === "pt") {
                          router.push(`/${lang}`);
                        } else {
                          router.push("/");
                        }
                      } else {
                        if (lang === "en" || lang === "es" || lang === "pt") {
                          router.push(`/${lang}${item.ref}`);
                        } else {
                          router.push(item.ref);
                        }
                      }
                    } else {
                      window.open(item.ref);
                    }
                  }}
                  className="relative w-fit text-xxs text-black uppercase h-fit flex flex-row cursor-pointer hover:underline bg-yellow-300 px-2 py-1"
                >
                  {isOnThisPage && !isHomePage ? dict?.mainPort : item.titulo}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
