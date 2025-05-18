type TitlesProps = {
  title: string;
};

export const H1 = ({ title }: TitlesProps) => {
  return (
    <h1 className="font-spline-sans text-4xl font-medium text-mainTextColor lg:text-6xl">{title}</h1>
  );
};
