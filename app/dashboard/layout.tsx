"use client";

import React, { useState } from "react";
import SideNav from "./_components/SideNav";
import Header from "./_components/Header";
import { Toaster } from "sonner";

import Provider from "../Provider";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Provider>
      {/* Wrap everything inside Provider */}
      <div className="h-screen">
        <div className="md:w-64 hidden md:block fixed">
          <SideNav />
        </div>
        <div className="md:ml-64">
          <Header />
          {children}
          <Toaster position="top-right" expand={true} richColors />
        </div>
      </div>
    </Provider>
  );
}

export default Layout;
