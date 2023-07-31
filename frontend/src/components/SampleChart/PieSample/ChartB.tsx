import React, {useEffect, useState} from 'react';
import PieChartWithCustomizedLabel from "../../common/Charts/PieChartWithCustomizedLabel";
import {Grid} from "@mui/material";

// 전체 data에서 필요한 데이터만 추출
interface ChartData {
    cd_factory: number;
    inspectcodenameafter: string;
    stockqty: string;
    [key: string]: string | number;
}

interface ChartAProps {
    data: ChartData[];
}

const ChartB: React.FC<ChartAProps> = ({ data }) => {
    const [processedData, setProcessedData] = useState<any[]>([]);

    const processFactoryData = (data: ChartData[], factoryNum: number) => {
        const filteredData = data.filter(item => item.cd_factory === factoryNum);

        const initialAccumulator = {
            '정상제품': 0,
            '불량제품': 0
        }

        return filteredData.reduce((acc: any, cur: ChartData) => {
            const key = String(cur.inspectcodenameafter).startsWith('A') ? '정상제품' : '불량제품';
            acc[key] += Number(cur.stockqty);
            return acc;
        }, initialAccumulator);
    };

    useEffect(() => {
        const groupedData1 = processFactoryData(data, 1);
        const groupedData2 = processFactoryData(data, 2);
        const groupedData3 = processFactoryData(data, 4);

        const processed = [groupedData1, groupedData2, groupedData3].map((groupedData, idx) => {
            const name = idx === 2 ? '기타' : `제 ${idx + 1}공장`;

            return {
                factoryName: name,
                data: Object.keys(groupedData).map(key => {
                    return {
                        name: key,
                        value: groupedData[key],
                    }
                })
            }
        });

        setProcessedData(processed);
    }, [data]);

    const customTooltipFormat = (value: number, name: string) => {
        return `${value}개`;
    };

    return (
        <Grid container spacing={3}>
            {processedData.map((factoryData, idx) => (
                <Grid item xs={4} style={{ height: '300px', position: 'relative' }} key={idx}>
                    <h2>{factoryData.factoryName}</h2>
                    <h5>정상 제품 생산비율</h5>
                    <PieChartWithCustomizedLabel
                        data={factoryData.data}
                        colors={['#82ca9d', '#FFBB28']}
                        dataKey="value"
                        outerRadius={100}
                        label={true}
                        tooltipFormat={customTooltipFormat}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default ChartB;