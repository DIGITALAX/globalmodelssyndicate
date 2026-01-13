"use client";

import { FunctionComponent } from "react";
import Header from "./Header";
import Forum from "./Forum";
import W3F from "./W3F";
import Bio from "./Bio";
import LiveVideo from "./LiveVideo";
import Complements from "./Complements";
import Marquee from "./Marquee";
import { GMS } from "@/app/lib/constants";
import Image from "next/image";

const Entry: FunctionComponent<{ dict: any }> = ({ dict }) => {
  return (
    <div className="relative flex flex-col">
      <Header dict={dict} />
      <Bio dict={dict} />
      <W3F dict={dict} />
      <Marquee dict={dict} />
      <div className="relative w-full h-fit flex">
        <div className="relative w-full h-[40rem] flex">
          <Image
            objectFit="cover"
            layout="fill"
            alt={"Global Models Syndicate"}
            src={"/images/digitalax-globalmodelssyndicate-wall.png"}
            draggable={false}
          />
        </div>
      </div>

      <Complements dict={dict} />
      <LiveVideo dict={dict} />
      <div className="relative w-full flex flex-col mid:flex-row h-fit">
        {GMS.map((run, i) => (
          <div key={i} className="relative w-full h-screen flex">
            <video
              className="relative object-cover flex w-full h-full"
              autoPlay
              muted
              loop
              playsInline
              poster={run.poster}
            >
              <source src={run.src} type="video/mp4" />
            </video>
          </div>
        ))}
      </div>
      <Forum dict={dict} />
    </div>
  );
};

export default Entry;
