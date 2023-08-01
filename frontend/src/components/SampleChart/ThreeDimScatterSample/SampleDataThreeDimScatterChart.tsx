import React from 'react';
import ThreeDimScatterChart from "../../common/Charts/ThreeDimScatterChart";
import {Grid} from "@mui/material";

const SampleDataThreeDimScatterChart: React.FC = () => {
    const sampleData01 = [
        { x: 100, y: 200, z: 200 },
        { x: 120, y: 100, z: 260 },
        { x: 170, y: 300, z: 400 },
        { x: 140, y: 250, z: 280 },
        { x: 150, y: 400, z: 600 },
        { x: 110, y: 280, z: 200 },
    ];
    const sampleData02 = [
        { x: 200, y: 260, z: 240 },
        { x: 240, y: 290, z: 220 },
        { x: 190, y: 290, z: 250 },
        { x: 198, y: 250, z: 210 },
        { x: 180, y: 280, z: 260 },
        { x: 210, y: 220, z: 230 },
    ];

    const scatterSeries = [
        { name: "A school", data: sampleData01, fill: "#8884d8" },
        { name: "B school", data: sampleData02, fill: "#82ca9d" },
    ];

    return (
        <Grid item xs={5} style={{ height: '300px', position: 'relative' }}>
            <h2>Custom ThreeDim Scatter Chart Sample Data Example</h2>
            <ThreeDimScatterChart
                height={400}
                scatterSeries={scatterSeries}
                xAxisName="Height"
                xAxisUnit="cm"
                yAxisName="Weight"
                yAxisUnit="kg"
                zAxisName="Score"
                zAxisUnit="points"
            />
            </Grid>
    );
};

export default SampleDataThreeDimScatterChart;
