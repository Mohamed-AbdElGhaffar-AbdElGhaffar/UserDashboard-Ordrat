'use client';

import { useEffect, useState } from 'react';
import cn from '@utils/class-names';
import { useMedia } from 'react-use';
import Popover from '@ui/carbon-menu/popover/popover';
import { ActionIcon, Button, Checkbox, Input, Title } from 'rizzui';
import { type Table as ReactTableType } from '@tanstack/react-table';
import { getDateRangeStateValues } from '@utils/get-formatted-date';
import {
  PiTrash,
  PiFunnel,
  PiTextColumns,
  PiTrashDuotone,
  PiMagnifyingGlassBold,
} from 'react-icons/pi';
import PriceField from '@/app/shared/controlled-table/price-field';
import DateFiled from '@/app/shared/controlled-table/date-field';
import StatusField from '@/app/shared/controlled-table/status-field';
import { FilterDrawerView } from '@/app/shared/controlled-table/table-filter';
import InputField from '../controlled-table/input-field';
import FromToField from '../controlled-table/from-to-number-field';
import { renderOptionDisplayValue, statusOptions } from '../invoice/form-utils-activation';
import RoleSelect from './selectInput';
import { useUserContext } from '@/app/components/context/UserContext';

interface TableToolbarProps<T extends Record<string, any>> {
  table: ReactTableType<T>;
  lang?: string;
  nameEN?: string;
  nameAr?: string;
  inputFromTo: string[];
  setInputFromTo: React.Dispatch<React.SetStateAction<string[]>>;
  accountIdSelectedValue: string;
  setAccountIdSelectedValue: React.Dispatch<React.SetStateAction<string>>;
  stockTypeIdSelectedValue: string;
  setStockTypeIdSelectedValue: React.Dispatch<React.SetStateAction<string>>;
  isApprovedSelectedValue: string;
  setIsApprovedSelectedValue: React.Dispatch<React.SetStateAction<string>>;
  isPaidSelectedValue: string;
  setIsPaidSelectedValue: React.Dispatch<React.SetStateAction<string>>;
  transactionTypeSelectedValue: string;
  setTransactionTypeSelectedValue: React.Dispatch<React.SetStateAction<string>>;
  toFromDate: [Date | null, Date | null];
  setToFromDate: React.Dispatch<React.SetStateAction<[Date | null, Date | null]>>;
}

const translations = {
  en: {
    searchPlaceholder: "Search by Stores name...",
    deleteTitle: "Delete",
    toggleColumns: "Toggle Columns",
    showFilters: "Filters",
    hideFilters: "Hide",
    name: "Name",
    phoneNumber: "Phone Number",
    email: "Email",
    fromDatePlaceholder: "From Date",
    toDatePlaceholder: "To Date",
    select: "Select Account Id",
    TransactionType: "Select TransactionType",
    clear: "Clear",
    currency: "EGP",
    rangeLabel: "Range",
    stockType: "stock Type",
    IsApproved: "Is Approved",
    IsPaid: "Is Paid",


  },
  ar: {
    searchPlaceholder: "البحث باسم المشتري...",
    deleteTitle: "حذف",
    toggleColumns: "تبديل الأعمدة",
    showFilters: "الفرز",
    hideFilters: "إخفاء",
    name: "الاسم",
    phoneNumber: "رقم هاتف",
    email: "البريد الالكتروني",
    fromDatePlaceholder: "من تاريخ",
    toDatePlaceholder: "إلى تاريخ",
    select: "اختار صاحب الاكونت",
    TransactionType: "اختار TransactionType",
    clear: "مسح",
    currency: "ج.م.",
    rangeLabel: "سيريال",
    stockType: " نوع المخزون",
    IsApproved: "تمت الموافقة",
    IsPaid: "تم الدفع",
  }
};

export default function TableToolbarFilterAbandonedOrders<TData extends Record<string, any>>({
  table,
  lang = "en",
  nameEN = "Accounts",
  nameAr = "الحسابات",
  inputFromTo,
  setInputFromTo,
  accountIdSelectedValue,
  setAccountIdSelectedValue,
  stockTypeIdSelectedValue,
  setStockTypeIdSelectedValue,
  isApprovedSelectedValue,
  setIsApprovedSelectedValue,
  isPaidSelectedValue,
  setIsPaidSelectedValue,
  transactionTypeSelectedValue,
  setTransactionTypeSelectedValue,
  toFromDate,
  setToFromDate,
}: TableToolbarProps<TData>) {
  const t = translations[lang as 'en' | 'ar'] || translations.en;

  const [openDrawer, setOpenDrawer] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const isMediumScreen = useMedia('(max-width: 1860px)', false);
  const isMultipleSelected = table.getSelectedRowModel().rows.length > 1;
  const placeholder = lang === 'ar' ? `البحث باسم ${nameAr}...` : `Search by ${nameEN} name...`;
  const deleteTitle = lang === 'ar' ? `حذف` : `Delete`;
  const toggleColumns = lang === 'ar' ? `تبديل الأعمدة` : `Toggle Columns`;
  const {
    options: { meta },
  } = table;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-wrap items-center gap-4">
        <Input
          type="search"
          placeholder={placeholder}
          value={table.getState().globalFilter ?? ''}
          onClear={() => table.setGlobalFilter('')}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
          inputClassName="h-9"
          clearable={true}
          prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
        />
        {!isMediumScreen && showFilters && <FilterElements lang={lang} table={table} inputFromTo={inputFromTo} setInputFromTo={setInputFromTo} accountIdSelectedValue={accountIdSelectedValue} setAccountIdSelectedValue={setAccountIdSelectedValue} isPaidSelectedValue={isPaidSelectedValue} setIsPaidSelectedValue={setIsPaidSelectedValue} isApprovedSelectedValue={isApprovedSelectedValue} setIsApprovedSelectedValue={setIsApprovedSelectedValue} stockTypeIdSelectedValue={stockTypeIdSelectedValue} setStockTypeIdSelectedValue={setStockTypeIdSelectedValue} transactionTypeSelectedValue={transactionTypeSelectedValue} setTransactionTypeSelectedValue={setTransactionTypeSelectedValue} toFromDate={toFromDate} setToFromDate={setToFromDate} />}
      </div>
      <div className="flex items-center gap-4">
        <Button
          {...(isMediumScreen
            ? {
              onClick: () => {
                setOpenDrawer(() => !openDrawer);
              },
            }
            : { onClick: () => setShowFilters(() => !showFilters) })}
          variant={'outline'}
          className={cn(
            'h-[34px] pe-3 ps-2.5',
            !isMediumScreen && showFilters && 'border-dashed border-gray-700'
          )}
        >
          <PiFunnel className="me-1.5 h-[18px] w-[18px]" strokeWidth={1.7} />
          {!isMediumScreen && showFilters ? t.hideFilters : t.showFilters}
        </Button>

        {isMediumScreen && (
          <FilterDrawerView isOpen={openDrawer} setOpenDrawer={setOpenDrawer}>
            <div className="space-y-3">
              <FilterElements lang={lang} table={table} inputFromTo={inputFromTo} setInputFromTo={setInputFromTo} accountIdSelectedValue={accountIdSelectedValue} setAccountIdSelectedValue={setAccountIdSelectedValue} isPaidSelectedValue={isPaidSelectedValue} setIsPaidSelectedValue={setIsPaidSelectedValue} isApprovedSelectedValue={isApprovedSelectedValue} setIsApprovedSelectedValue={setIsApprovedSelectedValue} stockTypeIdSelectedValue={stockTypeIdSelectedValue} setStockTypeIdSelectedValue={setStockTypeIdSelectedValue} transactionTypeSelectedValue={transactionTypeSelectedValue} setTransactionTypeSelectedValue={setTransactionTypeSelectedValue} toFromDate={toFromDate} setToFromDate={setToFromDate} />
            </div>
          </FilterDrawerView>
        )}

        {isMultipleSelected ? (
          <Button
            size="sm"
            color="danger"
            variant="outline"
            className="h-[34px] gap-2 text-sm"
            onClick={() =>
              //   meta?.handleMultipleDelete &&
              //   meta.handleMultipleDelete(
              //     table.getSelectedRowModel().rows.map((r) => r.original.id)
              //   )
              console.log("delete")

            }
          >
            <PiTrash size={18} />
            {deleteTitle}
          </Button>
        ) : null}

        {table && (
          <Popover position="bottom-end">
            <Popover.Trigger>
              <ActionIcon
                variant="outline"
                title={toggleColumns}
                className="h-auto w-auto p-1"
              >
                <PiTextColumns strokeWidth={3} className="size-6" />
              </ActionIcon>
            </Popover.Trigger>
            <Popover.Content className="z-0">
              <div className="p-2 text-left rtl:text-right">
                <Title as="h6" className="mb-6 px-0.5 text-sm font-semibold">
                  {toggleColumns}
                </Title>
                <div className="grid grid-cols-2 gap-6">
                  {table.getAllLeafColumns().map((column) => {
                    return (
                      typeof column.columnDef.header === 'string' &&
                      column.columnDef.header.length > 0 && (
                        <Checkbox
                          key={column.id}
                          label={<>{column.columnDef.header}</>}
                          checked={column.getIsVisible()}
                          onChange={column.getToggleVisibilityHandler()}
                        />
                      )
                    );
                  })}
                </div>
              </div>
            </Popover.Content>
          </Popover>
        )}
      </div>
    </div>
  );
}

interface SelectOption {
  value: string;
  label: string;
}


function FilterElements<T extends Record<string, any>>({
  table,
  lang = 'en',
  inputFromTo,
  setInputFromTo,
  accountIdSelectedValue,
  setAccountIdSelectedValue,
  stockTypeIdSelectedValue,
  setStockTypeIdSelectedValue,
  isApprovedSelectedValue,
  setIsApprovedSelectedValue,
  isPaidSelectedValue,
  setIsPaidSelectedValue,
  transactionTypeSelectedValue,
  setTransactionTypeSelectedValue,
  toFromDate,
  setToFromDate,
}: TableToolbarProps<T>) {
  const t = translations[lang as 'en' | 'ar'] || translations.en;
  const isMediumScreen = useMedia('(max-width: 1860px)', false);
  const [options, setOptions] = useState<{ id: string; name: string }[]>([]);
  const [optionsAcc, setOptionsAcc] = useState<{ id: string; name: string }[]>([]);
    const { couponData, setCouponData } = useUserContext();

  // const [inputName, setInputName] = useState('');
  // const [inputEmail, setInputEmail] = useState('');
  // const [inputPhoneNumber, setInputPhoneNumber] = useState('');
  // const [accountIdSelectedValue, setAccountIdSelectedValue] = useState<string>('');
  // const [toFromDate, setToFromDate] = useState<[Date | null, Date | null]>([null, null]);
  const isFiltered =
    table.getState().globalFilter ||
    table.getState().columnFilters.length > 0 ||
    inputFromTo.some((value) => value !== '') ||
    accountIdSelectedValue !== '' ||
    transactionTypeSelectedValue !== '' ||
    stockTypeIdSelectedValue !== '' ||
    isPaidSelectedValue !== '' ||
    isApprovedSelectedValue !== '' ||
    (toFromDate[0] !== null && toFromDate[1] !== null);

  const handleValueSelectAccountIdChange = (value: string) => {
    console.log("Selected AccountId option:", value);
    setAccountIdSelectedValue(value);
    setCouponData(true);
  };

  const handleValueSelectTransactionTypeChange = (value: string) => {
    console.log("Selected TransactionType option:", value);
    setTransactionTypeSelectedValue(value);
    setCouponData(true);
  };
  const handleValueSelectIsApprovedChange = (value: string) => {
    console.log("Selected TransactionType option:", value);
    setIsApprovedSelectedValue(value);
    setCouponData(true);
  };
  const handleValueSelectIsPaidChange = (value: string) => {
    console.log("Selected StockTypeId option:", value);
    setIsPaidSelectedValue(value);
    setCouponData(true);
  };
  const handleValueSelectStockTypeIdChange = (value: string) => {
    console.log("Selected StockTypeId option:", value);
    setStockTypeIdSelectedValue(value);
    setCouponData(true);
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`https://www.accidp.com/api/StockType/GetAll`, {
        method: 'GET',
        headers: {
          'Accept-Language': lang,
        },
      });
      if (response.status === 200) {
        const data = await response.json();

        const fetchedOptions = data.map((item: any) => ({
          id: item.id,
          name: item.name,
        }));
        setOptions(fetchedOptions);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };
  const fetchData1 = async () => {
    try {
      const userDataString = JSON.parse(localStorage.getItem('userData') as string);
      const token = userDataString.accessToken

      const response = await fetch(`https://accidp.com/api/Account/GetChildrenAccounts`, {
        method: 'GET',
        headers: {
          'Accept-Language': lang,
          'Authorization': `Bearer ${token}`
        },
      });
      if (response.status === 200) {
        const data = await response.json();

        const fetchedOptions = data.map((item: any) => ({
          id: item.id,
          name: item.name,
        }));
        setOptionsAcc(fetchedOptions);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };
  useEffect(() => {
    fetchData();
    fetchData1();
  }, []);
  const staticOptions = lang === 'ar'
    ? [
      { id: '1', name: 'نشط' },
      { id: '2', name: 'غير نشط' },
      { id: '3', name: 'قيد الانتظار' }
    ]
    : [
      { id: '1', name: 'Active' },
      { id: '2', name: 'Inactive' },
      { id: '3', name: 'Pending' }
    ];

  const TransactionTypeOptions = lang === 'ar'
    ? [{ id: '1', name: 'تحويل' },
    { id: '2', name: 'إضافة' },
    { id: '-1', name: 'إاسترجاع' },
    { id: '-2', name: 'حذف' }
    ]

    : [
      { id: '1', name: 'Transfer' },
      { id: '2', name: 'Add' },
      { id: '-1', name: 'Return' },
      { id: '-2', name: 'Delete' }
    ];



  const IsApprovedOptions = lang === 'ar'
    ? [
      { id: true, name: 'True' },
      { id: false, name: 'False' },

    ]
    : [
      { id: true, name: 'True' },
      { id: false, name: 'False' },

    ];

  return (
    <>
      {/* <FromToField
        value={inputFromTo}
        label={t.rangeLabel}
        toPlaceholder="0"
        fromPlaceholder="200"
        onChange={(v) => {
          // table.getColumn('amount')?.setFilterValue(v);
          console.log("input From To:", v);
          setInputFromTo(v);
          setCouponData(true);
        }}
      /> */}
      <DateFiled
        className="w-full h-fit"
        placeholderText={`${t.fromDatePlaceholder} ${t.toDatePlaceholder}`}
        startDate={toFromDate[0] ? getDateRangeStateValues(toFromDate[0].toISOString()) : null}
        endDate={toFromDate[1] ? getDateRangeStateValues(toFromDate[1].toISOString()) : null}
        selected={toFromDate[0] ? getDateRangeStateValues(toFromDate[0].toISOString()) : null}
      onChange={(date) => {
  if (!date || !Array.isArray(date)) return;

  const [from, to] = date;

  const convertToEgyptTime = (d: Date | null) => {
    if (!d) return null;
    const localDate = new Date(d);
    localDate.setHours(localDate.getHours() + 2); // UTC+2
    return localDate.toISOString();
  };

  const fromDateEgypt = convertToEgyptTime(from);
  const toDateEgypt = convertToEgyptTime(to);

  // إرسال الفلتر للتابل (ممكن تبعت range كامل أو تبدأ بـ from فقط)
  table.getColumn('createdAt')?.setFilterValue([fromDateEgypt, toDateEgypt]);

  // حفظهم في الستيت الأصلي
  setToFromDate([from, to]);

  console.log("✅ Egypt From:", fromDateEgypt);
  console.log("✅ Egypt To:", toDateEgypt);

  setCouponData(true);
}}


      />
      {/* <RoleSelect
        placeholder={t.select}
        options={optionsAcc}
        optionId={true}
        selectValue={accountIdSelectedValue}
        onChange={(e) => {
          handleValueSelectAccountIdChange(e);
          setCouponData(true);
        }}
      /> */}
      {/* <RoleSelect
        placeholder={t.stockType}
        options={options}
        optionId={true}
        selectValue={stockTypeIdSelectedValue}
        onChange={(e) => {
          handleValueSelectStockTypeIdChange(e);
          setCouponData(true);
        }}
      /> */}
      {/* <RoleSelect
        placeholder={t.IsApproved}
        options={IsApprovedOptions as any}
        optionId={true}
        selectValue={isApprovedSelectedValue}
        onChange={(e) => {
          handleValueSelectIsApprovedChange(e);
          setCouponData(true);
        }}
      />
      <RoleSelect
        placeholder={t.IsPaid}
        options={IsApprovedOptions as any}
        optionId={true}
        selectValue={isPaidSelectedValue}
        onChange={(e) => {
          handleValueSelectIsPaidChange(e);
          setCouponData(true);
        }}
      /> */}
      {/* <RoleSelect
        placeholder={t.TransactionType}
        options={TransactionTypeOptions}
        optionId={true}
        selectValue={transactionTypeSelectedValue}
        onChange={(e) => {
          handleValueSelectTransactionTypeChange(e);
          setCouponData(true);
        }}
      /> */}
      {isFiltered && (
        <Button
          size="sm"
          onClick={() => {
            // Clear local filter states
            setInputFromTo(['', '']);
            setToFromDate([null, null]);
            setAccountIdSelectedValue('');
            setIsApprovedSelectedValue('');
            setStockTypeIdSelectedValue('');
            setTransactionTypeSelectedValue('');
            setIsPaidSelectedValue('');
            setCouponData(true);
          }}
          variant="flat"
          className="h-9 bg-gray-200/70"
        >
          <PiTrashDuotone className="me-1.5 h-[17px] w-[17px]" /> {t.clear}
        </Button>
      )}
    </>
  );
}
