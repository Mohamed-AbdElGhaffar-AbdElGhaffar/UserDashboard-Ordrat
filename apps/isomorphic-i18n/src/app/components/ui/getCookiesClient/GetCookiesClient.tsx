'use client';

import Cookies from 'js-cookie';

export function GetCookiesClient(key: string): string | null {
  const value = Cookies.get(key);
  return value || null;
}
