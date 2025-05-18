import NotFound from "@/app/not-found";
import { metaObject } from "@/config/site.config";

export const metadata = {
  ...metaObject('Update Product'),
};
export default function AssignToDelivery({ params: { lang }, }: { params: { lang: string; }; }) {
  return <>
    <NotFound />
  </>;
}
