
import dynamic from 'next/dynamic';
import TextInput from './textInput';
import { InputProps } from 'typings/typings';

const EmailInput = dynamic(() => import('./emailInput'), {
  ssr: false,
});

type Input = {
  [key: string]: JSX.Element;
};

const Input = ({ typeOfInput,lang }: InputProps) => {
  const inputs: Input = {
    text: <TextInput lang={lang} />,

  };

  return <div className={'mt-5'}>{inputs[typeOfInput]}</div>;
};

export default Input;
