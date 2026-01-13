"use client";

import Image from "next/image";
import { FunctionComponent } from "react";

const Bio: FunctionComponent<{ dict: any }> = ({ dict }) => {
  return (
    <div className="w-full h-fit flex bg-white flex flex-col" id="About">
      <div className="relative w-full h-fit lg:h-[40rem] flex flex-col lg:flex-row justify-between gap-10">
        <div className="relative w-full h-full flex flex-col justify-between p-8 gap-4 text-yellow-500">
          <div
            className="relative w-fit h-fit flex glitch-text"
            data-text={dict?.bioEst}
          >
            {dict?.bioEst}
          </div>
          <div className="relative w-full h-fit text-xs galaxy:text-sm sm:text-base lg:text-lg xl:text-3xl uppercase font-cyn flex-col flex gap-3 lg:pb-0 pb-12">
            <div
              className="relative w-fit h-fit"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 20%, #13090aff 20%, #000000ff 100%)",
              }}
            >
              {dict?.bioLine1}
            </div>
            <div
              className="relative w-full h-fit"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 20%, #13090aff 20%, #000000ff 100%)",
              }}
            >
              {dict?.bioLine2}
            </div>
            <div
              className="relative w-fit h-fit"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 20%, #13090aff 20%, #000000ff 100%)",
              }}
            >
              {dict?.bioLine3}
            </div>
            <div
              className="relative w-fit h-fit"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 20%, #13090aff 20%, #000000ff 100%)",
              }}
            >
              {dict?.bioLine4}
            </div>
            <div
              className="relative w-fit h-fit"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 20%, #13090aff 20%, #000000ff 100%)",
              }}
            >
              {dict?.bioLine5}
            </div>
          </div>
          <div className="relative w-full h-fit flex flex-col gap-7 tracking-wide font-retro text-xs items-end justify-end">
            <div className="relative w-fit h-fit flex text-right uppercase">
              {dict?.bioPara1}
            </div>
            <div className="relative w-fit h-fit flex text-right uppercase">
              {dict?.bioPara2}
            </div>
            <div className="relative w-full h-fit text-right flex flex-col items-end justify-end">
              <span
                className="cursor-pointer flex flex-row gap-1 items-center justify-center w-fit h-fit"
                onClick={() => window.open("https://digitalax.xyz")}
              >
                {dict?.bioLinkPrefix}
                <div className="relative w-fit h-fit flex bg-[#004DF9] text-[#FFE200] ">
                  {dict?.bioLinkBrand}
                </div>
                <div className="relative w-fit h-fit flex">
                  <div className="relative w-3 h-3 flex">
                    <Image
                      objectFit="cover"
                      layout="fill"
                      alt={dict?.bioLinkAlt}
                      src={"/images/enlace.png"}
                      draggable={false}
                    />
                  </div>
                </div>
                {dict?.bioLinkSuffix}
              </span>
            </div>
          </div>
        </div>
        <div className="relative w-full h-fit lg:h-full flex">
          <div className="relative w-full h-[30rem] lg:h-full flex">
            <Image
              objectFit="cover"
              layout="fill"
              alt={dict?.bioImageAlt}
              src={"/images/digitalax-globalmodelssyndicate-stitched.png"}
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bio;
