'use client';

import Cookies from 'js-cookie'; 
import { ReactNode, useEffect, useState } from 'react';

interface RoleExistProps {
  PageRoles: string[];
  children: ReactNode;
}

export default function RoleExist({ PageRoles, children }: RoleExistProps) {
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const cookieRolesString = Cookies.get('roles');
    if (!cookieRolesString) return;

    try {
      const cookieRoles = JSON.parse(cookieRolesString);
      const hasAll = PageRoles.every((r) => cookieRoles.includes(r));
      setHasAccess(hasAll);
    } catch {
      setHasAccess(false);
    }
  }, [PageRoles]);

  if (!hasAccess) return null;
  return <>{children}</>;
}
