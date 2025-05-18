'use client';

import NextImage from 'next/image';
import toast from 'react-hot-toast';
import { useCallback, useState } from 'react';
import { useDropzone } from '@uploadthing/react/hooks';
import { PiCheckBold, PiTrashBold, PiUploadSimpleBold } from 'react-icons/pi';
import { Button, Text, FieldError } from 'rizzui';
import cn from '@utils/class-names';
import UploadIcon from '@components/shape/upload';
import { FileWithPath } from 'react-dropzone';
import { ClientUploadedFileData } from 'uploadthing/types';
import prettyBytes from 'pretty-bytes';

interface ExtendedFile extends File {
  preview: string;
  width?: number;
  height?: number;
}

interface UploadZoneProps {
  label?: string;
  name: string;
  files: any[];
  setFiles: (files: ExtendedFile[]) => void;
  className?: string;
  error?: string | string[];
  lang?: string;
  multiple?: boolean;
  recommendedDimensions?: string; 
  recommendedDimensionsTitle?: string; 
}

export default function UploadZone({
  label,
  name,
  files,
  setFiles, 
  className,
  error,
  lang = 'en',
  multiple = false,
  recommendedDimensions,
  recommendedDimensionsTitle,
}: UploadZoneProps) {
  console.log("files: ",files);
  
  const text = {
    dropOrSelectFile: lang === 'ar' ? 'اسحب أو اختر ملف' : 'Drop or select file',
    textButtons: {
      clearFiles: lang === 'ar' ? 'مسح' : 'Clear',
      uploadFiles: lang === 'ar' ? 'رفع' : 'Upload',
      files: lang === 'ar' ? 'ملفات' : 'files',
    },
    portfolioImagesUpdated: lang === 'ar' ? 'تم تحديث صور المحفظة' : 'Portfolio images updated',
  };

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    const readFiles = acceptedFiles.map((file) => {
      return new Promise<ExtendedFile>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const image = new Image();
          image.onload = () => {
            const extendedFile: ExtendedFile = Object.assign(file, {
              preview: URL.createObjectURL(file),
              width: image.width,
              height: image.height,
            });
            resolve(extendedFile);
          };
          if (typeof event.target?.result === 'string') {
            image.src = event.target.result;
          }
        };
        reader.readAsDataURL(file);
      });
    });
  
    Promise.all(readFiles).then((filesWithDimensions) => {
      if (multiple) {
        setFiles([...files, ...filesWithDimensions]);
      } else {
        setFiles(filesWithDimensions.slice(0, 1));
      }
    });
  }, [files, setFiles, multiple]);
  
  function handleRemoveFile(index: number) {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple,
  });

  return (
    <div className={cn('grid @container', className)}>
      {(label || recommendedDimensions) && (
        <div className="mb-1.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          {label && (
            <span className="block font-semibold text-gray-900">{label}</span>
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

      {/* Drag & Drop Upload Zone */}
      <div {...getRootProps()} className={cn(
        'rounded-md border-2 p-5 text-center cursor-pointer hover:bg-gray-50 transition-all duration-300',
        files.length === 0
          ? ''
          : 'flex flex-wrap items-center justify-between @xl:flex-nowrap'
      )}
      >
        <div
          className={cn(
            'flex cursor-pointer items-center gap-4 transition-all duration-300',
            files.length === 0
              ? 'justify-center'
              : 'flex-grow justify-center @xl:justify-start'
          )}
        >
          <input {...getInputProps()} />
          <UploadIcon className="h-12 w-12 text-gray-400" />
          <Text className="mt-2 text-sm text-gray-600">{text.dropOrSelectFile}</Text>
        </div>
        {/* Upload / Clear Buttons */}
        {files.length > 0 && (
          <UploadButtons
            files={files}
            onClear={() => setFiles([])}
            onUpload={() => toast.success(text.portfolioImagesUpdated)}
            text={text.textButtons}
          />
        )}
      </div>

      {/* File Previews */}
      {files.length > 0 && (
        <div className={`mt-5 grid gap-4 ${multiple? 'grid-cols-2 sm:grid-cols-[repeat(auto-fit,_minmax(140px,_1fr))]':'grid-cols-[repeat(auto-fit,_minmax(140px,_1fr))]'}`}>
          {files.map((file, index) => (
            <>
            {typeof file === 'string' ?
              <div key={index} className="relative">
                <figure className="group relative h-40 rounded-md bg-gray-50 flex items-center justify-center">
                  {/* <Image src={file.preview} alt={file.name} width={140} height={140} className="object-cover rounded-md" /> */}
                  <NextImage
                    fill
                    src={file}
                    alt={lang === 'ar'? 'صورة البانر الرئيسية': 'Main Banner Image'}
                    className="transform rounded-md object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="mohamed absolute right-0 top-0 rounded-full bg-gray-700/70 p-1.5 opacity-20 transition duration-300 hover:bg-red-dark group-hover:opacity-100"
                  >
                    <PiTrashBold className="ahmed text-white" />
                  </button>
                </figure>
                <MediaCaption name={lang === 'ar'? 'الصورة الرئيسية': 'Main Image'} />
              </div>
              :
              <div key={index} className="relative">
                <figure className="group relative h-40 rounded-md bg-gray-50 flex items-center justify-center">
                  {/* <Image src={file.preview} alt={file.name} width={140} height={140} className="object-cover rounded-md" /> */}
                  <NextImage
                    fill
                    src={file.preview}
                    alt={file.name}
                    className="transform rounded-md object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="mohamed absolute right-0 top-0 rounded-full bg-gray-700/70 p-1.5 opacity-20 transition duration-300 hover:bg-red-dark group-hover:opacity-100"
                  >
                    <PiTrashBold className="ahmed text-white" />
                  </button>
                </figure>
                <MediaCaption name={file.name} size={file.size} width={file.width} height={file.height} />
              </div>
            }
            </>
          ))}
        </div>
      )}

      {/* Validation Error */}
      {error && <FieldError error={Array.isArray(error) ? error[0] : error} />}
    </div>
  );
}

/* Upload Buttons */
function UploadButtons({
  files,
  onClear,
  onUpload,
  text,
}: {
  files: ExtendedFile[];
  onClear: () => void;
  onUpload: () => void;
  text: { clearFiles: string; uploadFiles: string; files: string };
}) {
  return (
    <div className="flex justify-end gap-4">
      <Button variant="outline" className="gap-2" onClick={onClear}>
        <PiTrashBold /> {text.clearFiles} ({files.length})
      </Button>
      {/* <Button className="gap-2" onClick={onUpload}>
        <PiUploadSimpleBold /> {text.uploadFiles} ({files.length})
      </Button> */}
    </div>
  );
}

/* File Caption */
function MediaCaption({ name, size, width, height }: { name: string; size?: number; width?: number; height?: number }) {
  return (
    <div className="mt-1 text-xs text-center">
      <p className="break-words font-medium text-gray-700">{name}</p>
      {size &&(
        <p className="mt-1 font-mono">{prettyBytes(size)}</p>
      )}
      {width && height && <p className="font-mono text-gray-500">{width}×{height}</p>}
    </div>
  );
}
