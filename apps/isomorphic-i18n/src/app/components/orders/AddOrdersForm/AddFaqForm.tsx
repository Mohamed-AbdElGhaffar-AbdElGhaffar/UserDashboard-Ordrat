'use client';

import dynamic from 'next/dynamic';
import { PiXBold, PiPlusBold, PiMinusBold } from 'react-icons/pi';
import React, { useEffect, useState } from 'react';
import { ActionIcon, Title, Button, Input, Textarea } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import toast from 'react-hot-toast';
import styles from './FAQForm.module.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Loader } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import axiosClient from '../../context/api';
import { GetCookiesClient } from '../../ui/getCookiesClient/GetCookiesClient';

const QuillEditor = dynamic(() => import('@ui/quill-editor'), {
  ssr: false,
});

type FAQ = {
  question: string;
  questionAr: string;
  answer: string; 
  answerAr: string;
};

type ImageOption = {
  id: string;
  imageUrl: string;
};

type AddFaqFormProps = {
  title?: string;
  onSuccess?: () => void;
  lang: string;
};

export default function AddFaqForm({
  title,
  onSuccess,
  lang = 'en',
}: AddFaqFormProps) {
  const shopId = GetCookiesClient('shopId');
  const { closeModal } = useModal();
  
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [images, setImages] = useState<ImageOption[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);

  const text = {
    nameAr: lang === 'ar' ? 'الأسم (عربي)' : 'Name (Arabic)',
    nameEn: lang === 'ar' ? 'الأسم (انجليزي)' : 'Name (English)',
    titleAr: lang === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)',
    titleEn: lang === 'ar' ? 'العنوان (انجليزي)' : 'Title (English)',
    metaDescriptionAr: lang === 'ar' ? 'وصف جوجل (عربي)' : 'Meta Description (Arabic)',
    metaDescriptionEn: lang === 'ar' ? 'وصف جوجل (انجليزي)' : 'Meta Description (English)',
    chooseImage: lang === 'ar' ? 'اختر صورة' : 'Choose an Image',

    addQuestions: lang === 'ar' ? 'أسئلة' : 'Questions',
    questionsPlaceholder: lang === 'ar' ? 'سؤال رقم' : 'Question',
    QuestionEn: lang === 'ar' ? 'السؤال (انجليزي)' : "Question (English)",
    QuestionAr: lang === 'ar' ? 'السؤال (عربي)' : "Question (Arabic)",
    AnswerEn: lang === 'ar' ? "الإجابة (انجليزي)" : "Answer (English)",
    AnswerAr: lang === 'ar' ? "الإجابة (عربي)" : "Answer (Arabic)",
    submit: lang === 'ar' ? 'انشاء' : 'Create',
  };
  const fetchImages = async () => {
    setLoadingImages(true);
    try {
      const response = await axiosClient.get('/api/FAQCategory/GetShopFAQCategoriesImages');
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoadingImages(false);
    }
  };
  useEffect(() => {
    fetchImages();
  }, []);

  const requiredMessage = lang === 'ar' ? 'مطلوب' : 'is required';

  const mainFormSchema = Yup.object().shape({
    nameAr: Yup.string().required(text.nameAr + ' ' + requiredMessage),
    nameEn: Yup.string().required(text.nameEn + ' ' + requiredMessage),
    titleAr: Yup.string().required(text.titleAr + ' ' + requiredMessage),
    titleEn: Yup.string().required(text.titleEn + ' ' + requiredMessage),
    metaDescriptionAr: Yup.string().required(text.metaDescriptionAr + ' ' + requiredMessage),
    metaDescriptionEn: Yup.string().required(text.metaDescriptionEn + ' ' + requiredMessage),
    imageId: Yup.string().required(`${text.chooseImage} ${requiredMessage}`),
  });

  const mainFormik = useFormik({
    initialValues: {
      nameAr: '',
      nameEn: '',
      titleAr: '',
      titleEn: '',
      metaDescriptionAr: '',
      metaDescriptionEn: '',
      imageId: '',
    },
    validationSchema: mainFormSchema,
    onSubmit: async (values) => {
      try {
        const requestBody = {
          nameAr: values.nameAr,
          nameEn: values.nameEn,
          titleAr: values.titleAr,
          titleEn: values.titleEn,
          metaDescriptionAr: values.metaDescriptionAr,
          metaDescriptionEn: values.metaDescriptionEn,
          imageId: values.imageId,
          shopId: shopId,
          faQs: faqs.map((faq) => ({
            questionAr: faq.questionAr,
            questionEn: faq.question,
            answerAr: faq.answerAr,
            answerEn: faq.answer,
          })),
        };

        const response = await axiosClient.post('/api/FAQCategory/Create', requestBody);

        toast.success(
          lang === 'ar' ? 'تم انشاء قسم الأسئلة بنجاح!' : 'FAQ Category created successfully!'
        );
        if (onSuccess) onSuccess();
        closeModal();
      } catch (error) {
        console.error('API Error:', error);
        toast.error(
          lang === 'ar'
            ? 'فشل في انشاء قسم الأسئلة. حاول مجدداً.'
            : 'Failed to create FAQ Category. Please try again.'
        );
      }
    },
  });

  const handleAddFaq = () => setFaqs([...faqs, { question: '', questionAr: '', answer: '', answerAr: '' }]);
  
  const handleRemoveFaq = (index: number) => setFaqs(faqs.filter((_, i) => i !== index));
  const handleFaqChange = (index: number, field: 'question' | 'questionAr' | 'answer' | 'answerAr', value: string) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index][field] = value;
    setFaqs(updatedFaqs);
  };
  const handleImageSelect = (imageId: string) => {
    mainFormik.setFieldValue('imageId', imageId);
  };

  if (loadingImages) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader className="animate-spin text-[#e11d48]" width={40} height={40} />
      </div>
    );
  }
  return (
    <div className='py-1'>
      <div className={`m-auto ps-3 rounded-xl pe-1.5 me-1.5 pb-4 pt-4 IBM-Plex-sans ${styles.customScroll}`}>
        <div className="mb-6 flex items-center justify-between">
          <Title as="h3" className="text-lg IBM-Plex-sans">{title || text.submit}</Title>
          <ActionIcon size="sm" variant="text" onClick={closeModal} className="p-0 text-gray-500 hover:!text-gray-900">
            <PiXBold className="h-[18px] w-[18px]" />
          </ActionIcon>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          mainFormik.handleSubmit();
        }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label={text.nameAr} placeholder={text.nameAr} name="nameAr" value={mainFormik.values.nameAr} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.nameAr && mainFormik.errors.nameAr ? mainFormik.errors.nameAr : ''} className="" />
            <Input label={text.nameEn} placeholder={text.nameEn} name="nameEn" value={mainFormik.values.nameEn} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.nameEn && mainFormik.errors.nameEn ? mainFormik.errors.nameEn : ''} className="" />
            <Input label={text.titleAr} placeholder={text.titleAr} name="titleAr" value={mainFormik.values.titleAr} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.titleAr && mainFormik.errors.titleAr ? mainFormik.errors.titleAr : ''} className="" />
            <Input label={text.titleEn} placeholder={text.titleEn} name="titleEn" value={mainFormik.values.titleEn} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.titleEn && mainFormik.errors.titleEn ? mainFormik.errors.titleEn : ''} className="" />
            <Input label={text.metaDescriptionAr} placeholder={text.metaDescriptionAr} name="metaDescriptionAr" value={mainFormik.values.metaDescriptionAr} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.metaDescriptionAr && mainFormik.errors.metaDescriptionAr ? mainFormik.errors.metaDescriptionAr : ''} className="" />
            <Input label={text.metaDescriptionEn} placeholder={text.metaDescriptionEn} name="metaDescriptionEn" value={mainFormik.values.metaDescriptionEn} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.metaDescriptionEn && mainFormik.errors.metaDescriptionEn ? mainFormik.errors.metaDescriptionEn : ''} className="" />
          </div>
          <div className="my-4">
            <label className="block text-sm font-medium mb-2">{text.chooseImage}</label>
            <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              {images.map((image) => (
                <label
                  key={image.id}
                  className={`cursor-pointer flex flex-col items-center border-2 p-2 rounded-lg transition-all ${
                    mainFormik.values.imageId === image.id
                      ? 'border-blue-500 bg-blue-100'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="image"
                    value={image.id}
                    checked={mainFormik.values.imageId === image.id}
                    onChange={() => handleImageSelect(image.id)}
                    className="hidden"
                  />
                  <img src={image.imageUrl} alt="FAQ Category" className="max-w-full max-h-24" />
                </label>
              ))}
            </div>
            {mainFormik.touched.imageId && mainFormik.errors.imageId && (
              <p className="text-red-500 text-sm mt-1">{mainFormik.errors.imageId}</p>
            )}
          </div>

          {/* Questions Section */}
          {faqs.length != 0  &&(
            <div className="p-3 border border-gray-200 rounded-md mb-4">
              <div className="flex justify-between items-center mb-3">
                <label htmlFor="Questions" className="block text-sm font-semibold">
                  {text.addQuestions}
                </label>
                <ActionIcon onClick={() => setFaqs([])} className="text-white bg-[#b90d29] hover:bg-[#8d0a20]">
                  <PiMinusBold />
                </ActionIcon>
              </div>
              {faqs.map((faq, index) => (
                <div key={index} className="relative p-3 border border-gray-200 rounded-md mb-4">
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 mt-6'>
                    <Input
                      value={faq.question}
                      placeholder={`${text.QuestionEn} ${lang === 'ar'? ' رقم':''} ${index+1}`}
                      onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                    />
                    <Input
                      value={faq.questionAr}
                      placeholder={`${text.QuestionAr} ${lang === 'ar'? ' رقم':''} ${index+1}`}
                      onChange={(e) => handleFaqChange(index, 'questionAr', e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-4 mb-3 rtl:ltr">
                  {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3"> */}
                  {/* <QuillEditor
                    value={faq.answer}
                    placeholder={`${text.AnswerEn} ${lang === 'ar' ? ' السؤال رقم' : 'question number '} ${index + 1}`}
                    onChange={(value) => {
                      console.log("value: ", value);
                      handleFaqChange(index, 'answer', value);
                    }}
                    className="@3xl:col-span-2 [&>.ql-container_.ql-editor]:min-h-[100px] text-left"
                    labelClassName="font-medium text-gray-700 dark:text-gray-600 mb-1.5"
                    lang={lang}
                  /> */}

                    <QuillEditor
                      value={faq.answer}
                      placeholder={`${text.AnswerEn} ${lang === 'ar' ? ' السؤال رقم' : 'question number '} ${index + 1}`}
                      onChange={(value) => {
                        console.log("value: ", value);
                        handleFaqChange(index, 'answer', value);
                      }}
                      className={`@3xl:col-span-2 [&>.ql-container_.ql-editor]:min-h-[100px]`}
                      labelClassName="font-medium text-gray-700 dark:text-gray-600 mb-1.5"
                      modules={{
                        toolbar: [
                          [{ direction: 'rtl' }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [{ list: 'ordered' }, { list: 'bullet' }],
                          [{ align: [] }],
                          [{ color: [] }, { background: [] }],
                          ['clean']
                        ]
                      }}
                    />
                    <QuillEditor
                      value={faq.answerAr}
                      placeholder={`${text.AnswerAr} ${lang === 'ar' ? ' السؤال رقم' : 'question number '} ${index + 1}`}
                      onChange={(value) => {
                        console.log("valueAr: ", value);
                        handleFaqChange(index, 'answerAr', value);
                      }}
                      className={`@3xl:col-span-2 [&>.ql-container_.ql-editor]:min-h-[100px]`}
                      labelClassName="font-medium text-gray-700 dark:text-gray-600 mb-1.5"
                      modules={{
                        toolbar: [
                          [{ direction: 'rtl' }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [{ list: 'ordered' }, { list: 'bullet' }],
                          [{ align: [] }],
                          [{ color: [] }, { background: [] }],
                          ['clean']
                        ]
                      }}
                    />
                    {/* <Textarea
                      value={faq.answer}
                      placeholder={`${text.AnswerEn} ${lang === 'ar'? ' السؤال رقم':'question number '} ${index+1}`}
                      onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                      className='flex-1'
                    /> */}
                    {/* <Textarea
                      value={faq.answerAr}
                      placeholder={`${text.AnswerAr} ${lang === 'ar'? ' السؤال رقم':'question number '} ${index+1}`}
                      onChange={(e) => handleFaqChange(index, 'answerAr', e.target.value)}
                      className='flex-1'
                    /> */}
                  </div>
                  <button
                    type="button"
                    title={`${lang === 'ar'? 'حذف':'remove'}`}
                    className="absolute top-0 right-0 text-[#c4c4c4] hover:text-[#404040] p-2"
                    onClick={() => handleRemoveFaq(index)}
                  >
                    <PiXBold className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-end gap-3 mb-4">
            <Button onClick={handleAddFaq} variant="outline" className="w-full border border-[#404040] hover:border-[#404040] bg-white hover:bg-[#404040] text-[#404040] hover:text-white transition-all duration-300 ease-in-out">
              {text.addQuestions}<PiPlusBold className="ms-1.5 h-[17px] w-[17px]" />
            </Button>
            <Button type="submit" className="w-full bg-[#404040] hover:bg-[#323232] text-white transition-all duration-300 ease-in-out">
              {text.submit}<PiPlusBold className="ms-1.5 h-[17px] w-[17px]" />
            </Button>
          </div> 

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            
          </div>
        </form>
      </div>
    </div>
  );
}
