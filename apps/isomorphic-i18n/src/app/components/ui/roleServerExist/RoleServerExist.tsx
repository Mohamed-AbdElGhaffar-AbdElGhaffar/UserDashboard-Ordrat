import { cookies } from 'next/headers';

export function RoleServerExist(PageRoles: string[]): boolean {
  const cookieStore = cookies();
  const rolesCookie = cookieStore.get('roles')?.value;

  if (!rolesCookie) return false;

  try {
    const cookieRoles: string[] = JSON.parse(rolesCookie);
    return PageRoles.some((role) => cookieRoles.includes(role));
  } catch {
    return false;
  }
}
