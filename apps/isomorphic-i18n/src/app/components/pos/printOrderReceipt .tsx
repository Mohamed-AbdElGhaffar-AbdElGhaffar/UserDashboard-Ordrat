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
 * Prints an order receipt directly to a specific printer
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
  const { date, time } = formatDate(order?.createdAt);
  
  // Calculate totals
  const subtotal = order?.price || 0;
  const shippingFees = order?.shippingFees || 0;
  const serviceCharge = order?.serviceCharge || 0;
  const vat = order?.totalVat || 0;
  const discount = order?.discount || 0;
  const total = order?.totalPrice || 0;

  // Create the HTML receipt content
  const receiptHtml = `
    <!DOCTYPE html>
    <html lang="${isRTL ? 'ar' : 'en'}" dir="${isRTL ? 'rtl' : 'ltr'}">
    <head>
      <meta charset="UTF-8">
      <title>Receipt - Order #${order.orderNumber}</title>
      <style>
        @page { 
          size: 80mm auto; 
          margin: 0mm;
        }
        body {
          font-family: ${isRTL ? "'Arial', sans-serif" : "monospace"};
          margin: 0;
          padding: 8px;
          font-size: 10pt;
          line-height: 1.2;
          width: 80mm;
          background-color: white;
          color: black;
        }
        * {
          box-sizing: border-box;
        }
        .receipt {
          width: 100%;
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
        @media print {
          html, body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            width: 80mm;
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      </style>
    </head>
    <body>
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

  // Direct Print Methods
  
  // Method 1: Print with specific printer using Print.js
  const printWithPrintJS = async () => {
    try {
      // First import the library dynamically
      const printJS = await import('print-js');
      
      // Convert HTML to a data URL or Blob
      const blob = new Blob([receiptHtml], { type: 'text/html' });
      const dataUrl = URL.createObjectURL(blob);
      
      // Print with specific printer if available, otherwise default printer
      printJS.default({
        printable: dataUrl,
        type: 'raw-html',
        documentTitle: `Receipt-${order.orderNumber}`,
        onPrintDialogClose: () => {
          URL.revokeObjectURL(dataUrl);
        },
        // This is where we would set the printer if browser API supported it
        // Unfortunately, direct printer selection isn't fully supported in browsers
        // Newer experimental APIs like WebUSB are starting to enable this
        // The best approach is to use print-js and store the printer preference
        // in the OS, so it automatically selects the right printer
      });
    } catch (error) {
      console.error("PrintJS method failed:", error);
      printWithIframe();  // Fall back to iframe method
    }
  };
  
  // Method 2: Print with hidden iframe (fallback method)
  const printWithIframe = () => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '-9999px';
    iframe.style.bottom = '-9999px';
    iframe.style.width = '80mm';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);
    
    const frameDoc = iframe.contentWindow?.document;
    if (!frameDoc) {
      console.error('Could not access iframe document');
      return;
    }
    
    frameDoc.open();
    frameDoc.write(receiptHtml);
    frameDoc.close();
    
    // Handle specific printer selection if the browser supports it
    if (printerId && iframe.contentWindow?.matchMedia) {
      // Some browsers might support this experimental feature
      // This is not widely supported but showing the approach
      try {
        const mediaQueryList = iframe.contentWindow.matchMedia('print');
        mediaQueryList.addListener(function(mql) {
          if (mql.matches) {
            // Before print
            console.log(`Attempting to use printer: ${printerId}`);
            // This part is theoretical and might not work in all browsers
            const style = document.createElement('style');
            style.textContent = `@page { size: 80mm auto; margin: 0mm; }`;
            iframe.contentDocument?.head.appendChild(style);
          }
        });
      } catch (err) {
        console.warn('Advanced print features not supported', err);
      }
    }
    
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        
        // Clean up after printing
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      } catch (e) {
        console.error('Printing failed:', e);
        printWithWebPrintAPI(); // Try one more method
      }
    }, 300);
  };
  
  // Method 3: Using Web Print API (experimental, for specific printers)
  const printWithWebPrintAPI = async () => {
    try {
      // This is a more modern approach but still experimental
      if ('print' in navigator && printerId) {
        // Using the newer, experimental Web Print API
        // Not widely supported yet but showing the concept
        // In the future, browsers may support direct printer selection
        const blob = new Blob([receiptHtml], { type: 'text/html' });
        
        // @ts-ignore - This is experimental and not in TS definitions
        const printManager = await navigator.print?.getPrinters();
        
        // @ts-ignore
        const printer = printManager?.find((p: any) => p.id === printerId);
        
        if (printer) {
          // @ts-ignore
          await navigator.print.print({
            data: blob,
            printer: printer,
            options: {
              paperWidth: 80,
              paperUnit: 'mm',
              margins: { top: 0, right: 0, bottom: 0, left: 0 }
            }
          });
          
          return; // Success
        }
      }
      // If we get here, it means the Web Print API is not supported or failed
      console.warn('Web Print API not supported or printer not found');
      
      // Fall back to PDF method
      printWithPDF();
    } catch (error) {
      console.error('Web Print API error:', error);
      // Fall back to PDF method
      printWithPDF();
    }
  };
  
  // Method 4: Print with PDF as final fallback
  // Method 4: Print with PDF as final fallback
  const printWithPDF = () => {
    try {
      console.log('Falling back to PDF printing method');
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, 297], // Thermal receipt size
      });
      
      if (isRTL) {
        doc.setR2L(true);
      }
      
      doc.setFont(isRTL ? 'Amiri' : 'courier', 'normal');
      doc.setFontSize(10);
      
      // Header
      doc.text(`${isRTL ? `رقم الطلب: ${order?.orderNumber}` : `Order# ${order?.orderNumber}`}`, 40, 10, { align: 'center' });
      doc.setFontSize(8);
      doc.text(`${isRTL ? `التاريخ: ${date} - الوقت: ${time}` : `Date: ${date} - Time: ${time}`}`, 40, 15, { align: 'center' });
      
      // Draw a line
      doc.setDrawColor(0);
      doc.setLineWidth(0.1);
      doc.line(5, 17, 75, 17);
      
      // Items Table
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
        columnStyles: {
          0: { cellWidth: 8 },
          1: { cellWidth: 47 },
          2: { cellWidth: 20, halign: isRTL ? 'left' : 'right' }
        },
      });
      
      // Calculate the Y position after the table
      // @ts-ignore - AutoTable API
      const finalY = (doc as any).lastAutoTable.finalY + 5;
      
      // Draw totals
      let y = finalY;
      const leftCol = isRTL ? 60 : 10;
      const rightCol = isRTL ? 10 : 70;
      
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
      
      // Draw a line before total
      doc.line(5, y, 75, y);
      y += 3;
      
      doc.setFont(isRTL ? 'Amiri' : 'courier', 'bold');
      doc.text(`${isRTL ? 'الإجمالي:' : 'Total:'}`, leftCol, y);
      doc.text(`${toCurrency(total, lang)}`, rightCol, y, { align: isRTL ? 'left' : 'right' });
      y += 6;
      
      // Add address if available
      if (order?.address) {
        doc.setFont(isRTL ? 'Amiri' : 'courier', 'bold');
        doc.text(`${isRTL ? 'عنوان التوصيل:' : 'Delivery Address:'}`, 10, y);
        y += 4;
        doc.setFont(isRTL ? 'Amiri' : 'courier', 'normal');
        doc.text(`${order.address.street}`, 10, y);
        y += 4;
        doc.text(`${isRTL ? `شقة: ${order.address.apartmentNumber}, الطابق: ${order.address.floor}` : `Apt: ${order.address.apartmentNumber}, Floor: ${order.address.floor}`}`, 10, y);
        y += 6;
      }
      
      // Add customer info if available
      if (endUser) {
        doc.setFont(isRTL ? 'Amiri' : 'courier', 'bold');
        doc.text(`${isRTL ? 'بيانات العميل:' : 'Customer Info:'}`, 10, y);
        y += 4;
        doc.setFont(isRTL ? 'Amiri' : 'courier', 'normal');
        if (endUser.firstName || endUser.lastName) {
          doc.text(`${isRTL ? 'الاسم:' : 'Name:'} ${endUser.firstName || ''} ${endUser.lastName || ''}`, 10, y);
          y += 4;
        }
        if (endUser.phoneNumber) {
          doc.text(`${isRTL ? 'رقم الهاتف:' : 'Phone:'} ${endUser.phoneNumber}`, 10, y);
          y += 6;
        }
      }
      
      // Footer
      doc.line(5, y, 75, y);
      y += 5;
      doc.setFont(isRTL ? 'Amiri' : 'courier', 'normal');
      doc.text(`${isRTL ? 'شكراً لطلبك!' : 'Thank you for your order!'}`, 40, y, { align: 'center' });
      y += 4;
      doc.setFontSize(7);
      doc.text(`${isRTL ? 'تم إنشاؤه بواسطة Ordrat' : 'Powered by Ordrat'}`, 40, y + 4, { align: 'center' });
      
      // Print the PDF
      // Use standard autoPrint without the invalid printToPDF option
      doc.autoPrint();
      
      // Open in a new window, which will trigger the print dialog
      window.open(doc.output('bloburl'), '_blank');
    } catch (pdfError) {
      console.error("PDF generation failed:", pdfError);
      alert(lang === 'ar' ? 'فشل الطباعة. حاول مرة أخرى.' : 'Printing failed. Please try again.');
    }
  };
  
  // Start with the most advanced method first, with fallbacks
  if (printerId) {
    try {
      // Try to import print-js dynamically
      import('print-js')
        .then(() => {
          printWithPrintJS();
        })
        .catch(() => {
          // If PrintJS isn't available, try WebPrintAPI
          printWithWebPrintAPI();
        });
    } catch (e) {
      // If import fails, go to iframe method
      printWithIframe();
    }
  } else {
    // No printer ID, use standard iframe method
    printWithIframe();
  }
};