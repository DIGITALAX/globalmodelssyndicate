"use client";

import { FunctionComponent } from "react";
import Header from "./Header";
import Forum from "./Forum";

const Entry: FunctionComponent<{ dict: any }> = ({ dict }) => {
  return (
    <div className="relative flex flex-col">
      <Header dict={dict} />
      <Forum dict={dict} />
    </div>
  );
};

export default Entry;
