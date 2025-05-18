'use client';

import { useState } from 'react';
import cn from '@utils/class-names';
import { useMedia } from 'react-use';
import Popover from '@ui/carbon-menu/popover/popover';
import { ActionIcon, Button, Checkbox, Input, Title } from 'rizzui';
import { type Table as ReactTableType } from '@tanstack/react-table';
import {
  PiTrash,
  PiFunnel,
  PiTextColumns,
  PiTrashDuotone,
  PiMagnifyingGlassBold,
} from 'react-icons/pi';
import PriceField from '@/app/shared/controlled-table/price-field';
import DateFiled from '@/app/shared/controlled-table/date-field';
import { FilterDrawerView } from '@/app/shared/controlled-table/table-filter';
import InputField from '../controlled-table/input-field';
import FromToField from '../controlled-table/from-to-number-field';
import RoleSelect from './selectInput';

interface FilterConfig {
  type: 'price' | 'fromTo' | 'input' | 'date' | 'select';
  value: any;
  setValue: (value: any) => void;
  options?: any[];
  placeholder?: string;
  label?: string;
  className?: string;
}
interface TableToolbarProps<T extends Record<string, any>> {
  table: ReactTableType<T>;
  lang?: string;
  nameEN?: string;
  nameAr?: string;
  filters: FilterConfig[];
  search?: any;
  setSearch?: (value: any) => void;
  onSuccess: () => void;
}

const translations = {
  en: {
    searchPlaceholder: "Search by Reviews name...",
    deleteTitle: "Delete",
    toggleColumns: "Toggle Columns",
    showFilters: "Filters",
    hideFilters: "Hide",
    endUserName: "End User Name",
    endUserPhoneNumber: "End User Phone Number",
    shopName: "Shop Name",
    rateLabel: "Rate",
    fromDatePlaceholder: "From Date",
    toDatePlaceholder: "To Date",
    select: "Select Status",
    earn: "Earning",
    clear: "Clear"
  },
  ar: {
    searchPlaceholder: "البحث باسم المراجعة...",
    deleteTitle: "حذف",
    toggleColumns: "تبديل الأعمدة",
    showFilters: "الفرز",
    hideFilters: "إخفاء",
    endUserName: "اسم المستخدم النهائي",
    endUserPhoneNumber: "رقم هاتف المستخدم النهائي",
    shopName: "اسم المتجر",
    rateLabel: "التقييم",
    fromDatePlaceholder: "من تاريخ",
    toDatePlaceholder: "إلى تاريخ",
    select: "اختار حالة",
    earn: "الربح",
    clear: "مسح"
  }
};

export default function TableToolbarFilter<TData extends Record<string, any>>({
  table,
  lang = "en",
  nameEN="Reviews",
  nameAr="المراجعات",
  filters,
  search,
  setSearch,
  onSuccess
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
          value={search}
          onClear={() => {
            if(setSearch){setSearch('');}
            onSuccess();
            table.setGlobalFilter('');
          }}
          onChange={(e) => {
            if (setSearch) {
              setSearch(e.target.value);
              onSuccess();
              console.log("ccc");
            }else{
              table.setGlobalFilter(e.target.value);
            }
          }}
          inputClassName="h-9"
          clearable={true}
          prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
        />
        {filters.length != 0 &&(
          <>
            {!isMediumScreen && showFilters && <FilterElements lang={lang} table={table} filters={filters} onSuccess={onSuccess} />}
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        {filters.length != 0 &&(
          <>
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
                <div className="grid grid-cols-1 gap-6">
                  <FilterElements lang={lang} table={table}  filters={filters} onSuccess={onSuccess} />
                </div>
              </FilterDrawerView>
            )}
          </>
        )}
        {isMultipleSelected ? (
          <Button
            size="sm"
            color="danger"
            variant="outline"
            className="h-[34px] gap-2 text-sm"
            onClick={() =>{
              table.resetRowSelection(); 
            }}
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

function FilterElements<T extends Record<string, any>>({
  table,
  lang = 'en',
  filters,
  onSuccess
}: TableToolbarProps<T> ) {
  const t = translations[lang as 'en' | 'ar'] || translations.en;
  const isMediumScreen = useMedia('(max-width: 1860px)', false);
  const isFiltered = filters.some((filter) => {
    if (Array.isArray(filter.value)) {
      return filter.value.some((v) => v !== ''&&v !== null);
    }
    return filter.value !== '' && filter.value !== null;
  });

  return (
    <>
    {filters.map((filter, index) => {
        switch (filter.type) {
          case 'price':
            return (
              <PriceField
                key={index}
                value={filter.value}
                onChange={(v)=>{
                  filter.setValue(v);
                  onSuccess();
                }}
                label={filter.label || t.earn}
                // toPlaceholder="0"
                // fromPlaceholder="50k"
              />
            );
          case 'fromTo':
            return (
              <FromToField
                key={index}
                value={filter.value}
                label={filter.label || t.rateLabel}
                toPlaceholder="0"
                fromPlaceholder="5"
                onChange={(v)=>{
                  filter.setValue(v);
                  onSuccess();
                }}
              /> 
            );
          case 'input':
            return (
              <InputField
                key={index}
                value={filter.value}
                placeholder={filter.placeholder || ''}
                className={isMediumScreen ? 'w-full' : 'w-48'}
                onChange={(v)=>{
                  filter.setValue(v);
                  onSuccess();
                }}
              />
            );
          case 'date':
            return (
              <DateFiled
                key={index}
                className="w-full"
                placeholderText={`${t.fromDatePlaceholder} - ${t.toDatePlaceholder}`}
                startDate={filter.value[0]}
                endDate={filter.value[1]}
                onChange={(v)=>{
                  filter.setValue(v);
                  onSuccess();
                }}
              />
            );
          case 'select':
            return (
              <RoleSelect
                key={index}
                options={filter.options || []}
                placeholder={filter.placeholder || t.select}
                selectValue={filter.value}
                onChange={(v)=>{
                  filter.setValue(v);
                  onSuccess();
                }}
              />
            );
          default:
            return null;
        }
      })}

      {isFiltered && (
        <Button
          size="sm"
          onClick={() => {
            filters.forEach((filter) => {
              if (Array.isArray(filter.value)) {
                filter.setValue(['', '']);
              } else {
                filter.setValue('');
              }
            });
            onSuccess();
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
