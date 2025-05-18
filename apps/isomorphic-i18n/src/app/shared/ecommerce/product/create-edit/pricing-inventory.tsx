import FormGroup from '@/app/shared/form-group';
import cn from '@utils/class-names';
import ProductAvailability from '@/app/shared/ecommerce/product/create-edit/product-availability';
import InventoryTracing from '@/app/shared/ecommerce/product/create-edit/inventory-tracking';
import ProductPricing from '@/app/shared/ecommerce/product/create-edit/product-pricing';

interface PricingInventoryProps {
  className?: string;
  lang?: string;
  languages?: number;
}

export default function PricingInventory({ className, lang='en', languages }: PricingInventoryProps) {
  const text = {
    sectionTitle: lang === 'ar' ? "التسعير" : "Pricing",
    sectionDescription: lang === 'ar' ? "أضف تسعير المنتج هنا" : "Add your product pricing here",
  };
  return (
    <>
      <FormGroup
        title={text.sectionTitle}
        description={text.sectionDescription}
        className={cn(className)}
      >
        <ProductPricing lang={lang} />
      </FormGroup>
      {/* <FormGroup
        title="Inventory Tracking"
        description="Add your product inventory info here"
        className={cn(className)}
      >
        <InventoryTracing />
      </FormGroup>
      <FormGroup
        title="Availability"
        description="Add your product inventory info here"
        className={cn(className)}
      >
        <ProductAvailability />
      </FormGroup> */}
    </>
  );
}
