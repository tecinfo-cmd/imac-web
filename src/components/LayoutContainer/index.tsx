"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import {
  PiFarmLight,
  PiSealCheckLight,
  //PiCowboyHatLight,
} from "react-icons/pi";
import { RiMenuUnfoldLine } from "react-icons/ri";

import { useAuthContext } from "@/context";
import { LogoWhite } from "@/icons/LogoWhite";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserRoleStore } from "@/store/useUserRoleStore";

import { version } from "../../../package.json";

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface HeaderProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  menuItems?: MenuItem[];
}

export const LayoutContainer = ({
  title,
  children,
  actions,
  menuItems,
}: HeaderProps) => {
  const { signOut } = useAuthContext();
  const { userData } = useAuthStore();
  const { role } = useUserRoleStore();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const activePathClass = (path: string) =>
    `flex items-center gap-3 py-1 px-4 ${isOpen ? "" : "rounded"} ${
      pathname === path
        ? "bg-[#D7EADD] text-[#175912]"
        : "hover:bg-[#D7EADD] hover:text-[#175912]"
    }`;

  const defaultMenuItems: MenuItem[] = [
    {
      label: "Propriedades",
      href: "/propriedade",
      icon: <PiFarmLight size={44} />,
    },
    /*{
      label: "Proprietários",
      href: "/owners",
      icon: <PiCowboyHatLight size={44} />,
    },
    */
    {
      label: "Elegibilidade",
      href: "/",
      icon: <PiSealCheckLight size={44} />,
    },
  ];

  const itemsToRender = menuItems ?? defaultMenuItems;

  return (
    <div className="flex">
      <aside
        className={`z-20 fixed left-0 top-1/2 -translate-y-1/2 shadow-sm h-auto bg-[#23811C] text-white flex flex-col justify-between transition-all duration-300 ${
          isOpen ? "w-72" : "w-24"
        } rounded-tr-2xl rounded-br-2xl`}
      >
        <div className="flex flex-col items-center pb-4">
          <div className="flex items-center gap-2 pb-6 p-4">
            <div className="flex-1">
              <LogoWhite />
            </div>
            {isOpen && (
              <h5 className="text-sm font-semibold">
                Programa de Reinserção e Monitoramento
              </h5>
            )}
          </div>

          <nav
            className={`flex flex-col gap-4 w-full ${
              isOpen ? "" : " items-center"
            }`}
          >
            <button
              className="flex items-center gap-3 py-1 px-4"
              onClick={() => setIsOpen(!isOpen)}
            >
              <RiMenuUnfoldLine size={44} /> {isOpen && <span>Menu</span>}
            </button>

            {itemsToRender.map((item) => {
              const isElegibilidade = item.label === "Elegibilidade";
              const isProdutor = role === "PRODUTOR";

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={activePathClass(item.href)}
                  target={isElegibilidade && isProdutor ? "_blank" : undefined}
                >
                  {item.icon}
                  {isOpen && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <div className="flex flex-col flex-1 ml-[calc(100%_/_12)]">
        <header className="flex items-center justify-between gap-4 m-4 pb-4 border border-transparent border-b-[#CAC4D0]">
          <div className="flex items-center gap-4">
            <h1 className="text-[#1A6415] text-2xl font-semibold">{title}</h1>
            {actions}
          </div>
          <div className="flex items-center gap-4 text-[#0A3503]">
            <div>
              <p className="text-[17px] font-semibold">
                {userData?.pessoa?.nome}
              </p>
              <p className="text-sm">{userData?.email}</p>
              <p>{version}</p>
            </div>
            <button onClick={signOut}>
              <FiLogOut size={26} />
            </button>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};
