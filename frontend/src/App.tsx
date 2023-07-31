import React, {useEffect} from 'react';
import {BrowserRouter, Routes, Route, Navigate, Outlet} from 'react-router-dom';
import Login from './components/Login';
import ResponsiveDrawer from './components/ResponsiveDrawer';
import Dashboard from "./components/Dashboard";
import SampleTable from "./components/SampleTable";
import SampleChart from "./components/SampleChart/StackedBarSample";
import ProtectedRoute from "./components/common/ProtectedRoute";
import PieChart from "./components/SampleChart/PieSample";

const App: React.FC = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/" element={<ProtectedRoute/>}>
                    <Route element={<ResponsiveDrawer/>}>
                        <Route path="/" element={<div></div>}/>
                        <Route path="/dashboard" element={<Dashboard/>}/>
                        <Route path="/sampletable" element={<SampleTable/>}/>
                        <Route path="/stackedbarchart" element={<SampleChart/>}/>
                        <Route path="/piechart" element={<PieChart/>}/>
                    </Route>
                    {/* other protected routes go here */}
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
