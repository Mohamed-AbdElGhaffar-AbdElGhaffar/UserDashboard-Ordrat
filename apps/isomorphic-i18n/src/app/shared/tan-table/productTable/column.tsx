import { Product } from '@/data/tan-table-data';
import { createColumnHelper } from '@tanstack/react-table';
import { Checkbox, Text } from 'rizzui';
import AvatarCard from '@ui/avatar-card';
import DateCell from '@ui/date-cell';
import ActionsCellProduct from '@/app/components/storeProducts/products/actionsCellProduct/ActionsCellProduct';
import ActionsCellActive from '@/app/components/storeProducts/products/actionsCellActive/ActionsCellActive';
import { RoleClientExist } from '@/app/components/ui/roleClientExist/RoleClientExist';

const columnHelper = createColumnHelper<Product>();

export const defaultColumns = (lang: string) => {
  const updateActivationStatus = RoleClientExist([
    'ChangeProductsActivationStatus',
  ]);
  const hasActions = RoleClientExist([
    'DeleteProducts',
    'sellerDashboard-storeProducts-products-update',
  ]);

  const columns = [
    columnHelper.accessor('id', {
      id: 'id',
      size: 60,
      header: ({ table }) => (
        <Checkbox
          aria-label="Select all rows"
          checked={table.getIsAllPageRowsSelected()}
          onChange={() => table.toggleAllPageRowsSelected()}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label="Select row"
          checked={row.getIsSelected()}
          onChange={() => row.toggleSelected()}
        />
      ),
      enableSorting: false,
    }),
    columnHelper.accessor('name', {
      id: 'name',
      size: 240,
      header: lang === 'ar' ? 'الاسم' : 'Name',
      cell: ({ row }) => (
        <AvatarCard
          src={row.original.imageUrl}
          name={row.original.name}
          description={``}
        />
      ),
      enableSorting: false,
    }),
    // columnHelper.accessor('description', {
    //   id: 'description',
    //   size: 280,
    //   header: lang === 'ar' ? 'الوصف' : 'Description',
    //   cell: ({ row }) => (
    //     <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
    //       {row.original.description}
    //     </Text>
    //   ),
    // }),
    columnHelper.accessor('categoryName', {
      id: 'categoryName',
      size: 220,
      header: lang === 'ar' ? 'القسم' : 'Category',
      cell: ({ row }) => (
        <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
          {row.original.categoryName}
        </Text>
      ),
    }),
    columnHelper.accessor('price', {
      id: 'price',
      size: 140,
      header: lang === 'ar' ? "السعر" : 'Price',
      cell: ({ row }) => (
        <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
          {row.original.price}
        </Text>
      ),
    }),
    // columnHelper.accessor('oldPrice', {
    //   id: 'oldPrice',
    //   size: 180,
    //   header: lang === 'ar' ? "السعر القديم" : 'Old Price',
    //   cell: ({ row }) => (
    //     <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
    //       {row.original.oldPrice}
    //     </Text>
    //   ),
    // }),
    columnHelper.accessor('numberOfSales', {
      id: 'numberOfSales',
      size: 180,
      header: lang === 'ar' ? "عدد المبيعات" : 'Number Of Sales',
      cell: ({ row }) => (
        <Text className="text-center font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
          {row.original.numberOfSales}
        </Text>
      ),
    }),
    columnHelper.accessor('status', {
      id: 'status',
      size: 140,
      header: lang === 'ar' ? 'الحالة' : 'Status',
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <Text className="font-lexend text-sm font-normal text-gray-900 dark:text-gray-700">
            {row.original.status}
          </Text>
          {updateActivationStatus &&(
            <ActionsCellActive row={row as any} 
              lang={lang}
            />
          )}
        </div>
      ),
    }),
    // columnHelper.accessor('isTopSelling', {
    //   id: 'isTopSelling',
    //   size: 140,
    //   header: lang === 'ar' ? 'الأكثر مبيعًا' : 'Top Selling',
    //   cell: ({ row }) => (
    //     <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
    //       {row.original.isTopSelling}
    //     </Text>
    //   ),
    // }),
    // columnHelper.accessor('isTopRated', {
    //   id: 'isTopRated',
    //   size: 140,
    //   header: lang === 'ar' ? 'الأعلى تقييمًا' : 'Top Rated',
    //   cell: ({ row }) => (
    //     <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
    //       {row.original.isTopRated}
    //     </Text>
    //   ),
    // }),
    // columnHelper.accessor('createdAt', {
    //   id: 'createdAt',
    //   size: 200,
    //   header: lang === 'ar' ? 'تاريخ الإنشاء' : 'Created Date',
    //   cell: ({ row }) => <DateCell date={new Date(row.original.createdAt)} lang={lang} />,
    // }),
    // columnHelper.accessor('lastUpdatedAt', {
    //   id: 'lastUpdatedAt',
    //   size: 200,
    //   header: lang === 'ar' ? "تاريخ آخر تحديث" : 'last Updated Date',
    //   cell: ({ row }) => <DateCell date={new Date(row.original.lastUpdatedAt)} lang={lang} />,
    // })
  ]

  if (hasActions) {
    columns.push(
      columnHelper.accessor('userName', {
        id: 'userName',
        size: 110,
        header: '',
        enablePinning: true,
        enableSorting: false,
        cell: ({ row }) => <ActionsCellProduct row={row} lang={lang}/>,
      })
    );
  }

  return columns;
};
