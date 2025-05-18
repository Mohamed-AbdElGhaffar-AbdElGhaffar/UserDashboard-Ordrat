import cn from '@utils/class-names';
import { Minus, Plus, Trash } from 'lucide-react';
import React from 'react';

type Props = {
	quantity: number;
	setQuantity: React.Dispatch<React.SetStateAction<number>>;
	type?: string;
	plusClassName?: string;
	className?: string;
};

function QuantityHandler({ quantity, setQuantity, type, className, plusClassName }: Props) {
	return (
		<div
			className={cn(
				'flex  rounded-lg px-2  py-2 shadow-md items-center justify-between',
				className
			)}
		>
			{quantity === 1 && type === 'cart' ? (
				<button onClick={() => setQuantity(prev => prev - 1)}>
					<Trash className={cn('text-primary')} size={type === 'cart' ? 16 : undefined} />
				</button>
			) : (
				<button type='button' disabled={quantity === 1} onClick={() => setQuantity(prev => prev - 1)}>
					<Minus
						className={cn({
							'text-Color50': quantity === 1,
							'text-primary': quantity > 1
						})}
						size={type === 'cart' ? 16 : undefined}
					/>
				</button>
			)}
			<span>{quantity}</span>
			<button type='button' className={plusClassName} onClick={() => setQuantity(prev => prev + 1)}>
				<Plus className={cn({ 'text-primary': true })} size={type === 'cart' ? 16 : undefined} />
			</button>
		</div>
	);
}

export default QuantityHandler;
