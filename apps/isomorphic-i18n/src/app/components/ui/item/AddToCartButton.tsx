'use client'
import  cn  from '../../../../../../../packages/isomorphic-core/src/utils/class-names';
import { Check, Plus } from 'lucide-react';
import React from 'react';
import Price from './Price';
import { useTranslation } from '@/app/i18n/client';

type Props = {
	type?: string;
	mainItem?: boolean;
	className?: string;
	action?: () => void;
	price?: string;
	oldPrice?: string;
	lang?: string;
	buttonType?: "submit" | "reset" | "button" | undefined;
	isAddedToCart?: boolean;
};

function AddToCartButton({
	className,
	mainItem = false,
	action,
	type = 'add',
	price,
	oldPrice,
	lang,
	buttonType = "button",
	isAddedToCart
}: Props) {
	  const { t, i18n } = useTranslation(lang!, 'home');
	
	return (
		<button
			type={buttonType}
			onClick={action}
			className={cn(
				'flex text-white bg-primary px-2 py-1 rounded-lg font-bold items-center justify-center gap-1',
				className
			)}
		>
			{mainItem ? (
				<div className="w-full px-2 font-normal flex items-center justify-between">
					{t('Additem')}
					<Price
						className="flex-col-reverse items-end"
						price={price!}
						PriceClassName="text-white"
						oldPriceClassName="text-white/90"
						oldPrice={oldPrice}
					/>
				</div>
			) : !isAddedToCart ? (
				<>
					<Plus className="text-white" />
					{t('Add')}
				</>
			) : (
				<>
					<Check className="text-white" /> <span>Added</span>
				</>
			)}
		</button>
	);
}

export default AddToCartButton;
