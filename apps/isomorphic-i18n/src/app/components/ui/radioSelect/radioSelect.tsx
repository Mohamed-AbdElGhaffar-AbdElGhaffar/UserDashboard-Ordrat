import cn from '@utils/class-names';
import Image from 'next/image';

type RadioOption = {
  value: string;
  label: string;
  image: any;
  class: string;
};

interface RadioSelectionProps {
  options: RadioOption[];
  formik: any;
  name: string;
  error?: string;
  lang: string;
  ImageClassName?: string;
  labelClassName?: string;
}

export default function RadioSelection({
  options,
  formik,
  name,
  error,
  lang,
  ImageClassName,
  labelClassName,
}: RadioSelectionProps) {
  console.log("formik.values[name]: ",formik.values[name]," options[0]: ",options[0].value);
  console.log("formik.values[name]: ",formik.values[name]," options[1]: ",options[1].value);
  console.log("formik.values[name]: ",formik.values[name]," options[2]: ",options[2].value);
  
  return (
    <div>
      <div className="mb-2 flex items-center gap-4">
        {options.map((option) => (
          <label
            key={option.value}
            className={`cursor-pointer flex flex-col items-center border-2 p-2 rounded-lg transition ${
              formik.values[name] === option.value
                ? option.class
                : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={formik.values[name] === option.value}
              onChange={() => {
                console.log("click");
                
                formik.setFieldValue(name, option.value)
              }} // ✅ Updates Formik state
              className="hidden"
            />
            <Image src={option.image} alt={option.label} width={200} height={200} className={cn('mb-2',ImageClassName)} />
            <span className={cn('',labelClassName)}>{option.label}</span>
          </label>
        ))}
      </div>

      {formik.touched[name] && error && <div className="text-red-500 text-sm">{error}</div>}
    </div>
  );
}
