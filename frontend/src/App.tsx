import React, {useEffect} from 'react';
import {BrowserRouter, Routes, Route, Navigate, Outlet} from 'react-router-dom';
import Login from './components/Login';
import ResponsiveDrawer from './components/ResponsiveDrawer';
import Dashboard from "./components/Dashboard";
import SampleTable from "./components/SampleTable";
import SampleChart from "./components/SampleChart";

const ProtectedRoute: React.FC = () => {

    const token = localStorage.getItem('token');

    if(token){
        const jwt = JSON.parse(atob(token.split('.')[1]));

        // 만료시간이 현재 시간보다 이전인 경우
        if (jwt.exp < Date.now() / 1000) {
            // 토큰 만료
            // TODO Alert를 띄우고 로그인 페이지로 이동
            return <Navigate to="/login" replace/>;
        }
    }
    return <Outlet/>;
};


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
                    </Route>
                    {/* other protected routes go here */}
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
