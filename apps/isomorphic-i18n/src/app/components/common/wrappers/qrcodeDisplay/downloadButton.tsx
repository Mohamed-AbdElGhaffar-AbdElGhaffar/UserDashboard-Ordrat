import React from 'react';
import { DownloadSvg } from '../../svgs/downloadSvg';
import { ArrowDownToLine } from 'lucide-react';

type DownloadButtonProps = {
  onDownloadClickSvg: () => void;
  onDownloadClickPng: () => void;
  onDownloadClickpdf: () => void;
};

const DownloadButton = ({ onDownloadClickSvg, onDownloadClickPng,onDownloadClickpdf }: DownloadButtonProps) => {
  return (
    <div
      className={
        'mt-5 flex w-9/12 3xl:w-5/12 mx-auto flex-col items-center justify-between gap-5 gap-x-5 rounded-lg px-2 py-2 text-left text-sm text-white lg:flex-row'
      }
    >
      <button
        className={
          'flex w-6/12 items-center justify-center rounded-lg bg-[#2F566A] px-1 py-2 text-white transition-all duration-300 ease-in-out'
        }
        onClick={onDownloadClickPng}
      >
    
          <ArrowDownToLine className='w-5' />
        PNG
      </button>
      <button
        className={
          'flex w-6/12  items-center justify-center rounded-lg bg-[#2F566A] px-0 py-2 text-white transition-all duration-300 ease-in-out'
        }
        onClick={onDownloadClickSvg}
      >
                  <ArrowDownToLine className='w-5' />

        SVG
      </button>
      <button
        className={
          'flex w-6/12 items-center justify-center rounded-lg bg-[#2F566A] px-2 py-2 text-white transition-all duration-300 ease-in-out'
        }
        onClick={onDownloadClickpdf}
      >
                 <ArrowDownToLine className='w-5' />

        PDF
      </button>
    </div>
  );
};

export default DownloadButton;
