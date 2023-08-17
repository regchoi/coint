import React, {useEffect} from 'react';
import {BrowserRouter, Routes, Route, Navigate, Outlet} from 'react-router-dom';

import ProtectedRoute from "./components/common/ProtectedRoute";
import NotFoundPage from "./components/common/Error/NotFoundPage";
import Login from './components/Login';
import Layout from "./components/Layout";
// User
import UserTable from "./components/User/UserTable";
import UserGroupTable from "./components/User/UserGroupTable";
import DepartmentTable from "./components/User/DepartmentTable";
// Project
import ProjectPlan from "./components/Project/ProjectPlan";
import ProjectTaskTable from "./components/Project/ProjectTaskTable";


// Example
// import SampleTable from "./components/SampleTable";
// import StackedBarChart from "./components/SampleChart/StackedBarSample";
// import PieChart from "./components/SampleChart/PieSample";
// import ThreeDimScatter from "./components/SampleChart/ThreeDimScatterSample";
// import TreeMapChart from "./components/SampleChart/TreeMapSample";
// import Kanban from "./components/common/Kanban";
// import GanttChart from "./components/common/GanttChart";
// import DocumentEditor from "./components/common/DocumentEditor";
// import MyCalendar from "./components/common/Calendar";
// import TaskList from "./components/common/TaskList";

import "./assets/css/common/chart.css";

const ROUTES = {
    LOGIN: '/login',
    LAYOUT: '/layout',
    // User
    USERTABLE: '/system/user',
    USERGROUPTABLE: '/system/usergroup',
    DEPARTMENTTABLE: '/system/department',
    // Project
    PROJECTPLAN: '/project/plan',
    PROJECTTASKTABLE: '/project/task',

    // Example
    // SAMPLE_TABLE: '/sampletable',
    // STACKED_BAR_CHART: '/stackedbarchart',
    // PIE_CHART: '/piechart',
    // THREE_DIM_SCATTER_CHART: '/threedimscatterchart',
    // TREE_MAP_CHART: '/treemapchart',
    // KANBAN: '/kanban',
    // GANTTCHART: '/ganttchart',
    // DOCUMENTEDITOR: '/documenteditor',
    // CALENDAR: '/calendar',
    // TASKLIST: '/tasklist',
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
                        <Route path={ROUTES.USERTABLE} element={<UserTable/>}/>
                        <Route path={ROUTES.USERGROUPTABLE} element={<UserGroupTable/>}/>
                        <Route path={ROUTES.DEPARTMENTTABLE} element={<DepartmentTable/>}/>

                        <Route path={ROUTES.PROJECTPLAN} element={<ProjectPlan/>}/>
                        <Route path={ROUTES.PROJECTTASKTABLE} element={<ProjectTaskTable/>}/>

                        {/* Example*/}
                        {/*<Route path={ROUTES.SAMPLE_TABLE} element={<SampleTable/>}/>*/}
                        {/*<Route path={ROUTES.STACKED_BAR_CHART} element={<StackedBarChart/>}/>*/}
                        {/*<Route path={ROUTES.PIE_CHART} element={<PieChart/>}/>*/}
                        {/*<Route path={ROUTES.THREE_DIM_SCATTER_CHART} element={<ThreeDimScatter />}/>*/}
                        {/*<Route path={ROUTES.TREE_MAP_CHART} element={<TreeMapChart/>}/>*/}
                        {/*<Route path={ROUTES.KANBAN} element={<Kanban/>}/>*/}
                        {/*<Route path={ROUTES.GANTTCHART} element={<GanttChart/>}/>*/}
                        {/*<Route path={ROUTES.DOCUMENTEDITOR} element={<DocumentEditor/>}/>*/}
                        {/*<Route path={ROUTES.CALENDAR} element={<MyCalendar/>}/>*/}
                        {/*<Route path={ROUTES.TASKLIST} element={<TaskList/>}/>*/}
                    </Route>
                    {/* other protected routes go here */}
                </Route>

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
