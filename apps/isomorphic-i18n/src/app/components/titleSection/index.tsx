'use client'
// import { H1 } from '@/common/titles';
// import QrCodeWrapper from '@/common/wrappers/qrcodeDisplay';
// import Input from '@/components/titleSection/input';
import QrCodeWrapper from '../common/wrappers/qrcodeDisplay';
import Input from './input';
import { H1 } from '../common/titles';
import { InputProps } from 'typings/typings';
import Details from '../common/wrappers/qrcodeDisplay/details';
import ShapesSwitcher from '../common/wrappers/qrcodeDisplay/shapesSwitcher';
import { ColorsTabs } from '../common/wrappers/qrcodeDisplay/tabs/colorsTabs';
import FileInput from '../common/wrappers/qrcodeDisplay/inputFile';
import { useContext, useEffect, useRef, useState } from 'react';

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
import { QrStyleContext } from '../contsxt1';
// import Details from '.';
// import ShapesSwitcher from './shapesSwitcher';
type TitleProps = {
  title: string;
  lang: string;
  typeOfInput: InputProps['typeOfInput'];
};
const Title = ({ title, typeOfInput, lang }: TitleProps) => {
  const { state } = useContext(QrStyleContext);

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
  return (
    <div className="flex flex-col gap-16 lg:grid lg:grid-cols-2  items-stretch">
      <div className={'mx-auto w-11/12 p-10 shadow-md bg-white h-auto rounded-xl'}>
        <H1 title={title} />
        <Input lang={lang} typeOfInput={typeOfInput} />
        <Details title={lang === 'ar' ? 'الشكل' : 'Shape'}>
          <ShapesSwitcher lang={lang} />
        </Details>
        <Details title={lang === 'ar' ? 'الالوان' : 'Colors'}>
          <ColorsTabs lang={lang} />
        </Details>
        <Details title={lang === 'ar' ? 'الشعار' : 'Logo'}>
          <FileInput lang={lang} />
        </Details>
      </div>
      <QrCodeWrapper lang={lang} />
    </div>
  );
};

export default Title;
