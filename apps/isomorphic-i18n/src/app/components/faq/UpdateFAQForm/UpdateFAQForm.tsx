'use client';

import dynamic from 'next/dynamic';
import { PiXBold, PiPlusBold, PiMinusBold } from 'react-icons/pi';
import React, { useEffect, useState } from 'react';
import { ActionIcon, Title, Button, Input, Textarea } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import toast from 'react-hot-toast';
import styles from '../AddFaqForm/FAQForm.module.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Loader } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import axiosClient from '../../context/api';

const QuillEditor = dynamic(() => import('@ui/quill-editor'), {
  ssr: false,
});

type FAQ = {
  id?: string;
  questionEn: string;
  questionAr: string;
  answerEn: string;
  answerAr: string;
};

type ImageOption = {
  id: string;
  imageUrl: string;
};

type UpdateFAQFormProps = {
  title?: string;
  onSuccess?: () => void;
  lang: string;
  row: any;
  languages: number;
};

export default function UpdateFAQForm({
  title,
  onSuccess,
  lang = 'en',
  row,
  languages
}: UpdateFAQFormProps) {   
  const { closeModal } = useModal();
  
  const [faqs, setFaqs] = useState<FAQ[]>(row.faQs);
  const [images, setImages] = useState<ImageOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);

  const fetchCategoryData = async (id: string) => {
    try {
      const response = await axiosClient.get(`/api/FAQCategory/GetById/${id}`);
      const data = response.data;

      setFaqs(data.faQs || []);
      mainFormik.setValues({
        nameAr: languages === 1? 'no data' : data.nameAr || '',
        nameEn: languages === 0? 'no data' : data.nameEn || '',
        titleAr: languages === 1? 'no data' : data.titleAr || '',
        titleEn: languages === 0? 'no data' :data.titleEn || '',
        metaDescriptionAr: languages === 1? 'no data' : data.metaDescriptionAr || '',
        metaDescriptionEn: languages === 0? 'no data' :data.metaDescriptionEn || '',
        imageId: data.imageId || '',
      });
    } catch (error) {
      console.error('Error fetching category data:', error);
      toast.error(lang === 'ar' ? 'فشل في تحميل البيانات.' : 'Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async () => {
    setLoadingImages(true);
    try {
      const response = await axiosClient.get('/api/FAQCategory/GetShopFAQCategoriesImages');
      setImages(response.data);
      console.log(response.data);
      
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoadingImages(false);
    }
  };

  useEffect(() => {
    if (row?.id) {
      fetchCategoryData(row.id);
      fetchImages();
    }
  }, [row?.id]);


  const text = {
    nameAr: lang === 'ar' ? 'الأسم (عربي)' : 'Name (Arabic)',
    nameEn: lang === 'ar' ? 'الأسم (انجليزي)' : 'Name (English)',
    titleAr: lang === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)',
    titleEn: lang === 'ar' ? 'العنوان (انجليزي)' : 'Title (English)',
    metaDescriptionAr: lang === 'ar' ? 'وصف الميتا (عربي)' : 'Meta Description (Arabic)',
    metaDescriptionEn: lang === 'ar' ? 'وصف الميتا (انجليزي)' : 'Meta Description (English)',
    chooseImage: lang === 'ar' ? 'اختر صورة' : 'Choose an Image',

    addQuestions: lang === 'ar' ? 'أسئلة' : 'Questions',
    questionsPlaceholder: lang === 'ar' ? 'سؤال رقم' : 'Question',
    QuestionEn: lang === 'ar' ? 'السؤال (انجليزي)' : "Question (English)",
    QuestionAr: lang === 'ar' ? 'السؤال (عربي)' : "Question (Arabic)",
    AnswerEn: lang === 'ar' ? "الإجابة (انجليزي)" : "Answer (English)",
    AnswerAr: lang === 'ar' ? "الإجابة (عربي)" : "Answer (Arabic)",
    submit: lang === 'ar' ? 'تعديل' : 'Update',
  };
  // const fetchImages = async () => {
  //   setLoadingImages(true);
  //   try {
  //     const response = await axiosClient.get('/api/FAQCategory/GetShopFAQCategoriesImages');
  //     setImages(response.data);
  //   } catch (error) {
  //     console.error('Error fetching images:', error);
  //   } finally {
  //     setLoadingImages(false);
  //   }
  // };
  // useEffect(() => {
  //   fetchImages();
  // }, []);

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
      nameAr: languages === 1? 'no data' : '',
      nameEn: languages === 0? 'no data' : '',
      titleAr: languages === 1? 'no data' : '',
      titleEn: languages === 0? 'no data' : '',
      metaDescriptionAr: languages === 1? 'no data' : '',
      metaDescriptionEn: languages === 0? 'no data' : '',
      imageId: images.find((img) => img.imageUrl === row.image)?.id || '',
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
          faQs: faqs.map((faq) => ({
            id: faq.id || undefined,
            questionAr: faq.questionAr,
            questionEn: faq.questionEn,
            answerAr: faq.answerAr,
            answerEn: faq.answerEn,
          })),
        };
        console.log("requestBody: ",requestBody);
  
        const response = await axiosClient.put(`/api/FAQCategory/Update/${row.id}`, requestBody);
  
        toast.success(
          lang === 'ar' ? 'تم تحديث قسم الأسئلة بنجاح!' : 'FAQ Category updated successfully!'
        );
        if (onSuccess) onSuccess();
        closeModal();
      } catch (error) {
        console.error('API Error:', error);
        toast.error(
          lang === 'ar'
            ? 'فشل في تحديث قسم الأسئلة. حاول مجدداً.'
            : 'Failed to update FAQ Category. Please try again.'
        );
      }
    },
  });

  const handleAddFaq = () => setFaqs([...faqs, { questionEn: languages === 0 ? 'no data' : '', questionAr: languages === 1 ? 'no data' : '', answerEn: languages === 0 ? 'no data' : '', answerAr: languages === 1 ? 'no data' : '' }]);
  
  const handleRemoveFaq = (index: number) => setFaqs(faqs.filter((_, i) => i !== index));
  const handleFaqChange = (index: number, field: 'questionEn' | 'questionAr' | 'answerEn' | 'answerAr', value: string) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index][field] = value;
    setFaqs(updatedFaqs);
  };
  const handleImageSelect = (imageId: string) => {
    mainFormik.setFieldValue('imageId', imageId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader className="animate-spin text-[#e11d48]" width={40} height={40} />
      </div>
    );
  }

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
            {languages!=1 &&(
              <Input label={text.nameAr} placeholder={text.nameAr} name="nameAr" value={mainFormik.values.nameAr} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={typeof mainFormik.errors.nameAr === 'string' ? mainFormik.errors.nameAr : undefined} className="" />
            )}
            {languages!=0 &&(
              <Input label={text.nameEn} placeholder={text.nameEn} name="nameEn" value={mainFormik.values.nameEn} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={typeof mainFormik.errors.nameEn === 'string' ? mainFormik.errors.nameEn : undefined} className="" />
            )}
            {languages!=1 &&(
              <Input label={text.titleAr} placeholder={text.titleAr} name="titleAr" value={mainFormik.values.titleAr} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.titleAr && mainFormik.errors.titleAr ? mainFormik.errors.titleAr : ''} className="" />
            )}
            {languages!=0 &&(
              <Input label={text.titleEn} placeholder={text.titleEn} name="titleEn" value={mainFormik.values.titleEn} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.titleEn && mainFormik.errors.titleEn ? mainFormik.errors.titleEn : ''} className="" />
            )}
            {languages!=1 &&(
              <Input label={text.metaDescriptionAr} placeholder={text.metaDescriptionAr} name="metaDescriptionAr" value={mainFormik.values.metaDescriptionAr} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.metaDescriptionAr && mainFormik.errors.metaDescriptionAr ? mainFormik.errors.metaDescriptionAr : ''} className="" />
            )}
            {languages!=0 &&(
              <Input label={text.metaDescriptionEn} placeholder={text.metaDescriptionEn} name="metaDescriptionEn" value={mainFormik.values.metaDescriptionEn} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.metaDescriptionEn && mainFormik.errors.metaDescriptionEn ? mainFormik.errors.metaDescriptionEn : ''} className="" />            
            )}
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
                  <div className={`grid grid-cols-1 ${languages === 2 ? 'md:grid-cols-2': ''} gap-4 mb-3 mt-6`}>
                    {languages!=1 &&(
                      <Input
                        value={faq.questionAr}
                        placeholder={`${text.QuestionAr} ${lang === 'ar'? ' رقم':''} ${index+1}`}
                        onChange={(e) => handleFaqChange(index, 'questionAr', e.target.value)}
                      />
                    )}
                    {languages!=0 &&(
                      <Input
                        value={faq.questionEn}
                        placeholder={`${text.QuestionEn} ${lang === 'ar'? ' رقم':''} ${index+1}`}
                        onChange={(e) => handleFaqChange(index, 'questionEn', e.target.value)}
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-4 mb-3 rtl:ltr">
                  {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3"> */}
                    {languages!=1 &&(
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
                    )}
                    {languages!=0 &&(
                      <QuillEditor
                        value={faq.answerEn}
                        placeholder={`${text.AnswerEn} ${lang === 'ar' ? ' السؤال رقم' : 'question number '} ${index + 1}`}
                        onChange={(value) => {
                          console.log("value: ", value);
                          handleFaqChange(index, 'answerEn', value);
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
                    )}
                    {/* <Textarea
                      value={faq.answerEn}
                      placeholder={`${text.AnswerEn} ${lang === 'ar'? ' السؤال رقم':'question number '} ${index+1}`}
                      onChange={(e) => handleFaqChange(index, 'answerEn', e.target.value)}
                      className='flex-1'
                    />
                    <Textarea
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
          <div className="flex justify-end gap-3 mb-0">
            <Button onClick={handleAddFaq} variant="outline" className="w-full">
              {text.addQuestions}<PiPlusBold className="ms-1.5 h-[17px] w-[17px]" />
            </Button>
            <Button type="submit" className="w-full">
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
