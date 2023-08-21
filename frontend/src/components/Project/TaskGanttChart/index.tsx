import React, {SyntheticEvent, useEffect, useState} from "react";
import { Task, ViewMode, Gantt } from "gantt-task-react";
import { ViewSwitcher } from "./viewSwitcher";
import {convertToGanttTasks, getStartEndDateForProject, initTasks} from "./helper";
import "gantt-task-react/dist/index.css";
import axios from "../../../redux/axiosConfig";
import { saveAs } from 'file-saver';
import {
    Autocomplete,
    AutocompleteChangeDetails,
    AutocompleteChangeReason, AutocompleteInputChangeReason, Box, Grid,
    TextField
} from "@mui/material";
import ExcelModal from "./UploadExcelModal";
import ErrorModal from "../../common/ErrorModal";
import {FileDownload} from "@mui/icons-material";

type ProjectSelectResponse = {
    idNum: number;
    projectName: string;
}

type ProjectResponse = {
    idNum: number;
    projectName: string;
    startDate: string;
    endDate: string;
    status: string;
}

type TaskResponse = {
    idNum: number;
    taskName: string;
    startDate: string;
    endDate: string;
    status: string;
    projectName: string;
}

const TaskGanttChart = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [options, setOptions] = useState<ProjectSelectResponse[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
    const [view, setView] = useState<ViewMode>(ViewMode.Day);
    const [tasks, setTasks] = useState<Task[]>(initTasks());
    const [isChecked, setIsChecked] = useState(true);
    const [isErrorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [projectResponses, setProjectResponses] = useState<ProjectResponse[]>([]);
    const [taskResponses, setTaskResponses] = useState<TaskResponse[]>([]);
    const [isExcelModalOpen, setExcelModalOpen] = useState(false);

    useEffect(() => {
        // 프로목록 불러오기
        axios.get('/api/project')
            .then((response) => {
                setOptions(response.data);
            })
            .catch((error) => {
                setErrorModalOpen(true)
                setErrorMessage("프로젝트 목록을 불러오는데 실패했습니다.")
            });

        const fetchData = async () => {
            try {
                const projectResponse = await axios.get("/api/project");
                setProjectResponses(projectResponse.data);

                const taskResponse = await axios.get("/api/task");
                setTaskResponses(taskResponse.data);

                const ganttTasks = convertToGanttTasks(projectResponse.data, taskResponse.data);
                setTasks(ganttTasks);
            } catch (error) {
                setErrorModalOpen(true)
                setErrorMessage("프로젝트 목록을 불러오는데 실패했습니다.")
            }
        };

        fetchData();
    }, []);


    // 프로젝트 엑셀 다운로드

    const downloadProjectExcel = async (projectId: number) => {
        try {
            const response = await axios.get(`/download/excel/${projectId}`, {
                responseType: 'blob',
            });

            if (response.status === 200) {
                const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                saveAs(blob, `Project_${projectId}.xlsx`);
            } else {
                throw new Error(`Server responded with status: ${response.status}`);
            }
        } catch (error) {
            console.error('Failed to download project excel:', error);
            setErrorModalOpen(true)
            setErrorMessage("프로젝트 엑셀 다운로드에 실패했습니다.")
        }
    };

    const handleDownload = () => {
        if (selectedProjectId) {
            downloadProjectExcel(selectedProjectId);
        } else {
            setErrorModalOpen(true)
            setErrorMessage("프로젝트를 선택해주세요.")
        }
    };

    const handleFileUpload = async (files: File[]) => {
        if (files.length === 0) {
            return;
        }
        const file = files[0];

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("/upload/excel", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (response.status === 200) {
                console.log("File uploaded successfully.");
            } else {
                setErrorModalOpen(true)
                setErrorMessage("엑셀파일 저장에 실패했습니다.")
            }
        } catch (error) {
            type ErrorResponse = {
                message: string;
            }
            const errorResponse = error as ErrorResponse;
            console.error("Error occurred while uploading a file:", error);

            setErrorModalOpen(true)

            setErrorMessage(errorResponse.message)
        }
    };


    const openExcelModal = () => {
        setExcelModalOpen(true);
    }

    let columnWidth = 65;
    if (view === ViewMode.Year) {
        columnWidth = 350;
    } else if (view === ViewMode.Month) {
        columnWidth = 300;
    } else if (view === ViewMode.Week) {
        columnWidth = 250;
    }

    const handleInputChange = (
        event: SyntheticEvent<Element, Event>,
        newValue: string,
        reason: AutocompleteInputChangeReason
    ) => {
        setSearchTerm(newValue);

        // 검색어가 비어 있으면 전체 데이터를 다시 조회
        if (newValue === "") {
            const ganttTasks = convertToGanttTasks(projectResponses, taskResponses);
            setTasks(ganttTasks);
            return;
        }

        const selectedProject = options.find(option => option.projectName === newValue);
        if (selectedProject) {
            setSelectedProjectId(selectedProject.idNum);
            const projectId = selectedProject.idNum;
            const filteredProjects = projectResponses.filter(pr => pr.idNum === projectId);
            const filteredTasks = taskResponses.filter(tr => tr.projectName === newValue);
            const ganttTasks = convertToGanttTasks(filteredProjects, filteredTasks);
            setTasks(ganttTasks);
        }
    };

    const autocompleteOptions = options.map(option => option.projectName);
    const filteredOptions = searchTerm === ""
        ? autocompleteOptions.filter(option =>
            option.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : autocompleteOptions;

    const handleSearchSubmit = async () => {
        const selectedProject = options.find(option => option.projectName === searchTerm);
        if (selectedProject) {
            const projectId = selectedProject.idNum;
            try {
                const response = await fetch(`/api/tasks?projectId=${projectId}`);
                const result = await response.json();
                setTasks(result);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        }
    };

    const handleTaskChange = (task: Task) => {
        console.log("On date change Id:" + task.id);
        let newTasks = tasks.map(t => (t.id === task.id ? task : t));
        if (task.project) {
            const [start, end] = getStartEndDateForProject(newTasks, task.project);
            const project = newTasks[newTasks.findIndex(t => t.id === task.project)];
            if (
                project.start.getTime() !== start.getTime() ||
                project.end.getTime() !== end.getTime()
            ) {
                const changedProject = { ...project, start, end };
                newTasks = newTasks.map(t =>
                    t.id === task.project ? changedProject : t
                );
            }
        }
        setTasks(newTasks);
    };

    const handleTaskDelete = (task: Task) => {
        const conf = window.confirm("Are you sure about " + task.name + " ?");
        if (conf) {
            setTasks(tasks.filter(t => t.id !== task.id));
        }
        return conf;
    };

    const handleProgressChange = async (task: Task) => {
        setTasks(tasks.map(t => (t.id === task.id ? task : t)));
        console.log("On progress change Id:" + task.id);
    };

    const handleDblClick = (task: Task) => {
        alert("On Double Click event Id:" + task.id);
    };

    const handleClick = (task: Task) => {
        console.log("On Click event Id:" + task.id);
    };

    const handleSelect = (task: Task, isSelected: boolean) => {
        console.log(task.name + " has " + (isSelected ? "selected" : "unselected"));
    };

    const handleExpanderClick = (task: Task) => {
        setTasks(tasks.map(t => (t.id === task.id ? task : t)));
        console.log("On expander click Id:" + task.id);
    };

    return (
        <Grid container>
            <Grid item xs={12} md={12}>
                <Box
                    component="div"
                    sx={{
                        overflowX: "auto",
                        maxWidth: "1600px",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "#fff",
                        p: 2,
                    }}
                >
                    <div className="SearchBox" style={{ width: '15%', marginBottom: '10px'}}>
                        <Autocomplete
                            options={filteredOptions}
                            value={searchTerm}
                            onInputChange={handleInputChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    variant="outlined"
                                    label="프로젝트검색"
                                    placeholder="프로젝트명을 입력해주세요"
                                    InputProps={{
                                        ...params.InputProps,
                                        style: { fontSize: '14px', backgroundColor: '#fff' }
                                    }}
                                    InputLabelProps={{
                                        style: { fontSize: '14px' },
                                    }}
                                />
                            )}
                        />
                    </div>

                    <ViewSwitcher
                        onViewModeChange={viewMode => setView(viewMode)}
                        onViewListChange={setIsChecked}
                        isChecked={isChecked}
                        downloadExcel={handleDownload}
                        uploadExcel={openExcelModal}
                    />
                    <Gantt
                        tasks={tasks}
                        viewMode={view}
                        onDateChange={handleTaskChange}
                        onDelete={handleTaskDelete}
                        onProgressChange={handleProgressChange}
                        onDoubleClick={handleDblClick}
                        onClick={handleClick}
                        onSelect={handleSelect}
                        onExpanderClick={handleExpanderClick}
                        listCellWidth={isChecked ? "155px" : ""}
                        columnWidth={columnWidth}
                    />
                </Box>
            </Grid>

            {/*엑셀 업로드 Modal*/}
            <ExcelModal
                open={isExcelModalOpen}
                onClose={() => setExcelModalOpen(false)}
                onUpload={handleFileUpload}
            />

            {/*에러 발생 Modal*/}
            <ErrorModal
                open={isErrorModalOpen}
                onClose={() => setErrorModalOpen(false)}
                title="요청 실패"
                description={errorMessage || ""}
            />
        </Grid>
    );
};

export default TaskGanttChart;
