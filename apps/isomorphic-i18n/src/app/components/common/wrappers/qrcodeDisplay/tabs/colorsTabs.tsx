import ColorSwitcher from "../colorSwitcher";

export const ColorsTabs = ({ lang }: { lang: string }) => {
  const tabs = [
    {
      title: lang === 'ar' ? 'لون الباركود' : 'Dot Color',
      key: 'dotColor',
    },
    {
      title: lang === 'ar' ? 'لون الخلفية' : 'Background Color',
      key: 'background',
    },
    {
      title: lang === 'ar' ? 'لون الحواف' : 'Eye Color',
      key: 'eyeColor',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {tabs.map((tab, idx) => (
        <div key={idx}>
          <p className="text-sm rounded-full font-semibold  text-gray-800 mb-2">{tab.title}</p>
          <ColorSwitcher  change={tab.key as any} />
        </div>
      ))}
    </div>
  );
};
