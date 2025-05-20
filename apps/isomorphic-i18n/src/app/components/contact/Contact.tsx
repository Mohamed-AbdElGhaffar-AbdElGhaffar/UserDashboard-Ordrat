'use client'
import { useTranslation } from '@/app/i18n/client';
import FormGroup from '@/app/shared/form-group';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import { PiEnvelopeSimple } from 'react-icons/pi';
import { Button, Input } from 'rizzui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faSquareFacebook, faSquareWhatsapp, faTwitter, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { PhoneNumber } from '@ui/phone-input';
import ContactValidation from '../validation/ContactValidation';
import CustomInput from '../ui/customForms/CustomInput';
import axiosClient from '../context/api';
import toast from 'react-hot-toast';
import { ContactInfo } from '@/types';
import { GetCookiesClient } from '../ui/getCookiesClient/GetCookiesClient';
import RoleExist from '../ui/roleExist/RoleExist';
import WidgetCard from '@components/cards/widget-card';
function Contact({ lang }: { lang: string }) {
    const shopId = GetCookiesClient('shopId');
    const [isDisabled, setIsDisabled] = useState(true);
    const { t, i18n } = useTranslation(lang!, "basicData");
    const [contact, setContact] = useState<ContactInfo>();
    // const validationSchema = ContactValidation({ lang })
    const handleEnableInputs = () => {
        setIsDisabled(false);
    };
    const fetchContact = async () => {
        try {
            const { data } = await axiosClient.get(`/api/ShopContactInfo/GetByShopId/${shopId}`);

            if (data) {
                setContact(data);
                formik.setValues({
                    Whatsapp: data.whatsAppNumber || '',
                    facebook: data.facebookLink || '',
                    insta: data.instagramLink || '',
                    twitter: data.xLink || ''
                });
            }
        } catch (error) {
            toast.error(lang === 'ar' ? 'فشل تحميل بيانات التواصل' : 'Failed to load contact data');
        }
    };

    useEffect(() => {
        fetchContact()
    }, [])
    let formik = useFormik({
        initialValues: {
            Whatsapp: '',
            facebook: '',
            insta: '',
            twitter: ''
        },
        // validationSchema,
        onSubmit: async (values) => {
            console.log("values", values);

            const data = {
                whatsAppNumber: values.Whatsapp,
                facebookLink: values.facebook,
                xLink: values.twitter,
                instagramLink: values.insta,
                shopId: shopId
            };

            if (contact?.id) {
                const isChanged =
                    data.whatsAppNumber !== contact.whatsAppNumber ||
                    data.facebookLink !== contact.facebookLink ||
                    data.xLink !== contact.xLink ||
                    data.instagramLink !== contact.instagramLink;

                if (!isChanged) {
                    // toast.error(lang === 'ar' ? 'لم يتم إجراء أي تغييرات' : 'No changes were made');
                    return;
                }

                try {
                    await axiosClient.put(`/api/ShopContactInfo/Update/${contact.id}`, data);
                    toast.success(lang === 'ar' ? 'تم تحديث معلومات التواصل بنجاح!' : 'Contact info updated successfully!');
                    fetchContact();
                    setIsDisabled(true);

                } catch (error) {
                    console.error('API Error:', error);
                    toast.error(lang === 'ar' ? 'حدث خطأ أثناء الحفظ.  حاول مجددًا.' : 'Error saving data. Please try again.');
                }
            } else {

                try {
                    await axiosClient.post(`/api/ShopContactInfo/Create/${shopId}`, data);
                    toast.success(lang === 'ar' ? 'تم إنشاء معلومات التواصل بنجاح!' : 'Contact info created successfully!');
                    fetchContact();
                    setIsDisabled(true);

                } catch (error) {
                    console.error('API Error:', error);
                    toast.error(lang === 'ar' ? 'فشل في إنشاء البيانات. حاول مجدداً.' : 'Failed to create contact info. Please try again.');
                }
            }
        }
    }
    )
    return (
        <div className='mx-auto mb-2 grid w-full  max-w-screen-4xl gap-7 @2xl:gap-9 @3xl:gap-11'>
            <form onSubmit={formik.handleSubmit} >
                <div className="border  border-gray-200 bg-white rounded-xl p-5">
                    <div className="flex justify-between items-center">
                        <h2 className='mb-3 text-base font-semibold sm:text-lg'>{t('contact-title')}</h2>
                        <RoleExist PageRoles={['UpdateShopContactInfo', 'CreateShopContactInfo']}>
                            <Button type='submit' onClick={handleEnableInputs} className='bg-redColor hover:bg-mainTextColor'>
                                {t('update')}
                            </Button>
                        </RoleExist>
                    </div>
                    <div className="sm:space-y-6 mt-3">
                        <div className="sm:flex justify-between  gap-10">
                            <div className="sm:w-1/2  ">
                                <PhoneNumber
                                    label={t('whatsapp')}
                                    country="eg"
                                    className=' font-medium '
                                    preferredCountries={["eg"]}
                                    value={formik.values.Whatsapp}
                                    onChange={(value) => formik.setFieldValue('Whatsapp', value)}
                                    onBlur={formik.handleBlur}
                                    disabled={isDisabled}

                                />
                                <div className="h-4">
                                    {formik.errors.Whatsapp && formik.touched.Whatsapp ? (
                                        <div className="text-red-500 font-normal text-[14px] mt-1">
                                            {formik.errors.Whatsapp as any}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                            <div className="sm:w-1/2 ">
                                <CustomInput
                                    label={t('facebook')}
                                    prefix={<FontAwesomeIcon icon={faFacebook} size='1x' className='text-blue-500' />}
                                    id='facebook'
                                    name='facebook'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.facebook}
                                    className=""
                                    placeholder={t('facebook')}
                                    disabled={isDisabled}
                                />
                                <div className="h-4">
                                    {formik.errors.facebook && formik.touched.facebook ? (
                                        <div className="text-red-500 font-normal text-[14px] mt-1">
                                            {formik.errors.facebook as any}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                        <div className="sm:flex justify-between gap-10">
                            <div className="sm:w-1/2 ">
                                <CustomInput
                                    label={t('insta')}
                                    prefix={<FontAwesomeIcon icon={faInstagram} size='1x' className='text-red-400' />}
                                    name='insta'
                                    id='insta'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.insta}
                                    className=""
                                    placeholder={t('insta')}
                                    disabled={isDisabled}
                                />
                                <div className="h-4">
                                    {formik.errors.insta && formik.touched.insta ? (
                                        <div className="text-red-500 font-normal text-[14px] mt-1">
                                            {formik.errors.insta as any}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                            <div className="sm:w-1/2 ">
                                <CustomInput
                                    label={t('twitter')}
                                    prefix={<FontAwesomeIcon icon={faTwitter} size='1x' className='text-blue-400' />}
                                    id='twitter'
                                    name='twitter'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.twitter}
                                    className=""
                                    placeholder={t('twitter')}
                                    disabled={isDisabled}
                                />
                                <div className="h-4">
                                    {formik.errors.twitter && formik.touched.twitter ? (
                                        <div className="text-red-500 font-normal text-[14px] mt-1">
                                            {formik.errors.twitter as any}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <WidgetCard title={lang === 'ar' ? 'معاينة وسائل التواصل الاجتماعي' : 'Social Media Preview'}>
                <div className="p-6">
                    <div className="flex flex-wrap justify-center gap-4">
                        {/* Facebook */}
                        <a href={formik.values.facebook ? formik.values.facebook : ""} >

                            <FontAwesomeIcon icon={faSquareFacebook} className='text-blue-500 social-icon flex items-center justify-center w-12 h-12 rounded-lg' />
                        </a>
                        {/* Twitter */}
                        <a href={formik.values.twitter ? formik.values.twitter : ""} >

                            <FontAwesomeIcon icon={faTwitter} className='text-blue-400 social-icon flex items-center justify-center w-12 h-12 rounded-lg' />
                        </a>
                        {/* Instagram */}
                        <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center bg-white"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <a href={formik.values.insta ? formik.values.insta : ""} >
                                <svg
                                    width={60}
                                    height={60}
                                    viewBox="0 0 48 48"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <defs>
                                        <radialGradient
                                            id="instagramGradient1"
                                            cx="19.38"
                                            cy="42.035"
                                            r="44.899"
                                            gradientUnits="userSpaceOnUse"
                                        >
                                            <stop offset="0" stopColor="#fd5" />
                                            <stop offset=".328" stopColor="#ff543f" />
                                            <stop offset=".348" stopColor="#fc5245" />
                                            <stop offset=".504" stopColor="#e64771" />
                                            <stop offset=".643" stopColor="#d53e91" />
                                            <stop offset=".761" stopColor="#cc39a4" />
                                            <stop offset=".841" stopColor="#c837ab" />
                                        </radialGradient>
                                        <radialGradient
                                            id="instagramGradient2"
                                            cx="11.786"
                                            cy="5.54"
                                            r="29.813"
                                            gradientTransform="matrix(1 0 0 .6663 0 1.849)"
                                            gradientUnits="userSpaceOnUse"
                                        >
                                            <stop offset="0" stopColor="#4168c9" />
                                            <stop offset=".999" stopColor="#4168c9" stopOpacity="0" />
                                        </radialGradient>
                                    </defs>

                                    <path
                                        fill="url(#instagramGradient1)"
                                        d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20
          c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20
          C42.014,38.383,38.417,41.986,34.017,41.99z"
                                    />
                                    <path
                                        fill="url(#instagramGradient2)"
                                        d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20
          c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20
          C42.014,38.383,38.417,41.986,34.017,41.99z"
                                    />
                                    <path
                                        fill="#fff"
                                        d="M24,31c-3.859,0-7-3.14-7-7s3.141-7,7-7s7,3.14,7,7S27.859,31,24,31z M24,19c-2.757,0-5,2.243-5,5
          s2.243,5,5,5s5-2.243,5-5S26.757,19,24,19z"
                                    />
                                    <circle cx="31.5" cy="16.5" r="1.5" fill="#fff" />
                                    <path
                                        fill="#fff"
                                        d="M30,37H18c-3.859,0-7-3.14-7-7V18c0-3.86,3.141-7,7-7h12c3.859,0,7,3.14,7,7v12
          C37,33.86,33.859,37,30,37z M18,13c-2.757,0-5,2.243-5,5v12c0,2.757,2.243,5,5,5h12c2.757,0,5-2.243,5-5V18c0-2.757-2.243-5-5-5H18z"
                                    />
                                </svg>

                            </a>
                        </div>

                        {/* WhatsApp */}
                        <a href={`https://wa.me/${formik.values.Whatsapp}`} >
                            <FontAwesomeIcon
                                className="social-icon flex items-center justify-center w-12 h-12 rounded-lg text-[#25D366] "
                                icon={faSquareWhatsapp} />
                        </a>
                    </div>

                    <div className="text-center mt-5 text-gray-600 text-sm">
                        {lang === 'ar' ?
                            'ستظهر أزرار التواصل الاجتماعي هذه في صفحة المتجر الخاصة بك' : 'These social media buttons will appear on your store page.'}
                    </div>
                </div>

            </WidgetCard>
            <WidgetCard title={lang === 'ar' ? 'نصائح لبيانات التواصل' : 'Contact Information Tips'}>
                <ul className="ps-5 list-disc text-[#4A5568] font-medium text-base mt-3">
                    <li className='mb-2'>{t('whatsappHint')}</li>
                    <li className='mb-2'>{t('socialLinksHint')}</li>
                    <li className='mb-2'>{t('linksValidityHint')}</li>
                    <li>{t('updateHint')}</li>
                </ul>
            </WidgetCard>

        </div>
    )
}
export default Contact

