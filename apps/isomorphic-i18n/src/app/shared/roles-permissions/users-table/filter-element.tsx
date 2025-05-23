'use client';

import { PiTrashDuotone, PiMagnifyingGlassBold } from 'react-icons/pi';
import StatusField from '@/app/shared/controlled-table/status-field';
import { Badge, Text, Title, Button, Input } from 'rizzui';
import { STATUSES } from '@/data/users-data';
import { rolesList } from '@/data/roles-permissions';
import ModalButton from '@/app/shared/modal-button';
import CreateUser from '@/app/shared/roles-permissions/create-user';
import RoleExist from '@/app/components/ui/roleExist/RoleExist';

const statusOptions = [
  {
    value: STATUSES.Active,
    label: STATUSES.Active,
  },
  {
    value: STATUSES.Deactivated,
    label: STATUSES.Deactivated,
  },
  {
    value: STATUSES.Pending,
    label: STATUSES.Pending,
  },
];

type FilterElementProps = {
  isFiltered: boolean;
  filters: { [key: string]: any };
  updateFilter: (columnId: string, filterValue: string | any[]) => void;
  handleReset: () => void;
  onSearch: (searchTerm: string) => void;
  searchTerm: string;
  lang: string;
  groupOptions:{ value: string, label: string }[];
  branchOption: any[];
};

const roles = rolesList.map((role) => ({
  label: role.name,
  value: role.name,
}));

export default function FilterElement({
  isFiltered,
  handleReset,
  filters,
  updateFilter,
  onSearch,
  searchTerm,
  lang,
  groupOptions,
  branchOption
}: FilterElementProps) {
  const text = {
    title: lang === 'ar' ? 'كل الموظفين' : 'All Employees',
    // filterByStatus: lang === 'ar' ? 'تصفية حسب الحالة' : 'Filter by Status',
    filterByPhoneNumber: lang === 'ar' ? 'بحث برقم الهاتف' : 'Filter by Phone Number',
    searchPlaceholder: lang === 'ar' ? 'ابحث عن مستخدمين...' : 'Search for users...',
    clear: lang === 'ar' ? 'إزالة الفلاتر' : 'Clear',
    addUser: lang === 'ar' ? 'إضافة مستخدم جديد' : 'Add New User',
  };
  return (
    <>
      <div className="relative z-50 mb-4 flex flex-wrap items-center justify-between gap-2.5 @container ">
        <Title as="h5" className="-order-6 basis-2/5 @xl:basis-auto">
          {text.title}
        </Title>

        {/* <StatusField
          className=" -order-3 w-full @[25rem]:w-[calc(calc(100%_-_10px)_/_2)] @4xl:-order-5 @4xl:w-auto"
          options={statusOptions}
          dropdownClassName="!z-10"
          value={filters['status']}
          onChange={(value: string) => {
            updateFilter('status', value);
          }}
          placeholder={text.filterByStatus}
          getOptionValue={(option: { value: any }) => option.value}
          getOptionDisplayValue={(option: { value: any }) =>
            renderOptionDisplayValue(option.value as string)
          }
          displayValue={(selected: string) =>
            renderOptionDisplayValue(selected)
          }
        /> */}

        <Input
          type="number"
          placeholder={text.filterByPhoneNumber}
          value={filters['phoneNumber'] ?? ''}
          onChange={(event) => updateFilter('phoneNumber', event.target.value)}
          className="@4xl:-auto -order-2 w-full min-w-[160px] @4xl:-order-4 @4xl:w-auto"
        />


        {isFiltered && (
          <Button
            size="sm"
            onClick={handleReset}
            className="-order-1 h-8 w-full bg-gray-200/70 @4xl:-order-4 @4xl:w-auto"
            variant="flat"
          >
            <PiTrashDuotone className="me-1.5 h-[17px] w-[17px]" /> {text.clear}
          </Button>
        )}

        <Input
          type="search"
          placeholder={text.searchPlaceholder}
          value={searchTerm}
          onClear={() => onSearch('')}
          onChange={(event) => onSearch(event.target.value)}
          prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
          rounded="lg"
          clearable
          className="-order-4 w-full @xl:-order-5 @xl:ms-auto @xl:w-auto @4xl:-order-2 @4xl:w-[230px] @5xl:w-auto"
        />

        <RoleExist PageRoles={['AddEmployee']}>
          <div className="-order-5 flex basis-auto justify-end @xl:-order-4 @4xl:-order-1">
              <ModalButton
                lang={lang}
                label={text.addUser}
                view={<CreateUser lang={lang} groupOptions={groupOptions} branchOption={branchOption}/>}
                customSize="600px"
                className="mt-0"
              />
          </div>
        </RoleExist>
      </div>
    </>
  );
}

function renderOptionDisplayValue(value: string) {
  switch (value) {
    case STATUSES.Active:
      return (
        <div className="flex items-center">
          <Badge color="success" renderAsDot />
          <Text className="ms-2 font-medium capitalize text-green-dark">
            {value}
          </Text>
        </div>
      );
    case STATUSES.Deactivated:
      return (
        <div className="flex items-center">
          <Badge color="danger" renderAsDot />
          <Text className="ms-2 font-medium capitalize text-red-dark">
            {value}
          </Text>
        </div>
      );
    default:
      return (
        <div className="flex items-center">
          <Badge renderAsDot className="bg-gray-400" />
          <Text className="ms-2 font-medium capitalize text-gray-600">
            {value}
          </Text>
        </div>
      );
  }
}
