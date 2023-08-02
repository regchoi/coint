import React, {useEffect} from 'react';
import {BrowserRouter, Routes, Route, Navigate, Outlet} from 'react-router-dom';

import ProtectedRoute from "./components/common/ProtectedRoute";
import NotFoundPage from "./components/common/Error/NotFoundPage";
import Login from './components/Login';
import Layout from "./components/Layout";
import SampleTable from "./components/SampleTable";
import StackedBarChart from "./components/SampleChart/StackedBarSample";
import PieChart from "./components/SampleChart/PieSample";
import ThreeDimScatter from "./components/SampleChart/ThreeDimScatterSample";
import TreeMapChart from "./components/SampleChart/TreeMapSample";

import "./assets/css/common/chart.css";

const ROUTES = {
    LOGIN: '/login',
    LAYOUT: '/layout',
    SAMPLE_TABLE: '/sampletable',
    STACKED_BAR_CHART: '/stackedbarchart',
    PIE_CHART: '/piechart',
    THREE_DIM_SCATTER_CHART: '/threedimscatterchart',
    TREE_MAP_CHART: '/treemapchart',
    NOT_FOUND: '*'
}

const App: React.FC = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login/>}/>

                {/* Layout 수정용 */}
                <Route path={ROUTES.LAYOUT} element={<Layout/>}/>

                <Route path="/" element={<ProtectedRoute/>}>
                    <Route element={<Layout/>}>

                        <Route path="/" element={<div></div>}/>
                        <Route path={ROUTES.SAMPLE_TABLE} element={<SampleTable/>}/>
                        <Route path={ROUTES.STACKED_BAR_CHART} element={<StackedBarChart/>}/>
                        <Route path={ROUTES.PIE_CHART} element={<PieChart/>}/>
                        <Route path={ROUTES.THREE_DIM_SCATTER_CHART} element={<ThreeDimScatter />}/>
                        <Route path={ROUTES.TREE_MAP_CHART} element={<TreeMapChart/>}/>
                    </Route>
                    {/* other protected routes go here */}
                </Route>

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
