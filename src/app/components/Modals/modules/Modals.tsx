"use client";

import { useContext } from "react";
import { ModalContext } from "@/app/providers";
import Cart from "./Cart";
import Success from "./Success";
import Error from "./Error";

export const Modals = ({ dict }: { dict: any }) => {
  const context = useContext(ModalContext);

  if (!context) return null;

  return (
    <>
      {context.cartOpen && <Cart dict={dict} />}
      {context.successData && <Success dict={dict} />}
      {context.errorData && <Error dict={dict} />}
    </>
  );
};
