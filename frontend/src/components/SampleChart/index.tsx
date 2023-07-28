import React from 'react';
import StackedBarChart from '../common/Charts/StackedBarChart';
import ChartA from "./ChartA";

const ParentComponent: React.FC = () => {
    return (
        <div>
            <ChartA/>
        </div>
    );
};

export default ParentComponent;
