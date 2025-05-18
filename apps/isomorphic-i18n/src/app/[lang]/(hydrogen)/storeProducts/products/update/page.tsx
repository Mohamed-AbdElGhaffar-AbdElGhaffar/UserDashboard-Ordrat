import NotFound from "@/app/not-found";
import { metaObject } from "@/config/site.config";

export const metadata = {
  ...metaObject('Update Product'),
};
export default function UpdateProduct({ params: { lang }, }: { params: { lang: string; }; }) {
  return <>
    <NotFound />
  </>;
}
