import RoleCard from '@/app/shared/roles-permissions/role-card';
import { rolesList } from '@/data/roles-permissions';
import cn from '@utils/class-names';
import { Key } from 'react';

interface RolesGridProps {
  className?: string;
  lang: string;
  gridClassName?: string;
  groups?: { id: string; name: string; numberOfEmployees: number; roles:any[]; }[];
}

export default function RolesGrid({
  className,
  lang,
  gridClassName,
  groups,
}: RolesGridProps) {
  console.log("groups: ",groups);
  
  return (
    <div className={cn('@container', className)}>
      <div
        className={cn(
          'grid grid-cols-1 gap-6 @[36.65rem]:grid-cols-2 @[56rem]:grid-cols-3 @[78.5rem]:grid-cols-4 @[100rem]:grid-cols-5',
          gridClassName
        )}
      >
        {groups?.map((group: { id: string; name: string; numberOfEmployees: number; roles: any[]; }) => (
          <RoleCard key={group.name} users={group.numberOfEmployees} color='#FF1A1A' lang={lang} name={group.name} roles={group.roles.map((role: any) => (role.name))}/>
        ))}
      </div>
    </div>
  );
}
