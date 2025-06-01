'use client'
import { useFormik } from 'formik';
import React, { useState } from 'react'
import { PiPlusBold } from 'react-icons/pi';
import { Button, Input } from 'rizzui';
import * as Yup from 'yup'
import axiosClient from '../../context/api';
import toast from 'react-hot-toast';
import FileUpload from '@/app/shared/image-form-upload';
import { useUserContext } from '../../context/UserContext';
import { GetCookiesClient } from '../../ui/getCookiesClient/GetCookiesClient';
function Contact({lang}:{lang:string}) {
    const shopId = GetCookiesClient('shopId') as string;
    const [image, setImage] = useState<File | null>(null);
    const { setBannersData, setFileData, setProgressData } = useUserContext();
    const [loading, setLoading] = useState(false);

    const text = {
        link: lang === 'ar' ? 'الرابط' : 'Link',
        image: lang === 'ar' ? 'الصورة' : 'Image',
        submit: lang === 'ar' ? 'انشاء' : 'Create',
        title: lang === 'ar' ? 'إنشاء البانر' : 'Create Banner',
    };
    
    const requiredMessage = lang === 'ar' ? 'مطلوب' : 'is required';

    const mainFormSchema = Yup.object().shape({
        link: Yup.string()
        .url(lang === 'ar' ? 'الرابط غير صالح، يجب أن يبدأ بـ http أو https' : 'Invalid URL. Must start with http or https')
        .required(text.link + ' ' + requiredMessage),
        image: Yup.mixed().required(`${text.image} ${requiredMessage}`).test(
        'fileFormat',
        lang === 'ar' ? 'يجب أن يكون ملف صورة' : 'Must be an image file',
        (file) => {
            return !file || (file instanceof File && file.type.startsWith('image/'));
        }
        ),
    });

    const mainFormik = useFormik({
        initialValues: {
        link: '',
        image: null,
        },
        validationSchema: mainFormSchema,
        onSubmit: async (values) => {
            setLoading(true);
            const formData = new FormData();
            formData.append('ActionString', values.link);
            formData.append('ShopId', shopId);
            formData.append('ActionType', '0');

            if (values.image) {
                formData.append('Banner', values.image);
            }

            try {
                await axiosClient.post(`/api/Banner/Create/${shopId}`, formData);
                toast.success(lang === 'ar' ? 'تم إنشاء البانر بنجاح!' : 'Banner created successfully!');
                
                // Reset Form
                mainFormik.setFieldValue('link', '');
                mainFormik.setFieldValue('image', null);
                setImage(null);
                setFileData(false);
                setBannersData(true);
                setProgressData(true);
                setLoading(false);
            } catch (error) {
                console.error('API Error:', error);
                setLoading(false);    
                toast.error(lang === 'ar' ? 'فشل في إنشاء البانر. حاول مجدداً.' : 'Failed to create banner. Please try again.');
            }
        },
    });
    return (
    <div id="contact-step" className='w-full lg:w-6/12 bg-white rounded-xl'>
        <form onSubmit={(e) => {
          e.preventDefault();
          mainFormik.handleSubmit();
        }} >

            <div className="border border-gray-200 rounded-xl p-5">
                <div className="flex justify-between items-center">
                    <h2 className='mb-3'>{text.title}</h2>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-1 gap-4">
                        <Input label={text.link} placeholder="https://example.com" name="link" value={mainFormik.values.link} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.link && mainFormik.errors.link ? mainFormik.errors.link : ''} className="" />
                    </div>
                    <div>
                        <FileUpload
                            label={text.image}
                            accept="img"
                            multiple={false}
                            multipleFiles={false}
                            lang={lang}
                            onFileChange={(file) => {
                                setImage(file || null);
                                mainFormik.setFieldValue('image', file);
                            }}
                            onFileDelete={() => {
                                setImage(null);
                                mainFormik.setFieldValue('image', null);
                            }}
                            recommendedDimensions="750×300"
                            recommendedDimensionsTitle={lang=='ar'?'الأبعاد المثلى: ':'Recommended dimensions: '}
                        />
                        {mainFormik.touched.image && mainFormik.errors.image && (
                            <div role="alert" className="pb-2 text-red text-[13px] mt-0.5 rizzui-input-error-text">
                                {mainFormik.errors.image}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex justify-end gap-3 mb-4 mt-2">
                    <Button isLoading={loading} disabled={loading} type="submit" className="w-full">
                        {text.submit}<PiPlusBold className="ms-1.5 h-[17px] w-[17px]" />
                    </Button>
                </div> 
            </div>
        </form>
    </div>
  )
}

export default Contact