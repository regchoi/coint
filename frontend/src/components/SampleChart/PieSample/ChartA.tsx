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

const ChartA: React.FC<ChartAProps> = ({ data }) => {
    const [processedData, setProcessedData] = useState<any[]>([]);

    // 데이터 가공 로직을 별도의 함수로 분리
    const processFactoryData = (data: ChartData[], factoryNum: number) => {
        // cd_factory가 factoryNum인 데이터 중 inspectcodenameafter가 A로 시작하는 데이터만 추출
        const filteredData = data.filter(item => item.cd_factory === factoryNum && String(item.inspectcodenameafter).startsWith('A'));

        return filteredData.reduce((acc: any, cur: ChartData) => {
            if (!acc[cur.inspectcodenameafter]) {
                acc[cur.inspectcodenameafter] = 0;
            }

            acc[cur.inspectcodenameafter] += Number(cur.stockqty);

            return acc;
        }, {});
    }

    useEffect(() => {
        const groupedData1 = processFactoryData(data, 1);
        const groupedData2 = processFactoryData(data, 2);
        const groupedData3 = processFactoryData(data, 4);

        const processed = [groupedData1, groupedData2, groupedData3].flatMap((groupedData, idx) => {
            return Object.keys(groupedData).map(key => {
                // idx 가 3인 경우 기타로 처리
                const name = idx === 2 ? '기타' : `제 ${idx + 1}공장`;
                return {
                    name,
                    value: groupedData[key],
                }
            });
        });


        setProcessedData(processed);
    }, [data]);

    const customTooltipFormat = (value: number, name: string) => {
        return `${value}개`;
    };

    return (
        <Grid item xs={4} style={{ height: '300px', position: 'relative' }}>
            <h2>Custom Pie Chart Example</h2>
            <h5>공장별 정상 제품 생산량</h5>
            <PieChartWithCustomizedLabel
                data={processedData}
                colors={['#82ca9d', '#FFBB28', '#8884d8']}
                dataKey="value"
                outerRadius={100}
                label={true}
                tooltipFormat={customTooltipFormat}
            />
        </Grid>
    );
};

export default ChartA;
