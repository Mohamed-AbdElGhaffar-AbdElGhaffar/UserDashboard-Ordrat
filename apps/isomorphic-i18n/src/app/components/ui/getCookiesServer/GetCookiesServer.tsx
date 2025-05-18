import { cookies } from 'next/headers';

export function GetCookiesServer(key: string): string | null {
  const cookieStore = cookies();
  const cookieValue = cookieStore.get(key)?.value;
  return cookieValue || null;
}
