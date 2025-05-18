"use client";
import { useEffect } from "react";
export default function GoToPath({ lang, path } : { lang: string, path: string }) {
  useEffect(() => {
    window.location.href = `/${lang}/${path}`;
  }, [lang]);

  return null;
}
