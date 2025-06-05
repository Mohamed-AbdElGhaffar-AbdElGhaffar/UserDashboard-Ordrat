'use client';

import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import { PaymentGateway, ShopPaymentGateway } from '@/types';

interface PaymentGatewayCardProps {
  gateway: PaymentGateway;
  shopGateway?: ShopPaymentGateway;
  isActive: boolean;
  onClick: () => void;
  lang: string;
}

export const PaymentGatewayCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-gray-200">
    <div className="absolute top-4 end-4">
      <Skeleton width={60} height={20} />
    </div>
    <div className="flex items-center mb-4">
      <Skeleton width={60} height={60} className="me-4 rounded-xl" />
      <div className="flex-1">
        <Skeleton width={120} height={20} className="mb-2" />
        <Skeleton width={200} height={16} />
      </div>
    </div>
    <div className="pt-4 border-t border-gray-200">
      <Skeleton width={150} height={16} />
    </div>
  </div>
);

export default function PaymentGatewayCard({ 
  gateway,
  shopGateway,
  isActive,
  onClick,
  lang
 }: PaymentGatewayCardProps) {
  const text = {
    active: lang === 'ar' ? 'نشط' : 'Active',
    inactive: lang === 'ar' ? 'غير نشط' : 'Inactive',
    unavailable: lang === 'ar' ? 'غير موجود' : 'unavailable',
    configured: lang === 'ar' ? 'تم التفعيل وهو' : 'Activated and',
    enabled: lang === 'ar' ? 'مفعل' : 'Enabled',
    disabled: lang === 'ar' ? 'معطل' : 'Disabled',
    clickToActivate: lang === 'ar' ? 'انقر للتفعيل' : 'Click to activate',
    clickToDeactivate: lang === 'ar' ? 'انقر لإلغاء التفعيل' : 'Click to deactivate',
    clickToAdd: lang === 'ar' ? 'انقر لإضافته في المتجر' : 'Click to add it to the store',
    priority: lang === 'ar' ? 'الأولوية' : 'Priority',
    discription: lang === 'ar' ? 'خدمة بوابة الدفع' : 'Payment gateway service',
  };

  return (
    <div
      className={`
        bg-white rounded-2xl p-6 shadow-md transition-all duration-300 cursor-pointer relative
        border-2 hover:shadow-lg hover:-translate-y-1
        ${isActive 
          ? shopGateway?.isEnabled? 'border-green-500 bg-gradient-to-br from-green-50 to-green-25' 
          : 'border-red-500 bg-gradient-to-br from-red-50 to-red-25'
          : 'border-gray-200 hover:border-red-500'
        }
      `}
      onClick={onClick}
    >
      {/* Status Badge */}
      <div className={`
        absolute top-4 end-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
        ${isActive 
          ? shopGateway?.isEnabled? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg' 
          : 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
          : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
        }
      `}>
        {isActive ? shopGateway?.isEnabled? text.active : text.inactive : text.unavailable}
      </div>

      {/* Gateway Header */}
      <div className="flex items-center mb-4">
        <div className="relative w-15 h-15 me-4 rounded-xl bg-white p-2 border-2 border-gray-200">
          <img
            src={gateway.imageURL}
            alt={gateway.name}
            width={60}
            height={60}
            className="w-[60px] h-[60px] object-contain"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {gateway.name}
          </h3>
          <p className="text-gray-600 text-sm">
            {gateway.description || text.discription}
          </p>
          {isActive && shopGateway && (
            <span className="inline-block mt-2 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
              {text.priority}: {shopGateway.priority}
            </span>
          )}
        </div>
      </div>

      {/* Status Info */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center text-sm font-semibold text-gray-500">
          <span className="me-2">⚙️</span>
          {isActive? shopGateway?.isEnabled? text.clickToDeactivate : text.clickToActivate : text.clickToAdd}
        </div>
      </div>
    </div>
  );
};