"use client";

import Link from "next/link";
import cn from "@utils/class-names";
import SimpleBar from "@ui/simplebar";
// import Logo from "@components/logo";
import { SidebarMenu } from "./sidebar-menu";
import Logo from "@/app/components/ui/logo/Logo";
import { FaExternalLinkAlt, FaShare } from "react-icons/fa";
import toast from "react-hot-toast";

export default function Sidebar({
  className,
  lang,
}: {
  className?: string;
  lang?: string;
}) {
  const link = 'https://ordrat.com/'
  const text = {
    share: lang === 'ar' ? 'مشاركة' : 'Share',
    error: lang === 'ar' ? 'المشاركة غير مدعومة على هذا المتصفح.' : 'Share not supported on this browser.',
  }
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: text.share,
          text: text.share,
          url: link,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      toast.error(text.error);
    }
  };
  return (
    <aside
      className={cn(
        "fixed bottom-0 start-0 z-50 h-full w-[270px] border-e-2 border-gray-100 bg-white dark:bg-gray-100/50 2xl:w-72 pb-[100px]",
        className
      )}
    >
      <div className="sticky top-0 z-40 bg-gray-0/10 px-6 pb-5 pt-5 dark:bg-gray-100/5 2xl:px-8 2xl:pt-6">
        <Link
          href={`/${lang}`}
          aria-label="Site Logo"
          className="text-gray-800 hover:text-gray-900"
        >
          <Logo />
        </Link>
      </div>

      <SimpleBar className="h-[calc(100%-80px)]">
        <SidebarMenu lang={lang} />
      </SimpleBar>

      <div className="sticky bottom-0 z-40 bg-gray-0/10 dark:bg-gray-100/5 border-t-2 border-gray-300 flex justify-center py-6">
        <div className="header-actions flex gap-3">
          <a
            href="#"
            id="viewStoreBtn"
            className="quick-btn flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 hover:-translate-y-0.5 transition-transform"
          >
            <FaExternalLinkAlt />
            {lang === 'ar' ? 'عرض المتجر' : 'View Store'}
          </a>
          <button
            onClick={handleShare}
            id="shareStoreBtn"
            className="quick-btn secondary flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 hover:-translate-y-0.5 transition-transform"
          >
            <FaShare />
            {lang === 'ar' ? 'مشاركة' : 'Share'}
          </button>
        </div>
      </div>
    </aside>
  );
}
 