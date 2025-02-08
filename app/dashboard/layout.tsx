"use client";

import React from "react";
import SideNav from "./_components/SideNav";
import Header from "./_components/Header";
import { Toaster } from "sonner";
import Provider from "../Provider";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Provider>
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <div className="md:w-64 hidden md:block fixed h-screen">
          <SideNav />
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col md:ml-64 min-h-screen">
          <Header />

          {/* Main content wrapper */}
          <main className="flex-1">{children}</main>

          {/* Footer */}
          <footer className="w-full bg-indigo-300 py-10 bg-opacity-10 gradient-background2 p-10">
            <div className="mx-auto px-4 text-center text-gray-200">
              <p>
                © {new Date().getFullYear()} CodeNow101. All Rights Reserved
              </p>
            </div>
          </footer>

          <Toaster position="top-right" expand={true} richColors />
        </div>
      </div>
    </Provider>
  );
}

export default Layout;
