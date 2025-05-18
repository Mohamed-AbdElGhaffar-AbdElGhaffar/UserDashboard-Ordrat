import cn from '@utils/class-names';
import React from 'react';

type Props = {
	oldPrice?: string;
	price: string;
	className?: string;
	PriceClassName?: string;
	oldPriceClassName?: string;
};

function Price({ price, oldPrice, className, PriceClassName, oldPriceClassName }: Props) {
	return (
		<div className={cn('flex', className)}>
			<bdi
				className={cn(
					'',
					{
						'text-red-400': oldPrice
					},
					PriceClassName
				)}
			>
				{price}
			</bdi>
			{oldPrice && (
				<span className={cn('text-stone-600 line-through text-xs', oldPriceClassName)}>
					{oldPrice}
				</span>
			)}
		</div>
	);
}

export default Price;
