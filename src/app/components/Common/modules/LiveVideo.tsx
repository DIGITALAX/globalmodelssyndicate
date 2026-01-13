"use client";

import Image from "next/image";
import { FunctionComponent } from "react";

const LiveVideo: FunctionComponent<{ dict: any }> = ({ dict }) => {
  return (
    <div className="relative w-full font-back h-fit flex flex-col bg-black gap-10 p-3">
      <div className="relative text-white text-[2rem] galaxy:text-[4rem] sm:text-[6rem] mid:text-[8rem] lg:text-[10rem] xl:text-[12rem] flex w-full h-fit items-end justify-end font-back">
        {dict?.liveVideoTitle}
      </div>
      <div className="relative w-full h-fit flex flex-col md:flex-row justify-between items-start gap-3">
        <div className="relative w-full text-xl text-left h-fit text-white tracking-widest">
          <div className="relative w-1/2 font-role">
            {dict?.liveVideoBodyStart}{" "}
            <a
              href="https://lucidity.agentmeme.xyz/"
              className="cursor-pointer underline"
              target="_blank"
            >
              {dict?.liveVideoBodyLink}
            </a>
            {dict?.liveVideoBodyEnd}
          </div>
        </div>
        <div className="relative w-full h-[25rem] text-white mid:h-[30rem] flex flex-col gap-2">
          <div className="relative w-fit h-fit flex">
            {dict?.liveVideoCaption}
          </div>
          <div className="relative flex w-full h-full">
            <Image
              alt={dict?.liveVideoAltMain}
              layout="fill"
              objectFit="cover"
              draggable={false}
              src={"/images/digitalax-globalmodelssyndicate-gpus.png"}
            />
            <div className="absolute -left-28 top-20 w-40 h-66 flex  border-4 border-pink-400">
              <Image
                alt={dict?.liveVideoAltInset}
                layout="fill"
                objectFit="cover"
                draggable={false}
                src={"/images/digitalax-globalmodelssyndicate-server-racks.png"}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-full h-fit flex p-4">
        <div className="relative w-fit overflow-x-scroll h-fit flex flex-row gap-4 justify-between">
          {/* {RADIO.map((show, index) => (
            <div
              key={index}
              onClick={() => setVidDetails(show)}
              className={`text-white text-black uppercase relative flex w-fit h-fit cursor-pointer hover:opacity-70 border border-white`}
            >
              <div className="relative flex flex-col gap-3 w-60 h-40 p-1">
                <div className="w-full h-fit flex flex-col gap-1">
                  <div className="w-fit h-fit flex relative text-base">
                    {show.title}
                  </div>
                  <div className="w-fit h-fit flex relative text-sm">
                    {show.time}
                  </div>
                  <div className="w-fit h-fit flex relative text-sm">
                    [{show.type}]
                  </div>
                </div>
                <div className="relative w-full h-full flex border border-white">
                  <Image
                    objectFit="cover"
                    layout="fill"
                    src={show.poster}
                    draggable={false}
                    alt={show.title}
                  />
                </div>
              </div>
            </div>
          ))} */}
        </div>
      </div>
    </div>
  );
};

export default LiveVideo;
