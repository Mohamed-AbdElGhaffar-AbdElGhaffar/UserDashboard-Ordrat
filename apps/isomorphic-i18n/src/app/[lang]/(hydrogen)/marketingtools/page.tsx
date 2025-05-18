import { redirect } from 'next/navigation';
import { metaObject } from '@/config/site.config';
import GoToPath from '@/app/components/ui/goToPath/GoToPath';
import { Loader } from 'lucide-react';

export const metadata = {
  ...metaObject('Marketing tools'),
};

export default function MarketingTools({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  redirect(`/${lang}/marketingtools/banner`);
  return <div className="flex items-center justify-center min-h-[200px]">
    <Loader className="animate-spin text-primary" width={40} height={40} />
  </div>;
  // return <GoToPath lang={lang} path='marketingtools/banner' />;
}
