"use client";

import { FunctionComponent } from "react";
import { GrLanguage } from "react-icons/gr";
import { usePathname, useRouter } from "next/navigation";

const Footer: FunctionComponent = () => {
  const router = useRouter();
  const path = usePathname();

  const changeLanguage = () => {
    const segments = path.split("/");
    const currentLang = segments[1];
    let nextLang = "es";

    if (currentLang === "en") {
      nextLang = "es";
    } else if (currentLang === "es") {
      nextLang = "pt";
    } else if (currentLang === "pt") {
      nextLang = "en";
    } else {
      nextLang = "es";
    }

    let newPath;
    if (currentLang === "en" || currentLang === "es" || currentLang === "pt") {
      segments[1] = nextLang;
      newPath = segments.join("/");
    } else {
      if (path === "/") {
        newPath = `/${nextLang}/`;
      } else {
        newPath = `/${nextLang}${path}`;
      }
    }

    document.cookie = `NEXT_LOCALE=${nextLang}; path=/; SameSite=Lax`;

    router.push(newPath);
  };

  const getCurrentLangLabel = () => {
    const segments = path.split("/");
    const currentLang = segments[1];

    if (currentLang === "en") return "EN → ES";
    if (currentLang === "es") return "ES → PT";
    if (currentLang === "pt") return "PT → EN";
    return "EN → ES";
  };

  return (
    <div className="relative w-full h-fit flex items-center justify-center py-6 bg-white border-t-2 border-black">
      <div
        className="relative flex flex-row items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
        onClick={changeLanguage}
      >
        <GrLanguage size={20} color="black" />
        <span className="text-sm font-hid text-black">
          {getCurrentLangLabel()}
        </span>
      </div>
    </div>
  );
};

export default Footer;
