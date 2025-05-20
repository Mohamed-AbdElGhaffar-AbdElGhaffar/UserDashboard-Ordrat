import { toCurrency } from '@utils/to-currency';
import { format } from 'date-fns';

export interface OrderAddress {
  street: string;
  apartmentNumber: string;
  floor: string;
}

export interface OrderChoice {
  choiceId?: string;
  choiceNameEn?: string;
  choiceNameAr?: string;
  price: number;
  inputValue?: string;
  image?: File;
}

export interface OrderVariation {
  variationId: string;
  variationNameEn: string;
  variationNameAr: string;
  choices?: OrderChoice[];
}

export interface OrderProduct {
  id?: string;
  name: string;
}

export interface OrderItem {
  id?: string | number;
  quantity: number;
  product?: OrderProduct;
  itemPrice: number;
  orderItemVariations?: OrderVariation[];
}

export interface OrderCustomer {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt?: string | Date;
  items?: OrderItem[];
  price?: number;
  shippingFees?: number;
  totalVat?: number;
  discount?: number;
  totalPrice?: number;
  address?: OrderAddress;
}

const formatDate = (dateString: string | Date | undefined): { date: string; time: string } => {
  try {
    if (!dateString) throw new Error('Invalid date');
    const date = new Date(dateString);
    return {
      date: format(date, 'yyyy/MM/dd'),
      time: format(date, 'hh:mm:ss a')
    };
  } catch (error) {
    return { date: 'N/A', time: 'N/A' };
  }
};

export const printOrderReceipt = (order: Order, lang: string = 'en', endUser?: OrderCustomer): void => {
  if (!order) return;

  const isRTL = lang === 'ar';
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const { date, time } = formatDate(order?.createdAt);

  const container = document.createElement('div');
  container.style.display = 'none';
  container.innerHTML = `
    <div style="width: 302px; max-width: 302px; text-align: ${isRTL ? "right" : "left"}; font-family: ${isRTL ? "Arial, sans-serif" : "monospace"}; font-size: 9pt; line-height: 1.2; box-sizing: border-box; padding: 8px;" dir="${isRTL ? "rtl" : "ltr"}">
      <div style="text-align: center; margin-bottom: 8px;">
        <div style="border: 1px solid black; margin-bottom: 8px; padding-bottom: 4px;">
          <div style="font-weight: bold; text-align: center; padding: 2px;">
            ${isRTL ? `رقم الطلب: ${order?.orderNumber}` : `Order# ${order?.orderNumber}`}
          </div>
        </div>
      </div>

      <table style="width: 100%; border-bottom: 1px solid black; margin-bottom: 8px; border-collapse: collapse; font-size: 8pt;">
        <thead>
          <tr style="border-bottom: 1px solid black;">
            <th style="text-align: ${isRTL ? "right" : "left"}; padding: 2px; width: 10%;">${isRTL ? 'الكمية' : 'Qty'}</th>
            <th style="text-align: ${isRTL ? "right" : "left"}; padding: 2px; width: 65%;">${isRTL ? 'المنتج' : 'Item'}</th>
            <th style="text-align: ${isRTL ? "left" : "right"}; padding: 2px; width: 25%;">${isRTL ? 'السعر' : 'Price'}</th>
          </tr>
        </thead>
        <tbody>
          ${order?.items?.map((item, index) => `
            <tr>
              <td style="padding: 2px;">${item.quantity}</td>
              <td style="padding: 2px;">${item.product?.name}</td>
              <td style="text-align: ${isRTL ? "left" : "right"}; padding: 2px;">${toCurrency(item.itemPrice * item.quantity, lang)}</td>
            </tr>
            ${item.orderItemVariations?.flatMap(variation =>
              variation.choices?.map(choice => `
                <tr>
                  <td style="padding: 2px;">${item.quantity}</td>
                  <td style="padding: 2px;">
                    ${isRTL ? variation.variationNameAr : variation.variationNameEn}: ${isRTL ? choice.choiceNameAr : choice.choiceNameEn}
                  </td>
                  <td style="text-align: ${isRTL ? "left" : "right"}; padding: 2px;">${toCurrency(choice.price * item.quantity, lang)}</td>
                </tr>
              `) || []
            ).join('')}
          `).join('')}
        </tbody>
      </table>

      <div style="margin-bottom: 8px; font-size: 8pt;">
        <div style="display: flex; justify-content: space-between;"><span>${isRTL ? 'المجموع الفرعي:' : 'Subtotal:'}</span><span>${toCurrency(order?.price || 0, lang)}</span></div>
        <div style="display: flex; justify-content: space-between;"><span>${isRTL ? 'رسوم التوصيل:' : 'Shipping:'}</span><span>${toCurrency(order?.shippingFees || 0, lang)}</span></div>
        ${order?.totalVat && order.totalVat > 0 ? `
          <div style="display: flex; justify-content: space-between;"><span>${isRTL ? 'ضريبة القيمة المضافة:' : 'VAT:'}</span><span>${toCurrency(order?.totalVat || 0, lang)}</span></div>` : ''}
        ${order?.discount && order.discount > 0 ? `
          <div style="display: flex; justify-content: space-between;"><span>${isRTL ? 'الخصم:' : 'Discount:'}</span><span>-${toCurrency(order?.discount || 0, lang)}</span></div>` : ''}
        <div style="display: flex; justify-content: space-between; font-weight: bold; border-top: 1px solid black; padding-top: 4px;"><span>${isRTL ? 'الإجمالي:' : 'Total:'}</span><span>${toCurrency(order?.totalPrice || 0, lang)}</span></div>
      </div>

      ${order?.address ? `
        <div style="border-top: 1px solid black; padding-top: 4px; margin-bottom: 8px;">
          <div style="font-weight: bold;">${isRTL ? 'عنوان التوصيل:' : 'Delivery Address:'}</div>
          <div>${order.address.street}<br/>${isRTL ? `شقة: ${order.address.apartmentNumber}, الطابق: ${order.address.floor}` : `Apt: ${order.address.apartmentNumber}, Floor: ${order.address.floor}`}</div>
        </div>` : ''}

      ${endUser ? `
        <div style="border-top: 1px solid black; padding-top: 4px; margin-bottom: 8px;">
          <div style="font-weight: bold;">${isRTL ? 'بيانات العميل:' : 'Customer Info:'}</div>
          <div>
            ${endUser.firstName || endUser.lastName ? `${isRTL ? 'الاسم:' : 'Name:'} ${endUser.firstName || ''} ${endUser.lastName || ''}` : ''}
            ${endUser.phoneNumber ? `<br/>${isRTL ? 'رقم الهاتف:' : 'Phone:'} ${endUser.phoneNumber}` : ''}
          </div>
        </div>` : ''}

      <div style="text-align: center; border-top: 1px solid black; padding-top: 4px;">
        <div>${isRTL ? 'شكراً لطلبك!' : 'Thank you for your order!'}</div>
        <div style="margin-top: 4px;">${isRTL ? 'تم إنشاؤه بواسطة Ordrat' : 'Powered by Ordrat'}</div>
      </div>
    </div>
  `;

  document.body.appendChild(container);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - Order #${order.orderNumber}</title>
        <style>
          @page {
            size: 80mm auto;
            margin: 2mm;
          }
          @media print {
            body {
              width: 80mm;
              margin: 0;
              padding: 0;
            }
          }
        </style>
      </head>
      <body>${container.innerHTML}
        <script>
          window.onload = function() {
            window.print();
            setTimeout(() => window.close(), 100);
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }
  container.remove();
};
