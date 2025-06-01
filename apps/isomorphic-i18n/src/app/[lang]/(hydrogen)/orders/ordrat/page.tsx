import NotFound from "@/app/not-found";
import { metaObject } from "@/config/site.config";

export default function Branch({ params: { lang }, }: { params: { lang: string; }; }) {
  return <>
    <NotFound />
  </>;
}
