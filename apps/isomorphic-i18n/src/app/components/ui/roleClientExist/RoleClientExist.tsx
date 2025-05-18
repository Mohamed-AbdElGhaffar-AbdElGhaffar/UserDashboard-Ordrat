'use client';

import Cookies from 'js-cookie';

export function RoleClientExist(pageRoles: string[]): boolean {
  try {
    const cookieRolesString = Cookies.get('roles');
    if (!cookieRolesString) return false;

    const cookieRoles: string[] = JSON.parse(cookieRolesString);
    return pageRoles.some((role) => cookieRoles.includes(role));
  } catch {
    return false;
  }
}
