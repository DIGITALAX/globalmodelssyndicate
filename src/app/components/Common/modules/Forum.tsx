"use client";

import { FunctionComponent } from "react";

export const Forum: FunctionComponent<{ dict: any }> = ({ dict }) => {
  return (
    <div
      className="relative w-full h-fit flex flex-col bg-white pb-4"
      id="Forum"
    >
      <div className="relative w-full flex justify-center px-6 pt-6 sm:pt-8">
        <div className="bg-white/90 backdrop-blur-sm p-6 w-full">
          <div className="relative w-full h-fit flex flex-col gap-10 sm:flex-row flex-wrap justify-center sm:justify-between flex-wrap items-center">
            <div className="relative sm:w-80 break-all flex text-left text-black">
              {dict?.take}
            </div>
            <div className="relative h-fit break-all flex sm:w-80 text-right text-black">
              {dict?.post1}
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-full h-[20rem] sm:h-[25rem] md:h-[30rem] lg:h-[40rem] mt-6 wheatpaste-texture underground-texture weathered-poster crinkled-wheatpaste wheatpaste-fold poster-wrinkles">
        <video
          draggable={false}
          className="cover w-full h-full object-cover"
          autoPlay
          muted
          loop
          poster={"/images/globalmodelssyndicate.png"}
        >
          <source src="/videos/globalmodelssyndicate.mp4" />
        </video>
      </div>
      <div className="relative w-full h-8 flex">
        <video autoPlay loop muted className="w-full h-full object-cover">
          <source src="/videos/chica_gdn.mp4" />
        </video>
      </div>
      <div className="relative w-full h-fit flex flex-col gap-2 px-6">
        <div className="w-full h-fit flex items-end justify-end">
          <div
            className="relative w-fit h-fit flex cursor-pointer"
            onClick={() => window.open("https://cc0web3fashion.com/forum/")}
          >{`${dict?.more} >`}</div>
        </div>
      </div>
    </div>
  );
};

export default Forum;
