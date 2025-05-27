import {
  ValueType,
  NameType,
} from 'recharts/types/component/DefaultTooltipContent';
import { TooltipProps } from 'recharts';
import { Text } from 'rizzui';
import cn from '../../utils/class-names';
import { addSpacesToCamelCase } from '../../utils/add-spaces-to-camel-case';
import { formatNumber } from '../../utils/format-number';

function isValidHexColor(colorCode: string) {
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexColorRegex.test(colorCode);
}

export interface CustomTooltipProps extends TooltipProps<ValueType, NameType> {
  prefix?: any;
  postfix?: string;
  className?: string;
  lang?: string;
  currency: string; 
  formattedNumber?: boolean;
  translateKey?: (key: string) => string; 
}

export function CustomTooltip({
  label,
  prefix,
  active,
  postfix,
  payload,
  lang,
  className,
  translateKey ,
  formattedNumber,
  currency,
}: CustomTooltipProps) {
  if (!active) return null;

  return (
    <div
      className={cn(
        'rounded-md border border-gray-300 bg-gray-0 shadow-2xl dark:bg-gray-100',
        className
      )}
    >
      <Text className="label mb-0.5 block bg-gray-100 p-2 px-2.5 text-center font-lexend text-xs font-semibold capitalize text-gray-600 dark:bg-gray-200/60 dark:text-gray-700">
        {label}
      </Text>
      <div className="px-3 py-1.5 text-xs">
        {payload?.map((item: any, index: number) => (
          <div
            key={item.dataKey + index}
            className="chart-tooltip-item flex items-center py-1.5"
          >
            <span
              className="me-1.5 h-2 w-2 rounded-full"
              style={{
                backgroundColor: isValidHexColor(item.fill)
                  ? item.fill === '#fff'
                    ? item.stroke
                    : item.fill
                  : item.stroke,
              }}
            />
         <Text className="flex items-center gap-1">
  <Text as="span" className="capitalize">
    {translateKey ? translateKey(item.dataKey) : item.dataKey}:
  </Text>{' '}
  <Text
    as="span"
    className="font-medium text-gray-900 dark:text-gray-700 flex items-center gap-1"
  >
    {currency === 'ر.س' ? (
      <>
        {formattedNumber ? formatNumber(item.value) : item.value}
        {prefix}
      </>
    ) : lang === 'ar' ? (
      <>
        {prefix}
        {formattedNumber ? formatNumber(item.value) : item.value}
      </>
    ) : (
      <>
        {formattedNumber ? formatNumber(item.value) : item.value}
        {prefix}
      </>
    )}
    {postfix && postfix}
  </Text>
</Text>

          </div>
        ))}
      </div>
    </div>
  );
}