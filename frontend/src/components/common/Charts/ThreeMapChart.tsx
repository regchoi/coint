import React, {ReactNode} from 'react';
import { Treemap, ResponsiveContainer, Tooltip, TooltipProps } from 'recharts';

interface TreemapChartProps {
    data: any[];
    dataKey: string;
    aspectRatio?: number;
    stroke?: string;
    fill?: string;
    showTooltip?: boolean;
    customTooltip?: React.ComponentType<TooltipProps<any, any>>;
}

// 기본 툴팁 컴포넌트 정의
const DefaultTooltip: React.FC<TooltipProps<any, any>> = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="label">{`Name : ${payload[0].payload.name}`}</p>
                <p className="intro">{`Size : ${payload[0].value}`}</p>
            </div>
        );
    }

    return null;
};

/**
 * ThreemapChart - 트리맵 차트
 * @param data 차트에 표시할 데이터
 * @param dataKey 차트에 표시할 데이터의 키
 * @param aspectRatio 차트의 가로 세로 비율 (default: 4/3)
 * @param stroke 차트의 테두리 색상 (default: #fff)
 * @param fill 차트의 색상 (default: #8884d8)
 * @param showTooltip 툴팁 표시 여부 (default: false)
 * @param customTooltip 툴팁 커스텀 (default: 없음)
 * @constructor
 */
const TreeMapChart = ({
      data,
      dataKey,
      aspectRatio = 4 / 3,
      stroke = "#fff",
      fill = "#8884d8",
      showTooltip = false,
      customTooltip,
  }: TreemapChartProps) => {
    // CustomTooltip의 custom-tooltip은 css로 스타일링
    const TooltipComponent = customTooltip || DefaultTooltip;
    const CustomTooltip = (props: TooltipProps<any, any>) => <TooltipComponent {...props} />;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <Treemap
                data={data}
                dataKey={dataKey}
                aspectRatio={aspectRatio}
                stroke={stroke}
                fill={fill}
            >
                {showTooltip && <Tooltip content={CustomTooltip} />}
            </Treemap>
        </ResponsiveContainer>
    );
}


export default TreeMapChart;
