// config/roles.ts
import Cookies from 'js-cookie';

export function getUserRolesFromCookies(): string[] {
  const roles = Cookies.get('roles');
  console.log("function roles: ",roles);
  
  try {
    return roles ? JSON.parse(roles) : []; // Example cookie: '["Admin", "User"]'
  } catch {
    return [];
  }
}
