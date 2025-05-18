'use client';

import { type Referrals } from '@/data/users-data';
import { Text } from 'rizzui';
import { HeaderCell } from '@/app/shared/table';
import DateCell from '@ui/date-cell';
import { HiCheckCircle, HiClock } from 'react-icons/hi';
type Columns = {
  data: any[];
  sortConfig?: any;
  handleSelectAll: any;
  checkedItems: string[];
  onDeleteItem: (id: string) => void;
  onHeaderCellClick: (value: string) => void;
  onChecked?: (id: string) => void;
  lang?: string;
};

export const getColumns = ({
  sortConfig,
  onHeaderCellClick,
  lang = 'en',
}: Columns) => {
  const text = {
    userName: lang === 'ar' ? 'اسم المستخدم' : 'User Name',
    referralDate: lang === 'ar' ? 'تاريخ الإحالة' : 'Referral Date',
    subscribed: lang === 'ar' ? 'مشترك' : 'Subscribed',
    planStatus: lang === 'ar' ? 'حالة الخطة' : 'Plan Status',
    payments: lang === 'ar' ? 'المدفوعات' : 'Payments',
    active: lang === 'ar' ? 'مفعل' : 'Active',
    notActive: lang === 'ar' ? 'غير مفعل' : 'Unactive',
    currency: lang === 'ar' ? "ج.م" : "EGP",
  };

  return [
    {
      title: <HeaderCell title={text.userName} />,
      dataIndex: 'userName',
      key: 'userName',
      width: 100,
      render: (_: string, user: Referrals) => (
        <Text className="font-medium text-gray-900 truncate max-w-[250px]">
          {user.userName}
        </Text>
      ),
    },
    {
      title: (
        <HeaderCell
          title={text.referralDate}
          sortable
          ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'referralDate'}
        />
      ),
      onHeaderCell: () => onHeaderCellClick('referralDate'),
      dataIndex: 'referralDate',
      key: 'referralDate',
      width: 100,
      render: (value: Date) => <DateCell lang={lang} date={value} />,
    },
    {
      title: <HeaderCell title={text.subscribed} />,
      dataIndex: 'subscribed',
      key: 'subscribed',
      width: 100,
      render: (_: string, user: Referrals) => {
        const subscribed = user.subscribed;

        const badge = {
          true: {
            className: 'bg-green-100 text-green-600',
            icon: <HiCheckCircle className="h-4 w-4" />,
            label: text.active,
          },
          false: {
            className: 'bg-red-100 text-red-600',
            icon: <HiClock className="h-4 w-4" />,
            label: text.notActive,
          },
          Default: {
            className: 'bg-gray-100 text-gray-500',
            icon: null,
            label: '-',
          },
        };

        const badgeData = badge[`${subscribed}`] || badge.Default;

        return (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${badgeData.className}`}
          >
            {badgeData.icon}
            {badgeData.label}
          </span>
        );
      },
    },
    {
      title: <HeaderCell title={text.planStatus} />,
      dataIndex: 'planStatus',
      key: 'planStatus',
      width: 100,
      render: (_: string, user: Referrals) => {
        const planStatus = user.planStatus;

        const badge = {
          true: {
            className: 'bg-green-100 text-green-600',
            icon: <HiCheckCircle className="h-4 w-4" />,
            label: text.active,
          },
          false: {
            className: 'bg-red-100 text-red-600',
            icon: <HiClock className="h-4 w-4" />,
            label: text.notActive,
          },
          Default: {
            className: 'bg-gray-100 text-gray-500',
            icon: null,
            label: '-',
          },
        };

        const badgeData = badge[`${planStatus}`] || badge.Default;

        return (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${badgeData.className}`}
          >
            {badgeData.icon}
            {badgeData.label}
          </span>
        );
      },
    },
    {
      title: <HeaderCell title={text.payments} />,
      dataIndex: 'payments',
      key: 'payments',
      width: 100,
      render: (_: string, user: Referrals) => (
        <Text
          className={`font-semibold ${user.payments >= 0 ? 'text-green-600' : 'text-red-600'}`}
        >
          {user.payments >= 0 ? `+${user.payments.toFixed(2)}${text.currency}` : `-${Math.abs(user.payments).toFixed(2)}${text.currency}`}
        </Text>
      ),
    },
  ];
};
