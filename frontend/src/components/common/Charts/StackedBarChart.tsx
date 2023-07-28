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
    margin: { top: number; right: number; left: number; bottom: number };
}

const StackedBarChart = <T,>({ data, colors, dataKey, dataKeys, height, width, margin }: StackedBarChartProps<T>) => {
    console.log(data);
    return (
        <ResponsiveContainer width={width} height={height}>
            <BarChart
                data={data}
                margin={margin}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={dataKey} />
                <YAxis />
                <Tooltip />
                <Legend />
                {dataKeys.map((key, index) => (
                    <Bar key={index} dataKey={key} stackId="a" fill={colors[index % colors.length]} />
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
};

export default StackedBarChart;
