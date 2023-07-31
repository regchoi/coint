import React from 'react';
import PieChartWithCustomizedLabel from "../../common/Charts/PieChartWithCustomizedLabel";
import {Grid} from "@mui/material";

const SampleDataPieChart: React.FC = () => {
    const data = [
        { name: '제 1공장', value: 1500 },
        { name: '제 2공장', value: 500 },
        { name: '기타', value: 700 },
    ];
    const colors = ['#8884d8', '#82ca9d', '#FFBB28', '#FF8042'];

    // 툴팁 포매터 함수 Example
    const customTooltipFormat = (value: number, name: string) => {
        return `${value}개`;
    };

    return (
        <Grid item xs={4} style={{ height: '300px', position: 'relative' }}>
            <h2>Custom Pie Chart Sample Data Example</h2>
            <h5>공장별 제품 총 생산량</h5>
            <PieChartWithCustomizedLabel
                data={data}
                colors={colors}
                dataKey="value"
                outerRadius={100}
                cx={'25%'}  // 차트의 x축 위치 - 커스터마이징 예시
                cy={'50%'}
                label={true}
                tooltipFormat={customTooltipFormat}
            />
        </Grid>
    );
};

export default SampleDataPieChart;
