'use client';

import React, { useState, useEffect } from 'react';
import { PiXBold, PiFloppyDiskBold } from 'react-icons/pi';
import { ActionIcon, Title, Button, Input, Select, Radio, Checkbox, Password, Switch } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Skeleton from 'react-loading-skeleton';
import toast from 'react-hot-toast';
import { GatewayConfigField } from '@/types';
import styles from './ConfigModal.module.css';
import axiosClient from '../../context/api';
import { PhoneNumber } from '@ui/phone-input';
import { useUserContext } from '../../context/UserContext';
import { GetCookiesClient } from '../../ui/getCookiesClient/GetCookiesClient';

// API Response interfaces
interface PaymentGatewayApiResponse {
  id: string;
  imageURL: string;
  gatewayConfigFields: ApiGatewayConfigField[];
  name: string;
  description: string;
  priority: number; 
  isEnabled: boolean;  
}

interface ApiGatewayConfigField {
  id: string;
  name: string;
  options: Array<{ id: string; name: string }>;
  buttonType: string;
  priority: number;
}

interface ConfigModalProps {
  title?: string;
  gatewayId: string;
  shopGateway?: any;
  gatewayName?: string;
  isUpdate: boolean;
  onSave: (data: any) => void;
  lang: string;
  existingData?: any;
}

export default function ConfigModal({
  title,
  gatewayId,
  shopGateway,
  gatewayName,
  isUpdate,
  onSave,
  lang,
  existingData
}: ConfigModalProps) {
  console.log("shopGateway: ",shopGateway);
  
  const { closeModal } = useModal();
  const [isSubmit, setIsSubmit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [gatewayData, setGatewayData] = useState<PaymentGatewayApiResponse | null>(null);
  const [configFields, setConfigFields] = useState<GatewayConfigField[]>([]);
  const { setPaymentGateway } = useUserContext();
  const shopId = GetCookiesClient('shopId') as string;

  const text = {
    configure: lang === 'ar' ? 'تكوين' : 'Configure',
    update: lang === 'ar' ? 'تحديث' : 'Update',
    setup: lang === 'ar' ? 'إعداد جديد' : 'Set up new',
    priority: lang === 'ar' ? 'ترتيب الأولوية' : 'Priority Order',
    status: lang === 'ar' ? 'الحالة' : 'Status',
    enabled: lang === 'ar' ? 'مفعل' : 'Enabled',
    disabled: lang === 'ar' ? 'معطل' : 'Disabled',
    cancel: lang === 'ar' ? 'إلغاء' : 'Cancel',
    save: lang === 'ar' ? 'حفظ البيانات' : 'Save Configuration',
    loading: lang === 'ar' ? 'جاري التحميل...' : 'Loading...',
    required: lang === 'ar' ? 'مطلوب' : 'Required',
    optional: lang === 'ar' ? 'اختياري' : 'Optional',
    noConfigRequired: lang === 'ar' ? 'لا يتطلب تكوين إضافي' : 'No Additional Configuration Required',
    noConfigDesc: lang === 'ar' ? 'بوابة الدفع هذه لا تحتاج إعداد إضافي' : 'This payment gateway doesn\'t require additional setup',
    configField: lang === 'ar' ? 'حقل تكوين لـ' : 'Configuration field for',
    enterValue: lang === 'ar' ? 'أدخل' : 'Enter',
    selectValue: lang === 'ar' ? 'اختر' : 'Select',
    phoneNumber: lang === 'ar' ? 'رقم الهاتف' : 'Phone Number',
    loadError: lang === 'ar' ? 'خطأ في تحميل بيانات بوابة الدفع' : 'Error loading payment gateway data',
    wrongPhone: lang === 'ar' ? 'رقم الهاتف غير صالح' : 'Invalid phone number',
    wrongEmail: lang === 'ar' ? 'بريد الكتروني غير صالح' : 'is not a valid email address',
    enter: lang === 'ar' ? 'ادخل البيانات' : 'Enter Data',
  };

  const paymentMethodMap: Record<string, number> = {
    "87bbdf07-1b56-4110-9208-8e12192d1d7c": 0,  // Cash on delivery
    "e4f951d4-7248-4ef1-82a5-ce28ad7a6b35": 2,  // PayPal
    "ca9cc6c0-51a8-4ef5-82d6-0b668e19c3c7": 7,  // Instapay
    "ce2dd816-69ad-44cd-ac81-997c98bdd07b": 6,  // Etisala Cash
    "5144f1aa-91a7-4427-a13d-8418ea7c2eea": 4,  // VodafoneCash
    "6f9db62a-ce10-4a9f-a2e4-4ba746cf07f2": 5,  // OrangeCash
    "82f046ad-18a6-45ed-9ba4-02ab23ab276c": 3,  // Kashier
  };

  const requiredMessage = lang === 'ar' ? 'مطلوب' : 'is required';

  // Fetch payment gateway data from API
  useEffect(() => {
    const fetchGatewayData = async () => {
      if (!gatewayId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response = await axiosClient.get(`/api/PaymentGateway/GetById/${gatewayId}`, {
          headers: {
            'Accept-Language': lang,
          },
        });

        const data: PaymentGatewayApiResponse = response.data;
        setGatewayData(data);

        // Transform API config fields to match your existing interface
        const transformedFields: GatewayConfigField[] = data.gatewayConfigFields.map(field => ({
          id: field.id,
          nameEn: field.name,
          nameAr: field.name,
          buttonType: field.buttonType as 'Radio' | 'Dropdown' | 'Checkbox' | 'Input' | 'PhoneNumber' | 'Email' | 'DatePick' | 'Image' ,
          priority: field.priority,
          isRequired: true,
          options: field.options,
        }));

        setConfigFields(transformedFields);

      } catch (error) {
        console.error('Error fetching gateway data:', error);
        toast.error(text.loadError);
      } finally {
        setLoading(false);
      }
    };

    fetchGatewayData();
  }, [gatewayId, lang]);

  // Create dynamic validation schema based on config fields
  const createValidationSchema = () => {
    const schemaFields: any = {
      priority: Yup.number()
        .min(1, lang === 'ar' ? 'يجب أن تكون الأولوية 1 على الأقل' : 'Priority must be at least 1')
        .required(text.priority + ' ' + requiredMessage),
      isEnabled: Yup.boolean().required(),
    };
  
    configFields.forEach(field => {
      if (field.isRequired) {
        switch (field.buttonType) {
          case 'Radio':
            schemaFields[field.id] = Yup.string().required(
              `${lang === 'ar' ? field.nameAr : field.nameEn} ${requiredMessage}`
            );
            break;
          case 'Dropdown':
            schemaFields[field.id] = Yup.string().required(
              `${lang === 'ar' ? field.nameAr : field.nameEn} ${requiredMessage}`
            );
            break;
          case 'Checkbox':
            schemaFields[field.id] = Yup.boolean().oneOf([true], `${lang === 'ar' ? field.nameAr : field.nameEn} ${requiredMessage}`);
            break;
          case 'Input':
            schemaFields[field.id] = Yup.string().required(
              `${lang === 'ar' ? field.nameAr : field.nameEn} ${requiredMessage}`
            );
            break;
          case 'PhoneNumber':
            schemaFields[field.id] = Yup.string().required(`${text.phoneNumber} ${requiredMessage}`).matches(/^20(1[0-2,5][0-9]{8})$/, text.wrongPhone);
            break;
          case 'Email':
            schemaFields[field.id] = Yup.string()
              .email(`${lang === 'ar' ? field.nameAr : field.nameEn} ${text.wrongEmail}`)
              .required(`${lang === 'ar' ? field.nameAr : field.nameEn} ${requiredMessage}`);
            break;
          case 'DatePick':
            schemaFields[field.id] = Yup.date()
              .required(`${lang === 'ar' ? field.nameAr : field.nameEn} ${requiredMessage}`);
            break;
          case 'Image':
            schemaFields[field.id] = Yup.string().required(
              `${lang === 'ar' ? field.nameAr : field.nameEn} ${requiredMessage}`
            );
            break;
          default:
            break;
        }
      }
    });
  
    return Yup.object().shape(schemaFields);
  };  

  // Create initial values based on config fields
  const createInitialValues = () => {
    const initialValues: any = {
      priority: shopGateway?.priority || null,
      isEnabled: shopGateway?.isEnabled ?? true,
    };

    // configFields.forEach(field => {
    //   initialValues[field.id] = existingData?.configValues?.[field.id] || '';
    // });
    shopGateway?.gatewayConfigValues.forEach((config: any) => {
      initialValues[config.gatewayConfigField.id] = config.value;
    });
    
    return initialValues;
  };

  const formik = useFormik({
    initialValues: createInitialValues(),
    validationSchema: createValidationSchema(),
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsSubmit(true);

      try {
        const configValues: Array<{ value: string, gatewayConfigFieldId?: string, selectedOptionId?: string }> = [];
        const selectedOptions: Record<string, string> = {};

        configFields.forEach(field => {
          const value = values[field.id];
          if (value) {
            if (field.buttonType === 'Dropdown' || field.buttonType === 'Radio') {
              configValues.push({
                value: value,
                selectedOptionId: field.id,
              });
            } else {
              configValues.push({
                value: value,
                gatewayConfigFieldId: field.id,
              });
            }
          }
        });
        const paymentMethod = paymentMethodMap[gatewayId] || 0;
        const payload = {
          isEnabled: values.isEnabled,
          priority: values.priority,
          paymentMethod: paymentMethod,
          shopId: shopId,
          paymentGatewayId: gatewayId,
          gatewayNameAr: "string",
          gatewayNameEn: "string",
          gatewayDescriptionAr: "string",
          gatewayDescriptionEn: "string",
          gatewayConfigValues: configValues,
        };
        console.log("gatewayData: ",gatewayData);
        

        let response;
        if (isUpdate && shopGateway) {
          response = await axiosClient.put(`/api/ShopPaymentGateway/Update/${shopGateway.id}`, payload);
        } else {
          response = await axiosClient.post('/api/ShopPaymentGateway/Create', payload);
        }

        toast.success(
          lang === 'ar'
            ? 'تم حفظ بوابة الدفع بنجاح!'
            : 'Payment gateway saved successfully!'
        );
        setPaymentGateway(true);
        closeModal();
      } catch (error: any) {
        console.error('Error saving config:', error);
        toast.error(
          lang === 'ar'
            ? 'فشل في حفظ بوابة الدفع. حاول مرة أخرى.'
            : 'Failed to save payment. Please try again.'
        );
      } finally {
        setIsSubmit(false);
        setLoading(false);
      }
    },
  });

  const renderConfigField = (field: GatewayConfigField) => {
    const fieldId = field.id;
    const value = formik.values[fieldId] || '';
    const fieldName = lang === 'ar' ? field.nameAr : field.nameEn;
    const error = formik.touched[fieldId] && formik.errors[fieldId] ? formik.errors[fieldId] as string : '';
  
    switch (field.buttonType) {
      case 'Dropdown':
        return (
          <div className="w-full">
            <Select
              label={fieldName}
              name={fieldId}
              value={value}
              onChange={(value: any) => formik.setFieldValue(fieldId, value)}
              onBlur={formik.handleBlur}
              error={error}
              options={field.options ? field.options.map(option => ({ value: option.id, label: option.name })) : []}  // Ensure options is not undefined
              getOptionValue={(option: any) => option.value}
            />
          </div>
        );
  
      case 'Radio':
        return (
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {fieldName}
              {field.isRequired && <span className="text-red-500 ms-1">*</span>}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {field.options?.map(option => (
                <Radio
                  key={option.id}
                  name={fieldId}
                  value={option.id}
                  checked={value === option.id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label={option.name}
                />
              ))}
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );
  
      case 'Email':
        return (
          <div className="w-full">
            <Input
              label={fieldName}
              type='email'
              name={fieldId}
              value={value}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={error}
              placeholder={fieldName}
            />
          </div>
        );
  
      case 'PhoneNumber':
        return (
          <div className="w-full">
            <PhoneNumber
              country={'eg'}
              onlyCountries={['eg']}
              value={value}
              onChange={(phone: string) => formik.setFieldValue(fieldId, phone)}
              onBlur={formik.handleBlur}
              label={text.phoneNumber}
              error={formik.touched[fieldId] && typeof formik.errors[fieldId] === 'string' ? formik.errors[fieldId] as string : ''} // Ensure it's a string
            />
            {/* {error && <p className="text-red-500 text-sm mt-1">{error}</p>} */}
          </div>
        );
        
      case 'Checkbox':
        return (
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {fieldName}
              {field.isRequired && <span className="text-red-500 ms-1">*</span>}
            </label>
            <Checkbox
              name={fieldId}
              checked={value}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label={fieldName}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );
  
      case 'DatePick':
        return (
          <div className="w-full">
            <Input
              label={fieldName}
              type="date"
              name={fieldId}
              value={value}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={error}
              placeholder={fieldName || text.enter}
            />
          </div>
        );
  
      case 'Input':
      default:
        return (
          <div className="w-full">
            <Input
              label={fieldName}
              type='text'
              name={fieldId}
              value={value}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={error}
              placeholder={fieldName || text.enter}
            />
          </div>
        );
    }
  };  

  return (
    <div className="py-1" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className={`m-auto ps-3 rounded-xl pe-1.5 me-1.5 pb-4 pt-4 IBM-Plex-sans ${styles.customScroll}`}>
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            {(gatewayData?.imageURL || shopGateway?.gatewayUrl) && (
              <img
                src={shopGateway?.gatewayUrl || gatewayData?.imageURL}
                alt={shopGateway?.gatewayName || gatewayData?.name}
                className="w-14 h-14 rounded-lg me-3 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <div>
              <Title as="h3" className="text-lg IBM-Plex-sans mb-1">
                {title || text.configure}
              </Title>
              <p className="text-sm text-gray-600">
                {gatewayData?.description || text.setup}
              </p>
            </div>
          </div>
          <ActionIcon
            size="sm"
            variant="text"
            onClick={closeModal}
            className="p-0 text-gray-500 hover:!text-gray-900"
          >
            <PiXBold className="h-[18px] w-[18px]" />
          </ActionIcon>
        </div>
        {loading ?
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="bg-gray-50 rounded-xl p-6">
                <Skeleton height={20} width={200} className="mb-4" />
                <Skeleton height={50} />
              </div>
            ))}
          </div>
          :
          <form onSubmit={(e) => {
            e.preventDefault();
            formik.handleSubmit();
          }}>
            {/* Basic Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <Input
                  label={text.priority}
                  type="number"
                  name="priority"
                  value={formik.values.priority}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.priority && formik.errors.priority ? formik.errors.priority as string : ''}
                  className="input-placeholder text-[16px]"
                  inputClassName="text-[16px]"
                  placeholder={text.priority}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {text.status}:
                </label>
                <Switch
                  name="isEnabled"
                  className="flex items-center"
                  checked={formik.values.isEnabled}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label={formik.values.isEnabled ? text.enabled : text.disabled}
                />
              </div>
            </div>

            {/* Dynamic Config Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {loading ? (
                <div className="space-y-4">
                  {[1].map(i => (
                    <div key={i} className="bg-gray-50 rounded-xl p-6">
                      <Skeleton height={20} width={200} className="mb-4" />
                      <Skeleton height={50} />
                    </div>
                  ))}
                </div>
              ) : configFields.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl">
                  <div className="text-4xl mb-3">✅</div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">
                    {text.noConfigDesc}
                  </h4>
                </div>
              ) : (
                configFields.sort((a, b) => a.priority - b.priority).map((field) => (
                  <div key={field.id}>
                    {renderConfigField(field)}
                  </div>
                  // <div key={field.id} className="bg-gray-50 rounded-xl p-6 relative">
                  //   <div className={`absolute top-4 end-4 px-3 py-1 rounded-full text-xs font-semibold ${field.isRequired ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                  //     {field.isRequired ? text.required : text.optional}
                  //   </div>
                  //   {renderConfigField(field)}
                  // </div>
                ))
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
              <Button variant="outline" onClick={closeModal} className="px-6" disabled={isSubmit}>
                {text.cancel}
              </Button>
              <Button type="submit" isLoading={isSubmit} disabled={isSubmit || loading} className="px-6">
                <PiFloppyDiskBold className="me-1.5 h-[17px] w-[17px]" />
                {text.save}
              </Button>
            </div>
          </form>
        }
      </div>
    </div>
  );
}
