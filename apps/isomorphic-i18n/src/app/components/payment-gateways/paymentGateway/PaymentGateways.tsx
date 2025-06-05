'use client';

import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import PaymentGatewayCard, { PaymentGatewayCardSkeleton } from '../paymentGatewayCard/PaymentGatewayCard';
import { useEffect, useState } from 'react';
import axiosClient from '../../context/api';
import { useUserContext } from '../../context/UserContext';
import { GetCookiesClient } from '../../ui/getCookiesClient/GetCookiesClient';
import { PaymentGateway, ShopPaymentGateway } from '@/types';
import { useModal } from '@/app/shared/modal-views/use-modal';
import ConfigModal from '../configModal/ConfigModal';

interface PaymentGatewayProps {
  lang: string;
}

export default function PaymentGateways({
  lang
 }: PaymentGatewayProps) {
  const text = {
    title: lang === 'ar' ? 'إدارة بوابات الدفع' : 'Payment Gateway Manager',
    subtitle: lang === 'ar' ? 'إدارة وتكوين طرق الدفع لمتجرك' : 'Manage and configure payment methods for your shop',
    loadGateways: lang === 'ar' ? 'تحميل بوابات الدفع' : 'Load Payment Gateways',
    noGateways: lang === 'ar' ? 'لا توجد بوابات دفع متاحة' : 'No Payment Gateways Available',
    noGatewaysDesc: lang === 'ar' ? 'لا توجد بوابات دفع في النظام' : 'No payment gateways found in the system',
    enterShopId: lang === 'ar' ? 'أدخل معرف المتجر أعلاه لعرض وتكوين بوابات الدفع المتاحة' : 'Enter your shop ID above to view and configure available payment gateways',
    loading: lang === 'ar' ? 'جاري تحميل بوابات الدفع...' : 'Loading payment gateways...',
    loadSuccess: lang === 'ar' ? 'تم تحميل بوابات الدفع بنجاح' : 'Payment gateways loaded successfully',
    loadError: lang === 'ar' ? 'خطأ في تحميل بوابات الدفع' : 'Error loading payment gateways',
    configError: lang === 'ar' ? 'خطأ في تحميل حقول التكوين' : 'Error loading configuration fields',
    saveSuccess: lang === 'ar' ? 'تم حفظ تكوين بوابة الدفع بنجاح!' : 'Payment gateway configuration saved successfully!',
    saveError: lang === 'ar' ? 'خطأ في حفظ التكوين' : 'Error saving configuration',
    deleteSuccess: lang === 'ar' ? 'تم حذف تكوين بوابة الدفع بنجاح!' : 'Payment gateway configuration deleted successfully!',
    deleteError: lang === 'ar' ? 'خطأ في حذف التكوين' : 'Error deleting configuration',
    configureGateway: lang === 'ar' ? 'تكوين بوابة الدفع' : 'Configure Payment Gateway',
    updateGateway: lang === 'ar' ? 'تحديث بوابة الدفع' : 'Update Payment Gateway',
  };
  const [loading, setLoading] = useState(false);
  const [allGateways, setAllGateways] = useState<PaymentGateway[]>([]);
  const [shopGateways, setShopGateways] = useState<ShopPaymentGateway[]>([]);
  const { paymentGateway, setPaymentGateway } = useUserContext();
  const shopId = GetCookiesClient('shopId') as string;
  const { openModal } = useModal();

  const fetchPaymentGatewayData = async () => {
    try {
      const response = await axiosClient.get('/api/PaymentGateway/GetAll', {
        headers: {
          'Accept-Language': lang,
        },
      });
      console.log("PaymentGateway: ",response.data);
      setAllGateways(response.data);
    } catch (error) {
      console.error('Error loading payment gateways:', error);
    }
  };

  const fetchShopPaymentGatewayData = async () => {
    try {
      const response = await axiosClient.get(`/api/ShopPaymentGateway/GetByShopId/${shopId}`, {
        headers: {
          'Accept-Language': lang,
        },
      });
      console.log("ShopPaymentGateway: ",response.data);
      
      setShopGateways(response.data);
    } catch (error) {
      console.error('Error loading shop gateways:', error);
      setShopGateways([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchPaymentGatewayData(),
          fetchShopPaymentGatewayData(),
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lang, shopId]);

  useEffect(() => {
    if (paymentGateway) {
      fetchPaymentGatewayData();
      fetchShopPaymentGatewayData();
      setPaymentGateway(false);
    }
  }, [paymentGateway]);


  useEffect(() => {
    if (paymentGateway == true) {
      fetchPaymentGatewayData();
      fetchShopPaymentGatewayData();
      setPaymentGateway(false);
    }
  }, [paymentGateway]); 

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <PaymentGatewayCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (allGateways.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">
          ❌ {text.noGateways}
        </h3>
        <p className="text-gray-600">
          {text.noGatewaysDesc}
        </p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {allGateways.map(gateway => {
        const shopGateway = shopGateways.find(sg => sg.gatewayId === gateway.id);
        const isActive = !!shopGateway;
        
        return (
          <PaymentGatewayCard
            key={gateway.id}
            gateway={gateway}
            shopGateway={shopGateway}
            isActive={isActive}
            onClick={() => {
              openModal({
                view: (
                  <ConfigModal
                    title={gateway.name}
                    gatewayId={gateway.id}
                    shopGateway={shopGateway}
                    gatewayName={gateway.name}
                    isUpdate={isActive}
                    onSave={()=>{}}
                    lang={lang}
                  />
                ),
                customSize: '800px',
              });
            }}
            lang={lang}
          />
        );
      })}
    </div>
  );
};