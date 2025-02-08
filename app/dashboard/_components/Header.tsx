import React, { useContext, useState } from "react";
import {
  UserButton,
  SignedIn,
  SignedOut,
  SignInButton,
} from "@clerk/clerk-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { TotalUsageContext } from "@/app/(context)/TotalUsageContext";
import MotionWrapperDelay from "@/app/_components/FramerMotionStuff/MotionWrapperDelay";

const MobileMenuList = [
  {
    name: "Home",
    icon: "home",
    path: "/dashboard",
  },
  {
    name: "History",
    icon: "history",
    path: "/dashboard/history",
  },
  {
    name: "Billing",
    icon: "wallet",
    path: "/dashboard/billing",
  },
  {
    name: "Setting",
    icon: "settings",
    path: "/dashboard/setting",
  },
];

function Header() {
  const { userDetail } = useContext(TotalUsageContext);
  console.log("userDetail:", userDetail); // Debugging userDetail object
  console.log("Credits:", userDetail?.credits);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
    setIsMenuOpen(false);
  };

  return (
    <MotionWrapperDelay
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, delay: 0.7 }}
      variants={{
        hidden: { opacity: 0, x: -100 },
        visible: { opacity: 1, x: 0 },
      }}
    >
      <div className="relative p-5 shadow-sm overflow-hidden gradient-background2 border border-indigo-400">
        {/* <div className="dynamic-bg absolute inset-0 -z-10"></div> */}

        <div className="relative flex flex-wrap justify-between items-center gap-5">
          <Link href={"/"}>
            <div className="flex gap-2 items-center">
              <Image
                className="horizontal-rotate"
                src="/logo.png"
                alt="Logo"
                height={60}
                width={60}
              />
              <h2 className="font-bold text-xl md:text-2xl lg:text-3xl text-yellow-400">
                AI Content
              </h2>
            </div>
          </Link>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
            >
              <div className="space-y-2">
                <div
                  className={`w-8 h-1 bg-white transition-all duration-300 ${
                    isMenuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                />
                <div
                  className={`w-8 h-1 bg-white transition-all duration-300 ${
                    isMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <div
                  className={`w-8 h-1 bg-white transition-all duration-300 ${
                    isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </div>
            </button>
          </div>

          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } fixed top-0 right-0 bg-indigo-800 text-white p-6 w-1/2 h-full md:hidden z-40`}
          >
            <SignedIn>
              {MobileMenuList.map((menu, index) => (
                <Link
                  key={index}
                  href={menu.path}
                  className={`py-2 block text-lg text-white border gradient-background2 border-teal-500 p-1 rounded-lg ${
                    activeLink === menu.path ? "text-yellow-400" : ""
                  }`}
                  onClick={() => handleLinkClick(menu.path)}
                >
                  {menu.name}
                </Link>
              ))}
            </SignedIn>
          </div>

          <div className="flex gap-7 items-center md:flex-row md:gap-4 md:static">
            <SignedIn>
              <div className="flex gap-2 p-1 items-center bg-teal-600 px-4 rounded-full w-[120px] sm:w-auto">
                <Image
                  src={"/coin.png"}
                  alt="Tokens"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <h2 className="text-white text-sm sm:text-base">
                  {userDetail?.credits}
                </h2>
              </div>

              <Link href="/dashboard/billing">
                <Button variant="sex1" className="w-full sm:w-auto md:ml-4">
                  Buy More Credits
                </Button>
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-16 h-16",
                  },
                }}
              />
            </SignedIn>
            <SignedOut>
              <SignInButton>
                <Button variant="sex1" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </div>
    </MotionWrapperDelay>
  );
}

export default Header;
