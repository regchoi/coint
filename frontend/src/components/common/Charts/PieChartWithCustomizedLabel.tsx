import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, PieLabelRenderProps } from 'recharts';

// Pie Chart에서 사용할 Customized Label을 위한 props
interface ExtendedPieLabelRenderProps extends PieLabelRenderProps {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
}

interface CustomPieChartProps<T> {
    data: T[];
    colors: string[];
    dataKey: string;
    outerRadius: number;
    label: boolean;
    cx?: string;
    cy?: string;
    midAngle?: number;
    innerRadius?: number;
    percent?: number;
    tooltipFormat?: (value: any, name: string, entry: any) => string;  // Add this line
}

/**
 * PieChartWithCustomizedLabel - 가공한 data의 비율을 활용하여 Pie Chart 표현가능한 컴포넌트
 * cx, cy, midAngle, innerRadius, percent는 renderCustomizedLabel 함수에서 사용할 수 있는 props를 default값 존재
 * @param data Pie Chart에 표현할 data
 * @param colors Pie Chart에 표현할 data의 색상
 * @param dataKey Pie Chart에 표현할 data의 key
 * @param outerRadius Pie Chart의 바깥 반지름
 * @param label Pie Chart에 label을 표시할지 여부
 * @param cx Pie Chart의 중심 x좌표 (50%가 중심)
 * @param cy Pie Chart의 중심 y좌표 (50%가 중심)
 * @param midAngle Pie Chart의 중심 각도
 * @param innerRadius Pie Chart의 안쪽 반지름
 * @param percent Pie Chart의 비율
 * @constructor
 */
const PieChartWithCustomizedLabel = <T,>({ data, colors, dataKey, outerRadius, label, cx, cy, midAngle, innerRadius, percent, tooltipFormat }: CustomPieChartProps<T>) => {

    const RADIAN = Math.PI / 180;

    // cx, cy, midAngle, innerRadius, outerRadius, percent와 같이 renderCustomizedLabel 함수에서 사용할 수 있는 props를 미리 지정
    // 필수값으로 지정하지 않고, undefined일 경우에는 default 값으로 사용해 해당 컴포넌트 사용시에 편리하게 사용할 수 있도록 함
    const renderCustomizedLabel = ({
                                       cx: defaultCx,
                                       cy: defaultCy,
                                       midAngle: defaultMidAngle,
                                       innerRadius: defaultInnerRadius,
                                       outerRadius: defaultOuterRadius,
                                       percent: defaultPercent }: ExtendedPieLabelRenderProps) => {

        const radius = defaultInnerRadius + (defaultOuterRadius - defaultInnerRadius) * 0.5;
        const x = defaultCx + radius * Math.cos(-defaultMidAngle * RADIAN);
        const y = defaultCy + radius * Math.sin(-defaultMidAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > defaultCx ? 'start' : 'end'} dominantBaseline="central">
                {`${(defaultPercent * 100).toFixed(0)}%`}
            </text>
        );
    };

    // Tooltip의 커스텀 포매터 함수
    // Tooltip에 표시되는 단위를 변경하고 싶을 때 사용
    const customTooltipFormatter = (value: number, name: string, entry: any) => {
        if (tooltipFormat) {
            return tooltipFormat(value, name, entry);
        }
        return value;
    };

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    cx={cx ?? "50%"} // use the provided cx prop, or default to "50%" if not provided
                    cy={cy ?? "50%"} // use the provided cy prop, or default to "50%" if not provided
                    labelLine={false}
                    label={label ? renderCustomizedLabel : undefined}
                    outerRadius={outerRadius}
                    fill="#8884d8"
                    dataKey={dataKey}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={customTooltipFormatter} />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default PieChartWithCustomizedLabel;
