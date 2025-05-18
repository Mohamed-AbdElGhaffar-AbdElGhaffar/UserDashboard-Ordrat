
import { QrStyleContext } from '@/app/components/contsxt1';
import jsPDF from 'jspdf';

import { ColorTypes } from '@/app/components/contsxt1/colorTypes';
import QRCodeStyling, {
  CornerDotType,
  CornerSquareType,
  DotType,
  DrawType,
  ErrorCorrectionLevel,
  FileExtension,
  Mode,
  Options,
  TypeNumber,
} from 'qr-code-styling';
import { useContext, useEffect, useRef, useState } from 'react';
import Details from './details';
import ShapesSwitcher from './shapesSwitcher';
import { ColorsTabs } from './tabs/colorsTabs';
import FileInput from './inputFile';
import DownloadButton from './downloadButton';

const QRCode = ({ lang }: { lang: string }) => {
  const { state } = useContext(QrStyleContext);

  const toBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const [options] = useState<Options>({
    width: 235,
    height: 235,
    type: 'svg' as DrawType,
    data: `${state.value}`,
    image: '',
    margin: 10,
    qrOptions: {
      typeNumber: 0 as TypeNumber,
      mode: 'Byte' as Mode,
      errorCorrectionLevel: 'Q' as ErrorCorrectionLevel,
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.4,
      margin: 5,
      crossOrigin: 'anonymous',
    },
    dotsOptions: {
      color: state.dotColor || '#000000',
      type: state.dotType as DotType,
    },
    backgroundOptions: {
      color: state.background || '#ffffff',
    },
    cornersSquareOptions: {
      color: state.eyeColor || '#000000',
      type: state.style as CornerSquareType,
    },
    cornersDotOptions: {
      color: state.eyeColor || '#000000',
      type: state.style as CornerDotType,
    },
  });

  const [qrCode] = useState<QRCodeStyling>(new QRCodeStyling(options));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = '';
      qrCode.append(ref.current);
    }
  }, [qrCode, ref]);


  const onDownloadClickSvg = () => {
    if (!qrCode) return;
    qrCode.download({
      extension: 'svg' as FileExtension,
      name: 'qr-code',
    });
  };

  const onDownloadClickPng = () => {
    if (!qrCode) return;
    qrCode.download({
      extension: 'png' as FileExtension,
      name: 'qr-code',
    });
  };

  const onDownloadClickPdf = async () => {
    // 1. أنشئ instance جديد من QRCodeStyling
    const exportQr = new QRCodeStyling({
      ...options, // ممكن تمرر نفس الإعدادات هنا
      data: state.value,
      image: typeof state.logoImage === 'string' ? state.logoImage : '',
      backgroundOptions: {
        color: state.background,
      },
      dotsOptions: {
        color: state.dotColor,
        type: state.dotType,
      },
      cornersSquareOptions: {
        type: state.style,
        color: state.eyeColor,
      },
      cornersDotOptions: {
        type: state.style,
        color: state.eyeColor,
      },
    });

    // 2. ارسمه في div مخفي
    const hiddenContainer = document.createElement('div');
    hiddenContainer.style.position = 'absolute';
    hiddenContainer.style.left = '-9999px';
    document.body.appendChild(hiddenContainer);
    await exportQr.append(hiddenContainer);
    await new Promise((res) => setTimeout(res, 300));

    // 3. خد صورة PNG
    const blob = await exportQr.getRawData('png') as Blob;
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

    // 4. شيل الـ container
    document.body.removeChild(hiddenContainer);

    // 5. احفظ PDF
    const pdf = new jsPDF({ unit: 'px', format: [300, 300] });
    pdf.addImage(dataUrl, 'PNG', 10, 10, 280, 280);
    pdf.save('qr-code.pdf');
  };



  useEffect(() => {
    if (!qrCode) return;
    if (state.logoImage) {
      if (typeof state.logoImage === 'string') {
        qrCode.update({
          image: state.logoImage,
        });
      } else {
        toBase64(state.logoImage).then((res) => {
          qrCode.update({
            image: res,
          });
        });
      }
    }
    if (state.logoImage === '') {
      qrCode.update({
        image: '',
      });
    }
    qrCode.update({
      data: `${state.value}`,
      cornersSquareOptions: {
        color: `${state.eyeColor}` as ColorTypes['colors'],
        type: `${state.style}` as CornerSquareType,
      },
      cornersDotOptions: {
        color: `${state.eyeColor}` as ColorTypes['colors'],
        type: `${state.style}` as CornerDotType,
      },
      dotsOptions: {
        type: `${state.dotType}` as DotType,
        color: `${state.dotColor}` as ColorTypes['colors'],
      },
      backgroundOptions: {
        color: `${state.background}` as ColorTypes['colors'],
      },
    });
  }, [
    qrCode,
    state.style,
    state.dotType,
    state.background,
    state.dotColor,
    state.eyeColor,
    state.value,
    state.logoImage,
  ]);

  return (
    <>
      <div className={'mx-auto flex justify-center'} ref={ref} />
      {/* <Details title={lang === 'ar' ? 'الشكل' : 'Shape'}>
        <ShapesSwitcher lang={lang} />
      </Details>
      <Details title={lang === 'ar' ? 'الالوان' : 'Colors'}>
        <ColorsTabs lang={lang} />
      </Details>
      <Details title={lang === 'ar' ? 'الشعار' : 'Logo'}>
        <FileInput lang={lang} />
      </Details> */}
      <DownloadButton
        onDownloadClickPng={onDownloadClickPng}
        onDownloadClickSvg={onDownloadClickSvg}
        onDownloadClickpdf={onDownloadClickPdf}
      />

    </>
  );
};

export default QRCode;
