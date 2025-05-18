import NotFound from "@/app/not-found";
import { metaObject } from "@/config/site.config";

export const metadata = {
  ...metaObject('Update Details'),
};
export default function UpdateDetails({ params: { lang }, }: { params: { lang: string; }; }) {
  return <>
    <NotFound />
  </>;
}
