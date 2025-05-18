import { redirect } from 'next/navigation';
import { Loader } from 'lucide-react';

export default function StoreProducts({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  redirect(`/${lang}/storeProducts/categories`);
  return <div className="flex items-center justify-center min-h-[200px]">
    <Loader className="animate-spin text-primary" width={40} height={40} />
  </div>;
}
