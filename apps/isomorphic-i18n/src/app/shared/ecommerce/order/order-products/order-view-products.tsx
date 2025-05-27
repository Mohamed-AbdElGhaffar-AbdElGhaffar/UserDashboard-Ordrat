'use client';

import Image from 'next/image';
import Table, { HeaderCell } from '@/app/shared/table';
import { useCart } from '@/store/quick-cart/cart.context';
import { Title, Text, Badge } from 'rizzui';
import { toCurrency } from '@utils/to-currency';
import { CartItem ,Order,OrderItem } from '@/types';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; 
import { useTranslation } from '@/app/i18n/client';
import { API_BASE_URL } from '@/config/base-url';
import ActionsCellOrders from '@/app/components/orders/actionsCellOrders/ActionsCellOrders';
import { useUserContext } from '@/app/components/context/UserContext';
import { PiMinus, PiPlus } from 'react-icons/pi';
import ModalCancelOrderItem from '@/app/components/ui/modals/ModalCancelOrderItem';
import { useModal } from '@/app/shared/modal-views/use-modal';
import ModalIncreaseOrderItem from '@/app/components/ui/modals/ModalIncreaseOrderItem';

function getStatusBadge(status: string, lang: string) {
  console.log("status: ",status);
  
  switch (status.toLowerCase()) {
    case 'false':
      return (
        <div className="flex items-center">
          <Badge color="success" renderAsDot />
          <Text className="ms-2 font-medium text-green-dark">{lang=='ar'?'موجود':'Exist'}</Text>
        </div>
      );
    default:
      return (
        <div className="flex items-center">
          <Badge color="danger" renderAsDot />
          <Text className="ms-2 font-medium text-red-dark">{lang=='ar'?'محذوف':'Cancelled'}</Text>
        </div>
      );
  }
}

// const cartItems: CartItem[] = [
//   {
//     id: 1,
//     name: "Product 1",
//     slug: "product-1",
//     description: "Description of Product 1",
//     image: "/path/to/image1.jpg", // يمكنك استبدال هذا بصورة ثابتة
//     color: null,
//     price: 100,
//     salePrice: 90,
//     quantity: 2,
//     size: 10,
//     sizeFood: "Large",
//     stock: 50,
//     discount: 10,
//   },
//   {
//     id: 2,
//     name: "Product 2",
//     slug: "product-2",
//     description: "Description of Product 2",
//     image: "/path/to/image2.jpg", // يمكنك استبدال هذا بصورة ثابتة
//     color: null,
//     price: 150,
//     quantity: 1,
//     size: 12,
//     stock: 20,
//   },
//   // يمكنك إضافة المزيد من العناصر هنا
// ];

// const columns = [
//   {
//     title: <HeaderCell title="Product" />,
//     dataIndex: 'product',
//     key: 'product',
//     width: 250,
//     render: (_: any, row: OrderItem) => (
//       <div className="flex items-center">
//         <div className="relative aspect-square w-12 overflow-hidden rounded-lg">
//           <Image
//             alt={row?.product.name} 
//             src={row?.product.imageUrl} 
//             fill
//             sizes="(max-width: 768px) 100vw"
//             className="object-cover"
//           />
//         </div>
//         <div className="ms-4">
//           <Title as="h6" className="!text-sm font-medium">
//             {row.product.name} 
//           </Title>
//         </div>
//       </div>
//     ),
//   },
//   {
//     title: <HeaderCell title="Product Price" align="right" />,
//     dataIndex: 'price',
//     key: 'price',
//     width: 200,
//     render: (_: any, item: OrderItem) => (
//       <Text className="text-sm text-center">{item.itemPrice}</Text>
//     ),
//   },
//   {
//     title: <HeaderCell title="Quantity" align="center" />,
//     dataIndex: 'quantity',
//     key: 'quantity',
//     width: 150,
//     render: (_: any, item: OrderItem) => (
//       <Text className="text-center text-sm font-semibold">{item.quantity}</Text>
//     ),
//   },
//     {
//       title: <HeaderCell title="Total Price" align="right" />,
//       dataIndex: 'totalPrice',
//       key: 'totalPrice',
//       width: 200,
//       render: (_: any, item: OrderItem) => (
//         <></>
//         // <Text className="text-end text-sm">{to}$</Text>
//       ),
//   },
// ];


function QuantityControl({ itemId, quantity, orderId, cancelled, order, lang = 'en' }: { itemId: any; quantity:any; orderId: string; cancelled: boolean; order: Order | null; lang?: string; }) {
  const { openModal } = useModal();
  const { setPOSTableOrderId, setTablesData, setOrderDetailsTable, setOrderDetailsStatus } = useUserContext();

  return (
    <div className="inline-flex items-center gap-2.5 text-xs ">
      <button
        className={`grid h-7 w-7 place-content-center rounded-full bg-gray-200 ${
          (cancelled || order?.status==4 || order?.status==3) ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-300'
        }`}
        disabled={cancelled || order?.status==4 || order?.status==3}
        onClick={() => { 
          openModal({
            view: <ModalCancelOrderItem
              lang={lang} 
              orderId={orderId}
              itemId={itemId}
              quantity={quantity - 1}
              onSuccess={()=>{
                setTablesData(true);
                setOrderDetailsTable(true);
                setOrderDetailsStatus(true);
                setPOSTableOrderId('');
              }}
            />,
            customSize: '480px',
          });
        }}
      >
        <PiMinus className="h-3 w-3 text-gray-600" />
      </button>
      <span className="font-medium text-gray-900">{quantity}</span>
      <button
        className={`grid h-7 w-7 place-content-center rounded-full bg-gray-200 ${
          (cancelled || order?.status==4 || order?.status==3) ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-300'
        }`}
        disabled={cancelled || order?.status==4 || order?.status==3}
        onClick={() => { 
          openModal({
            view: <ModalIncreaseOrderItem
              lang={lang} 
              orderId={orderId}
              itemId={itemId}
              quantity={quantity + 1}
              onSuccess={()=>{
                setTablesData(true);
                setOrderDetailsTable(true);
                setOrderDetailsStatus(true);
                setPOSTableOrderId('');
              }}
            />,
            customSize: '480px',
          });
        }}
      >
        <PiPlus className="h-3 w-3 text-gray-600" />
      </button>
    </div>
  );
}

export default function OrderViewProducts({lang}:{lang:string}) {
  const { items } = useCart();
  const { id } = useParams();
  const orderId = id;   
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
	const { t } = useTranslation(lang ,'order');
  const { orderDetailsTable, orderDetailsStatus, setOrderDetailsTable } = useUserContext();

  const columns = [
    {
      title: <HeaderCell className='w-[140px]' title={t('product')} />,
      dataIndex: 'product', 
      key: 'product',
      width: 250,
      render: (_: any, record: any) => (
        <div className="flex items-center">
          <div className="relative aspect-square w-12 overflow-hidden rounded-lg">
            <img
              src={record.product.images[0]?.imageUrl || ''}
              alt={record.product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="ms-4">
            <Title as="h6" className="!text-sm font-medium">
              {record.product.name}
            </Title>
            <div className='mt-2'>
              <QuantityControl 
                itemId={record.itemId} 
                cancelled={record.cancelled} 
                orderId={orderId as string}
                quantity={record.quantity}
                order={order}
                lang={lang}
              />
            </div>
            {record.cancelled && (
              <>
                {getStatusBadge(`${record.cancelled}`, lang)}
              </> 
            )}
          </div>
        </div>
      ),
    },
    {
      title: <HeaderCell className='w-[80px]' title={t('orderItemVariations')} />,
      dataIndex: 'orderItemVariations', 
      key: 'orderItemVariations',
      width: 250,
      render: (_: any, record: any) => {
        const allChoices = record.orderItemVariations?.flatMap((variation: any) => variation.choices || []) || [];
    
        return allChoices.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {allChoices.map((choice: any) => (
              <span
                key={choice.choiceId}
                className="bg-gray-100 text-gray-700 px-2 py-[2px] rounded-md text-xs max-w-[100px] truncate"
                title={lang === 'ar' ? choice.choiceNameAr : choice.choiceNameEn}
              >
                {lang === 'ar' ? choice.choiceNameAr : choice.choiceNameEn}
              </span>
            ))}
          </div>
        ) : (
          <Text className="text-sm font-semibold w-full">
            {lang === 'ar' ? 'لا يوجد' : 'No Choices'}
          </Text>
        );
      },
    },
    // {
    //   title: <HeaderCell className='w-[70px]' title={t('Product-Status')} />,
    //   dataIndex: 'cancelled', 
    //   key: 'cancelled',
    //   width: 200,
    //   render: (cancelled: boolean) => (
    //     <Text className="text-end text-sm">{getStatusBadge(`${cancelled}`, lang)}</Text>
    //   ),
    // },
    {
      title: <HeaderCell className='w-[90px]' title={t('item-Price')} align="right" />,
      dataIndex: 'itemPrice', 
      key: 'itemPrice',
      width: 200,
      render: (_: any, record: any) => (
        <Text className={`text-end text-sm ${record.cancelled ? 'line-through text-muted':''}`}>{toCurrency(record.itemPrice, lang)}</Text>
      ),
    },
    // {
    //   title: <HeaderCell className='w-[100px]' title={t('Shipping-Fees')} align="right" />,
    //   dataIndex: 'shippingFees', 
    //   key: 'shippingFees',
    //   width: 200,
    //   render: (shippingFees: number) => (
    //     <Text className="text-center text-sm">{toCurrency(shippingFees, lang)}</Text>
    //   ),
    // },
    {
      title: <HeaderCell title={t('Quantity')} align="center" />,
      dataIndex: 'quantity',
      key: 'quantity',
      width: 150,
      render: (quantity: number) => (
        <Text className="text-center text-sm font-semibold">{quantity}</Text>
      ),
    },
    {
      title: <HeaderCell className='w-[160px]' title={t('totalChoicePrices')} align="right" />,
      dataIndex: 'totalChoicesPrice',
      key: 'totalChoicesPrice',
      width: 200,
      render: (_: any, record: any) => (
        <Text className={`text-center text-sm ${record.cancelled ? 'line-through text-muted':''}`}>{toCurrency(record.totalChoicesPrice, lang)}</Text>
      ),
    },
    {
      title: <HeaderCell className='w-[90px]' title={t('Total-Price')} align="right" />,
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      width: 200,
      render: (_: any, record: any) => (
        <Text className={`text-end text-sm ${record.cancelled ? 'line-through text-muted':''}`}>{toCurrency(`${(record.itemPrice * record.quantity) + record.totalChoicesPrice}`, lang)}</Text>
      ),
    },
    {
      title: <HeaderCell className='w-[125px]' title={t('Cancel-Product')} align="right" />,
      dataIndex: 'itemId',
      key: 'itemId',
      width: 200,
      render: (_: any, record: any) => (
        <ActionsCellOrders itemId={record.itemId} orderId={orderId as string} lang={lang} status={order?.status as number} cancelled={record.cancelled}/>
      )
    },
  ];


  const fetchOrder = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/Order/GetById/GetById/${id}`,
        {
          method: 'GET',
          headers: {
            'Accept-Language': lang,
          },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }
      const data: Order = await response.json();
      console.log("oreder data: ",data);
      console.log("oreder data: ",data.totalPrice);
      
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrder();
  }, [lang]);

  useEffect(() => {
    if (orderDetailsTable || orderDetailsStatus) {
      fetchOrder();
      setOrderDetailsTable(false);
    }
  }, [orderDetailsTable, orderDetailsStatus]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!order) {
    return <div>No order found</div>;
  }
  console.log("order: ",order);
  
  return (
    <Table
    data={order.items.map(item => ({
      ...order, 
      itemId: item.id, 
      product: item.product, 
      itemPrice: item.itemPrice, 
      quantity: item.quantity, 
      cancelled: item.cancelled, 
      totalChoicesPrice: item.totalChoicesPrice, 
      orderItemVariations: item.orderItemVariations
    }))} 
      columns={columns}
      className="text-sm"
      variant="minimal"
      rowKey={(record) => record.id}
      scroll={{ x: 800 }}
    />
  );
}
