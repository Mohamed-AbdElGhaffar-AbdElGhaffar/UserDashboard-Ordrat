"use client";

import Link from "next/link";
import HamburgerButton from "@/layouts/hamburger-button";
import Sidebar from "@/layouts/hydrogen/sidebar";
// import Logo from "@components/logo";
import HeaderMenuRight from "@/layouts/header-menu-right";
import StickyHeader from "@/layouts/sticky-header";
import { useTranslation } from "@/app/i18n/client";
import SearchWidget from "@/app/shared/search/search";
import Logo from "@/app/components/ui/logo/Logo";
import { useEffect, useState } from "react";
import { FaCompress, FaExpand } from "react-icons/fa";

export default function Header({ lang }: { lang?: string }) {
  const { t } = useTranslation(lang!, "common");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <StickyHeader className="z-[990] 2xl:py-5 3xl:px-8  4xl:px-10">
      <div className="flex w-full max-w-2xl items-center">
        <HamburgerButton
        lang={lang!}
          view={<Sidebar className="static w-full 2xl:w-full" lang={lang} />}
        />
        <Link
          href={`/${lang}`}
          aria-label="Site Logo"
          className="me-4 w-9 shrink-0 text-gray-800 hover:text-gray-900 lg:me-5 xl:hidden"
        >
          <Logo small={true} />
        </Link>
    <button
      onClick={toggleFullscreen}
      id="fullscreenToggleBtn"
      className={`quick-btn md:flex hidden items-center gap-2 px-2  me-2 border  py-3 text-sm font-medium text-black rounded-md hover:-translate-y-0.5 transition-transform
        shadow-sm  `}>
      {isFullscreen ? <FaCompress className="w-5" /> : <FaExpand className="w-5"  />}
    </button>
        <SearchWidget t={t} lang={lang!} />
      </div>

      <HeaderMenuRight lang={lang} />
    </StickyHeader>
  );
}
