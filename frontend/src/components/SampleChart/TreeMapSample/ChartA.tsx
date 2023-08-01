import React, {useEffect, useState} from 'react';
import TreeMapChart from '../../common/Charts/ThreeMapChart';
import {Grid, Typography} from "@mui/material";
import {TooltipProps} from "recharts";

interface ChartData {
    cd_factory: number;
    GitemNo_Name: string;
    GroupSetion: string;
    StockQty: string;
    [key: string]: string | number;
}

interface ChartAProps {
    data: ChartData[];
}

const ChartA: React.FC<ChartAProps> = ({ data }) => {
    const [processedData, setProcessedData] = useState<any[]>([]);

    useEffect(() => {
        const processData = (data: ChartData[]) => {
            // cd_factory가 1인 데이터만 필터링
            const filteredData = data.filter(item => item.cd_factory === 1 && item.gitemno_name);

            const groupedData = filteredData.reduce((acc: any, cur: ChartData) => {
                if (!acc[cur.gitemno_name]) {
                    acc[cur.gitemno_name] = {
                        name: cur.gitemno_name,
                        size: 0
                    };
                }

                // size는 StockQty의 합
                acc[cur.gitemno_name].size += Number(cur.stockqty);

                return acc;
            }, {});

            // result를 상위 20개만 보여주기 위해 정렬
            const result = Object.values(groupedData).sort((a: any, b: any) => b.size - a.size).slice(0, 20);


            return result;
        };

        const newData = processData(data);
        setProcessedData(newData);
    }, [data]);

    const CustomTooltip: React.FC<TooltipProps<any, any>> = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="label">{`Name : ${payload[0].payload.name}`}</p>
                    <p className="intro">{`Size : ${payload[0].value} 개`}</p>
                </div>
            );
        }

        return null;
    };

    return (
        <Grid item xs={7} style={{ height: '500px', position: 'relative' }}>
            <h2>Custom Tree Map Chart Processed Data Example</h2>
            <TreeMapChart
                data={processedData}
                dataKey='size'
                showTooltip={true}
                customTooltip={CustomTooltip}
            />
        </Grid>
    );
};

export default ChartA;
