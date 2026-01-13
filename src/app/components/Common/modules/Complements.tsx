"use client";

import { COMPLEMENTS } from "@/app/lib/constants";
import { FunctionComponent } from "react";

const Complements: FunctionComponent<{ dict: any }> = ({ dict }) => {
  return (
    <div className="w-full font-role py-32 complements-texture text-white font-hel relative overflow-hidden isolate bg-black">
      <div className="absolute inset-0 w-full h-full">
        <img
          src="/images/mackinnon-yellow-print.png"
          alt="Mackinnon yellow print texture"
          className="w-full h-full object-cover opacity-50 brightness-110"
          draggable={false}
        />
      </div>
      <div className="absolute inset-0 z-10 complements-crinkle-overlay pointer-events-none" />
      <div className="relative z-20">
        <div className="w-full h-fit flex flex-col gap-2 text-center mb-12">
          <h2 className="text-4xl md:text-6xl lg:text-8xl mb-4 tracking-wide uppercase">
            {dict?.complementsTitleTop}
            <br />
            <span className="bg-yellow-500 px-3 font-ras">
              {dict?.complementsTitleBottom}
            </span>
          </h2>
          <div className="relative w-full flex items-center justify-center">
            <div className="text-sm flex text-center justify-center items-center max-w-md uppercase tracking-widest text-gray-200 whitespace-pre-line">
              {dict?.complementsDesc}
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-12 h-px bg-white/60"></div>
            <span
              className="text-sm max-w-md cursor-pointer hover:underline uppercase tracking-widest text-gray-200"
              onClick={() =>
                window.open("https://runway.globaldesignernetwork.com/")
              }
            >
              {dict?.complementsLink}
            </span>
            <div className="w-12 h-px bg-white/60"></div>
          </div>
        </div>
        <div className="relative flex flex-col gap-4 pb-16 mb-16 items-center px-4 justify-center">
          <div className="flex flex-row relative w-full h-fit items-center flex-wrap justify-center gap-4">
            {COMPLEMENTS.slice(0, 2).map((video, index) => (
              <div
                key={index}
                className="relative w-fit h-fit flex bg-gray-900"
              >
                <video
                  className="w-full sm:w-96 h-60 object-cover transition-transform duration-300 group-hover:scale-105 border-4 border-white"  
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={video.poster}
                >
                  <source src={video.src} type="video/mp4" />
                </video>
              </div>
            ))}
          </div>
          <div className="relative w-fit h-fit flex bg-gray-900">
            <video
              className="w-full sm:w-96 h-60 object-cover transition-transform duration-300 group-hover:scale-105 border-4 border-white"
              autoPlay
              muted
              loop
              playsInline
              poster={COMPLEMENTS[2].poster}
            >
              <source src={COMPLEMENTS[2].src} type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Complements;
