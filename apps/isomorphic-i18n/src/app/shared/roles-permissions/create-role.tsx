'use client';

import { useState } from 'react';
import { PiChecksBold, PiFilesBold, PiXBold } from 'react-icons/pi';
import { RgbaColorPicker } from 'react-colorful';
import { Controller, SubmitHandler } from 'react-hook-form';
import { Form } from '@ui/form';
import { Input, Button, Tooltip, ActionIcon, Title } from 'rizzui';
import { useCopyToClipboard } from '@hooks/use-copy-to-clipboard';
import {
  CreateRoleInput,
  createRoleSchema,
} from '@/validators/create-role.schema';
import { useModal } from '@/app/shared/modal-views/use-modal';
import { useTranslation } from '@/app/i18n/client';

// main category form component for create and update category
export default function CreateRole({lang='en'}:{lang?:string;}) {
  const { t } = useTranslation(lang!, 'form');
  const { closeModal } = useModal();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [state, copyToClipboard] = useCopyToClipboard();
  const text = {
    title: lang === 'ar' ? 'إضافة مجموعة جديدة' : 'Add New Group',
    groupNameEn: lang === 'ar' ? "اسم المجموعة (بالإنجليزية)" : "Group Name (in English)",
    groupNameAr: lang === 'ar' ? "اسم المجموعة (بالعربية)" : "Group Name (in Arabic)",
    groupColor: lang === 'ar' ? 'لون المجموعة' : 'Group Color',
    clickToCopy: lang === 'ar' ? 'اضغط للنسخ' : 'Click to Copy',
    copiedToClipboard: lang === 'ar' ? 'تم النسخ' : 'Copied to Clipboard',
    cancel: lang === 'ar' ? 'إلغاء' : 'Cancel',
    create: lang === 'ar' ? 'إنشاء مجموعة' : 'Create Group',
  };

  console.log('state', state);

  const onSubmit: SubmitHandler<CreateRoleInput> = (data) => {
    // set timeout ony required to display loading state of the create category button
    setLoading(true);
    setTimeout(() => {
      console.log('data', data);
      setLoading(false);
      setReset({
        roleName: '',
        groupColor: '',
      });
      closeModal();
    }, 600);
  };

  const handleCopyToClipboard = (rgba: string) => {
    copyToClipboard(rgba);

    setIsCopied(() => true);
    setTimeout(() => {
      setIsCopied(() => false);
    }, 3000); // 3 seconds
  };

  return (
    <Form<CreateRoleInput>
      // resetValues={reset}
      onSubmit={onSubmit}
      validationSchema={createRoleSchema}
      className="flex flex-grow flex-col gap-6 p-6 @container [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900"
    >
      {({ register, control, watch, formState: { errors } }) => {
        const getColor = watch('groupColor');
        const colorCode = `rgba(${getColor?.r ?? 0}, ${getColor?.g ?? 0}, ${
          getColor?.b ?? 0
        }, ${getColor?.a ?? 0})`;
        return (
          <>
            <div className="flex items-center justify-between">
              <Title as="h4" className="font-semibold">
                {text.title}
              </Title>
              <ActionIcon size="sm" variant="text" onClick={closeModal}>
                <PiXBold className="h-auto w-5" />
              </ActionIcon>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={text.groupNameEn}
                placeholder={text.groupNameEn}
                {...register('groupNameEn')}
                error={t(errors.groupNameEn?.message as string)}
              />
              <Input
                label={text.groupNameAr}
                placeholder={text.groupNameAr}
                {...register('groupNameAr')}
                error={t(errors.groupNameAr?.message as string)}
              />
            </div>
            <Input
              label={text.groupColor}
              placeholder={text.groupColor}
              readOnly
              inputClassName="hover:border-muted"
              suffix={
                <Tooltip
                  size="sm"
                  content={isCopied ? text.copiedToClipboard : text.clickToCopy}
                  placement="top"
                  className="z-[1000]"
                >
                  <ActionIcon
                    variant="text"
                    title={text.clickToCopy}
                    onClick={() => handleCopyToClipboard(colorCode)}
                    className="-mr-3"
                  >
                    {isCopied ? (
                      <PiChecksBold className="h-[18px] w-[18px]" />
                    ) : (
                      <PiFilesBold className="h-4 w-4" />
                    )}
                  </ActionIcon>
                </Tooltip>
              }
              value={colorCode}
            />
            <div className='flex items-center justify-center'>
              <Controller
                control={control}
                name="groupColor"
                render={({ field: { onChange, value } }) => (
                  <RgbaColorPicker color={value} onChange={onChange} />
                )}
              />
            </div>

            <div className="flex items-center justify-end gap-4">
              <Button
                variant="outline"
                onClick={closeModal}
                className="w-full @xl:w-auto"
              >
                {text.cancel}
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full @xl:w-auto"
              >
                {text.create}
              </Button>
            </div>
          </>
        );
      }}
    </Form>
  );
}
