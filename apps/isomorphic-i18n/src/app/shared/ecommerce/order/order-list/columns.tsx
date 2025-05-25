'use client';

import Link from 'next/link';
import { HeaderCell } from '@/app/shared/table';
import { Badge, Text, Tooltip, ActionIcon } from 'rizzui';
import { routes } from '@/config/routes';
import EyeIcon from '@components/icons/eye';
import PencilIcon from '@components/icons/pencil';
import TableAvatar from '@ui/avatar-card';
import DateCell from '@ui/date-cell';
import DeletePopover from '@/app/shared/delete-popover';
import { RoleClientExist } from '@/app/components/ui/roleClientExist/RoleClientExist';
import { toCurrency } from '@utils/to-currency';

function getStatusBadge(lang:string , status: string) {
  switch (status.toLowerCase()) {
    case '0':
      return (
        <div className="flex items-center">
          <Badge color="danger" renderAsDot />
          <Text className="ms-2 font-medium text-red-dark">{lang=='ar'? 'تم الغاء الطلب' : 'Order Cancel' }</Text>
        </div>
      );
    case '1':
      return (
        <div className="flex items-center">
          <Badge color="warning" renderAsDot />
          <Text className="ms-2 font-medium text-orange-dark">{lang=='ar'? "انتظار الموافقة" : 'Order Pending' }</Text>
        </div>
      );
    case '2':
      return (
        <div className="flex items-center">
          <Badge color="danger" renderAsDot />
          <Text className="ms-2 font-medium text-gray-600">{lang=='ar'? 'يتم تحضير الطلب' : 'Order Being Prepared'}</Text>
        </div>
      );
    case '4':
      return (
        <div className="flex items-center">
          <Badge color="success" renderAsDot />
          <Text className="ms-2 font-medium text-green-dark">{lang=='ar'? 'تم الاستلام' : 'Order Delivered' }</Text>
        </div>
      );
    default:
      return (
        <div className="flex items-center">
          <Badge renderAsDot className="bg-gray-400" />
          <Text className="ms-2 font-medium text-green-400">{lang == 'ar'? 'يتم توصيل الطلب' : 'Order Being Delivered'}</Text>
        </div>
      );
  }
}

type Columns = {
  lang:string;
  sortConfig?: any;
  onDeleteItem: (id: string) => void;
  onHeaderCellClick: (value: string) => void;
  onChecked?: (event: React.ChangeEvent<HTMLInputElement>, id: string) => void;
};

export const getColumns = ({
  lang,
  sortConfig,
  onDeleteItem,
  onHeaderCellClick,
}: Columns) => {
  // Translation object
  const translations = {
    en: {
      orderId: 'Order ID',
      items: 'Items',
      price: 'Price',
      payment: 'Payment',
      address: 'Address',
      created: 'Created',
      modified: 'Modified',
      status: 'Status',
      paid: 'Paid',
      actions: 'Actions',
      noImage: 'No Image',
      cash: 'Cash',
      card: 'Card',
      apt: 'Apt',
      floor: 'Floor',
      yes: 'Yes',
      no: 'No',
      editOrder: 'Edit Order',
      viewOrder: 'View Order',
      deleteOrder: 'Delete the order',
      deleteConfirm: 'Are you sure you want to delete this order?',
    },
    ar: {
      orderId: 'رقم الطلب',
      items: 'العناصر',
      price: 'السعر',
      payment: 'طريقة الدفع',
      address: 'العنوان',
      created: 'تاريخ الإنشاء',
      modified: 'آخر تعديل',
      status: 'الحالة',
      paid: 'مدفوع',
      actions: 'الإجراءات',
      noImage: 'لا توجد صورة',
      cash: 'نقدي',
      card: 'بطاقة',
      apt: 'شقة',
      floor: 'الدور',
      yes: 'نعم',
      no: 'لا',
      editOrder: 'تعديل الطلب',
      viewOrder: 'عرض الطلب',
      deleteOrder: 'حذف الطلب',
      deleteConfirm: 'هل أنت متأكد أنك تريد حذف هذا الطلب؟',
    },
  };

  const t = translations[lang as 'en' | 'ar'] || translations.en;
  const hasActions = RoleClientExist([
    'OrderDetails',
  ]);
  const columns = [
    { 
      title: <HeaderCell title={t.orderId} />,
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: 200,
      render: (value: string) => <Text>#{value}</Text>,
    },
    // {
    //   title: <HeaderCell title={t.items} />,
    //   dataIndex: 'items',
    //   key: 'items',
    //   width: 250,
    //   render: (_: any, row: any) => (
    //     <div className="flex items-center space-x-2">
    //       {row.items.length > 0 && row.items[0].product.images.length > 0 ? (
    //         <img
    //           src={row.items[0].product.images[0].imageUrl}
    //           alt={row.items[0].product.name}
    //           className="w-10 h-10 object-cover rounded"
    //         />
    //       ) : (
    //         <span className="text-gray-500">{t.noImage}</span>
    //       )}
    //       <Text>{row.items.map((item: any) => item.product.name).join(', ')}</Text>
    //     </div>
    //   ),
    // },
    {
      title: (
        <HeaderCell
          title={t.price}
          // sortable
          // ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'totalPrice'}
        />
      ),
      // onHeaderCell: () => onHeaderCellClick('totalPrice'),
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      width: 120,
      render: (value: number) => (
        <Text className="font-medium text-gray-700">{toCurrency(`${value.toFixed(2)}`,lang)}</Text>
      ),
    },
    {
      title: <HeaderCell title={t.payment} />,
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 150,
      render: (value: number) => (
        <Text>
          {value === 0 ? t.cash : t.card}
        </Text>
      ),
    },
    // {
    //   title: <HeaderCell title={t.address} />,
    //   dataIndex: 'address',
    //   key: 'address',
    //   width: 300,
    //   render: (value: any) => (
    //     <Text className="text-gray-700">
    //       {value?.street}, {t.apt} {value?.apartmentNumber}, {t.floor} {value?.floor}
    //     </Text>
    //   ),
    // },
    {
      title: (
        <HeaderCell
          title={t.created}
          // sortable
          // ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'createdAt'}
        />
      ),
      // onHeaderCell: () => onHeaderCellClick('createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 200,
      render: (value: string) => <DateCell lang={lang} date={new Date(value)} />,
    },
    {
      title: (
        <HeaderCell
          title={t.modified}
          // sortable
          // ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'lastUpdatedAt'}
        />
      ),
      // onHeaderCell: () => onHeaderCellClick('lastUpdatedAt'),
      dataIndex: 'lastUpdatedAt',
      key: 'lastUpdatedAt',
      width: 200,
      render: (value: string) => value !== "0001-01-01T00:00:00" ? <DateCell lang={lang} date={new Date(value)} /> : '--',
    },
    {
      title: <HeaderCell title={t.status} />,
      dataIndex: 'status',
      key: 'status',
      width: 260,
      render: (value: number) => getStatusBadge(lang, `${value}`),
    },
    {
      title: <HeaderCell title={t.paid} />,
      dataIndex: 'isPaid',
      key: 'isPaid',
      width: 100,
      render: (value: boolean) => (
        <Text className={`font-medium ${value ? 'text-green-600' : 'text-red-500'}`}>
          {value ? t.yes : t.no}
        </Text>
      ),
    },
  ]
  
  if (hasActions) {
    columns.push(
      {
        title: <HeaderCell title={t.actions} className="opacity-0" />,
        dataIndex: 'action',
        key: 'action',
        width: 50,
        render: (_: string, row: any) => (
          <div className="flex items-center justify-end gap-3 pe-4">
            {/* <Tooltip size="sm" content={t.editOrder} placement="top" color="invert">
              <Link href={routes.eCommerce.editOrder(row.id)}>
                <ActionIcon as="span" size="sm" variant="outline" className="hover:text-gray-700">
                  <PencilIcon className="h-4 w-4" />
                </ActionIcon>
              </Link>
            </Tooltip> */}
            <Tooltip size="sm" content={t.viewOrder} placement="top" color="invert">
              <Link href={`/${lang}/orders/${row.id}`}>
                <ActionIcon as="span" size="sm" variant="outline" className="hover:text-gray-700">
                  <EyeIcon className="h-4 w-4" />
                </ActionIcon>
              </Link>
            </Tooltip>
            {/* <DeletePopover
              title={t.deleteOrder}
              description={`${t.deleteConfirm} #${row.id}`}
              onDelete={() => onDeleteItem(row.id)}
            /> */}
          </div>
        ),
      }as any
    );
  }

  return columns;
};


export const getWidgetColumns = ({
  sortConfig,
  onDeleteItem,
  onHeaderCellClick,
}: Columns) => [
  {
    title: (
      <HeaderCell title="Order ID" className="ps-4 [&>div]:whitespace-nowrap" />
    ),
    dataIndex: 'id',
    key: 'id',
    width: 90,
    render: (value: string, row: any) => (
      <Link
        href={routes.eCommerce.editOrder(row.id)}
        className="ps-4 hover:text-gray-900 hover:underline"
      >
        #{value}
      </Link>
    ),
  },
  {
    title: <HeaderCell title="Customer" />,
    dataIndex: 'customer',
    key: 'customer',
    width: 300,
    render: (_: any, row: any) => (
      <TableAvatar
        src={row.avatar}
        name={row.name}
        description={row.email.toLowerCase()}
      />
    ),
  },
  {
    title: <HeaderCell title="Items" />,
    dataIndex: 'items',
    key: 'items',
    width: 150,
    render: (value: string) => (
      <Text className="font-medium text-gray-700">{value}</Text>
    ),
  },
  {
    title: (
      <HeaderCell
        title="Price"
        sortable
        ascending={
          sortConfig?.direction === 'asc' && sortConfig?.key === 'price'
        }
      />
    ),
    onHeaderCell: () => onHeaderCellClick('price'),
    dataIndex: 'price',
    key: 'price',
    width: 150,
    render: (value: string) => (
      <Text className="font-medium text-gray-700">${value}</Text>
    ),
  },
  {
    title: (
      <HeaderCell
        title="Created"
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
    render: (createdAt: Date) => <DateCell lang='en' date={createdAt} />,
  },
  {
    title: (
      <HeaderCell
        title="Modified"
        sortable
        ascending={
          sortConfig?.direction === 'asc' && sortConfig?.key === 'updatedAt'
        }
      />
    ),
    onHeaderCell: () => onHeaderCellClick('updatedAt'),
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    width: 200,
    render: (value: Date) => <DateCell lang='en' date={value} />,
  },
  {
    title: <HeaderCell title="Status" />,
    dataIndex: 'status',
    key: 'status',
    width: 140,
    render: (value: string) => getStatusBadge('en', value),
  },
  {
    // Need to avoid this issue -> <td> elements in a large <table> do not have table headers.
    title: <HeaderCell title="Actions" className="opacity-0" />,
    dataIndex: 'action',
    key: 'action',
    width: 130,
    render: (_: string, row: any) => (
      <div className="flex items-center justify-end gap-3 pe-4">
        <Tooltip
          size="sm"
          content={'Edit Order'}
          placement="top"
          color="invert"
        >
          <Link href={routes.eCommerce.editOrder(row.id)}>
            <ActionIcon
              as="span"
              size="sm"
              variant="outline"
              aria-label={'Edit Order'}
              className="hover:text-gray-700"
            >
              <PencilIcon className="h-4 w-4" />
            </ActionIcon>
          </Link>
        </Tooltip>
        <Tooltip
          size="sm"
          content={'View Order'}
          placement="top"
          color="invert"
        >
          <Link href={routes.eCommerce.orderDetails(row.id)}>
            <ActionIcon
              as="span"
              size="sm"
              variant="outline"
              aria-label={'View Order'}
              className="hover:text-gray-700"
            >
              <EyeIcon className="h-4 w-4" />
            </ActionIcon>
          </Link>
        </Tooltip>
        <DeletePopover
          title={`Delete the order`}
          description={`Are you sure you want to delete this #${row.id} order?`}
          onDelete={() => onDeleteItem(row.id)}
        />
      </div>
    ),
  },
];
