'use client';
import Image from 'next/image';
import { Suspense, useState } from 'react';
import { 
  MapPin, 
  Star, 
  Clock, 
  Truck, 
  Send, 
  Phone, 
  Calendar, 
  ChevronRight, 
  BadgeCheck, 
  Shield, 
  Zap, 
  User,
  StarIcon
} from 'lucide-react';
import GoogleMap from '../GoogleMap/GoogleMap';
import { Button } from 'rizzui';
import user from '@public/assets/user.png';
import Link from 'next/link';
import ImageViewerModal from '../../ui/Chat/ImageViewerModal/ImageViewerModal';
import { RoleClientExist } from '../../ui/roleClientExist/RoleClientExist';
import { FaCalendarAlt, FaCalendarCheck, FaClock, FaEnvelope, FaIdCard, FaMapMarkerAlt, FaPhoneAlt, FaRoute, FaStar, FaStarHalfAlt, FaTruck } from 'react-icons/fa';

// Define enums and types
enum VehicleType {
  Bicycle = 0,
  Motorcycle = 1,
  Car = 2,
  Van = 3,
  Truck = 4
}

type Zone = {
  id: string;
  name: string;
  coverageRadius: number;
  centerLatitude: number;
  centerLongitude: number;
};

type DriverDetail = {
  id: string;
  createdAt: string;
  isAvailable: boolean;
  personalPhotoUrl: string;
  personalVerificationCardFrontUrl: string;
  personalVerificationCardBackUrl: string;
  vehicleLicenseFrontUrl: string;
  vehicleLicenseBackUrl: string;
  vehicleFrontImageUrl: string;
  vehicleBackImageUrl: string;
  deliveryStatus: number;
  branchId: string;
  zone: Zone;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  vehicleType: number;
};

type OrderStats = {
  deliveredOrders: number;
  deliveringOrders: number;
};

type DriverDetailsProps = {
  lang: string;
  driverDetails: DriverDetail[];
  orderStats: OrderStats;
};

// Stat Card Component
function StatCard({ 
  icon, 
  value, 
  label, 
  color 
}: { 
  icon: React.ReactNode; 
  value: string | number; 
  label: string; 
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center text-center">
      <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <span className="text-2xl font-bold mb-1">{value}</span>
      <span className="text-sm text-gray-500">{label}</span>
    </div>
  );
}

// Review Card Component
function ReviewCard({ 
  image, 
  name, 
  date, 
  rating, 
  comment,
  isRTL
}: { 
  image: string; 
  name: string; 
  date: string; 
  rating: number; 
  comment: string;
  isRTL: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 mb-4">
      <div className="flex items-center mb-4">
        <div className="relative w-12 h-12 overflow-hidden rounded-full mr-3">
          <img
            src={image}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{name}</h4>
          <div className="flex items-center mt-1">
            <span className="text-xs text-gray-500 mr-2">{date}</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={`${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="text-gray-600 text-sm">{comment}</p>
    </div>
  );
}

// Certificate Card Component
function CertificateCard({
  title,
  imageUrl,
  icon,
  isRTL
}: {
  title: string;
  imageUrl: string;
  icon: React.ReactNode;
  isRTL: boolean;
}) {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  
  return (
    <>
      <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
        <div className="relative h-40 3xl:h-52 4xl:h-56 w-full cursor-zoom-in" onClick={()=>setImageModalOpen(true)}>
          <div className="relative w-full h-full">
            <img
              src={imageUrl}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
        <div className="p-4 flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            {icon}
          </div>
          <h3 className="font-medium text-gray-900">{title}</h3>
        </div>
      </div>
      <ImageViewerModal
        isOpen={imageModalOpen}
        imageUrl={imageUrl}
        alt={title}
        onClose={() => setImageModalOpen(false)}
      />
    </>
  );
}

// Certificate Card Component
function CertificateCard2({
  title,
  imageUrl,
  key
}: {
  title: string;
  imageUrl: string;
  key:any;
}) {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  
  return (
    <>
      <div key={key} className="cursor-pointer border rounded-lg p-2 text-center shadow-md hover:shadow-lg transition-all duration-300"  onClick={()=>setImageModalOpen(true)}>
        <p className="text-sm text-gray-600 mb-2">{title}</p>
        {/* <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
          <FaIdCard className="text-gray-400 text-2xl" />
        </div> */}
        <div className="h-32 bg-gray-100 rounded overflow-hidden">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        </div>
      </div>             
      <ImageViewerModal
        isOpen={imageModalOpen}
        imageUrl={imageUrl}
        alt={title}
        onClose={() => setImageModalOpen(false)}
      />
    </>
  );
}

function formatDateDMYYYY(dateString: string) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function DriverDetails({
  lang,
  driverDetails,
  orderStats
}: DriverDetailsProps) {
  const isRTL = lang === 'ar';
  const driver = driverDetails[0]; // Assuming we're displaying the first driver in the array
  console.log("driverDetails: ",driver);
  
  // Calculate driver experience in months
  const createdDate = new Date(driver.createdAt);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate.getTime() - createdDate.getTime());
  const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
  
  const totalOrders = orderStats.deliveredOrders + orderStats.deliveringOrders;
  
  const text = {
    // Header
    pageTitle: isRTL ? 'تفاصيل السائق' : 'Driver Details',
    
    // Profile
    status: isRTL ? 'متاح الآن' : 'Available Now',
    unavailable: isRTL ? 'غير متاح' : 'Unavailable',
    contact: isRTL ? 'اتصال' : 'Contact',
    message: isRTL ? 'رسالة' : 'Message',
    phone: isRTL ? 'الهاتف' : 'Phone',
    joined: isRTL ? 'تاريخ الانضمام' : 'Joined',
    avgDestance: isRTL ? 'متوسط مسافة التوصيل' : 'Average delivery distance',
    avgTime: isRTL ? 'متوسط وقت التوصيل' : 'Average delivery time',
    minute: isRTL ? 'دقيقة' : 'minute',
    infoDriver: isRTL ? 'معلومات السائق' : 'Driver information',
    
    // Vehicle
    vehicleTitle: isRTL ? 'معلومات المركبة' : 'Vehicle Information',
    bicycle: isRTL ? 'دراجة هوائية' : 'Bicycle',
    motorcycle: isRTL ? 'دراجة نارية' : 'Motorcycle',
    car: isRTL ? 'سيارة' : 'Car',
    van: isRTL ? 'شاحنة صغيرة' : 'Van',
    truck: isRTL ? 'شاحنة' : 'Truck',
    plateNumber: isRTL ? 'رقم اللوحة' : 'Plate Number',
    
    // Stats
    statsTitle: isRTL ? 'إحصائيات الأداء' : 'Performance Stats',
    rating: isRTL ? 'التقييم' : 'Rating',
    onTime: isRTL ? 'في الوقت المحدد' : 'On Time',
    deliveries: isRTL ? 'التوصيلات' : 'Deliveries',
    experience: isRTL ? 'الخبرة' : 'Experience',
    months: isRTL ? 'شهر' : 'months',
    
    // Delivery Zone
    zoneTitle: isRTL ? 'منطقة التوصيل' : 'Delivery Zone',
    coverageRadius: isRTL ? 'نطاق التغطية' : 'Coverage Radius',
    meters: isRTL ? 'متر' : 'm',
    
    // Reviews
    reviewsTitle: isRTL ? 'آراء العملاء' : 'Customer Reviews',
    viewAll: isRTL ? 'عرض الكل' : 'View All',
    addReview: isRTL ? 'إضافة تقييم' : 'Add Review',
    daysAgo: isRTL ? 'منذ أيام' : 'days ago',
    
    // Documents
    documentsTitle: isRTL ? 'المستندات والشهادات' : 'Documents & Certificates',
    frontPersonalId: isRTL ? 'بطاقة الهوية الشخصية الأمامية' : 'Front Personal ID',
    backPersonalId: isRTL ? 'بطاقة الهوية الشخصية الخلفية' : 'Back Personal ID',
    frontDrivingLicense: isRTL ? 'رخصة القيادة الأمامية' : 'Front Driving License',
    backDrivingLicense: isRTL ? 'رخصة القيادة الخلفية' : 'Back Driving License',
    frontVehicleRegistration: isRTL ? 'تسجيل المركبة الأمامية' : 'Front Vehicle Registration',
    backVehicleRegistration: isRTL ? 'تسجيل المركبة الخلفية' : 'Back Vehicle Registration',
  };

  // Get vehicle type text
  const getVehicleTypeText = (type: number) => {
    switch(type) {
      case VehicleType.Bicycle: return text.bicycle;
      case VehicleType.Motorcycle: return text.motorcycle;
      case VehicleType.Car: return text.car;
      case VehicleType.Van: return text.van;
      case VehicleType.Truck: return text.truck;
      default: return text.motorcycle;
    }
  };
  
  // Get vehicle icon based on type
  const getVehicleIcon = (type: number) => {
    switch(type) {
      case VehicleType.Bicycle:
        return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-blue-600"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2"/></svg>;
      case VehicleType.Motorcycle:
        return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-red-600"><path d="M4.5 14.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm15 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/><path d="M5 12h1.5l3.5-5h4l2 5h1l2-4h2.5"/><path d="M13 6h1.5l3.5 5.5"/><path d="M8 12h10"/></svg>;
      default:
        return <Truck className="w-5 h-5 text-indigo-600" />;
    }
  };

  // Mock review data (would ideally come from API)
  const reviews = [
    {
      id: 1,
      name: isRTL ? 'أحمد محمد' : 'Ahmed Mohamed',
      image: user.src,
      date: isRTL ? 'منذ 2 يوم' : '2 days ago',
      rating: 5,
      comment: isRTL 
        ? 'ممتاز في التعامل مع الطلبات، دائما يوصل بسرعة وأي مشكلة يحلها فوراً. شكراً!' 
        : 'Excellent in handling orders, always delivers quickly and solves any issues immediately. Thanks!'
    },
    {
      id: 2,
      name: isRTL ? 'سارة أحمد' : 'Sara Ahmed',
      image: user.src,
      date: isRTL ? 'منذ 5 أيام' : '5 days ago',
      rating: 4,
      comment: isRTL 
        ? 'سريع ومهذب، لكن كان هناك تأخير بسيط في المرة الأخيرة.' 
        : 'Fast and polite, but there was a slight delay the last time.'
    }
  ];

  const chatButton = RoleClientExist([
    'delivery-chat',
  ]);

  return (
    // <div className={`min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-10 ${isRTL ? 'text-right' : 'text-left'}
    // mb-[-1.5rem] lg:mb-[-2rem] 4xl:mb-[-2.25rem] md:mx-[-1.25rem] lg:mx-[-1.5rem] 3xl:mx-[-2rem] 4xl:mx-[-2.5rem] mt-[-24px] lg:mt-[-28px]`} dir={isRTL ? 'rtl' : 'ltr'}>
    //   {/* Header Section */}
    //   <header className="p-4">
    //     <div className="w-fit mx-auto flex items-center justify-between">
    //       {/* <button className="flex items-center text-gray-800 hover:text-blue-600 transition-colors">
    //         <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isRTL ? 'ml-1' : 'mr-1'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRTL ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
    //         </svg>
    //         <span className="text-sm font-medium">Back</span>
    //       </button> */}
    //       {/* <div className="w-24"></div> Spacer for alignment */}
    //       <h1 className="text-xl font-bold text-gray-900">{text.pageTitle}</h1>
    //       {/* <div className="w-24"></div> Spacer for alignment */}
    //     </div>
    //   </header>

    //   <main className="max-w-full mx-auto px-4 pt-6">
    //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
    //       {/* Profile Card Section */}
    //       <div className="md:col-span-1 lg:col-span-1">
    //         <div className="rounded-2xl transition-all duration-300 p-6 relative overflow-hidden">
    //           {/* Status Badge */}
    //           <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} px-3 py-1 rounded-full text-xs font-medium ${driver.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
    //             {driver.isAvailable ? text.status : text.unavailable}
    //           </div>
              
    //           {/* Driver Photo */}
    //           <div className="flex flex-col items-center">
    //             <div className="relative w-24 h-24 mb-4">
    //               <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
    //               <img
    //                 src={driver.personalPhotoUrl}
    //                 alt={`${driver.firstName} ${driver.lastName}`}
    //                 width={96}
    //                 height={96}
    //                 className="w-full h-full object-cover"
    //               />
    //               </div>
    //               <div className={`absolute bottom-0 ${isRTL ? 'left-0' : 'right-0'} w-8 h-8 rounded-full flex items-center justify-center border-2 border-white`}>
    //                 {getVehicleIcon(driver.vehicleType)}
    //               </div>
    //             </div>
                
    //             <h2 className="text-xl font-bold text-gray-900 mb-1">{`${driver.firstName} ${driver.lastName}`}</h2>
    //             <p className="text-gray-500 text-sm mb-4">{getVehicleTypeText(driver.vehicleType)} • ID: {driver.id.substring(0, 8)}</p>
                
    //             {/* Rating Stars */}
    //             <div className="flex items-center mb-4">
    //               {[...Array(5)].map((_, i) => (
    //                 <Star
    //                   key={i}
    //                   size={20}
    //                   className={`${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} mx-0.5`}
    //                 />
    //               ))}
    //               <span className="ml-2 text-gray-600 font-medium">4.8</span>
    //             </div>
                
    //             {/* Contact Buttons */}
    //             <div className="flex w-full gap-3 mb-4">
    //               <Link href={`tel:${driver.phoneNumber}`} className='flex-1'>
    //                 <Button className="w-full h-full rounded-xl py-3 flex items-center justify-center gap-2 transition-colors">
    //                   <Phone size={18} />
    //                   <span>{text.contact}</span>
    //                 </Button>
    //               </Link>
    //               {chatButton &&(
    //                 <Link href={`https://wa.me/${driver.phoneNumber}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-gray-100 text-gray-800 rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
    //                   <Send size={18} />
    //                   <span>{text.message}</span>
    //                 </Link>
    //               )}
    //             </div>
                
    //             {/* Contact Details */}
    //             <div className="w-full">
    //               <div className="border-t border-gray-100 pt-4 pb-2">
    //                 <div className="flex items-center py-2">
    //                   <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
    //                     <Phone size={16} className="text-blue-600" />
    //                   </div>
    //                   <div className="flex-1">
    //                     <p className="text-sm text-gray-500 mb-0.5">{text.phone}</p>
    //                     <p className="font-medium">{driver.phoneNumber}</p>
    //                   </div>
    //                 </div>
    //                 <div className="flex items-center py-2">
    //                   <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
    //                     <Calendar size={16} className="text-green-600" />
    //                   </div>
    //                   <div className="flex-1">
    //                     <p className="text-sm text-gray-500 mb-0.5">{text.joined}</p>
    //                     <p className="font-medium">{formatDateDMYYYY(driver.createdAt)}</p>
    //                   </div>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
          
    //       {/* Stats Section */}
    //       <div className="md:col-span-1 lg:col-span-2">
    //         <h2 className="text-xl font-bold text-gray-900 mb-4">{text.statsTitle}</h2>
    //         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    //           <StatCard 
    //             icon={<Star size={24} className="text-yellow-600" />} 
    //             value="4.8" 
    //             label={text.rating} 
    //             color="bg-yellow-100" 
    //           />
    //           <StatCard 
    //             icon={<Clock size={24} className="text-purple-600" />} 
    //             value="98%" 
    //             label={text.onTime} 
    //             color="bg-purple-100" 
    //           />
    //           <StatCard 
    //             icon={<Truck size={24} className="text-blue-600" />} 
    //             value={totalOrders > 0 ? totalOrders : 52} 
    //             label={text.deliveries} 
    //             color="bg-blue-100" 
    //           />
    //           <StatCard 
    //             icon={<BadgeCheck size={24} className="text-green-600" />} 
    //             value={`${diffMonths} ${text.months}`}
    //             label={text.experience} 
    //             color="bg-green-100" 
    //           />
    //         </div>
            
    //         {/* Delivery Zone Map */}
    //         <h2 className="text-xl font-bold text-gray-900 mb-4">{text.zoneTitle}</h2>
    //         <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden mb-6">
    //           <div className="relative h-64 w-full">
    //             {/* Map visualization */}
    //             <GoogleMap
    //               centerLatitude={driver.zone.centerLatitude} 
    //               centerLongitude={driver.zone.centerLongitude} 
    //               coverageRadius={driver.zone.coverageRadius}
    //             />
    //             {/* Map overlay */}
    //             <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white to-transparent h-16"></div>
    //           </div>
    //           <div className="p-4">
    //             <div className="flex items-center justify-between mb-2">
    //               <h3 className="font-medium text-gray-900">{driver.zone.name}</h3>
    //               <span className="text-sm text-gray-500">{`${driver.zone.coverageRadius} ${text.meters}`}</span>
    //             </div>
    //             <p className="text-sm text-gray-600 mb-3">
    //               {`${text.coverageRadius}: ${driver.zone.coverageRadius}m`}
    //             </p>
    //             <div className="flex items-center text-xs text-gray-500">
    //               <MapPin size={14} className="mr-1 text-gray-400" />
    //               <span>{`${driver.zone.centerLatitude.toFixed(4)}, ${driver.zone.centerLongitude.toFixed(4)}`}</span>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
          
    //       {/* Documents & Certificates Section */}
    //       <div className="md:col-span-2 lg:col-span-3">
    //         <h2 className="text-xl font-bold text-gray-900 mb-4">{text.documentsTitle}</h2>
    //         <div className="grid grid-cols-1 md:grid-cols-3 3xl:grid-cols-4 gap-6 mb-8">
    //           <CertificateCard 
    //             title={text.frontPersonalId}
    //             imageUrl={driver.personalVerificationCardFrontUrl}
    //             icon={<Shield size={20} className="text-blue-600" />}
    //             isRTL={isRTL}
    //           />
    //           <CertificateCard 
    //             title={text.backPersonalId}
    //             imageUrl={driver.personalVerificationCardBackUrl}
    //             icon={<Shield size={20} className="text-blue-600" />}
    //             isRTL={isRTL}
    //           />
    //           <CertificateCard 
    //             title={text.frontDrivingLicense}
    //             imageUrl={driver.vehicleLicenseFrontUrl}
    //             icon={<BadgeCheck size={20} className="text-green-600" />}
    //             isRTL={isRTL}
    //           />
    //           <CertificateCard 
    //             title={text.backDrivingLicense}
    //             imageUrl={driver.vehicleLicenseBackUrl}
    //             icon={<BadgeCheck size={20} className="text-green-600" />}
    //             isRTL={isRTL}
    //           />
    //           <CertificateCard 
    //             title={text.frontVehicleRegistration}
    //             imageUrl={driver.vehicleFrontImageUrl}
    //             icon={<Zap size={20} className="text-purple-600" />}
    //             isRTL={isRTL}
    //           />
    //           <CertificateCard 
    //             title={text.backVehicleRegistration}
    //             imageUrl={driver.vehicleBackImageUrl}
    //             icon={<Zap size={20} className="text-purple-600" />}
    //             isRTL={isRTL}
    //           />
    //         </div>
    //       </div>
          
    //       {/* Customer Reviews Section */}
    //       {/* <div className="md:col-span-2 lg:col-span-3">
    //         <div className="flex items-center justify-between mb-4">
    //           <h2 className="text-xl font-bold text-gray-900">{text.reviewsTitle}</h2>
    //           <button className="text-blue-600 text-sm flex items-center gap-1">
    //             {text.viewAll}
    //             <ChevronRight size={16} className={isRTL ? "transform rotate-180" : ""} />
    //           </button>
    //         </div>
            
    //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 mb-6">
    //           {reviews.map((review) => (
    //             <ReviewCard
    //               key={review.id}
    //               image={review.image}
    //               name={review.name}
    //               date={review.date}
    //               rating={review.rating}
    //               comment={review.comment}
    //               isRTL={isRTL}
    //             />
    //           ))}
    //         </div>
            
    //         <button className="w-full bg-gray-100 text-gray-800 rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
    //           <User size={18} />
    //           <span>{text.addReview}</span>
    //         </button>
    //       </div> */}
          
    //     </div>
    //   </main>
    // </div>
    <div className="w-full space-y-6">
      <div className="w-full bg-white rounded-lg shadow-sm p-6">
        <div className="w-full flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0">
          <div className='flex items-center gap-2 flex-grow w-full sm:w-[calc(100%-220px)]'>
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-xl text-gray-500">
              <img
                src={driver.personalPhotoUrl}
                alt={`${driver.firstName} ${driver.lastName}`}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="me-4 flex-grow w-[calc(100%-72px)]">
              <div className="flex items-center">
                <h2 className="text-lg font-bold truncate overflow-hidden whitespace-nowrap max-w-[calc(100%-64px)]">{`${driver.firstName} ${driver.lastName}`}</h2>
                <span className={`inline-block px-2 py-1 ${driver.isAvailable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} rounded-full text-xs ms-2`}>{driver.isAvailable ? text.status : text.unavailable}</span>
              </div>
              <p className="text-gray-600 text-sm">{getVehicleTypeText(driver.vehicleType)} • ID: {driver.id.substring(0, 8)}</p>
              <div className="flex items-center mt-1 space-x-1 space-x-reverse">
                {[...Array(4)].map((_, i) => <FaStar key={i} className="text-yellow-400" />)}
                <FaStarHalfAlt className="text-yellow-400" />
                <span className="text-gray-600 me-1">4.8</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between w-full sm:w-fit gap-2">
            <Link href={`tel:${driver.phoneNumber}`}>
              <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center">
                <FaPhoneAlt className="me-1" /> {text.contact}
              </button>
            </Link>
            {chatButton &&(
              <Link href={`https://wa.me/${driver.phoneNumber}`} target="_blank" rel="noopener noreferrer" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg flex items-center">
                <FaEnvelope className="me-1" /> {text.message}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: <FaCalendarCheck className="text-green-500" />, title: text.experience, value: `${diffMonths} ${text.months}`, bg: 'bg-green-100' },
          { icon: <FaTruck className="text-blue-500" />, title: text.deliveries, value: totalOrders > 0 ? `${totalOrders}` : '52', bg: 'bg-blue-100' },
          { icon: <FaClock className="text-purple-500" />, title: text.onTime, value: '98%', bg: 'bg-purple-100' },
          { icon: <StarIcon className="text-yellow-500" />, title: text.rating, value: '4.8', bg: 'bg-yellow-100' },
        ].map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className={`p-2 rounded-full me-3 ${stat.bg}`}>{stat.icon}</div>
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="font-bold text-xl">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold mb-4">{text.infoDriver}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { icon: <FaPhoneAlt className="text-blue-500" />, title: text.phone, value: driver.phoneNumber, bg: 'bg-blue-50' },
            { icon: <FaCalendarAlt className="text-green-500" />, title: text.joined, value: formatDateDMYYYY(driver.createdAt), bg: 'bg-green-50' },
            { icon: <FaRoute className="text-purple-500" />, title: text.avgDestance, value: '3.5 كم', bg: 'bg-purple-50' },
            { icon: <FaClock className="text-yellow-500" />, title: text.avgTime, value: `28 ${text.minute}`, bg: 'bg-yellow-50' },
          ].map((item, i) => (
            <div key={i} className="flex items-start mb-4">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center mr-3 ${item.bg}`}>{item.icon}</div>
              <div>
                <p className="text-gray-500 text-sm mb-1">{item.title}</p>
                <p className="font-medium">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Area */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold mb-4">{text.zoneTitle}</h3>
        <div className="relative mb-3 h-72 rounded-xl overflow-hidden">
          <GoogleMap
            centerLatitude={driver.zone.centerLatitude} 
            centerLongitude={driver.zone.centerLongitude} 
            coverageRadius={driver.zone.coverageRadius}
          />
          <div className="absolute top-3 left-3 bg-white bg-opacity-80 px-3 py-2 rounded-lg text-sm flex items-center">
            <FaMapMarkerAlt className="text-red-500 me-1" /> {`${text.coverageRadius}: ${driver.zone.coverageRadius}${text.meters}`}
          </div>
        </div>
        <p className="text-center text-gray-700 mb-2">
          {driver.zone.name}
        </p>
      </div>

      {/* Documents */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold mb-4">{text.documentsTitle}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: text.frontPersonalId, imageUrl: driver.personalVerificationCardFrontUrl },
            { title: text.backPersonalId, imageUrl: driver.personalVerificationCardBackUrl },
            { title: text.frontDrivingLicense, imageUrl: driver.vehicleLicenseFrontUrl },
            { title: text.backDrivingLicense, imageUrl: driver.vehicleLicenseBackUrl },
            { title: text.frontVehicleRegistration, imageUrl: driver.vehicleFrontImageUrl },
            { title: text.backVehicleRegistration, imageUrl: driver.vehicleBackImageUrl },
          ].map((item, i) => (
            <CertificateCard2 
              title={item.title}
              imageUrl={item.imageUrl}
              key={i}
            />
          ))}
        </div>
      </div>
    </div>
  );
}