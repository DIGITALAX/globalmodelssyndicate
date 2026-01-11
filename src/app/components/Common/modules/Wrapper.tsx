"use client";

import { JSX } from "react";
import { Modals } from "../../Modals/modules/Modals";

export default function Wrapper({
  dict,
  page,
}: {
  dict: any;
  page: JSX.Element;
}) {
  return (
    <>
      {page}
      <Modals dict={dict} />
    </>
  );
}
