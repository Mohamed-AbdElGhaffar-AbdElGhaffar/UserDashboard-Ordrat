// import cn from '../../../../../../../isomorphic/packages/isomorphic-core/src/utils/class-names';
import cn from '@utils/class-names';
import { LucideProps, Star } from 'lucide-react';
import React, { HTMLAttributes } from 'react';

type Props = {
	Icon: React.ForwardRefExoticComponent<
		Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
	>;
	title: string;
	className?: HTMLAttributes<HTMLDivElement>['className'];
};

function Badge({ Icon, title, className }: Props) {
	return (
		<div
			className={cn(
				'flex items-center gap-1 bg-Color30  text-primary   font-semibold text-[10px] w-fit px-1 py-.5 rounded-md',
				className
			)}
		>
			<Icon className="fill-primary text-primary" size={12} /> {title}
		</div>
	);
}

export default Badge;
