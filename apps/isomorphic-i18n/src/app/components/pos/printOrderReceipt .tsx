import { toCurrency } from '@utils/to-currency';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

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
  serviceCharge?: number;
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

/**
 * Check if the current device is mobile
 */
const isMobileDevice = (): boolean => {
  // Method 1: User Agent detection (traditional but can be less reliable)
  const userAgentCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Method 2: Screen size-based detection
  const screenSizeCheck = window.innerWidth <= 768;
  
  // Method 3: Touch points detection (touchscreen capability)
  const touchCheck = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Method 4: Platform detection for iOS specifically
  const iosPlatformCheck = /iPad|iPhone|iPod/.test(navigator.platform) || 
                          (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  
  // iOS 13+ detection using userAgent for newer iPhones (14 Pro Max, etc.)
  const modernIosCheck = /iPhone|iPad|iPod/.test(navigator.userAgent) && 
                         ('ontouchend' in document);
  
  // Combine checks with preference for iOS-specific detection
  return iosPlatformCheck || modernIosCheck || (userAgentCheck && touchCheck) || (screenSizeCheck && touchCheck);
};

/**
 * Prints an order receipt directly
 * @param order The order details to print
 * @param lang Language to use (en or ar)
 * @param endUser Customer information
 * @param printerId Optional ID of the printer to use for direct printing
 */
export const printOrderReceipt = (
  order: Order, 
  lang: string = 'en', 
  endUser?: OrderCustomer,
  printerId?: string
): void => {
  if (!order) return;

  const isRTL = lang === 'ar';
  const isMobile = isMobileDevice();
  const { date, time } = formatDate(order?.createdAt);
  
  // Calculate totals
  const subtotal = order?.price || 0;
  const shippingFees = order?.shippingFees || 0;
  const serviceCharge = order?.serviceCharge || 0;
  const vat = order?.totalVat || 0;
  const discount = order?.discount || 0;
  const total = order?.totalPrice || 0;

  // Set padding value - you can adjust this as needed
  const xPadding = '5mm';

  // Create the HTML receipt content
  const receiptHtml = `
    <!DOCTYPE html>
    <html lang="${isRTL ? 'ar' : 'en'}" dir="${isRTL ? 'rtl' : 'ltr'}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Receipt - Order #${order.orderNumber}</title>
      <style>
        @page { 
          size: 72mm auto !important;
          margin: 0mm !important;
        }
        
        @media print {
          html, body {
            width: 72mm !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          .receipt {
            width: 100% !important;
            max-width: 72mm !important;
            padding-left: ${xPadding} !important;
            padding-right: ${xPadding} !important;
            box-sizing: border-box !important;
          }
        }
        
        body {
          font-family: ${isRTL ? "'Arial', sans-serif" : "monospace"};
          margin: 0;
          padding: 0;
          font-size: 10pt;
          line-height: 1.2;
          width: 100%;
          max-width: 72mm;
          background-color: white;
          color: black;
        }
        
        * {
          box-sizing: border-box;
        }
        
        .receipt {
          width: 100%;
          padding-left: ${xPadding};
          padding-right: ${xPadding};
          padding-top: 8px;
          padding-bottom: 8px;
        }
        
        .header, .footer {
          text-align: center;
          padding-bottom: 5px;
          padding-top: 5px;
        }
        
        .header {
          border-bottom: 1px solid black;
          margin-bottom: 8px;
        }
        
        .footer {
          border-top: 1px solid black;
          margin-top: 8px;
        }
        
        .bold {
          font-weight: bold;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 9pt;
        }
        
        th, td {
          padding: 2px;
          text-align: ${isRTL ? 'right' : 'left'};
        }
        
        th:last-child, td:last-child {
          text-align: ${isRTL ? 'left' : 'right'};
        }
        
        .price-row {
          display: flex;
          justify-content: space-between;
          font-size: 9pt;
          margin-bottom: 2px;
        }
        
        .border-top {
          border-top: 1px solid black;
          padding-top: 4px;
        }
        
        .border-bottom {
          border-bottom: 1px solid black;
          margin-bottom: 8px;
        }
        
        .calculation {
          font-size: 7pt;
          color: #666;
          font-style: italic;
          margin-top: 4px;
        }
        
        .small {
          font-size: 8pt;
        }
      </style>
      <script>
        function onLoadHandler() {
          // Auto-print after a short delay
          setTimeout(function() {
            window.print();
            // On mobile, we'll just close the window after printing attempt
            ${isMobile ? 'setTimeout(function() { window.close(); }, 1000);' : ''}
          }, 500);
        }
      </script>
    </head>
    <body onload="onLoadHandler()">
      <div class="receipt">
        <!-- Header -->
        <div class="header">
          <div style="border: 1px solid black; margin-bottom: 8px; padding-bottom: 4px;">
            <div class="bold" style="font-weight: bold; text-align: center; padding: 2px;">
              ${isRTL ? `رقم الطلب: ${order?.orderNumber}` : `Order# ${order?.orderNumber}`}
            </div>
            <div class="small" style="text-align: center;">
              ${isRTL ? `التاريخ: ${date} - الوقت: ${time}` : `Date: ${date} - Time: ${time}`}
            </div>
          </div>
        </div>
        
        <!-- Items -->
        <table class="border-bottom">
          <thead>
            <tr class="border-bottom">
              <th width="10%">${isRTL ? 'الكمية' : 'Qty'}</th>
              <th width="65%">${isRTL ? 'المنتج' : 'Item'}</th>
              <th width="25%">${isRTL ? 'السعر' : 'Price'}</th>
            </tr>
          </thead>
          <tbody>
            ${order?.items?.map((item, index) => `
              <tr>
                <td>${item.quantity}</td>
                <td>${item.product?.name || ''}</td>
                <td>${toCurrency(item.itemPrice * item.quantity, lang)}</td>
              </tr>
              ${item.orderItemVariations?.flatMap(variation =>
                variation.choices?.map(choice => `
                  <tr>
                    <td>${item.quantity}</td>
                    <td>
                      ${isRTL ? variation.variationNameAr : variation.variationNameEn}: ${isRTL ? choice.choiceNameAr : choice.choiceNameEn}
                    </td>
                    <td>${toCurrency(choice.price * item.quantity, lang)}</td>
                  </tr>
                `) || []
              ).join('')}
            `).join('')}
          </tbody>
        </table>
        
        <!-- Totals -->
        <div style="margin-bottom: 8px;">
          <div class="price-row"><span>${isRTL ? 'المجموع الفرعي:' : 'Subtotal:'}</span><span>${toCurrency(subtotal, lang)}</span></div>
          
          <div class="price-row"><span>${isRTL ? 'رسوم التوصيل:' : 'Delivery Charge:'}</span><span>${toCurrency(shippingFees, lang)}</span></div>
          
          ${serviceCharge > 0 ? `
          <div class="price-row"><span>${isRTL ? 'رسوم الخدمة:' : 'Service Charge:'}</span><span>${toCurrency(serviceCharge, lang)}</span></div>` : ''}
          
          ${vat > 0 ? `
          <div class="price-row"><span>${isRTL ? 'ضريبة القيمة المضافة:' : 'VAT:'}</span><span>${toCurrency(vat, lang)}</span></div>` : ''}
          
          ${discount > 0 ? `
          <div class="price-row"><span>${isRTL ? 'الخصم:' : 'Discount:'}</span><span>-${toCurrency(discount, lang)}</span></div>` : ''}
          
          <div class="price-row bold border-top">
            <span>${isRTL ? 'الإجمالي:' : 'Total:'}</span>
            <span>${toCurrency(total, lang)}</span>
          </div>
          
          <div class="calculation">
            ${isRTL 
              ? `(المجموع الفرعي + رسوم التوصيل + رسوم الخدمة + ضريبة القيمة المضافة - الخصم = الإجمالي)` 
              : `(Subtotal + Delivery + Service + VAT - Discount = Total)`}
          </div>
        </div>
        
        <!-- Address Section -->
        ${order?.address ? `
          <div class="border-top" style="margin-bottom: 8px;">
            <div class="bold">${isRTL ? 'عنوان التوصيل:' : 'Delivery Address:'}</div>
            <div>${order.address.street}<br/>${isRTL ? `شقة: ${order.address.apartmentNumber}, الطابق: ${order.address.floor}` : `Apt: ${order.address.apartmentNumber}, Floor: ${order.address.floor}`}</div>
          </div>` : ''}
        
        <!-- Customer Info Section -->
        ${endUser ? `
          <div class="border-top" style="margin-bottom: 8px;">
            <div class="bold">${isRTL ? 'بيانات العميل:' : 'Customer Info:'}</div>
            <div>
              ${endUser.firstName || endUser.lastName ? `${isRTL ? 'الاسم:' : 'Name:'} ${endUser.firstName || ''} ${endUser.lastName || ''}` : ''}
              ${endUser.phoneNumber ? `<br/>${isRTL ? 'رقم الهاتف:' : 'Phone:'} ${endUser.phoneNumber}` : ''}
            </div>
          </div>` : ''}
        
        <!-- Footer -->
        <div class="footer">
          <div>${isRTL ? 'شكراً لطلبك!' : 'Thank you for your order!'}</div>
          <div class="small">${isRTL ? 'تم إنشاؤه بواسطة Ordrat' : 'Powered by Ordrat'}</div>
        </div>
      </div>
    </body>
    </html>
  `;

  // On Mobile devices, use a simplified approach that works better
  if (isMobile) {
    // For mobile, we'll use a simple approach that's more reliable
    const mobileFrameId = 'mobile-print-frame-' + Date.now();
    const printFrame = document.createElement('iframe');
    printFrame.id = mobileFrameId;
    printFrame.style.width = '1px';
    printFrame.style.height = '1px';
    printFrame.style.position = 'absolute';
    printFrame.style.left = '-9999px';
    printFrame.style.top = '-9999px';
    document.body.appendChild(printFrame);
    
    const frameDoc = printFrame.contentDocument || printFrame.contentWindow?.document;
    if (frameDoc) {
      frameDoc.open();
      frameDoc.write(receiptHtml);
      frameDoc.close();
      
      // The iframe's onload handler will trigger printing
      // and clean up automatically on mobile
    }
    
    return;
  }

  // For desktop, use more advanced methods with printer selection
  
  // Method 2: Generate PDF as fallback
  const generatePdfReceipt = () => {
    try {
      console.log('Falling back to PDF printing method');
      // Convert xPadding to number (remove 'mm')
      const paddingValue = parseInt(xPadding, 10) || 5; // Default to 5mm if parsing fails
      
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, 297], // Thermal receipt size (width, auto height)
      });
      
      if (isRTL) {
        doc.setR2L(true);
      }
      
      // Set font - use standard fonts to avoid loading issues
      doc.setFont(isRTL ? 'helvetica' : 'courier', 'normal');
      doc.setFontSize(10);
      
      // Header
      doc.text(`${isRTL ? `رقم الطلب: ${order?.orderNumber}` : `Order# ${order?.orderNumber}`}`, 40, 10, { align: 'center' });
      doc.setFontSize(8);
      doc.text(`${isRTL ? `التاريخ: ${date} - الوقت: ${time}` : `Date: ${date} - Time: ${time}`}`, 40, 15, { align: 'center' });
      
      // Draw a line - adjusted for padding
      doc.setDrawColor(0);
      doc.setLineWidth(0.1);
      doc.line(paddingValue, 17, 80 - paddingValue, 17);
      
      // Generate table data
      const tableColumn = [
        isRTL ? 'الكمية' : 'Qty', 
        isRTL ? 'المنتج' : 'Item', 
        isRTL ? 'السعر' : 'Price'
      ];
      
      const tableRows: any[] = [];
      
      order?.items?.forEach(item => {
        tableRows.push([
          item.quantity.toString(),
          item.product?.name || '',
          toCurrency(item.itemPrice * item.quantity, lang)
        ]);
        
        // Add variations if any
        item.orderItemVariations?.forEach(variation => {
          variation.choices?.forEach(choice => {
            tableRows.push([
              item.quantity.toString(),
              `${isRTL ? variation.variationNameAr : variation.variationNameEn}: ${isRTL ? choice.choiceNameAr : choice.choiceNameEn}`,
              toCurrency(choice.price * item.quantity, lang)
            ]);
          });
        });
      });
      
      // Calculate available width for the table considering padding
      const availableWidth = 80 - (2 * paddingValue);
      
      // @ts-ignore - jsPDF-AutoTable typing issue
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        theme: 'plain',
        styles: {
          fontSize: 8,
          cellPadding: 1,
        },
        margin: { left: paddingValue, right: paddingValue },
        columnStyles: {
          0: { cellWidth: availableWidth * 0.15 },  // 15% of available width 
          1: { cellWidth: availableWidth * 0.60 },  // 60% of available width
          2: { cellWidth: availableWidth * 0.25, halign: isRTL ? 'left' : 'right' }  // 25% of available width
        },
      });
      
      // Calculate the Y position after the table
      // @ts-ignore - AutoTable API
      const finalY = (doc as any).lastAutoTable.finalY + 5;
      
      // Draw totals
      let y = finalY;
      const leftCol = isRTL ? (80 - paddingValue * 2) : paddingValue;
      const rightCol = isRTL ? paddingValue : (80 - paddingValue);
      
      doc.text(`${isRTL ? 'المجموع الفرعي:' : 'Subtotal:'}`, leftCol, y);
      doc.text(`${toCurrency(subtotal, lang)}`, rightCol, y, { align: isRTL ? 'left' : 'right' });
      y += 4;
      
      doc.text(`${isRTL ? 'رسوم التوصيل:' : 'Delivery:'}`, leftCol, y);
      doc.text(`${toCurrency(shippingFees, lang)}`, rightCol, y, { align: isRTL ? 'left' : 'right' });
      y += 4;
      
      if (serviceCharge > 0) {
        doc.text(`${isRTL ? 'رسوم الخدمة:' : 'Service:'}`, leftCol, y);
        doc.text(`${toCurrency(serviceCharge, lang)}`, rightCol, y, { align: isRTL ? 'left' : 'right' });
        y += 4;
      }
      
      if (vat > 0) {
        doc.text(`${isRTL ? 'ضريبة القيمة المضافة:' : 'VAT:'}`, leftCol, y);
        doc.text(`${toCurrency(vat, lang)}`, rightCol, y, { align: isRTL ? 'left' : 'right' });
        y += 4;
      }
      
      if (discount > 0) {
        doc.text(`${isRTL ? 'الخصم:' : 'Discount:'}`, leftCol, y);
        doc.text(`-${toCurrency(discount, lang)}`, rightCol, y, { align: isRTL ? 'left' : 'right' });
        y += 4;
      }
      
      // Draw a line before total - adjusted for padding
      doc.line(paddingValue, y, 80 - paddingValue, y);
      y += 3;
      
      doc.setFont(isRTL ? 'helvetica' : 'courier', 'bold');
      doc.text(`${isRTL ? 'الإجمالي:' : 'Total:'}`, leftCol, y);
      doc.text(`${toCurrency(total, lang)}`, rightCol, y, { align: isRTL ? 'left' : 'right' });
      y += 6;
      
      // Add address if available - adjusted for padding
      if (order?.address) {
        doc.setFont(isRTL ? 'helvetica' : 'courier', 'bold');
        doc.text(`${isRTL ? 'عنوان التوصيل:' : 'Delivery Address:'}`, paddingValue, y);
        y += 4;
        doc.setFont(isRTL ? 'helvetica' : 'courier', 'normal');
        doc.text(`${order.address.street}`, paddingValue, y);
        y += 4;
        doc.text(`${isRTL ? `شقة: ${order.address.apartmentNumber}, الطابق: ${order.address.floor}` : `Apt: ${order.address.apartmentNumber}, Floor: ${order.address.floor}`}`, paddingValue, y);
        y += 6;
      }
      
      // Add customer info if available - adjusted for padding
      if (endUser) {
        doc.setFont(isRTL ? 'helvetica' : 'courier', 'bold');
        doc.text(`${isRTL ? 'بيانات العميل:' : 'Customer Info:'}`, paddingValue, y);
        y += 4;
        doc.setFont(isRTL ? 'helvetica' : 'courier', 'normal');
        if (endUser.firstName || endUser.lastName) {
          doc.text(`${isRTL ? 'الاسم:' : 'Name:'} ${endUser.firstName || ''} ${endUser.lastName || ''}`, paddingValue, y);
          y += 4;
        }
        if (endUser.phoneNumber) {
          doc.text(`${isRTL ? 'رقم الهاتف:' : 'Phone:'} ${endUser.phoneNumber}`, paddingValue, y);
          y += 6;
        }
      }
      
      // Footer - adjusted for padding
      doc.line(paddingValue, y, 80 - paddingValue, y);
      y += 5;
      doc.setFont(isRTL ? 'helvetica' : 'courier', 'normal');
      doc.text(`${isRTL ? 'شكراً لطلبك!' : 'Thank you for your order!'}`, 40, y, { align: 'center' });
      y += 4;
      doc.setFontSize(7);
      doc.text(`${isRTL ? 'تم إنشاؤه بواسطة Ordrat' : 'Powered by Ordrat'}`, 40, y + 4, { align: 'center' });
      
      // Critical - set pdf print options for thermal printer
      const pdfOptions = {
        orientation: 'portrait',
        unit: 'mm',
        format: [80, 297],
        hotfixes: ['px_scaling'],
      };
      
      // Auto-print directly without showing PDF preview on desktop
      doc.autoPrint();
      window.open(doc.output('bloburl'), '_blank');
      
    } catch (pdfError) {
      console.error("PDF generation failed:", pdfError);
      // Last resort fallback - alert user
      alert(lang === 'ar' ? 'فشل الطباعة. حاول مرة أخرى.' : 'Printing failed. Please try again.');
    }
  };

  // Method 1: Try direct print via iframe
  const printViaIframe = () => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '-9999px';
    iframe.style.bottom = '-9999px';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);
    
    const frameDoc = iframe.contentWindow?.document;
    if (!frameDoc) {
      console.error('Could not access iframe document');
      generatePdfReceipt(); // Fallback to PDF method - renamed function
      return;
    }
    
    frameDoc.open();
    frameDoc.write(receiptHtml);
    frameDoc.close();
    
    // Attempt printer selection if available
    if (printerId && iframe.contentWindow) {
      try {
        // Add some printer-detection diagnostics
        console.log('Attempting to use printer:', printerId);
        
        // Add printer selection meta tag (experimental)
        const printerMeta = frameDoc.createElement('meta');
        printerMeta.name = 'print-printer';
        printerMeta.content = printerId;
        frameDoc.head.appendChild(printerMeta);
        
        // Set page size to thermal receipt
        const style = frameDoc.createElement('style');
        style.textContent = `
          @page {
            size: 72mm auto !important;
            margin: 0mm !important;
          }
        `;
        frameDoc.head.appendChild(style);
      } catch (err) {
        console.warn('Printer selection features not fully supported:', err);
      }
    }
    
    // Print after a short delay
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        
        // Remove the iframe after printing
        document.body.removeChild(iframe);
      } catch (e) {
        console.error('Printing via iframe failed:', e);
        generatePdfReceipt(); // Fallback to PDF method - renamed function
      }
    }, 500);
  };

  // Try direct printing first, with fallback to PDF
  printViaIframe();
};