"use client";

import Link from "next/link";
import HamburgerButton from "@/layouts/hamburger-button";
import Logo from "@components/logo";
import HeaderMenuRight from "@/layouts/header-menu-right";
import StickyHeader from "@/layouts/sticky-header";
import { CarbonDrawerSidebar } from "./carbon-drawer-sidebar";
import SearchWidget from "@/app/shared/search/search";

export default function Header({ lang }: { lang?: string }) {
  return (
    <StickyHeader className="z-[990] 2xl:py-5 3xl:px-8 4xl:px-10">
      <div className="flex w-full max-w-2xl items-center">
        <HamburgerButton
          lang={lang!}

          view={<CarbonDrawerSidebar className="static w-full 2xl:w-full" lang={lang}/>}
        />
        <Link
          href={"/"}
          aria-label="Site Logo"
          className="me-4 w-9 shrink-0 text-gray-800 hover:text-gray-900 lg:me-5 xl:hidden"
        >
          <Logo iconOnly={true} />
        </Link>

        <SearchWidget />
      </div>

      <HeaderMenuRight lang={lang}/>
    </StickyHeader>
  );
}
