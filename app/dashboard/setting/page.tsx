import { UserProfile } from "@clerk/nextjs";
import React from "react";

function Setting() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animated-bg fixed -z-10 inset-0 opacity-90" />

      <UserProfile routing="hash" />
    </div>
  );
}

export default Setting;
