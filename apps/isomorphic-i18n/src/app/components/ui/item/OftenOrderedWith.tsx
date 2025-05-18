import React, { useState } from 'react';
import Price from './Price';
import AddToCartButton from './AddToCartButton';
import { FullProduct } from '@/types';
import Image from 'next/image';

type Props = {
	data: FullProduct['frequentlyOrderedWith'];
};

function OftenOrderedWith({ data }: Props) {
	const [isAddedToCart, setIsAddedToCart] = useState(false)
	return (
		<div className="flex flex-col pt-4">
			<h3 className="font-bold text-lg">Often ordered with</h3>
			<p className="text-black/70">People usually order these items as well</p>
			<div className="flex gap-5 py-5 flex-nowrap overflow-x-auto">
				{data.map((rp, i) => (
					<div key={rp.productId} className="flex rounded-lg flex-col gap-8 justify-between border">
						<div className="flex flex-col gap-3">
							<Image
								src={rp.relatedProduct.imageUrl}
								alt={'image'}
								className="relative w-[150px] h-[100px] rounded-t-lg"
								// imageClasses="rounded-t-lg"
							/>
							<h4 className="px-2">
								{
									//@ts-ignore
									rp.relatedProduct.name
								}
							</h4>
						</div>
						<div className="flex flex-col gap-2 px-2 pb-2">
							<Price
								price={`EGP ${rp.relatedProduct.price}`}
								oldPrice={
									rp.relatedProduct?.oldPrice ? `EGP ${rp.relatedProduct.oldPrice}` : undefined
								}
							/>
							<AddToCartButton
								action={() => setIsAddedToCart(!isAddedToCart)}
								isAddedToCart={isAddedToCart}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default OftenOrderedWith;
