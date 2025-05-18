'use client';

import { PiXBold, PiPlusBold, PiMinusBold } from 'react-icons/pi';
import React, { useEffect, useState } from 'react';
import { ActionIcon, Title, Button, Input, Textarea } from 'rizzui';
import ReactSelect from 'react-select';
import { useModal } from '@/app/shared/modal-views/use-modal';
import toast from 'react-hot-toast';
import styles from './StoresForm.module.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
// import { useFileContext } from '../../context/FileContext';
// import RoleSelect from '@/app/shared/tan-table/selectInput';
import FileUpload from '@/app/shared/image-form-upload';
import { ChromePicker } from 'react-color';
import { Loader } from 'lucide-react';
import { API_BASE_URL } from '@/config/base-url';
import { useUserContext } from '../context/UserContext';

type Feature = {
  title: string;
  address: string;
};

type Seller = {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
};

type StoresFormProps = {
  title?: string;
  modalBtnLabel?: string;
  onSuccess?: () => void;
  lang: string;
};

export default function StoresForm({
    title,
    modalBtnLabel = 'إضافة متجر',
    onSuccess,
    lang = 'en',
    initialData = {}, 
  }: StoresFormProps & { initialData?: any }) {
    
  const { closeModal } = useModal();
  const [visibleSection, setVisibleSection] = useState<'' | 'addSeller'>('');

  const { fileData } = useUserContext();
  const text = {
    name: lang === 'ar' ? 'الأسم' : 'Name',
    subDomain: lang === 'ar' ? 'الصب دومين' : 'Sub Domain',
    address: lang === 'ar' ? 'العنوان' : 'Address',
    submit: lang === 'ar' ? 'انشاء' : 'Create',
    select: lang === 'ar' ? "نوع المتجر" : "Shop Type",
    selectSellerId: lang === 'ar' ? "كود التاجر" : "Seller Id",
    clear: lang === 'ar' ? 'تفريغ' : 'Clear',
    logo: lang === 'ar' ? 'اللوجو' : 'logo',
    mainColor: lang === 'ar' ? 'اللون الرئيسي' : 'Main Color',
    secondaryColor: lang === 'ar' ? 'اللون الثانوي' : 'Secondary Color',
    addSeller: lang === 'ar' ? 'إضافة تاجر' : 'Add Seller',
    sellerName: lang === 'ar' ? 'اسم التاجر' : 'Seller Name',
    sellerEmail: lang === 'ar' ? 'البريد الإلكتروني للتاجر' : 'Seller Email',
  };

  const requiredMessage = lang === 'ar' ? 'مطلوب' : 'is required';

  const [sellerOptions, setSellerOptions] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const mainFormSchema = Yup.object().shape({
    name: Yup.string().required(text.name + ' ' + requiredMessage),
    subDomain: Yup.string().required(text.subDomain + ' ' + requiredMessage),
    shopType: Yup.string().required(`${text.select} ${requiredMessage}`),
    sellerId: Yup.string().required(`${text.selectSellerId} ${requiredMessage}`),
    mainColor: Yup.string().required(`${text.mainColor} ${requiredMessage}`),
    secondaryColor: Yup.string().required(`${text.secondaryColor} ${requiredMessage}`),
    logo: Yup.mixed().required(`${text.logo} ${requiredMessage}`).test(
      'fileFormat',
      lang === 'ar' ? 'يجب أن يكون ملف صورة' : 'Must be an image file',
      (file) => {
        return !file || (file instanceof File && ['image/jpeg', 'image/png', 'image/gif'].includes(file.type));
      }
    ),
  });

  const mainFormik = useFormik({
    initialValues: {
      name: '',
      subDomain: '',
      shopType: '',
      sellerId: '',
      mainColor: '#ffffff',
      secondaryColor: '#000000',
      logo: null,
    },
    validationSchema: mainFormSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('Name', values.name);
      formData.append('SubdomainName', values.subDomain);
      formData.append('ShopType', values.shopType);
      formData.append('SellerId', values.sellerId);
      formData.append('MainColor', values.mainColor);
      formData.append('SecondaryColor', values.secondaryColor);
      if (values.logo) {
        formData.append('Logo', values.logo);
      }
      formData.append('TopRatedIsEnabled', 'true');
      formData.append('TopSellingIsEnabled', 'true');
  
      try {
        const response = await fetch(`${API_BASE_URL}/api/Shop/Create`, {
          method: 'POST',
          headers: {
            'Accept-Language': lang,
          },
          body: formData,
        });
  
        if (response.ok) {
          closeModal();
          toast.success(lang === 'ar' ? 'تم انشاء المتجر بنجاح!' : 'Shop created successfully!');
        //   setUpdateStores(true);
        } else {
          const errorText = await response.text();
          toast.error(
            lang === 'ar'
              ? `فشل في إنشاء المتجر: ${errorText}`
              : `Failed to create shop: ${errorText}`
          );
        }
      } catch (error) {
        console.error('Error creating shop:', error);
        toast.error(lang === 'ar' ? 'حدث خطأ أثناء إنشاء المتجر' : 'An error occurred while creating the shop');
      }
    },
  });


  const handleFileChange = (file: File | null) => {
    mainFormik.setFieldValue('logo', file);
  };
  const handleFileDelete = () => {
    mainFormik.setFieldValue('logo', null);
  };
  const staticOptions = lang === 'ar' 
  ? [
      { id: '0', name: 'مطعم' },    
      { id: '1', name: 'سوبر ماركت' },
    ] 
  : [
      { id: '0', name: 'Resturant' },    
      { id: '1', name: 'SuperMarket' },
    ];

  const [selectedValue, setSelectedValue] = useState<string>('');
  const [selectedSellerIdValue, setSelectedSellerIdValue] = useState<string>('');
  const handleValueSelectChange = (value: string) => {
    console.log("Selected real option:", value);
    setSelectedValue(value);
    mainFormik.setFieldValue('shopType', value)
  };
  const handleValueSelectSellerIdChange = (value: string) => {
    console.log("Selected SellerId option:", value);
    setSelectedSellerIdValue(value);
    mainFormik.setFieldValue('sellerId', value)
  };

  const fetchSellers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Seller/Filter`, {
        method: 'GET',
        headers: {
          Accept: '*/*',
          'Accept-Language': lang,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const sellers = data.entities.map((seller: any) => ({
          id: seller.id,
          name: seller.name,
        }));
        setSellerOptions(sellers);
      } else {
        toast.error(lang === 'ar' ? 'فشل في جلب التجار' : 'Failed to fetch sellers');
      }
    } catch (error) {
      console.error('Error fetching sellers:', error);
      toast.error(lang === 'ar' ? 'حدث خطأ أثناء جلب التجار' : 'An error occurred while fetching sellers');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSellers();
  }, [lang]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader className="animate-spin text-[#e11d48]" width={40} height={40} />
      </div>
    );
  }

  const handleColorChange = (field: 'mainColor' | 'secondaryColor', color: string) => {
    mainFormik.setFieldValue(field, color);
  };




  return (
    <div className='py-1'>
      <div className={`m-auto ps-3 rounded-xl pe-1.5 me-1.5 pb-4 pt-4 rtl IBM-Plex-sans `}>
        <div className="mb-6 flex items-center justify-between">
          <Title as="h3" className="text-lg IBM-Plex-sans">{title || text.submit}</Title>
          <ActionIcon size="sm" variant="text" onClick={closeModal} className="p-0 text-gray-500 hover:!text-gray-900">
            <PiXBold className="h-[18px] w-[18px]" />
          </ActionIcon>
        </div>
        <Title as="h4" className="text-lg mb-3">{lang === 'ar' ? 'بيانات المتجر :' : 'Store Data:'}</Title>
        <form onSubmit={(e) => {
          e.preventDefault();
          mainFormik.handleSubmit();
        }}>
          <Input label={text.name} placeholder={text.name} name="name" value={mainFormik.values.name} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.name && mainFormik.errors.name ? mainFormik.errors.name : ''} className="mb-4" />
          <Input label={text.subDomain} placeholder={text.subDomain} name="subDomain" value={mainFormik.values.subDomain} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.subDomain && mainFormik.errors.subDomain ? mainFormik.errors.subDomain : ''} className="mb-4" />
          <div className="sm:flex gap-10 mt-5">
            <div className="mb-3">
                <label className="block text-sm font-medium mb-2">{text.mainColor}</label>
                <ChromePicker
                color={mainFormik.values.mainColor}
                onChangeComplete={(color) => handleColorChange('mainColor', color.hex)}
                styles={{
                    default: {
                    picker: {
                        width: '100%',
                    },
                    },
                }}
                />
                {mainFormik.touched.mainColor && mainFormik.errors.mainColor && (
                <div className="text-red-500 text-sm">{mainFormik.errors.mainColor}</div>
                )}
            </div>
            <div className="mb-3">
                <label className="block text-sm font-medium mb-2">{text.secondaryColor}</label>
                <ChromePicker
                color={mainFormik.values.secondaryColor}
                onChangeComplete={(color) => handleColorChange('secondaryColor', color.hex)}
                styles={{
                    default: {
                    picker: {
                        width: '100%',
                    },
                    },
                }}
                />
                {mainFormik.touched.secondaryColor && mainFormik.errors.secondaryColor && (
                <div className="text-red-500 text-sm">{mainFormik.errors.secondaryColor}</div>
                )}
            </div>
          </div>
          <FileUpload
            label={text.logo}
            accept="img"
            multiple={false}
            multipleFiles={false}
            lang={lang}
            onFileChange={handleFileChange}
            onFileDelete={handleFileDelete}
            // btnLabel={modalBtnLabel}
          />
          {mainFormik.touched.logo && mainFormik.errors.logo && (
            <div className={`text-red-500 text-sm ${fileData? '' : 'mb-6' }`}>{mainFormik.errors.logo}</div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button type="submit" className="w-full">
              {text.submit}<PiPlusBold className="ms-1.5 h-[17px] w-[17px]" />
            </Button>
            <Button onClick={() => console.log("clear")} variant="outline" className="w-full">
              {text.clear}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}