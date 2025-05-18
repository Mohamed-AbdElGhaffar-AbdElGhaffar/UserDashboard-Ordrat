'use client';

import { useRef } from 'react';
import { Button } from 'rizzui';
import { PiPrinterBold } from 'react-icons/pi';
import { useReactToPrint } from 'react-to-print';
import { toCurrency } from '@utils/to-currency';
import { format } from 'date-fns';
import cn from '@utils/class-names';

const PrintInvoice = ({ order, lang }:{order: any; lang:string;}) => {
  const printRef = useRef(null);
  const isRTL = lang === 'ar';

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Invoice-${order?.orderNumber || ''}`,
    // Define the print style to ensure it fits an 80mm receipt printer
    pageStyle: `
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
    `,
  });

  const formatDate = (dateString: any) => {
    try {
      const date = new Date(dateString);
      return {
        date: format(date, 'yyyy/MM/dd'),
        time: format(date, 'hh:mm:ss a')
      };
    } catch (error) {
      return { date: 'N/A', time: 'N/A' };
    }
  };

  const { date, time } = formatDate(order?.createdAt);
  console.log("order?.items: ",order?.items);
  
  return (
    <>
      <Button className='w-auto' onClick={handlePrint}>
        <PiPrinterBold className={cn("h-[17px] w-[17px]", isRTL ? "ms-1.5" : "me-1.5")} />
        <span className='hidden sm:block'>{isRTL ? 'فاتورة' : 'Invoice'}</span>
      </Button>
      
      <div className="hidden">
        <div 
          ref={printRef} 
          className="p-2"
          dir={isRTL ? "rtl" : "ltr"}
          style={{ 
            width: "302px", /* 80mm at 96 DPI */
            maxWidth: "302px",
            textAlign: isRTL ? "right" : "left",
            fontFamily: isRTL ? "Arial, sans-serif" : "monospace",
            fontSize: "9pt",
            lineHeight: "1.2",
            /* Ensure no margins or padding that would break the receipt format */
            boxSizing: "border-box"
          }}
        >
          {/* Header Section - Centered */}
          <div style={{ textAlign: "center", marginBottom: "8px" }}>
            {/* <div style={{ fontWeight: "bold", fontSize: "12pt", marginBottom: "4px" }}>
              {isRTL ? 'فاتورة الطلب' : 'Order Receipt'}
            </div> */}
            <div style={{ border: "1px solid black", marginBottom: "8px", paddingBottom: "4px" }}>
              <div style={{ 
                fontWeight: "bold", 
                textAlign: "center", 
                // borderBottom: "1px solid black", 
                padding: "2px"
              }}>
                {isRTL ? `رقم الطلب: ${order?.orderNumber}` : `Order# ${order?.orderNumber}`}
              </div>
              {/* <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                padding: "2px 4px",
                fontSize: "8pt"
              }}>
                <span>{isRTL ? 'تاريخ الطباعة:' : 'Printed At:'}</span>
                <span>{format(new Date(), 'yyyy/MM/dd hh:mm a')}</span>
              </div>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                padding: "2px 4px",
                fontSize: "8pt"
              }}>
                <span>{isRTL ? 'تاريخ الطلب:' : 'Order Date:'}</span>
                <span>{date}</span>
              </div>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                padding: "2px 4px",
                fontSize: "8pt"
              }}>
                <span>{isRTL ? 'وقت الطلب:' : 'Order Time:'}</span>
                <span>{time}</span>
              </div> */}
            </div>
          </div>

          {/* Items Table */}
          <table style={{ 
            width: "100%", 
            borderBottom: "1px solid black", 
            marginBottom: "8px",
            borderCollapse: "collapse",
            fontSize: "8pt"
          }}>
            <thead>
              <tr style={{ borderBottom: "1px solid black" }}>
                <th style={{ 
                  textAlign: isRTL ? "right" : "left", 
                  padding: "2px",
                  width: "10%"
                }}>{isRTL ? 'الكمية' : 'Qty'}</th>
                <th style={{ 
                  textAlign: isRTL ? "right" : "left",
                  padding: "2px",
                  width: "65%"
                }}>{isRTL ? 'المنتج' : 'Item'}</th>
                <th style={{ 
                  textAlign: isRTL ? "left" : "right",
                  padding: "2px",
                  width: "25%"
                }}>{isRTL ? 'السعر' : 'Price'}</th>
              </tr>
            </thead>
            <tbody>
              {order?.items?.map((item:any, index:any) => (
                <>
                <tr key={item.id || index} style={{ borderBottom: "1px dashed #d1d5db" }}>
                  <td style={{ padding: "2px" }}>{item.quantity}</td>
                  <td style={{ padding: "2px" }}>
                    {item.product?.name}
                    {/* {item.orderItemVariations?.map((variation:any) => (
                      <div key={variation.variationId} style={{ fontSize: "7pt" }}>
                        {variation.choices?.map((choice:any) => (
                          <div key={choice.choiceId} style={{ 
                            marginLeft: isRTL ? "0" : "6px",
                            marginRight: isRTL ? "6px" : "0"
                          }}>
                            - {isRTL ? variation.variationNameAr : variation.variationNameEn}: {isRTL ? choice.choiceNameAr : choice.choiceNameEn}
                          </div>
                        ))}
                      </div>
                    ))} */}
                  </td>
                  <td style={{ 
                    textAlign: isRTL ? "left" : "right", 
                    padding: "2px" 
                  }}>
                    {toCurrency(item.itemPrice * item.quantity, lang)}
                  </td>
                </tr>
                {item.orderItemVariations?.map((variation:any) => (
                  <>
                    {variation.choices?.map((choice:any) => (
                      <tr key={item.id || index} style={{ borderBottom: "1px dashed #d1d5db" }}>
                        <td style={{ padding: "2px" }}>{item.quantity}</td>
                        <td style={{ padding: "2px" }}>
                          {isRTL ? variation.variationNameAr : variation.variationNameEn}: {isRTL ? choice.choiceNameAr : choice.choiceNameEn}
                        </td>
                        <td style={{ 
                          textAlign: isRTL ? "left" : "right", 
                          padding: "2px" 
                        }}>
                          {toCurrency(choice.price * item.quantity, lang)}
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
                </>
              ))}
            </tbody>
          </table>

          {/* Totals Section */}
          <div style={{ marginBottom: "8px", fontSize: "8pt" }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              marginBottom: "2px" 
            }}>
              <span>{isRTL ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
              <span>{toCurrency(order?.price || 0, lang)}</span>
            </div>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              marginBottom: "2px" 
            }}>
              <span>{isRTL ? 'رسوم التوصيل:' : 'Shipping:'}</span>
              <span>{toCurrency(order?.shippingFees || 0, lang)}</span>
            </div>
            {(order?.totalVat > 0) && (
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                marginBottom: "2px" 
              }}>
                <span>{isRTL ? 'ضريبة القيمة المضافة:' : 'VAT:'}</span>
                <span>{toCurrency(order?.totalVat || 0, lang)}</span>
              </div>
            )}
            {(order?.discount > 0) && (
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                marginBottom: "2px" 
              }}>
                <span>{isRTL ? 'الخصم:' : 'Discount:'}</span>
                <span>-{toCurrency(order?.discount || 0, lang)}</span>
              </div>
            )}
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              fontWeight: "bold", 
              borderTop: "1px solid black", 
              paddingTop: "4px",
              fontSize: "9pt"
            }}>
              <span>{isRTL ? 'الإجمالي:' : 'Total:'}</span>
              <span>{toCurrency(order?.totalPrice || 0, lang)}</span>
            </div>
          </div>

          {/* Address Section */}
          {order?.address && (
            <div style={{ 
              borderTop: "1px solid black", 
              paddingTop: "4px", 
              marginBottom: "8px",
              fontSize: "8pt"
            }}>
              <div style={{ fontWeight: "bold", marginBottom: "2px" }}>
                {isRTL ? 'عنوان التوصيل:' : 'Delivery Address:'}
              </div>
              <div>
                {order.address.street}
                <br/>
                {isRTL 
                  ? `شقة: ${order.address.apartmentNumber}, الطابق: ${order.address.floor}` 
                  : `Apt: ${order.address.apartmentNumber}, Floor: ${order.address.floor}`
                }
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{ 
            textAlign: "center", 
            borderTop: "1px solid black", 
            paddingTop: "4px",
            fontSize: "8pt"
          }}>
            <div>{isRTL ? 'شكراً لطلبك!' : 'Thank you for your order!'}</div>
            <div style={{ marginTop: "4px" }}>
              {isRTL ? 'تم إنشاؤه بواسطة Ordrat' : 'Powered by Ordrat'}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrintInvoice;