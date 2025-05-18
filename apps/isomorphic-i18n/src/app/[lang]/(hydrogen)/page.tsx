import Data from "@/app/components/Data";
import FileDashboard from "@/app/shared/file/dashboard";
import { metaObject } from "@/config/site.config";
import { Loader } from "rizzui";
import { redirect } from 'next/navigation';

export const metadata = {
  ...metaObject(),
};

export default function FileDashboardPage({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  redirect(`/${lang}/storeSetting/basicData`);
}
