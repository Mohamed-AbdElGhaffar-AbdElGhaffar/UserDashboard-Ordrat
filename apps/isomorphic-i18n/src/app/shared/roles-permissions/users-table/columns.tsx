'use client';

import { STATUSES, type UserShop } from '@/data/users-data';
import { Text, Badge, Tooltip, Checkbox, ActionIcon } from 'rizzui';
import { HeaderCell } from '@/app/shared/table';
import EyeIcon from '@components/icons/eye';
import PencilIcon from '@components/icons/pencil';
import AvatarCard from '@ui/avatar-card';
import DateCell from '@ui/date-cell';
import DeletePopover from '@/app/shared/delete-popover';
import { RoleClientExist } from '@/app/components/ui/roleClientExist/RoleClientExist';
import ActionsCellBranch from '@/app/components/tables/branch/actionsCellBranch/ActionsCellBranch';
import ActionsCellEmployee from '@/app/components/tables/employee/actionsCellEmployee/ActionsCellEmployee';

// function getStatusBadge(status: User['status']) {
//   switch (status) {
//     case STATUSES.Deactivated:
//       return (
//         <div className="flex items-center">
//           <Badge color="danger" renderAsDot />

//           <Text className="ms-2 font-medium text-red-dark">{status}</Text>
//         </div>
//       );
//     case STATUSES.Active:
//       return (
//         <div className="flex items-center">
//           <Badge color="success" renderAsDot />
//           <Text className="ms-2 font-medium text-green-dark">{status}</Text>
//         </div>
//       );
//     case STATUSES.Pending:
//       return (
//         <div className="flex items-center">
//           <Badge renderAsDot className="bg-gray-400" />
//           <Text className="ms-2 font-medium text-gray-600">{status}</Text>
//         </div>
//       );
//     default:
//       return (
//         <div className="flex items-center">
//           <Badge renderAsDot className="bg-gray-400" />
//           <Text className="ms-2 font-medium text-gray-600">{status}</Text>
//         </div>
//       );
//   }
// }

type Columns = {
  data: any[];
  sortConfig?: any;
  handleSelectAll: any;
  checkedItems: string[];
  onDeleteItem: (id: string) => void;
  onHeaderCellClick: (value: string) => void;
  onChecked?: (id: string) => void;
  lang?: string;
  groupOptions:{ value: string, label: string }[];
  branchOption: any[];
};

export const getColumns = ({
  data,
  sortConfig,
  checkedItems,
  onDeleteItem,
  onHeaderCellClick,
  handleSelectAll,
  onChecked,
  lang = 'en',
  groupOptions,
  branchOption
}: Columns) => {
  const hasActions = RoleClientExist([
    'DeleteEmployee',
  ]);

  const columns = [
    // {
    //   title: (
    //     <div className="flex items-center gap-3 whitespace-nowrap ps-3">
    //       <Checkbox
    //         title={lang === 'ar' ? 'تحديد الكل' : 'Select All'}
    //         onChange={handleSelectAll}
    //         checked={checkedItems.length === data.length}
    //         className="cursor-pointer"
    //       />
    //       {lang=='ar'?'ID المستخدم':'User ID'}
    //     </div>
    //   ),
    //   dataIndex: 'checked',
    //   key: 'checked',
    //   width: 30,
    //   render: (_: any, row: UserShop) => (
    //     <div className="inline-flex ps-3">
    //       <Checkbox
    //         className="cursor-pointer"
    //         checked={checkedItems.includes(row.id)}
    //         {...(onChecked && { onChange: () => onChecked(row.id) })}
    //         label={`#${row.id}`}
    //       />
    //     </div>
    //   ),
    // },
    { 
      title: <HeaderCell title={lang === 'ar' ? 'الاسم' : 'Name'} />,
      dataIndex: 'fullName',
      key: 'fullName',
      width: 250,
      render: (_: string, user: UserShop) => (
        <AvatarCard
          src='https://isomorphic-furyroad.s3.amazonaws.com/public/avatars/avatar-0.webp'
          name={user.fullName}
          description=''
        />
      ),
    },
    {
      title: (
        <HeaderCell
          title={lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
        />
      ),
      onHeaderCell: () => onHeaderCellClick('phoneNumber'),
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 250,
      render: (phoneNumber: string) => phoneNumber,
    },
    {
      title: (
        <HeaderCell
          title={lang === 'ar' ? 'تاريخ الإنشاء' : 'Created'}
          sortable
          ascending={
            sortConfig?.direction === 'asc' && sortConfig?.key === 'createdAt'
          }
        />
      ),
      onHeaderCell: () => onHeaderCellClick('createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 200,
      render: (value: Date) => <DateCell lang={lang!} date={value} />,
    },
    {
      title: <HeaderCell title={lang === 'ar' ? 'الجروبات' : 'Groups'} />,
      dataIndex: 'groups',
      key: 'groups',
      width: 200,
      render: (groups: UserShop['groups'][]) => (
        <div className="flex items-center gap-2">
          {groups.map((group, index) => (
            <Badge
              key={index}
              rounded="lg"
              variant="outline"
              className="border-muted font-normal text-gray-500"
            >
              {group}
            </Badge>
          ))}
        </div>
      ),
    },
    // {
    //   title: <HeaderCell title={lang === 'ar' ? 'الحالة' : 'Status'} />,
    //   dataIndex: 'status',
    //   key: 'status',
    //   width: 120,
    //   render: (status: User['status']) => getStatusBadge(status),
    // },
  ]
  
  
  if (hasActions) {
    columns.push(
      {
        title: <></>,
        dataIndex: 'action',
        key: 'action',
        width: 140,
        render: (_: string, user: UserShop) => (
          <ActionsCellEmployee user={user} lang={lang} onDeleteItem={() => onDeleteItem(user.id)} groupOptions={groupOptions} branchOption={branchOption}/>
        ),
      },
    );
  }

  return columns;
};
