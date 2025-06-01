'use client';

import { ShopInfo } from '@/types';
import React, { createContext, useContext, useState, ReactNode } from 'react';


type UserContextType = {
  shop: ShopInfo | undefined;
  setShop: React.Dispatch<React.SetStateAction<ShopInfo | undefined>>;
  fileData: boolean;
  setFileData: React.Dispatch<React.SetStateAction<boolean>>;
  branchesData: boolean;
  setBranchesData: React.Dispatch<React.SetStateAction<boolean>>;
  printersData: boolean;
  setPrintersData: React.Dispatch<React.SetStateAction<boolean>>;
  tablesData: boolean;
  setTablesData: React.Dispatch<React.SetStateAction<boolean>>;
  groupsPermissions: boolean;
  setGroupsPermissions: React.Dispatch<React.SetStateAction<boolean>>;
  bannersData: boolean;
  setBannersData: React.Dispatch<React.SetStateAction<boolean>>;
  whatsAppData: boolean;
  setWhatsAppData: React.Dispatch<React.SetStateAction<boolean>>;
  productData: boolean;
  setProductData: React.Dispatch<React.SetStateAction<boolean>>;
  categoriesData: boolean;
  setCategoriesData: React.Dispatch<React.SetStateAction<boolean>>;
  updateFaq: boolean;
  setUpdateFaq: React.Dispatch<React.SetStateAction<boolean>>;
  orderDetailsTable: boolean;
  setOrderDetailsTable: React.Dispatch<React.SetStateAction<boolean>>;
  orderDetailsStatus: boolean;
  setOrderDetailsStatus: React.Dispatch<React.SetStateAction<boolean>>;
  couponData: boolean;
  setCouponData: React.Dispatch<React.SetStateAction<boolean>>;
  privacyId: any;
  setPrivacyId: React.Dispatch<React.SetStateAction<any>>;
  refundId: any;
  setRefundId: React.Dispatch<React.SetStateAction<any>>;
  shipping: string;
  setShipping: React.Dispatch<React.SetStateAction<string>>;
  mainBranch: string;
  setMainBranch: React.Dispatch<React.SetStateAction<string>>;
  posTableOrderId: any;
  setPOSTableOrderId: React.Dispatch<React.SetStateAction<any>>;
  updateMainBranch: boolean;
  setUpdateMainBranch: React.Dispatch<React.SetStateAction<boolean>>;
  progressData: boolean;
  setProgressData: React.Dispatch<React.SetStateAction<boolean>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children  }) => {

  const [shop, setShop] = useState<ShopInfo>();
  const [fileData, setFileData] = useState<boolean>(false);
  const [branchesData, setBranchesData] = useState<boolean>(false);
  const [printersData, setPrintersData] = useState<boolean>(false);
  const [groupsPermissions, setGroupsPermissions] = useState<boolean>(false);
  const [couponData, setCouponData] = useState<boolean>(false);
  const [bannersData, setBannersData] = useState<boolean>(false);
  const [whatsAppData, setWhatsAppData] = useState<boolean>(false);
  const [productData, setProductData] = useState<boolean>(false);
  const [categoriesData, setCategoriesData] = useState<boolean>(false);
  const [updateFaq, setUpdateFaq] = useState<boolean>(false);
  const [orderDetailsTable, setOrderDetailsTable] = useState<boolean>(false);
  const [orderDetailsStatus, setOrderDetailsStatus] = useState<boolean>(false);
  const [tablesData, setTablesData] = useState<boolean>(false);
  const [privacyId, setPrivacyId] = useState();
  const [refundId, setRefundId] = useState();
  const [shipping, setShipping] = useState('takeaway');
  const [posTableOrderId, setPOSTableOrderId] = useState(null);
  const [mainBranch, setMainBranch] = useState('');
  const [updateMainBranch, setUpdateMainBranch] = useState<boolean>(false);
  const [progressData, setProgressData] = useState<boolean>(false);

  
  return (
    <UserContext.Provider value={{
      shop,setShop , 
      fileData, setFileData,
      branchesData, setBranchesData,
      printersData, setPrintersData,
      groupsPermissions, setGroupsPermissions,
      bannersData, setBannersData,
      whatsAppData, setWhatsAppData,
      productData, setProductData,
      categoriesData, setCategoriesData,
      updateFaq, setUpdateFaq,
      orderDetailsTable, setOrderDetailsTable,
      orderDetailsStatus, setOrderDetailsStatus,
      tablesData, setTablesData,
      couponData, setCouponData,
      privacyId, setPrivacyId,
      refundId, setRefundId,
      shipping, setShipping,
      posTableOrderId, setPOSTableOrderId,
      mainBranch, setMainBranch,
      updateMainBranch, setUpdateMainBranch,
      progressData, setProgressData,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
