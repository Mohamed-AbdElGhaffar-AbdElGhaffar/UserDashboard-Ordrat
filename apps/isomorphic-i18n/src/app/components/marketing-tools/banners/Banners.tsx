'use client';

import React, { useEffect, useState } from 'react';
// import axiosClient from 'axiosClient';
import { ActionIcon, Button, Empty, Input, Text } from 'rizzui';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import axiosClient from '../../context/api';
import { PiTrashBold } from 'react-icons/pi';
import { useUserContext } from '../../context/UserContext';
import Link from 'next/link';

function Banners({ shopId, lang, data }: { shopId: string; lang: string; data:any; }) {
    const [banners, setBanners] = useState<{ id: string; bannerUrl: string; actionString: string }[]>(data);
    const { bannersData, setBannersData, setProgressData } = useUserContext();

    const text = {
        link: lang === 'ar' ? 'الرابط' : 'Link',
        title: lang === 'ar' ? 'البانرات' : 'Banners',
        delete: lang === 'ar' ? 'حذف' : 'Trash',
    };

    // Fetch banners from API
    const fetchBanners = async () => {
        try {
            const { data: newData } = await axiosClient.get(`/api/Banner/GetAll/${shopId}`);
            const areEqual =
            JSON.stringify(newData) === JSON.stringify(data);

            if (!areEqual) {
                setBanners(newData);
            }
        } catch (error) {
            toast.error(lang === 'ar' ? 'فشل تحميل البانرات' : 'Failed to load banners');
        }
    };

    // Delete banner
    const handleDelete = async (id: string) => {
        try {
            await axiosClient.delete(`/api/Banner/Delete/${id}`);
            toast.success(lang === 'ar' ? 'تم الحذف بنجاح' : 'Deleted successfully');
            setBannersData(true);
            setProgressData(true);
        } catch (error) {
            toast.error(lang === 'ar' ? 'فشل الحذف' : 'Failed to delete');
        }
    };

    // Update banner link
    const handleUpdate = async (id: string, newValue: string) => {
        try {
            const formData = new FormData();
            formData.append('ActionString', newValue);
            await axiosClient.put(`/api/Banner/Update/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success(lang === 'ar' ? 'تم التحديث' : 'Updated successfully');
            setBannersData(true);
            setProgressData(true);
        } catch (error) {
            toast.error(lang === 'ar' ? 'فشل التحديث' : 'Failed to update');
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    useEffect(() => {
        if (bannersData == true) {
            fetchBanners();
            setBannersData(false);
        }
    }, [bannersData]); 

    return (
        <div className="w-full">
            <div className="">
                <h2 className="mb-4 text-lg font-semibold text-gray-700">{text.title}</h2>
                {banners.length == 0?
                    <div className="py-5 text-center lg:py-8">
                        <Empty /> <Text className="mt-3">{lang === 'ar' ? 'لا توجد بانرات' : 'No Banners'}</Text>
                    </div>
                    :
                    <div className="Banners grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 3xl:grid-cols-4 gap-5">
                        {banners.map((banner) => (
                            <div
                                key={banner.id}
                                className="relative p-3 border rounded-lg bg-white shadow hover:shadow-md transition-all duration-300 hover:-translate-y-[5px]"
                            >
                                {/* Image */}
                                <img
                                    src={banner.bannerUrl}
                                    alt="Banner"
                                    className="w-full h-[140px] lg:h-[200px] rounded-md object-cover"
                                />

                                {/* Input Field */}
                                {/* <Input
                                    type="text"
                                    defaultValue={banner.actionString}
                                    onBlur={(e) => handleUpdate(banner.id, e.target.value)}
                                    className="mt-3 w-full text-sm"
                                /> */}
                                <Link
                                    href={banner.actionString}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-3 block text-sm font-semibold truncate text-blue-600 hover:underline"
                                >
                                    {banner.actionString}
                                </Link>

                                {/* Delete Button */}
                                <Button
                                    color="danger"
                                    onClick={() => handleDelete(banner.id)}
                                    className="absolute top-2 right-2 p-2 flex items-center justify-center rounded-full shadow-md bg-red-500 text-white hover:bg-red-600 transition-all"
                                >
                                    <PiTrashBold className="w-5 h-5" />
                                </Button>
                            </div>
                        ))}
                    </div>
                }
            </div>
        </div>
    );
}

export default Banners;
