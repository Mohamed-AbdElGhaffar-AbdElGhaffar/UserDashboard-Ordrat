'use client';

import { PiXBold, PiPlusBold, PiMinusBold, PiUploadSimple, PiTrashBold } from 'react-icons/pi';
import React, { useEffect, useState } from 'react';
import { ActionIcon, Title, Button, Input, Textarea } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import toast from 'react-hot-toast';
import styles from '../Form.module.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Loader } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import FileUpload from '@/app/shared/image-form-upload';
import Image from 'next/image';
import { useUserContext } from '@/app/components/context/UserContext';
import axiosClient from '@/app/components/context/api';

type Sections = {
  id?: string;
  image: File | null;
  titleAr: string;
  titleEn: string;
  contentAr: string;
  contentEn: string;
  additionalInfoAr: string;
  additionalInfoEn: string;
};

type UpdateProductFormProps = {
  title?: string;
  onSuccess?: () => void;
  lang: string;
  row: any;
};

export default function UpdateProductForm({
  title,
  onSuccess,
  lang = 'en',
  row
}: UpdateProductFormProps) {
  const { closeModal } = useModal();
  const { fileData, setFileData } = useUserContext();
  const [sections, setSections] = useState<Sections[]>([]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null | string>(null);
  
  const text = {
    nameAr: lang === 'ar' ? 'الأسم (عربي)' : 'Name (Arabic)',
    nameEn: lang === 'ar' ? 'الأسم (انجليزي)' : 'Name (English)',
    DescriptionAr: lang === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)',
    DescriptionEn: lang === 'ar' ? 'الوصف (انجليزي)' : 'Description (English)',
    MetaDescriptionAr: lang === 'ar' ? 'وصف جوجل (عربي)' : 'Meta Description (Arabic)',
    MetaDescriptionEn: lang === 'ar' ? 'وصف جوجل (انجليزي)' : 'Meta Description (English)',
    SlugAr: lang === 'ar' ? 'اسم جانبي (عربي)' : 'Slug (Arabic)',
    SlugEn: lang === 'ar' ? 'اسم جانبي (انجليزي)' : 'Slug (English)',
    TagsAr: lang === 'ar' ? 'العلامات (عربي)' : 'Tags (Arabic)',
    TagsEn: lang === 'ar' ? 'العلامات (انجليزي)' : 'Tags (English)',
    image: lang === 'ar' ? 'الصورة' : 'Image',

    addSections: lang === 'ar' ? 'السكاشن' : 'Sections',
    titleEn: lang === 'ar' ? 'الاسم (انجليزي)' : "title (English)",
    titleAr: lang === 'ar' ? 'الاسم (عربي)' : "title (Arabic)",
    contentEn: lang === 'ar' ? "المحتوى (انجليزي)" : "content (English)",
    contentAr: lang === 'ar' ? "المحتوى (عربي)" : "content (Arabic)",
    additionalInfoEn: lang === 'ar' ? "معلومات اضافية (انجليزي)" : "Additional Info (English)",
    additionalInfoAr: lang === 'ar' ? "معلومات اضافية (عربي)" : "Additional Info (Arabic)",
    submit: lang === 'ar' ? 'تعديل' : 'Update',
  };
  
  const requiredMessage = lang === 'ar' ? 'مطلوب' : 'is required';

  const mainFormSchema = Yup.object().shape({
    nameAr: Yup.string().required(text.nameAr + ' ' + requiredMessage),
    nameEn: Yup.string().required(text.nameEn + ' ' + requiredMessage),
    DescriptionAr: Yup.string().required(text.DescriptionAr + ' ' + requiredMessage),
    DescriptionEn: Yup.string().required(text.DescriptionEn + ' ' + requiredMessage),
    MetaDescriptionAr: Yup.string().required(text.MetaDescriptionAr + ' ' + requiredMessage),
    MetaDescriptionEn: Yup.string().required(text.MetaDescriptionEn + ' ' + requiredMessage),
    SlugAr: Yup.string().required(text.SlugAr + ' ' + requiredMessage),
    SlugEn: Yup.string().required(text.SlugEn + ' ' + requiredMessage),
    TagsAr: Yup.string().required(text.TagsAr + ' ' + requiredMessage),
    TagsEn: Yup.string().required(text.TagsEn + ' ' + requiredMessage),
    image: Yup.string().required(text.image + ' ' + requiredMessage)
  });
  const fetchArticle = async () => {
    setLoading(true);
    try {
      const { data } = await axiosClient.get(
        `/api/Article/GetById/${row.id}`,
        {
          headers: {
            'Accept-Language': lang,
          },
        }
      );
      setSections(data.sections.map((section: any) => ({
        id: section.id,
        image: section.imageUrl,
        titleAr: section.titleAr,
        titleEn: section.titleEn,
        contentAr: section.contentAr,
        contentEn: section.contentEn,
        additionalInfoAr: section.additionalInfoAr || '',
        additionalInfoEn: section.additionalInfoEn || '',
      })));
      mainFormik.setValues({
        nameAr: data.titleAr,
        nameEn: data.titleEn,
        DescriptionAr: data.descriptionAr,
        DescriptionEn: data.descriptionEn,
        MetaDescriptionAr: data.metaDescriptionAr,
        MetaDescriptionEn: data.metaDescriptionEn,
        SlugAr: data.slugAr,
        SlugEn: data.slugEn,
        TagsAr: data.tagsAr,
        TagsEn: data.tagsEn,
        image: data.imageUrl,
      });
      setImage(data.imageUrl);
    } catch (error) {
      toast.error('Failed to load article data.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchArticle();
    setFileData(true);
  }, [row]); 
  const mainFormik = useFormik({
    initialValues: {
      nameAr: '',
      nameEn: '',
      DescriptionAr: '',
      DescriptionEn: '',
      MetaDescriptionAr: '',
      MetaDescriptionEn: '',
      SlugAr: '',
      SlugEn: '',
      TagsAr: '',
      TagsEn: '',
      image: '',
    },
    validationSchema: mainFormSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('TitleAr', values.nameAr);
      formData.append('TitleEn', values.nameEn);
      formData.append('DescriptionAr', values.DescriptionAr);
      formData.append('DescriptionEn', values.DescriptionEn);
      formData.append('MetaDescriptionAr', values.MetaDescriptionAr);
      formData.append('MetaDescriptionEn', values.MetaDescriptionEn);
      formData.append('SlugAr', values.SlugAr);
      formData.append('SlugEn', values.SlugEn);
      formData.append('TagsAr', values.TagsAr);
      formData.append('TagsEn', values.TagsEn);
      // Append Sections
      sections.forEach((section, index) => {
        if(section.id){
          formData.append(`Sections[${index}].id`, section.id);
        }
        formData.append(`Sections[${index}].titleEn`, section.titleEn);
        formData.append(`Sections[${index}].titleAr`, section.titleAr);
        formData.append(`Sections[${index}].contentEn`, section.contentEn);
        formData.append(`Sections[${index}].contentAr`, section.contentAr);
        formData.append(`Sections[${index}].additionalInfoEn`, section.additionalInfoEn);
        formData.append(`Sections[${index}].additionalInfoAr`, section.additionalInfoAr);
        if (section.image instanceof File) {
          formData.append(`Sections[${index}].image`, section.image);
        }
      });
      if (values.image == 'file' && image) {
        formData.append('Image', image);
      }
      
      try {
        const response = await axiosClient.put(`/api/Article/Update/${row.id}`, formData);

        toast.success(
          lang === 'ar' ? 'تم تحديث المقالة بنجاح!' : 'Artical updated successfully!'
        );
        if (onSuccess) onSuccess();
        closeModal();
      } catch (error) {
        console.error('API Error:', error);
        toast.error(
          lang === 'ar'
            ? 'فشل في تحديث المقالة. حاول مجدداً.'
            : 'Failed to update Artical. Please try again.'
        );
      }
    },
  });

  const handleAddSections = () => setSections([...sections, { titleEn: '', titleAr: '', contentEn: '', contentAr: '', additionalInfoEn: '', additionalInfoAr: '', image: null }]);
  
  const handleRemoveSections = (index: number) => setSections(sections.filter((_, i) => i !== index));
  const handleSectionsChange = (index: number, field: 'titleEn' | 'titleAr' | 'contentEn' | 'contentAr' | 'additionalInfoEn' | 'additionalInfoAr', value: string) => {
    const updatedSections = [...sections];
    updatedSections[index][field] = value;
    setSections(updatedSections);
  };

  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const updatedPictures = [...sections];
      updatedPictures[index].image = file;
      setSections(updatedPictures);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedPictures = [...sections];
    updatedPictures[index].image = null;
    setSections(updatedPictures);
  };  

  if (loading) {
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
            <Input label={text.DescriptionAr} placeholder={text.DescriptionAr} name="DescriptionAr" value={mainFormik.values.DescriptionAr} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.DescriptionAr && mainFormik.errors.DescriptionAr ? mainFormik.errors.DescriptionAr : ''} className="" />
            <Input label={text.DescriptionEn} placeholder={text.DescriptionEn} name="DescriptionEn" value={mainFormik.values.DescriptionEn} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.DescriptionEn && mainFormik.errors.DescriptionEn ? mainFormik.errors.DescriptionEn : ''} className="" />
            <Input label={text.MetaDescriptionAr} placeholder={text.MetaDescriptionAr} name="MetaDescriptionAr" value={mainFormik.values.MetaDescriptionAr} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.MetaDescriptionAr && mainFormik.errors.MetaDescriptionAr ? mainFormik.errors.MetaDescriptionAr : ''} className="" />
            <Input label={text.MetaDescriptionEn} placeholder={text.MetaDescriptionEn} name="MetaDescriptionEn" value={mainFormik.values.MetaDescriptionEn} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.MetaDescriptionEn && mainFormik.errors.MetaDescriptionEn ? mainFormik.errors.MetaDescriptionEn : ''} className="" />
            <Input label={text.SlugAr} placeholder={text.SlugAr} name="SlugAr" value={mainFormik.values.SlugAr} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.SlugAr && mainFormik.errors.SlugAr ? mainFormik.errors.SlugAr : ''} className="" />
            <Input label={text.SlugEn} placeholder={text.SlugEn} name="SlugEn" value={mainFormik.values.SlugEn} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.SlugEn && mainFormik.errors.SlugEn ? mainFormik.errors.SlugEn : ''} className="" />
            <Input label={text.TagsAr} placeholder={text.TagsAr} name="TagsAr" value={mainFormik.values.TagsAr} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.TagsAr && mainFormik.errors.TagsAr ? mainFormik.errors.TagsAr : ''} className="" />
            <Input label={text.TagsEn} placeholder={text.TagsEn} name="TagsEn" value={mainFormik.values.TagsEn} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.TagsEn && mainFormik.errors.TagsEn ? mainFormik.errors.TagsEn : ''} className="" />
          </div>
          <FileUpload
            label={text.image}
            accept="img"
            multiple={false}
            multipleFiles={false}
            lang={lang}
            onFileChange={(file) => {
              setImage(file || null);
              mainFormik.setFieldValue('image', 'file');
            }}
            onFileDelete={() => {
              setImage(null);
              mainFormik.setFieldValue('image', null);
            }}
            initialImage={row?.imageUrl}
          />
          {mainFormik.touched.image && mainFormik.errors.image && (
            <div className={`text-red-500 text-sm ${fileData? '' : 'mb-6' }`}>{typeof mainFormik.errors.image === 'string' ? mainFormik.errors.image : undefined}</div>
          )}
          {/* Sections Section */}
          {sections.length != 0  &&(
            <div className="p-3 border border-gray-200 rounded-md mb-4">
              <div className="flex justify-between items-center mb-3">
                <label htmlFor="Sections" className="block text-sm font-semibold">
                  {text.addSections}
                </label>
                <ActionIcon onClick={() => setSections([])} className="text-white bg-[#b90d29] hover:bg-[#8d0a20]">
                  <PiMinusBold />
                </ActionIcon>
              </div>
              {sections.map((section, index) => (
                <div key={index} className="relative p-3 border border-gray-200 rounded-md mb-4">
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 mt-6'>
                    <Input
                      value={section.titleEn}
                      placeholder={`${text.titleEn} ${lang === 'ar'? ' رقم':''} ${index+1}`}
                      onChange={(e) => handleSectionsChange(index, 'titleEn', e.target.value)}
                    />
                    <Input
                      value={section.titleAr}
                      placeholder={`${text.titleAr} ${lang === 'ar'? ' رقم':''} ${index+1}`}
                      onChange={(e) => handleSectionsChange(index, 'titleAr', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <Textarea
                      value={section.contentEn}
                      placeholder={`${text.contentEn} ${lang === 'ar'? ' رقم':'number '} ${index+1}`}
                      onChange={(e) => handleSectionsChange(index, 'contentEn', e.target.value)}
                      className='flex-1'
                    />
                    <Textarea
                      value={section.contentAr}
                      placeholder={`${text.contentAr} ${lang === 'ar'? ' رقم':'number '} ${index+1}`}
                      onChange={(e) => handleSectionsChange(index, 'contentAr', e.target.value)}
                      className='flex-1'
                    />
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 mt-6'>
                    <Input
                      value={section.additionalInfoEn}
                      placeholder={`${text.additionalInfoEn} ${lang === 'ar'? ' رقم':''} ${index+1}`}
                      onChange={(e) => handleSectionsChange(index, 'additionalInfoEn', e.target.value)}
                    />
                    <Input
                      value={section.additionalInfoAr}
                      placeholder={`${text.additionalInfoAr} ${lang === 'ar'? ' رقم':''} ${index+1}`}
                      onChange={(e) => handleSectionsChange(index, 'additionalInfoAr', e.target.value)}
                    />
                  </div>
                  <div className="">
                    <div className='flex flex-col md:flex-row gap-4 mb-3 mt-6'>
                      {section.image ? (
                        <></>
                      ) : (
                        <label className="w-fit cursor-pointer bg-gray-100 border border-gray-300 rounded-md px-6 md:px-3 py-2 text-sm">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, index)}
                          />
                          <PiUploadSimple className="w-4 h-4 text-gray-600" />
                        </label>
                      )}
                    </div>
                    <div className="flex justify-center items-center gap-4">
                      {section.image && (
                        <div className="flex min-h-[58px] w-full items-center rounded-xl border border-muted px-3 dark:border-gray-300">
                          <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-muted bg-gray-50 object-cover px-2 py-1.5 dark:bg-transparent">
                            {section.image instanceof File && section.image.type.includes('image') ? (
                              <Image
                                src={URL.createObjectURL(section.image)}
                                fill
                                className="object-contain"
                                priority
                                alt={section.image.name}
                                sizes="(max-width: 768px) 100vw"
                              />
                            ) : typeof section.image === 'string' ? (
                              <Image
                                src={section.image}
                                fill
                                className="object-contain"
                                priority
                                alt="Preloaded Image"
                                sizes="(max-width: 768px) 100vw"
                              />
                            ) : (
                              <span className="text-gray-400">No Image</span>
                            )}
                          </div>
                          <div className="truncate px-2.5">
                            {section.image instanceof File ? section.image.name : 'Existing Image'}
                          </div>
                          <ActionIcon
                            onClick={() => handleRemoveImage(index)}
                            size="sm"
                            variant="flat"
                            color="danger"
                            className="ms-auto flex-shrink-0 p-0 dark:bg-red-dark/20"
                          >
                            <PiTrashBold className="w-6" />
                          </ActionIcon>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    title={`${lang === 'ar'? 'حذف':'remove'}`}
                    className="absolute top-0 right-0 text-[#c4c4c4] hover:text-[#404040] p-2"
                    onClick={() => handleRemoveSections(index)}
                  >
                    <PiXBold className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-end gap-3 mb-4">
            <Button onClick={handleAddSections} variant="outline" className="w-full border border-[#404040] hover:border-[#404040] bg-white hover:bg-[#404040] text-[#404040] hover:text-white transition-all duration-300 ease-in-out">
              {text.addSections}<PiPlusBold className="ms-1.5 h-[17px] w-[17px]" />
            </Button>
            <Button type="submit" className="w-full bg-[#404040] hover:bg-[#323232] text-white transition-all duration-300 ease-in-out">
              {text.submit}<PiPlusBold className="ms-1.5 h-[17px] w-[17px]" />
            </Button>
          </div> 
        </form>
      </div>
    </div>
  );
}
