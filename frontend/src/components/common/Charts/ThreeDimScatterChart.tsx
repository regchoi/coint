import React from 'react';
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    ZAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

interface ScatterData {
    x: number;
    y: number;
    z: number;
}

interface ScatterSeries {
    name: string;
    data: ScatterData[];
    fill: string;
}

interface ThreeDimScatterChartProps {
    width?: string;
    height?: number;
    margin?: { top: number, right: number, bottom: number, left: number };
    scatterSeries: ScatterSeries[];
    xAxisDataKey?: string;
    xAxisName: string;
    xAxisUnit: string;
    xAxisFontSize?: number;
    yAxisDataKey?: string;
    yAxisName: string;
    yAxisUnit: string;
    yAxisFontSize?: number;
    zAxisDataKey?: string;
    zAxisRange?: number[];
    zAxisName: string;
    zAxisUnit: string;
    tooltipCursor?: any;
    showLegend?: boolean;
    showTooltip?: boolean;
}

/**
 * ThreeDimScatterChart - 3차원 산점도 차트
 * @param width 차트의 너비 (default: 100%)
 * @param height 차트의 높이 (default: 400)
 * @param margin 차트의 margin - { top: 20, right: 20, left: 20, bottom: 20 }
 * @param scatterSeries 차트에 표현할 데이터
 * @param xAxisDataKey X축에 표현할 데이터의 key (default: "x")
 * @param xAxisName X축의 이름
 * @param xAxisUnit X축의 단위
 * @param xAxisFontSize X축의 폰트 사이즈 (default: 12)
 * @param yAxisDataKey Y축에 표현할 데이터의 key (default: "y")
 * @param yAxisName Y축의 이름
 * @param yAxisUnit Y축의 단위
 * @param yAxisFontSize Y축의 폰트 사이즈 (default: 12)
 * @param zAxisDataKey Z축에 표현할 데이터의 key (default: "z")
 * @param zAxisRange Z축의 범위 (default: [0, 1000])
 * @param zAxisName Z축의 이름
 * @param zAxisUnit Z축의 단위
 * @param tooltipCursor 툴팁의 커서 (default: { strokeDasharray: '3 3' })
 * @param showLegend 범례 표시 여부 (default: true)
 * @param showTooltip 툴팁 표시 여부 (default: true)
 * @constructor
 */
const ThreeDimScatterChart: React.FC<ThreeDimScatterChartProps> = ({
       width = "100%",
       height = 400,
       margin = { top: 20, right: 20, bottom: 20, left: 20 },
       scatterSeries,
       xAxisDataKey = "x",
       xAxisName,
       xAxisUnit,
       xAxisFontSize = 12,
       yAxisDataKey = "y",
       yAxisName,
       yAxisUnit,
       yAxisFontSize = 12,
       zAxisDataKey = "z",
       zAxisRange = [0, 1000],
       zAxisName,
       zAxisUnit,
       tooltipCursor = { strokeDasharray: '3 3' },
       showLegend = true,
       showTooltip = true,
   }) => {
    return (
        <ResponsiveContainer width={width} height={height}>
            <ScatterChart margin={margin}>
                <CartesianGrid />
                <XAxis type="number" dataKey={xAxisDataKey} name={xAxisName} unit={xAxisUnit} tick={{ fontSize: xAxisFontSize }} />
                <YAxis type="number" dataKey={yAxisDataKey} name={yAxisName} unit={yAxisUnit} tick={{ fontSize: yAxisFontSize }} />
                <ZAxis type="number" dataKey={zAxisDataKey} range={zAxisRange} name={zAxisName} unit={zAxisUnit} />
                {showTooltip && <Tooltip cursor={tooltipCursor} /> }
                {showLegend && <Legend /> }
                {scatterSeries.map((series, idx) => (
                    <Scatter key={idx} name={series.name} data={series.data} fill={series.fill} />
                ))}
            </ScatterChart>
        </ResponsiveContainer>
    );
};

export default ThreeDimScatterChart;
