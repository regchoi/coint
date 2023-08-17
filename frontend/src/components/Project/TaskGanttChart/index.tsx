import React, {SyntheticEvent, useEffect, useState} from "react";
import { Task, ViewMode, Gantt } from "gantt-task-react";
import { ViewSwitcher } from "./viewSwitcher";
import {convertToGanttTasks, getStartEndDateForProject, initTasks} from "./helper";
import "gantt-task-react/dist/index.css";
import axios from "../../../redux/axiosConfig";
import {
    Autocomplete,
    AutocompleteChangeDetails,
    AutocompleteChangeReason, Box, Grid,
    TextField
} from "@mui/material";
import ExcelModal from "./ExcelModal";
import ErrorModal from "../../common/ErrorModal";

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
    const [view, setView] = useState<ViewMode>(ViewMode.Day);
    const [tasks, setTasks] = useState<Task[]>(initTasks());
    const [isChecked, setIsChecked] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const projectResponse = await axios.get("/api/project");
                const projectResponses: ProjectResponse[] = projectResponse.data;

                const taskResponse = await axios.get("/api/task");
                const taskResponses: TaskResponse[] = taskResponse.data;

                const ganttTasks = convertToGanttTasks(projectResponses, taskResponses);
                setTasks(ganttTasks);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    let columnWidth = 65;
    if (view === ViewMode.Year) {
        columnWidth = 350;
    } else if (view === ViewMode.Month) {
        columnWidth = 300;
    } else if (view === ViewMode.Week) {
        columnWidth = 250;
    }

    const handleSearchChange = (
        event: SyntheticEvent<Element, Event>,
        value: string | null,
        reason: AutocompleteChangeReason,
        details?: AutocompleteChangeDetails<string> | undefined
    ) => {
            setSearchTerm(value || "");
    };

    const autocompleteOptions = options.map(option => option.projectName);
    const filteredOptions = autocompleteOptions.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        pt: 2,
                    }}
                >
                    <div className="SearchBox" style={{ width: '100%', marginBottom: '10px'}}>
                        <Autocomplete
                            options={filteredOptions}
                            value={searchTerm}
                            onChange={handleSearchChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    variant="outlined"
                                    label="프로젝트검색"
                                    placeholder="프로젝트명을 입력해주세요"
                                    InputProps={{
                                        ...params.InputProps,
                                        style: { fontSize: '14px', backgroundColor: 'transparent' }
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
        </Grid>
    );
};

export default TaskGanttChart;
