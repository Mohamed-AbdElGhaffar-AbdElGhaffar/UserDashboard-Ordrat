'use client';

import { type Affiliate } from '@/data/users-data';
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
    transactionId: lang === 'ar' ? 'ID المعاملة' : 'Transaction ID',
    date: lang === 'ar' ? 'التاريخ' : 'Date',
    amount: lang === 'ar' ? 'المبلغ' : 'Amount',
    description: lang === 'ar' ? 'الوصف' : 'Description',
    status: lang === 'ar' ? 'الحالة' : 'Status',
    currency: lang === 'ar' ? "ج.م" : "EGP",
    completed: lang === 'ar' ? 'مكتمل' : 'Completed',
    pending: lang === 'ar' ? 'قيد الانتظار' : 'Pending',
  };

  return [
    {
      title: <HeaderCell title={text.transactionId} />,
      dataIndex: 'TransactionID',
      key: 'TransactionID',
      width: 80,
      render: (_: string, user: Affiliate) => (
        <Text className="font-medium text-gray-900 truncate max-w-[250px]">
          {user.TransactionID}
        </Text>
      ),
    },
    {
      title: (
        <HeaderCell
          title={text.date}
          sortable
          ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'createdAt'}
        />
      ),
      onHeaderCell: () => onHeaderCellClick('createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 130,
      render: (value: Date) => <DateCell lang={lang} date={value} />,
    },
    {
      title: <HeaderCell title={text.amount} />,
      dataIndex: 'Amount',
      key: 'Amount',
      width: 120,
      render: (_: string, user: Affiliate) => (
        <Text
          className={`font-semibold ${user.Amount >= 0 ? 'text-green-600' : 'text-red-600'}`}
        >
          {user.Amount >= 0 ? `+${user.Amount.toFixed(2)}${text.currency}` : `-${Math.abs(user.Amount).toFixed(2)}${text.currency}`}
        </Text>
      ),
    },
    {
      title: <HeaderCell title={text.description} />,
      dataIndex: 'Description',
      key: 'Description',
      width: 300,
      render: (_: string, user: Affiliate) => (
        <Text className="truncate text-sm text-gray-600">{user.Description}</Text>
      ),
    },
    {
      title: <HeaderCell title={text.status} />,
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (_: string, user: Affiliate) => {
        const status = user.status;

        const badge = {
          Completed: {
            className: 'bg-green-100 text-green-600',
            icon: <HiCheckCircle className="h-4 w-4" />,
            label: text.completed,
          },
          Pending: {
            className: 'bg-red-100 text-red-600',
            icon: <HiClock className="h-4 w-4" />,
            label: text.pending,
          },
          Default: {
            className: 'bg-gray-100 text-gray-500',
            icon: null,
            label: '-',
          },
        };

        const badgeData = badge[status as 'Completed' | 'Pending'] || badge.Default;
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
  ];
};
