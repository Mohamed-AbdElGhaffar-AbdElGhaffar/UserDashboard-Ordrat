import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

interface AuthGuardProps {
  PageRoles: string[];
  children: ReactNode;
}

export default async function AuthGuard({ PageRoles, children }: AuthGuardProps) {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (!refreshToken) {
    redirect('/signin');
    return null;
  }

  const response = await fetch('https://testapi.ordrat.com/api/Auth/RefreshAccessToken', {
    method: 'POST',
    headers: {
      'Accept-Language': 'en',
      'refreshToken': refreshToken,
    },
  });

  if (!response.ok) {
    // ❌ Don't delete cookie here (not allowed)
    redirect('/signin');
    return null;
  }

  const data = await response.json();

  const userRoles = data.roles;
  const hasAccess = PageRoles.some(role => userRoles.includes(role));

  if (!hasAccess) {
    console.log("userRoles: ",userRoles);
    console.log("hasAccess: ",hasAccess);
    
    redirect('/unauthorized');
    return null;
  }

  return <>{children}</>;
}
