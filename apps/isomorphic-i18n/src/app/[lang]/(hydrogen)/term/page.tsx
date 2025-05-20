import { redirect } from 'next/navigation';
import { metaObject } from '@/config/site.config';
import GoToPath from '@/app/components/ui/goToPath/GoToPath';
import { Loader } from 'lucide-react';

export default function Term({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  redirect(`/${lang}/term/faq`);   
  // return <GoToPath lang={lang} path='marketingtools/banner' />;
}
