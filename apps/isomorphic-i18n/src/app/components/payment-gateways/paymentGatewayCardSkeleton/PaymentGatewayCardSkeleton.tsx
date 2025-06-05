import Skeleton from "react-loading-skeleton";

export default function  PaymentGatewayCardSkeleton (){
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
};