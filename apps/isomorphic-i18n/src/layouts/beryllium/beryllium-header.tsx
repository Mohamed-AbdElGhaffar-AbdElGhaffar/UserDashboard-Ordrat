"use client";

import Link from "next/link";
import HamburgerButton from "@/layouts/hamburger-button";
import Logo from "@components/logo";
import { PiMagnifyingGlass } from "react-icons/pi";
import cn from "@utils/class-names";
import Sidebar from "@/layouts/beryllium/beryllium-sidebar-drawer";
import HeaderMenuRight from "@/layouts/header-menu-right";
import StickyHeader from "@/layouts/sticky-header";
import { useTranslation } from "@/app/i18n/client";
import SearchWidget from "@/app/shared/search/search";

export default function Header({
  className,
  lang,
}: {
  className?: string;
  lang?: string;
}) {
  const { t } = useTranslation(lang!, "common");
  return (
    <StickyHeader
      className={cn(
        "z-[990] justify-between bg-white xl:pe-8  dark:bg-gray-50/50",
        className
      )}
    >
      <div className="hidden items-center gap-3 xl:flex">
        <Link
          aria-label="Site Logo"
          href={"/"}
          className="me-4 hidden w-[155px] shrink-0 text-gray-800 hover:text-gray-900 lg:me-5 xl:block"
        >
          <Logo className="max-w-[155px]" />
        </Link>
      </div>

      <div className="flex w-full items-center justify-between gap-5 xl:w-[calc(100%_-_190px)] 2xl:w-[calc(100%_-_310px)] 3xl:gap-6">
        <div className="flex max-w-2xl items-center xl:w-auto">
          <HamburgerButton
          lang={lang!}
            view={<Sidebar className="static w-full 2xl:w-full" lang={lang} />}
          />
          <Link
            aria-label="Site Logo"
            href="/"
            className="me-4 w-9 shrink-0 text-gray-800 hover:text-gray-900 lg:me-5 xl:hidden"
          >
            <Logo iconOnly={true} />
          </Link>
          <SearchWidget
            icon={<PiMagnifyingGlass className="me-3 h-[20px] w-[20px]" />}
            className="xl:w-[500px]"
            t={t}
          />
        </div>

        <div className="flex items-center justify-between">
          <HeaderMenuRight lang={lang} />
        </div>
      </div>
    </StickyHeader>
  );
}
