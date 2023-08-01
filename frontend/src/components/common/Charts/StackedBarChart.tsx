import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// props 정의
interface StackedBarChartProps<T> {
    data: T[];
    colors: string[];
    dataKey: string;
    dataKeys: string[];
    height: number;
    width: string | number;
    margin?: { top: number; right: number; left: number; bottom: number };
    XAxisFontSize?: number;
    YAxisFontSize?: number;
    tooltipFormat?: (value: number, name: string, entry: any) => React.ReactNode;
    barSize?: number; // 바 차트의 두께를 설정하는 prop 추가
    showLegend?: boolean; // 범례를 표시할지 여부를 설정하는 prop 추가
    showTooltip?: boolean; // 툴팁을 표시할지 여부를 설정하는 prop 추가
}

/**
 * StackedBarChart - 가공한 data 및 dataKey를 활용하여 차트 표현가능한 컴포넌트
 * margin, XAxisFontSize, YAxisFontSize, tooltipFormat, barSize, showLegend는 default값이 존재
 * @param data 차트에 표현할 데이터
 * @param colors 차트에 표현할 색상
 * @param dataKey 차트에 표현할 데이터 기준 key
 * @param dataKeys 차트에 표현할 데이터의 key 배열
 * @param height 차트의 높이
 * @param width 차트의 너비
 * @param margin 차트의 margin - { top: 20, right: 30, left: 20, bottom: 20 }
 * @param XAxisFontSize X축의 폰트 사이즈 (default: 12)
 * @param YAxisFontSize Y축의 폰트 사이즈 (default: 12)
 * @param tooltipFormat 툴팁의 포맷팅 함수 (default: value => value)
 * @param barSize 바 차트의 두께 (default: 40)
 * @param showLegend 범례 표시 여부 (default: true)
 * @param showTooltip 툴팁 표시 여부 (default: true)
 * @constructor
 */
const StackedBarChart = <T,>({
                                 data,
                                 colors,
                                 dataKey,
                                 dataKeys,
                                 height,
                                 width,
                                 margin = { top: 20, right: 30, left: 20, bottom: 20 },
                                 XAxisFontSize = 12,
                                 YAxisFontSize = 12,
                                 tooltipFormat,
                                 barSize = 40, // 기본 바 차트 두께 설정
                                 showLegend = true, // 기본 범례 표시
                                 showTooltip = true, // 기본 툴팁 표시 여부
                             }: StackedBarChartProps<T>) => {

    // Tooltip의 커스텀 포매터 함수
    // Tooltip에 표시되는 단위를 변경하고 싶을 때 사용
    const customTooltipFormatter = (value: number, name: string, entry: any) => {
        if (tooltipFormat) {
            return tooltipFormat(value, name, entry);
        }
        return value;
    };

    return (
        <ResponsiveContainer width={width} height={height}>
            <BarChart data={data} margin={margin}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={dataKey} tick={{ fontSize: XAxisFontSize }} />
                <YAxis tick={{ fontSize: YAxisFontSize }} />
                {showTooltip && <Tooltip formatter={customTooltipFormatter} /> }
                {showLegend && <Legend wrapperStyle={{ fontSize: '14px' }} /> }
                {dataKeys.map((key, index) => (
                    <Bar key={index} dataKey={key} stackId="a" fill={colors[index % colors.length]} barSize={barSize} />
                    ))}
            </BarChart>
        </ResponsiveContainer>
    );
};

export default StackedBarChart;
