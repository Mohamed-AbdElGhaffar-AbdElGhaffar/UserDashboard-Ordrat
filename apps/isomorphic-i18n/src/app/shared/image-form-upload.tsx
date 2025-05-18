'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  PiArrowLineDownBold,
  PiFile,
  PiFileCsv,
  PiFileDoc,
  PiFilePdf,
  PiFileXls,
  PiFileZip,
  PiTrashBold,
  PiXBold,
} from 'react-icons/pi';
import { ActionIcon, Title, Text, Button } from 'rizzui';
import cn from '@utils/class-names';
import { useModal } from '@/app/shared/modal-views/use-modal';
import SimpleBar from '@ui/simplebar';
import { toast } from 'react-hot-toast';
// import Upload from './upload';
import { useUserContext } from '../components/context/UserContext';
import Upload from './Upload';
// import { useFileContext } from '../components/context/FileContext';

type AcceptedFiles = 'img' | 'pdf' | 'csv' | 'imgAndPdf' | 'all';

export default function FileUpload({
  label = 'Upload Files',
  btnLabel = 'Upload',
  fieldLabel,
  multiple = true,
  multipleFiles = true,
  accept = 'all',
  lang = 'lang',
  onFileChange,
  onFilesChange,
  onFileDelete,
  initialImage,
  recommendedDimensions,
  recommendedDimensionsTitle,
}: {
  label?: string;
  lang?: string;
  fieldLabel?: string;
  btnLabel?: string;
  multiple?: boolean;
  multipleFiles?: boolean;
  accept?: AcceptedFiles;
  onFileChange?: (file: File | null) => void;
  onFilesChange?: (file: File[] | null) => void;
  onFileDelete?: () => void;
  initialImage?: string;
  recommendedDimensions?: string; 
  recommendedDimensionsTitle?: string; 
}) {
  const { closeModal } = useModal();

  return (
    <div className="m-auto pb-2">
      <div className="mb-2 flex items-center justify-between">
        {(label || recommendedDimensions) && (
          <div className="w-full mb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            {label && (
              <Title as="h3" className="rizzui-input-label block text-sm mb-0 font-medium">
                {label}
              </Title>
            )}
            {(recommendedDimensions || recommendedDimensionsTitle) && (
              <>
                {recommendedDimensions ? (
                  <span className="text-xs text-gray-500">
                    {lang === 'ar'
                      ? `${recommendedDimensionsTitle ?? ''} ${recommendedDimensions} بكسل`
                      : `${recommendedDimensionsTitle ?? ''} ${recommendedDimensions} pixels`}
                  </span>
                ) : recommendedDimensionsTitle ? (
                  <span className="text-xs text-gray-500">
                    {lang === 'ar' ? recommendedDimensionsTitle : recommendedDimensionsTitle}
                  </span>
                ) : null}
              </>
            )}
          </div>
        )}
        {/* <ActionIcon
          size="sm"
          variant="text"
          onClick={() => closeModal()}
          className="p-0 text-gray-500 hover:!text-gray-900"
        >
          <PiXBold className="h-[18px] w-[18px]" />
        </ActionIcon> */}
      </div>

      <FileInput
        accept={accept}
        multiple={multiple}
        multipleFiles={multipleFiles}
        label={fieldLabel}
        btnLabel={btnLabel}
        lang={lang}
        onFileChange={onFileChange}
        onFilesChange={onFilesChange}
        onFileDelete={onFileDelete}
        initialImage={initialImage}
      />
    </div>
  );
}

const fileType = {
  'text/csv': <PiFileCsv className="h-5 w-5" />,
  'text/plain': <PiFile className="h-5 w-5" />,
  'application/pdf': <PiFilePdf className="h-5 w-5" />,
  'application/xml': <PiFileXls className="h-5 w-5" />,
  'application/zip': <PiFileZip className="h-5 w-5" />,
  'application/gzip': <PiFileZip className="h-5 w-5" />,
  'application/msword': <PiFileDoc className="h-5 w-5" />,
} as { [key: string]: React.ReactElement };

export const FileInput = ({
  label,
  btnLabel = 'Upload',
  multiple = true,
  multipleFiles = true,
  accept = 'img',
  className,
  lang,
  onFileChange,
  onFilesChange,
  onFileDelete,
  initialImage,
}: {
  className?: string;
  label?: React.ReactNode;
  multiple?: boolean;
  multipleFiles?: boolean;
  btnLabel?: string;
  accept?: AcceptedFiles;
  lang?: string;
  onFileChange?: (file: File | null) => void;
  onFilesChange?: (file: File[] | null) => void;
  onFileDelete?: () => void;
  initialImage?: string;
}) => {
  const { closeModal } = useModal();
  const [files, setFiles] = useState<Array<File>>([]);
  const imageRef = useRef<HTMLInputElement>(null);
  const { fileData, setFileData, bannersData, setBannersData } = useUserContext();

  function handleFileDrop(event: React.ChangeEvent<HTMLInputElement>) {
    setFileData(true);
    const uploadedFiles = (event.target as HTMLInputElement).files;
    const newFiles = Object.entries(uploadedFiles as object)
      .map((file) => {
        if (file[1]) return file[1];
      })
      .filter((file) => file !== undefined);
    
    // if (multipleFiles) {
    //     setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    // }else{
    //     setFiles(newFiles);
    // }
    // Invoke onFileChange with the first file if multipleFiles is false
    if (multipleFiles) {
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      if (onFilesChange) onFilesChange(newFiles[0] || null);
    } else {
      const singleFile = newFiles[0] || null;
      setFiles(newFiles);
      if (onFileChange) onFileChange(singleFile);
    }
  }

  function handleImageDelete(index: number) {
    setFileData(false);
    if (onFileDelete) {
      onFileDelete();
    }
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    (imageRef.current as HTMLInputElement).value = '';
  }

  function handleFileUpload() {
    if (files.length) {
      console.log('uploaded files:', files);
      toast.success(<Text as="b">File successfully added</Text>);

      setTimeout(() => {
        closeModal();
      }, 200);
    } else {
      toast.error(<Text as="b">Please drop your file</Text>);
    }
  }

  useEffect(() => {
    if (bannersData == true) {
      setFileData(false);
      if (onFileDelete) {
        onFileDelete();
      }
      const updatedFiles = files.filter((_, i) => i !== 0);
      setFiles(updatedFiles);
      (imageRef.current as HTMLInputElement).value = '';
      setBannersData(false);
    }
  }, [bannersData]); 

  return (
    <div className={className}>
      <Upload
        color='primary'
        label={label}
        ref={imageRef}
        accept={accept}
        multiple={fileData}
        multipleFiles={multipleFiles}
        lang={lang}
        onChange={(event) => handleFileDrop(event)}
        className={`${fileData? 'mb-6' : '' } min-h-[280px] justify-center border-dashed bg-gray-50 hover:bg-[#e8465414] dark:bg-transparent`}
        initialImage={initialImage}
      />

      {files.length > 1 ? (
        <Text className="mb-2 text-gray-500">{files.length} files</Text>
      ) : null}

      {files.length > 0 && (
        <SimpleBar className="max-h-[280px]">
          <div className="grid grid-cols-1 gap-4">
            {files?.map((file: File, index: number) => (
              <div
                className="flex min-h-[58px] w-full items-center rounded-xl border border-muted px-3 dark:border-gray-300"
                key={file.name}
              >
                <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-muted bg-gray-50 hover:bg-[#e8465414] object-cover px-2 py-1.5 dark:bg-transparent">
                  {file.type.includes('image') ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="object-contain absolute inset-0 w-full h-full"
                    />
                  ) : (
                    <>{fileType[file.type]}</>
                  )}
                </div>
                <div className="truncate px-2.5">{file.name}</div>
                <ActionIcon
                  onClick={() => handleImageDelete(index)}
                  size="sm"
                  variant="flat"
                  color="danger"
                  className="ms-auto flex-shrink-0 p-0 dark:bg-red-dark/20"
                >
                  <PiTrashBold className="w-6" />
                </ActionIcon>
              </div>
            ))}
          </div>
        </SimpleBar>
      )}
      {/* <div className="mt-4 flex justify-end gap-3">
        <Button
          variant="outline"
          className={cn(!files.length && 'hidden', 'w-full')}
          onClick={() => setFiles([])}
        >
          Reset
        </Button>
        <Button className="w-full" onClick={() => handleFileUpload()}>
          <PiArrowLineDownBold className="me-1.5 h-[17px] w-[17px]" />
          {btnLabel}
        </Button>
      </div> */}
    </div>
  );
};
