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
import TaskGanttChart from "./components/Project/TaskGanttChart";
import KanBanBoard from "./components/Project/KanBanBoard";
import Calendar from "./components/Project/Calendar";
// Document
import FileDrive from "./components/Document/FileDrive";
// Template
import TemplateCopy from "./components/Template/TemplateCopy";
import TemplateList from "./components/Template/TemplateList";

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
import {getRole} from "./components/common/tokenUtils";

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
    TASKGANTTCHART: '/project/task/ganttchart',
    KANBANBOARD: '/project/task/kanbanboard',
    CALENDAR: '/project/task/calendar',
    // Document
    FILEDRIVE: '/document/drive',
    // Template
    TEMPLATECOPY: '/template/copy',
    TEMPLATELIST: '/template/list',

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
}

const App: React.FC = () => {

    const adminRoutes = getRole() === "ROLE_ADMIN" ? (
        <>
            <Route path={ROUTES.USERTABLE} element={<UserTable/>}/>
            <Route path={ROUTES.USERGROUPTABLE} element={<UserGroupTable/>}/>
            <Route path={ROUTES.DEPARTMENTTABLE} element={<DepartmentTable/>}/>
        </>
    ) : null;

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login/>}/>

                {/* Layout 수정용 */}
                <Route path={ROUTES.LAYOUT} element={<Layout/>}/>

                <Route path="/" element={<ProtectedRoute/>}>
                    <Route element={<Layout/>}>

                        <Route path="/" element={<div></div>}/>
                        {adminRoutes}
                        <Route path={ROUTES.PROJECTPLAN} element={<ProjectPlan/>}/>
                        <Route path={ROUTES.PROJECTTASKTABLE} element={<ProjectTaskTable/>}/>
                        <Route path={ROUTES.TASKGANTTCHART} element={<TaskGanttChart/>}/>
                        <Route path={ROUTES.KANBANBOARD} element={<KanBanBoard/>}/>
                        <Route path={ROUTES.CALENDAR} element={<Calendar />} />

                        <Route path={ROUTES.FILEDRIVE} element={<FileDrive/>}/>

                        <Route path={ROUTES.TEMPLATECOPY} element={<TemplateCopy/>}/>
                        <Route path={ROUTES.TEMPLATELIST} element={<TemplateList/>}/>

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
