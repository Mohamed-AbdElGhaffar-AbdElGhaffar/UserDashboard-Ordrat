'use client';
import React, { useEffect, useState } from 'react';
import { Box, TextField, Autocomplete } from "@mui/material";
import { PiWhatsappLogoFill } from 'react-icons/pi';
import { Button, Textarea } from 'rizzui';
import Select from 'react-select';
import Flag from 'react-world-flags';
import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import axiosClient from '../../context/api';
import { Loader2 } from 'lucide-react';

import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { createTheme, ThemeProvider } from '@mui/material';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { AsyncPaginate, LoadOptions } from 'react-select-async-paginate';
import { GroupBase } from 'react-select';
import { useUserContext } from '../../context/UserContext';
import { GetCookiesClient } from '../../ui/getCookiesClient/GetCookiesClient';
import { API_BASE_URL } from '@/config/base-url';

type OptionType = {
  value: string;
  label: string;
};

type Additional = {
  page: number;
};
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const createAppTheme = (direction: 'ltr' | 'rtl') =>
  createTheme({
    direction,
  });

const DirectionWrapper = ({ isRtl, children }: { isRtl: boolean, children: React.ReactNode }) => {
  const theme = createAppTheme(isRtl ? 'rtl' : 'ltr');
  
  return isRtl ? (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  );
};

const API_URL = 'https://salesmanapi.salesman.tools/api/WhatsappAutomation/SendMessage';
const API_KEY = 'gkP12oE2iOhQGSgNd8e7IMsTupN5GEm9';

const countries = [
  // Arab Countries
  { code: 'EG', nameEn: 'Egypt', nameAr: 'مصر', dialCode: '+20', flag: '🇪🇬' },
  { code: 'AE', nameEn: 'United Arab Emirates', nameAr: 'الإمارات', dialCode: '+971', flag: '🇦🇪' },
  { code: 'SA', nameEn: 'Saudi Arabia', nameAr: 'السعودية', dialCode: '+966', flag: '🇸🇦' },
  { code: 'QA', nameEn: 'Qatar', nameAr: 'قطر', dialCode: '+974', flag: '🇶🇦' },
  { code: 'KW', nameEn: 'Kuwait', nameAr: 'الكويت', dialCode: '+965', flag: '🇰🇼' },
  { code: 'OM', nameEn: 'Oman', nameAr: 'عمان', dialCode: '+968', flag: '🇴🇲' },
  { code: 'BH', nameEn: 'Bahrain', nameAr: 'البحرين', dialCode: '+973', flag: '🇧🇭' },
  { code: 'JO', nameEn: 'Jordan', nameAr: 'الأردن', dialCode: '+962', flag: '🇯🇴' },
  { code: 'LB', nameEn: 'Lebanon', nameAr: 'لبنان', dialCode: '+961', flag: '🇱🇧' },
  { code: 'SY', nameEn: 'Syria', nameAr: 'سوريا', dialCode: '+963', flag: '🇸🇾' },
  { code: 'IQ', nameEn: 'Iraq', nameAr: 'العراق', dialCode: '+964', flag: '🇮🇶' },
  { code: 'MA', nameEn: 'Morocco', nameAr: 'المغرب', dialCode: '+212', flag: '🇲🇦' },
  { code: 'TN', nameEn: 'Tunisia', nameAr: 'تونس', dialCode: '+216', flag: '🇹🇳' },
  { code: 'DZ', nameEn: 'Algeria', nameAr: 'الجزائر', dialCode: '+213', flag: '🇩🇿' },
  { code: 'LY', nameEn: 'Libya', nameAr: 'ليبيا', dialCode: '+218', flag: '🇱🇾' },
  { code: 'YE', nameEn: 'Yemen', nameAr: 'اليمن', dialCode: '+967', flag: '🇾🇪' },
  { code: 'SD', nameEn: 'Sudan', nameAr: 'السودان', dialCode: '+249', flag: '🇸🇩' },
  { code: 'PS', nameEn: 'Palestine', nameAr: 'فلسطين', dialCode: '+970', flag: '🇵🇸' },
  { code: 'SO', nameEn: 'Somalia', nameAr: 'الصومال', dialCode: '+252', flag: '🇸🇴' },
  { code: 'MR', nameEn: 'Mauritania', nameAr: 'موريتانيا', dialCode: '+222', flag: '🇲🇷' },
  { code: 'DJ', nameEn: 'Djibouti', nameAr: 'جيبوتي', dialCode: '+253', flag: '🇩🇯' },
  { code: 'KM', nameEn: 'Comoros', nameAr: 'جزر القمر', dialCode: '+269', flag: '🇰🇲' },
  // Famous Countries
  { code: 'US', nameEn: 'United States', nameAr: 'الولايات المتحدة', dialCode: '+1', flag: '🇺🇸' },
  { code: 'GB', nameEn: 'United Kingdom', nameAr: 'المملكة المتحدة', dialCode: '+44', flag: '🇬🇧' },
  { code: 'FR', nameEn: 'France', nameAr: 'فرنسا', dialCode: '+33', flag: '🇫🇷' },
  { code: 'DE', nameEn: 'Germany', nameAr: 'ألمانيا', dialCode: '+49', flag: '🇩🇪' },
  { code: 'CN', nameEn: 'China', nameAr: 'الصين', dialCode: '+86', flag: '🇨🇳' },
  { code: 'RU', nameEn: 'Russia', nameAr: 'روسيا', dialCode: '+7', flag: '🇷🇺' },
  { code: 'IN', nameEn: 'India', nameAr: 'الهند', dialCode: '+91', flag: '🇮🇳' },
  { code: 'BR', nameEn: 'Brazil', nameAr: 'البرازيل', dialCode: '+55', flag: '🇧🇷' },
  { code: 'JP', nameEn: 'Japan', nameAr: 'اليابان', dialCode: '+81', flag: '🇯🇵' },
  { code: 'KR', nameEn: 'South Korea', nameAr: 'كوريا الجنوبية', dialCode: '+82', flag: '🇰🇷' },
  { code: 'CA', nameEn: 'Canada', nameAr: 'كندا', dialCode: '+1', flag: '🇨🇦' },
  { code: 'AU', nameEn: 'Australia', nameAr: 'أستراليا', dialCode: '+61', flag: '🇦🇺' },
  { code: 'IT', nameEn: 'Italy', nameAr: 'إيطاليا', dialCode: '+39', flag: '🇮🇹' },
  { code: 'ES', nameEn: 'Spain', nameAr: 'إسبانيا', dialCode: '+34', flag: '🇪🇸' },
  { code: 'TR', nameEn: 'Turkey', nameAr: 'تركيا', dialCode: '+90', flag: '🇹🇷' },
  { code: 'ZA', nameEn: 'South Africa', nameAr: 'جنوب أفريقيا', dialCode: '+27', flag: '🇿🇦' },
  { code: 'NG', nameEn: 'Nigeria', nameAr: 'نيجيريا', dialCode: '+234', flag: '🇳🇬' },
  { code: 'MX', nameEn: 'Mexico', nameAr: 'المكسيك', dialCode: '+52', flag: '🇲🇽' },
  { code: 'AR', nameEn: 'Argentina', nameAr: 'الأرجنتين', dialCode: '+54', flag: '🇦🇷' },
  { code: 'ID', nameEn: 'Indonesia', nameAr: 'إندونيسيا', dialCode: '+62', flag: '🇮🇩' },
  { code: 'PK', nameEn: 'Pakistan', nameAr: 'باكستان', dialCode: '+92', flag: '🇵🇰' },
];

function SendMessage({ lang, savedPhoneNumber, isAuthenticated, closeConnection }: { lang?: string, savedPhoneNumber: string, isAuthenticated: boolean, closeConnection: () => void }) {
  const PAGE_SIZE = 10;
  const { setWhatsAppData } = useUserContext();
  
  const [message, setMessage] = useState('');
  const [selectedNumbers, setSelectedNumbers] = useState<{ value: string; label: string }[]>([]);
  const [manualNumbers, setManualNumbers] = useState<{ code: string; number: string; name: string; }[]>([]);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [manualNumber, setManualNumber] = useState('');
  const [manualName, setManualName] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [phoneNumbersError, setPhoneNumbersError] = useState<string | null>(null);
  const [contactOptions, setContactOptions] = useState([]);

  const text = {
    sendMessage: lang === 'ar' ? 'إرسال رسالة' : 'Send Message',
    messagePlaceholder: lang === 'ar' ? 'اكتب رسالتك هنا...' : 'Type your message here...',
    code: lang === 'ar' ? 'كود الدولة' : 'Country Code',
    phonePlaceholder: lang === 'ar' ? 'أدخل رقم الهاتف' : 'Enter phone number',
    namePlaceholder: lang === 'ar' ? 'أدخل الاسم' : 'Enter Name',
    selectContacts: lang === 'ar' ? 'حدد جهات الاتصال' : 'Select Contacts',
    send: lang === 'ar' ? 'إرسال' : 'Send',
    addPhone: lang === 'ar' ? 'أضف رقم الهاتف' : 'Add Phone Number',
    invalidPhone: lang === 'ar' ? 'رقم الهاتف غير صالح' : 'Invalid phone number',
    repetedPhone: lang === 'ar' ? 'رقم الهاتف موجود مسبقاً' : 'Phone number already exists',
    massageRequired: lang === 'ar' ? 'الرسالة مطلوبة' : 'Message is required',
    phoneNumbersRequired: lang === 'ar' ? 'يجب ادخال ارقام الهواتف' : 'Phone Numbers is required',
  };

  const validationSchema = Yup.object().shape({
    message: Yup.string().trim().required(text.massageRequired),
    // allNumbers: Yup.array()
    // .of(Yup.mixed())
    // .min(1, text.phoneNumbersRequired)
  });

  // const contactOptions = [
  //   { value: '+201001234567', label: 'Ahmed (+201001234567)' },
  //   { value: '+966501234567', label: 'Mohammed (+966501234567)' },
  //   { value: '+971501234567', label: 'Ali (+971501234567)' },
  //   { value: '+441231231231', label: 'John (+441231231231)' },
  // ];
  const shopId = GetCookiesClient('shopId') as string;     
  const loadOptions: LoadOptions<OptionType, GroupBase<OptionType>, Additional> =
  async (search, loadedOptions, additional) => {
    const page = additional?.page || 1;

    // تحديد إذا كانت قيمة البحث رقم فقط
    const isPhone = /^\d+$/.test(search.trim());

    try {
      const response = await axiosClient.get(`/api/EndUser/GetAll/${shopId}`, {
        params: {
          PageNumber: page,
          PageSize: PAGE_SIZE,
          ...(isPhone ? { phoneNumber: search } : { Name: search }),
        },
        headers: {
          'Accept-Language': lang || 'en',
        },
      });

      const { entities, nextPage } = response.data;

      const options = entities
        .filter((user: any) => {
          const raw = (user.phoneNumber || '').trim();
          const parsed = parsePhoneNumberFromString(raw, 'EG');
          return parsed?.country === 'EG' && parsed.isValid();
        })
        .map((user: any) => {
          const parsed = parsePhoneNumberFromString(user.phoneNumber.trim(), 'EG');
          const formatted = parsed?.number.replace('+', '') || '';

          const label = user.firstName
            ? `${user.firstName} ${user.lastName || ''} (${formatted})`
            : formatted;

          return {
            value: formatted,
            label,
          };
        });

      return {
        options,
        hasMore: !!nextPage,
        additional: {
          page: nextPage,
        },
      };
    } catch (err) {
      console.error("Error fetching contacts", err);
      return {
        options: [],
        hasMore: false,
      };
    }
  };
  const handleManualNumberAdd = () => {
    const formattedNumber = manualNumber.trim();
    if (!formattedNumber) return;

  //   const parsedNumber = parsePhoneNumberFromString(
  //     selectedCountry.dialCode + formattedNumber,
  //     selectedCountry.code as CountryCode
  //   );
    const finalNumber = parsePhoneNumberFromString(
      selectedCountry.dialCode + formattedNumber.replace(/^0+/, '').replace(/\s/g, ''),
      selectedCountry.code as CountryCode
    );

    if (!finalNumber || !finalNumber.isValid()) {
      setPhoneError(text.invalidPhone);
      return;
    }else if (manualNumbers.some(n => n.number === formattedNumber.replace(/^0+/, '').replace(/\s/g, ''))) {
      setPhoneError(text.repetedPhone);
      return;
    }

    setPhoneError(null);

    if (!manualNumbers.some(n => n.number === formattedNumber.replace(/^0+/, '').replace(/\s/g, ''))) {
      setManualNumbers([...manualNumbers, { code: selectedCountry.dialCode.replace('+', ''), number: formattedNumber.replace(/^0+/, '').replace(/\s/g, ''), name: manualName }]);
      setManualNumber('');
      setManualName('');
    }
  };

  const sendMessage = async (values: { message: string }) => {
    const { message } = values;

    const rawNumbers = [
      // { phoneNumber: savedPhoneNumber },
      ...selectedNumbers.map(num => ({ phoneNumber: num.value })),
      ...manualNumbers.map(num => ({ phoneNumber: num.code + num.number, name: num.name })),
    ];
    const seen = new Set<string>();
    const allNumbers = rawNumbers.filter(({ phoneNumber }) => {
      if (seen.has(phoneNumber)) return false;
      seen.add(phoneNumber);
      return true;
    });
    console.log("allNumbers: ",allNumbers);
    

    if (allNumbers.length === 0) {
        setPhoneNumbersError(lang === 'ar' ? 'الرجاء إدخال رقم هاتف واحد على الأقل' : 'Please enter at least one phone number');
        return;
    }else {
      setPhoneNumbersError('');
    }

    const campaignPayload = {
      name: 'May Newsletter Campaign',
      phoneNumbers: allNumbers
      .filter((phone) => phone.phoneNumber)
      .map((phone) => phone.phoneNumber),
      messageType: 'Text',
      textContent: message,
      delaySeconds: 120,
      randomize: false,
      deviceIds: [shopId],
    };
    console.log("campaignPayload: ",campaignPayload);
    
    setIsSending(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/WhatsSender/campaign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
        },
        body: JSON.stringify(campaignPayload),
      });
  
      const responseData = await response.json();
  
      if (response.ok && responseData?.success !== false) {
        toast.success(lang === 'ar' ? 'تم إرسال الحملة بنجاح!' : 'Campaign sent successfully!');
        setManualNumbers([]);
        setSelectedNumbers([]);
        setWhatsAppData(true);
      } else {
        toast.error(lang === 'ar' ? 'فشل إرسال الحملة' : 'Failed to send campaign');
        closeConnection();
      }
  
    } catch (error) {
      console.error('Error sending campaign:', error);
      toast.error(lang === 'ar' ? 'حدث خطأ أثناء إرسال الحملة' : 'An error occurred while sending the campaign');
      closeConnection();
    } finally {
      setIsSending(false);
    }
  };
  
  const isValidEgyptianNumber = (number: string) => {
    const parsed = parsePhoneNumberFromString('+' + number, 'EG');
    return parsed?.country === 'EG' && parsed.isValid();
  };
  
  // const sendMessage = async (values: { message: string, allNumbers: { phoneNumber: string; name?: string }[] }) => {
  //   const { message, allNumbers } = values;
  //   console.log("message: ",message);
  //   console.log("allNumbers: ",allNumbers);
  //   allNumbers.forEach(({ phoneNumber }) => {
  //     const valid = isValidEgyptianNumber(phoneNumber);
  //     console.log(phoneNumber, '=>', valid ? '✅ valid' : '❌ invalid');
  //   });
  //   setIsSending(true);

  //   try {
  //     for (const contact of allNumbers) {
  //       const phone = contact.phoneNumber;
  
  //       const isValid = isValidEgyptianNumber(phone);
  //       if (!isValid) {
  //         console.warn(`Invalid number: ${phone}`);
  //         continue;
  //       }
  
  //       const payload = {
  //         sessionGuid: shopId,
  //         to: phone,
  //         text: message,
  //       };
  
  //       const response = await axiosClient.post('https://testapi.ordrat.com/api/WhatsSender/sendtext', payload);
  
  //       const result = response.data?.message;
  //       console.log(`${phone} =>`, result);
  
  //       if (result?.includes('success')) {
  //         setWhatsAppData(true);
  //         toast.success(`${phone}: ${lang === 'ar' ? 'تم الإرسال' : 'Sent successfully'}`);
  //       } else {
  //         toast.error(`${phone}: ${lang === 'ar' ? 'فشل الإرسال' : 'Failed to send'}`);
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error sending message:', error);
  //     toast.error(lang === 'ar' ? 'حدث خطأ أثناء الإرسال' : 'Error while sending message');
  //   } finally {
  //     setIsSending(false);
  //   }
  // };
  const isRtl = lang === 'ar';

  return isAuthenticated ? (
    <DirectionWrapper isRtl={isRtl}>
      <div dir={isRtl ? 'rtl' : 'ltr'} className="w-full lg:w-[500px] lg:min-h-[644.22px] 3xl:min-h-[616px] bg-white p-6 border border-gray-200 rounded-xl shadow-md">
        <div className="w-full flex gap-2 items-center mb-3">
          <h3 className="text-[#e11d48] text-lg lg:text-xl font-semibold">{text.sendMessage}</h3>
          <PiWhatsappLogoFill color="#25D366" size={30} />
        </div>
        <Formik
            initialValues={{ message: '', allNumbers: [] }}
            validationSchema={validationSchema}
            onSubmit={sendMessage}
        >
          {({ values, touched, errors, handleChange, handleBlur, setFieldValue }) => (
              <Form className='lg:min-h-[535px] 3xl:min-h-[500px] flex flex-col justify-between'>
                  <Field
                      as={Textarea}
                      name="message"
                      className="w-full textWhatsHeight"
                      rows={4}
                      placeholder={text.messagePlaceholder}
                      onBlur={handleBlur}
                      onChange={handleChange}
                  />
                  
                  {/* <Textarea
                      className="w-full textWhatsHeight"
                      // className="w-full"
                      rows={4}
                      placeholder={text.messagePlaceholder}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                  /> */}
                  {/* Manually Display Error Below the Textarea */}
                  {touched.message && errors.message && (
                    <div className="text-red-500 text-sm mt-1">{errors.message}</div>
                  )}
                  <Box mt={3} className="flex flex-col gap-2">
                      <Autocomplete
                          id="manual-country"
                          options={countries}
                          getOptionLabel={(option) =>
                              lang === 'ar'
                              ? `${option.nameAr} (${option.dialCode})`
                              : `${option.nameEn} (${option.dialCode})`
                          }
                          onChange={(event, newValue) => setSelectedCountry(newValue || countries[0])}
                          value={selectedCountry}
                          renderInput={(params) => (
                              <TextField
                              {...params}
                              label={text.code}
                              variant="outlined"
                              size="small"
                              // error={touched.selectedCountry && Boolean(errors.selectedCountry)}
                              // helperText={touched.selectedCountry && errors.selectedCountry ? text.invalidCode : ''}
                              sx={{
                                  '& .MuiOutlinedInput-root': {
                                  whiteSpace: 'nowrap',
                                  overflow: 'visible',
                                  textOverflow: 'unset',
                                  },
                                  '& .MuiOutlinedInput-input': {
                                  whiteSpace: 'nowrap',
                                  overflow: 'visible',
                                  textOverflow: 'unset',
                                  },
                                  '& .MuiOutlinedInput-input:focus': {
                                  outline: '0',
                                  '--tw-ring-shadow': 'none',
                                  },
                              }}
                              />
                          )}
                          renderOption={(props, option) => (
                              <li {...props}>
                              <Flag code={option.code} style={{ marginRight: 10, width: 20 }} />
                              {lang === 'ar' ? option.nameAr : option.nameEn} ({option.dialCode})
                              </li>
                          )}
                      />
                      <TextField
                          fullWidth
                          id="phoneNumber"
                          name="phoneNumber"
                          type="tel"
                          label={text.phonePlaceholder}
                          variant="outlined"
                          size="small"
                          value={manualNumber}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              let numericValue = event.target.value.replace(/\D/g, ''); 
                              setManualNumber(numericValue)
                              
                              const finalNumber = parsePhoneNumberFromString(
                                  selectedCountry.dialCode + numericValue.replace(/^0+/, '').replace(/\s/g, ''),
                                  selectedCountry.code as CountryCode
                              );
                          
                              if (!finalNumber || !finalNumber.isValid()) {
                                  setPhoneError(text.invalidPhone);
                                  return;
                              }else if (manualNumbers.some(n => n.number === numericValue.replace(/^0+/, '').replace(/\s/g, ''))) {
                                  setPhoneError(text.repetedPhone);
                                  return;
                              }else{
                                  setPhoneError('');
                                  return;
                              }
                          }}
                          error={!!phoneError}
                          helperText={phoneError}
                          sx={{
                            '& input': {
                              textAlign: lang === 'ar' ? 'right' : 'left',
                            },
                          }}
                      />
                      <TextField
                          fullWidth
                          id="name"
                          name="name"
                          type="text"
                          label={text.namePlaceholder}
                          variant="outlined"
                          size="small"
                          value={manualName}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              setManualName(event.target.value);
                          }}
                          // error={!!phoneError}
                          // helperText={phoneError}
                          sx={{
                            '& input': {
                              textAlign: lang === 'ar' ? 'right' : 'left',
                            },
                          }}
                      />
                      <Button variant="outline" size="sm" className='text-sm' onClick={handleManualNumberAdd}>
                        {text.addPhone}
                      </Button>
                  </Box>

                  <Box className={`flex flex-wrap gap-2 ${manualNumbers.length != 0?'mt-4':''}`}>
                      {manualNumbers.map((num, index) => (
                      <div key={index} className="flex items-center bg-gray-100 border py-1 rounded-md">
                        <div className='flex flex-col gap-1'>
                          <span className="ps-3 max-w-[100px] truncate overflow-hidden text-ellipsis whitespace-nowrap block">
                            {num.name}
                          </span>
                          <span className='ps-3'>{num.code + num.number}</span>
                        </div>
                          <Button
                          variant="text"
                          color="danger"
                          size="sm"
                          className="ml-0"
                          onClick={() => setManualNumbers(manualNumbers.filter(n => n.number !== num.number))}
                          >
                          ❌
                          </Button>
                      </div>
                      ))}
                  </Box>

                  <Box mt={3}>
                      {/* <Select
                      isMulti
                      options={contactOptions}
                      placeholder={text.selectContacts}
                      onChange={(selected) => {
                        setSelectedNumbers(selected as any);
                        setFieldValue("allNumbers", [
                          ...(selected as any)?.map((s: any) => ({ phoneNumber: s.value })) || [],
                          ...manualNumbers.map(num => ({ phoneNumber: num.code + num.number, name: num.name }))
                        ]);
                      }}
                      value={selectedNumbers}
                      /> */}
                      <AsyncPaginate
                        isMulti
                        value={selectedNumbers}
                        loadOptions={loadOptions}
                        onChange={(selected) => {
                          setSelectedNumbers(selected as any);
                          setFieldValue("allNumbers", [
                            ...(selected as any)?.map((s: any) => ({ phoneNumber: s.value })) || [],
                            ...manualNumbers.map(num => ({ phoneNumber: num.code + num.number, name: num.name }))
                          ]);
                        }}
                        placeholder={text.selectContacts}
                        additional={{ page: 1 }}
                      />
                  </Box>
                  {/* {touched.allNumbers && errors.allNumbers && (
                    <div className="text-red-500 text-sm mt-2">{errors.allNumbers}</div>
                  )} */}
                  {phoneNumbersError &&(
                      <div className="text-red-500 text-sm mt-2">{phoneNumbersError}</div>
                  )}
                  <Button className={`w-full ${phoneNumbersError?'mt-1':'mt-4'}`} type="submit" disabled={isSending}>
                      {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : text.send}
                  </Button>
              </Form>
          )}
        </Formik>
      </div>
    </DirectionWrapper>
  ) : null;
}

export default SendMessage;
