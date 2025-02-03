"use client";
import { FileClock, Home, Settings, WalletCards } from "lucide-react";
import { div } from "motion/react-client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link"; // Import Link from next/link
import React, { useEffect } from "react";
import UsageTrack from "./UsageTrack";

function SideNav() {
  const MenuList = [
    {
      name: "Home",
      icon: Home,
      path: "/dashboard",
    },
    {
      name: "History",
      icon: FileClock,
      path: "/dashboard/history",
    },
    {
      name: "Billing",
      icon: WalletCards,
      path: "/dashboard/billing",
    },
    {
      name: "Setting",
      icon: Settings,
      path: "/dashboard/setting",
    },
  ];

  const path = usePathname();

  useEffect(() => {
    console.log("PATHNAME:", path);
  }, [path]); // Add path to the dependency array

  return (
    <div className="relative h-screen p-5 border shadow-md gradient-background2">
      <div className="flex justify-center border-2 border-teal-400 p-5 rounded-lg hover:scale-105 transition-all hover:border-yellow-300">
        <Image
          className="border-2 border-indigo-600 p-1 bg-black rounded-sm shadow-neon"
          src="/fullLogo.jpg"
          alt="logo"
          width={150}
          height={150}
        />
      </div>

      <div className="mt-3">
        {MenuList.map((menu, index) => (
          <Link key={index} href={menu.path}>
            {" "}
            {/* Wrap each item with Link */}
            <div
              className={`flex gap-2 mb-2 p-3
                hover:bg-primary hover:text-white rounded-lg cursor-pointer items-center
                ${
                  path === menu.path ? "bg-primary" : ""
                }  {/* Active route highlighting */}
              `}
            >
              <menu.icon className="text-white h-7 w-7" />
              <h2 className="text-white text-lg">{menu.name}</h2>
            </div>
          </Link>
        ))}
      </div>
      <div className="absolute bottom-10 left-0 w-full">
        <UsageTrack />
      </div>
    </div>
  );
}

export default SideNav;
