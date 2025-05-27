import Image from 'next/image';

export function CustomYAxisTick({ x, y, payload, prefix, postfix }: any) {
  return (
    <g transform={`translate(${x},${y})`}>
      <foreignObject x={-50} y={-10} width={100} height={20}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            justifyContent: 'flex-end',
            fontSize: '12px',
            color: '#6B7280',
          }}
        >
          {payload.value.toLocaleString()}
          {postfix && <span>{postfix}</span>}
          {prefix}
        </div>
      </foreignObject>
    </g>
  );
}
