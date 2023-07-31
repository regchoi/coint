import React from 'react';
import StackedBarChart from '../../common/Charts/StackedBarChart';
import {Grid} from "@mui/material";

const SampleDataBarChart: React.FC = () => {

    // Data Example - 아래와 같은 형식으로
    // name이 dataKey
    // '365일 초과'와 '365일 이하'가 dataKeys
    const data = [
        {
            name: '3M PEN',
            '365일 초과': 40,
            '365일 이하': 60,
        },
        {
            name: 'CP-1000T',
            '365일 초과': 30,
            '365일 이하': 70,
        },
        {
            name: 'XZ31C',
            '365일 초과': 20,
            '365일 이하': 80,
        },
        {
            name: 'SBK-E5',
            '365일 초과': 35,
            '365일 이하': 65,
        },
        {
            name: 'SBK-A5',
            '365일 초과': 25,
            '365일 이하': 75,
        },
        {
            name: 'UHF-E',
            '365일 초과': 45,
            '365일 이하': 55,
        },
    ];

    // 툴팁 포매터 함수 Example
    const customTooltipFormat = (value: number, name: string) => {
        if (name === '365일 초과') {
            return `${value}개`;
        }
        if (name === '365일 이하') {
            return `${value}수량`;
        }
        // return `${value}%`;
        return value;
    };

    return (
        <Grid item xs={5} style={{ height: '300px', position: 'relative' }}>
            <h2>Custom Stacked Bar Chart Sample Data Example</h2>
            <StackedBarChart
                data={data}
                colors={['#8884d8', '#82ca9d']}
                dataKey='name'
                dataKeys={['365일 초과', '365일 이하']}
                height={300}
                width='75%'
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                tooltipFormat={customTooltipFormat}
            />
        </Grid>
    );
};

export default SampleDataBarChart;
