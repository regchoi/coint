import React, {useEffect, useState} from 'react';
import StackedBarChart from '../../common/Charts/StackedBarChart';
import {Grid} from "@mui/material";

// 전체 data에서 필요한 data만 추출
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
        // 데이터의 가공 Example
        const processData = (data: ChartData[]) => {
            // cd_factory가 1인 데이터만 필터링
            const filteredData = data.filter(item => item.cd_factory === 1 && item.gitemno_name);

            // gitemno_name 별로 정렬
            const sortedData = filteredData.sort((a, b) => String(a.gitemno_name).localeCompare(String(b.gitemno_name)));

            // gitemno_name 별로 데이터를 그룹화하고, 각 그룹 내에서 GroupSetion에 따라 재고를 더함
            const groupedData = sortedData.reduce((acc: any, cur: ChartData) => {
                if (!acc[cur.gitemno_name]) {
                    acc[cur.gitemno_name] = { '365일 이하': "0%", '365일 초과': "0%" };
                }

                // 365일 초과인 것과 이하인 것을 비율로 계산
                if(String(cur.groupsetion) === '365일초과') {
                    acc[cur.gitemno_name]['365일 초과'] += Number(cur.stockqty);
                } else {
                    acc[cur.gitemno_name]['365일 이하'] += Number(cur.stockqty);
                }

                // 비율로 변환
                acc[cur.gitemno_name]['365일 초과'] = Math.round(acc[cur.gitemno_name]['365일 초과'] * 100 / (acc[cur.gitemno_name]['365일 초과'] + acc[cur.gitemno_name]['365일 이하']));
                acc[cur.gitemno_name]['365일 이하'] = Math.round(acc[cur.gitemno_name]['365일 이하'] * 100 / (acc[cur.gitemno_name]['365일 초과'] + acc[cur.gitemno_name]['365일 이하']));
                return acc;
            }, {});

            // 필요한 형태로 데이터 변환
            const result = Object.keys(groupedData).map(key => ({
                name: key,
                ...groupedData[key]
            }));

            return result;
        };

        const newData = processData(data);
        setProcessedData(newData);
    }, [data]);

    return (
        <Grid item xs={5} style={{ height: '300px', position: 'relative' }}>
            <h2>Custom Stacked Bar Chart Example</h2>
            <StackedBarChart
                data={processedData}
                colors={['#8884d8', '#82ca9d']}
                dataKey='name'
                dataKeys={['365일 초과', '365일 이하']}
                height={300}
                width='100%'
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            />
        </Grid>
    );
};

export default ChartA;
