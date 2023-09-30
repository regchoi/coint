import React, {SyntheticEvent, useEffect, useState} from 'react';
import { Event } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
    Autocomplete, AutocompleteInputChangeReason, Box,
    Card as MUICard,
    CardContent, Chip, Collapse, Divider,
    Grid,
    IconButton, TextareaAutosize,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {CSSTransition} from "react-transition-group";
import ErrorModal from "../../common/ErrorModal";
import axios from "../../../redux/axiosConfig";

interface MyEvent extends Event {
    title: string;
}

type ProjectUserNum = {
    projectIdNum: number;
    projectUserNum: number;
}

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

type TaskGroupResponse = {
    idNum: number;
    taskGroupName: string;
    projectsIdNum: number;
}

type TaskResponse = {
    idNum: number;
    taskName: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
    projectName: string;
    taskGroupIdNum: number;
}

const TemplateCopy: React.FC = () => {
    const [projectResponses, setProjectResponses] = useState<ProjectResponse[]>([]);
    const [taskGroupResponses, setTaskGroupResponses] = useState<TaskGroupResponse[]>([]);
    const [taskResponses, setTaskResponses] = useState<TaskResponse[]>([]);
    const [projectUserNum, setProjectUserNum] = useState<ProjectUserNum[]>([]);
    const [tasks, setTasks] = useState<TaskResponse[]>([]);
    const [options, setOptions] = useState<ProjectSelectResponse[]>([]);
    const [calendarEvents, setCalendarEvents] = useState<MyEvent[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProjectIdNum, setSelectedProjectIdNum] = useState<number>(0);
    const [isErrorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [projectListOpen, setProjectListOpen] = useState(true);
    const [expandedTasks, setExpandedTasks] = useState<number[]>([]);

    const autocompleteOptions = options.map(option => option.projectName);
    const filteredOptions = searchTerm === ""
        ? autocompleteOptions.filter(option =>
            option.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : autocompleteOptions;


    const handleInputChange = (
        event: SyntheticEvent<Element, Event>,
        newValue: string,
        reason: AutocompleteInputChangeReason
    ) => {
        setSearchTerm(newValue);
        setSelectedProjectIdNum(projectResponses.find(project => project.projectName === newValue)?.idNum || 0);
    };

    const handleTaskChange = (index, key, value) => {
        const updatedTasks = [...tasks];
        updatedTasks[index][key] = value;
        setTasks(updatedTasks);
    };

    const toggleTaskExpansion = (index: number) => {
        const newExpandedTasks = [...expandedTasks];
        if (newExpandedTasks.includes(index)) {
            const indexToRemove = newExpandedTasks.indexOf(index);
            newExpandedTasks.splice(indexToRemove, 1);
        } else {
            newExpandedTasks.push(index);
        }
        setExpandedTasks(newExpandedTasks);
    };


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

                // 조회된 project들의 idNum을 통해 taskGroup 조회
                // const taskGroupResponses = await Promise.all(projectResponse.data.map(async (project: ProjectResponse) => {
                //     const taskGroupResponse = await axios.get(`/api/task/group/${project.idNum}`);
                //     return taskGroupResponse.data;
                // }));
                // setTaskGroupResponses(taskGroupResponses);

                // TODO: projectIdNum 예외처리
                const projectUserNum: ProjectUserNum[] = await Promise.all(projectResponse.data.map(async (project: ProjectResponse) => {
                    const projectUserNum = await axios.get(`/api/project/user/${project.idNum}`);
                    return { projectIdNum: project.idNum, projectUserNum: projectUserNum.data.length };
                }));

                setProjectUserNum(projectUserNum);

                const taskResponse = await axios.get("/api/task");
                setTaskResponses(taskResponse.data);
            } catch (error) {
                setErrorModalOpen(true);
                setErrorMessage("프로젝트 목록을 불러오는데 실패했습니다.");
            }
        };

        fetchData();

    }, []);

    // useEffect로 selectedProjectIdNum이 변경될 때마다 실행
    useEffect(() => {
        setTasks(taskResponses.filter(task => task.projectName === selectedProject?.projectName));
    }, [selectedProjectIdNum]);

    // selectedProjectIdNum에 대응되는 selectProject
    const selectedProject = projectResponses.find(project => project.idNum === selectedProjectIdNum);

    return (
        <Grid container>
            <Grid item xs={12} md={12}>
                <Box
                    component="div"
                    sx={{
                        // 부모컴포넌트의 width를 넘지 않는 선에서 최대길이
                        maxWidth: "1450px",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "#fff",
                        p: 2,
                    }}
                >
                    <div className="SearchBox"
                         style={{display: 'flex', alignItems: 'center', width: '100%', marginBottom: '10px'}}>
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
                                        style: {fontSize: '14px', backgroundColor: '#fff'}
                                    }}
                                    InputLabelProps={{
                                        style: {fontSize: '14px'},
                                    }}
                                />
                            )}
                            style={{width: '15%'}}
                        />

                        <Tooltip title={projectListOpen ? "프로젝트 목록 접기" : "프로젝트 목록 보기"}>
                            <IconButton
                                onClick={() => setProjectListOpen(!projectListOpen)}
                                sx={{
                                    transform: projectListOpen ? "rotate(180deg)" : "rotate(0deg)",
                                    transition: "transform 0.5s",
                                }}
                            >
                                <ExpandMoreIcon/>
                            </IconButton>
                        </Tooltip>
                    </div>

                    <CSSTransition in={projectListOpen} timeout={500} classNames="project-list" unmountOnExit>
                        <div style={{marginTop: '10px'}}>
                            <Grid container spacing={2}>
                                {
                                    projectResponses.map((project) => {
                                        // TODO: 프로젝트별 업무, TODO, WORKING, WAITING, DONE 개수 조회
                                        // projectName과 동일한 task들을 추출
                                        const tasks = taskResponses.filter(task => task.projectName === project.projectName);
                                        const todoTasks = tasks.filter(task => task.status === "TODO" || null);
                                        const workingTasks = tasks.filter(task => task.status === "WORKING");
                                        const waitingTasks = tasks.filter(task => task.status === "WAITING");
                                        const doneTasks = tasks.filter(task => task.status === "DONE");

                                        return (
                                            <Grid item xs={12} sm={6} md={3} key={project.idNum}>
                                                <MUICard
                                                    style={{marginBottom: '10px', cursor: 'pointer'}}
                                                    onClick={() => {
                                                        setSearchTerm(project.projectName);
                                                        setSelectedProjectIdNum(project.idNum);
                                                        setProjectListOpen(false);
                                                    }}
                                                >
                                                    <CardContent>
                                                    {/*    <Typography variant="h6" gutterBottom*/}
                                                    {/*                component={"div"}*/}
                                                    {/*                sx={{*/}
                                                    {/*                    fontSize: '18px',*/}
                                                    {/*                    fontWeight: 'bold',*/}
                                                    {/*                    display: 'flex',*/}
                                                    {/*                    justifyContent: 'center',*/}
                                                    {/*                    alignItems: 'center'*/}
                                                    {/*                }}>*/}
                                                    {/*        <Chip*/}
                                                    {/*            label={project.status}*/}
                                                    {/*            sx={{*/}
                                                    {/*                backgroundColor: project.status === 'TODO' ? red[400] : project.status === 'WORKING' ? yellow[400] : project.status === 'WAITING' ? blue[400] : green[400],*/}
                                                    {/*                marginRight: 'auto',*/}
                                                    {/*                width: '40px',*/}
                                                    {/*                height: '10px',*/}
                                                    {/*                fontSize: '0.8rem',*/}
                                                    {/*                padding: '2px 12px'*/}
                                                    {/*            }}*/}
                                                    {/*        />*/}
                                                    {/*        <span>*/}
                                                    {/*    &nbsp;*/}
                                                    {/*</span>*/}
                                                    {/*    </Typography>*/}
                                                        <Typography variant="h6" gutterBottom>
                                                            {project.projectName}
                                                        </Typography>

                                                        <Typography variant="subtitle1">
                                                            {project.startDate} ~ {project.endDate}
                                                        </Typography>

                                                        <Typography variant="body2" mt={1}>
                                                            작업인원: {"몇"}명
                                                        </Typography>

                                                        <Divider style={{margin: '10px 0'}}/>
                                                        <Typography variant="body2">
                                                            업무: {tasks.length}개
                                                        </Typography>

                                                        <Box display="flex" alignItems="center" mt={1}>
                                                            <Chip
                                                                label="••"
                                                                color="default"
                                                                size="small"
                                                                style={{
                                                                    backgroundColor: "rgb(101, 173, 245, 0.5)",
                                                                    color: "transparent"
                                                                }}
                                                            />
                                                            <Typography variant="body2" style={{marginLeft: '8px'}}>
                                                                TODO: {todoTasks.length}개
                                                            </Typography>
                                                        </Box>

                                                        <Box display="flex" alignItems="center" mt={1}>
                                                            <Chip
                                                                label="••"
                                                                color="default"
                                                                size="small"
                                                                style={{
                                                                    backgroundColor: "rgb(108, 181, 111, 0.5)",
                                                                    color: "transparent"
                                                                }}
                                                            />
                                                            <Typography variant="body2" style={{marginLeft: '8px'}}>
                                                                WORKING: {workingTasks.length}개
                                                            </Typography>
                                                        </Box>

                                                        <Box display="flex" alignItems="center" mt={1}>
                                                            <Chip
                                                                label="••"
                                                                color="default"
                                                                size="small"
                                                                style={{
                                                                    backgroundColor: "rgb(234, 128, 56, 0.5)",
                                                                    color: "transparent"
                                                                }}
                                                            />
                                                            <Typography variant="body2" style={{marginLeft: '8px'}}>
                                                                WAITING: {waitingTasks.length}개
                                                            </Typography>
                                                        </Box>

                                                        <Box display="flex" alignItems="center" mt={1}>
                                                            <Chip
                                                                label="••"
                                                                color="default"
                                                                size="small"
                                                                style={{
                                                                    backgroundColor: "rgb(50, 65, 122, 0.5)",
                                                                    color: "transparent"
                                                                }}
                                                            />
                                                            <Typography variant="body2" style={{marginLeft: '8px'}}>
                                                                DONE: {doneTasks.length}개
                                                            </Typography>
                                                        </Box>

                                                    </CardContent>
                                                </MUICard>
                                            </Grid>
                                        );
                                    })
                                }
                            </Grid>
                        </div>
                    </CSSTransition>
                        {
                            selectedProjectIdNum !== 0 && selectedProject ? (
                                <Box sx={{mt: 3}}>
                                    <Typography variant="h6" gutterBottom>
                                        템플릿 상세정보
                                    </Typography>
                                    <Divider/>
                                    <Box sx={{mt: 2}}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} key={selectedProjectIdNum}>
                                                <TextField
                                                    label="템플릿명"
                                                    name="projectName"
                                                    variant="filled"
                                                    value={selectedProject.projectName}
                                                    onChange={handleInputChange}
                                                    sx={{mt: 1, width: '51%'}}
                                                    InputProps={{
                                                        style: {fontSize: '14px', backgroundColor: 'transparent'}
                                                    }}
                                                    InputLabelProps={{
                                                        style: {fontSize: '14px'},
                                                    }}
                                                />
                                                <TextareaAutosize
                                                    aria-label="프로젝트 상세설명"
                                                    minRows={4}
                                                    name="description"
                                                    placeholder="프로젝트 상세설명을 입력하세요"
                                                    value={selectedProject.description}
                                                    onChange={handleInputChange}
                                                    style={{
                                                        fontSize: '14px',
                                                        width: '100%',
                                                        padding: '10px',
                                                        marginTop: '10px',
                                                        border: '1px solid #e0e0e0',
                                                        borderRadius: '4px',
                                                        resize: 'vertical'
                                                    }}
                                                />

                                                <Grid container spacing={2} sx={{mt: 3}}>
                                                    <Grid item xs={6}>
                                                        <TextField
                                                            label="프로젝트 시작예정일"
                                                            variant="outlined"
                                                            type="date"
                                                            name="startDate"
                                                            value={selectedProject.startDate}
                                                            onChange={handleInputChange}
                                                            fullWidth
                                                            InputProps={{
                                                                style: {
                                                                    fontSize: '14px',
                                                                    backgroundColor: 'transparent'
                                                                }
                                                            }}
                                                            InputLabelProps={{
                                                                style: {fontSize: '14px'},
                                                                shrink: true,
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <TextField
                                                            label="프로젝트 종료예정일"
                                                            variant="outlined"
                                                            type="date"
                                                            name="endDate"
                                                            value={selectedProject.endDate}
                                                            onChange={handleInputChange}
                                                            fullWidth
                                                            InputProps={{
                                                                style: {
                                                                    fontSize: '14px',
                                                                    backgroundColor: 'transparent'
                                                                }
                                                            }}
                                                            InputLabelProps={{
                                                                style: {fontSize: '14px'},
                                                                shrink: true,
                                                            }}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Box>

                                    {
                                        tasks.length !== 0 ? (
                                            <Box sx={{ mt: 7 }}>
                                                <Typography variant="h6" gutterBottom>
                                                    템플릿 업무
                                                </Typography>
                                                <Divider />
                                                <Box sx={{ mt: 2 }}>
                                                    <Grid container spacing={2}>
                                                        {
                                                            tasks.map((task, index) => (
                                                                <Grid item xs={12} key={index}>
                                                                    <MUICard>
                                                                        <CardContent>
                                                                            <Box display="flex" justifyContent="space-between">
                                                                                <Box display="flex" alignItems="center">
                                                                                    <TextField
                                                                                        label="업무명"
                                                                                        value={task.taskName}
                                                                                        onChange={e => handleTaskChange(index, 'taskName', e.target.value)}
                                                                                        variant="filled"
                                                                                        InputProps={{
                                                                                            style: {fontSize: '14px', backgroundColor: 'transparent'}
                                                                                        }}
                                                                                        InputLabelProps={{
                                                                                            style: {fontSize: '14px'},
                                                                                        }}
                                                                                    />
                                                                                    <Typography variant="body2"
                                                                                                sx={{
                                                                                                    marginLeft: '10px',
                                                                                                    color: '#757575',
                                                                                                    fontSize: '12px',
                                                                                                    opacity: expandedTasks.includes(index) ? 0 : 1,
                                                                                                    transition: 'opacity 300ms ease-in-out'
                                                                                    }}>
                                                                                        {
                                                                                            // 시작일 ~ 종료일
                                                                                            task.startDate + ' ~ ' + task.endDate
                                                                                        }
                                                                                    </Typography>
                                                                                </Box>
                                                                                <IconButton
                                                                                    aria-label="expand"
                                                                                    onClick={() => toggleTaskExpansion(index)}
                                                                                    sx={{
                                                                                        transform: expandedTasks.includes(index) ? 'rotate(180deg)' : 'rotate(0deg)',
                                                                                        transition: '0.3s',
                                                                                        width: '40px',
                                                                                        height: '40px',
                                                                                }}
                                                                                >
                                                                                    <ExpandMoreIcon />
                                                                                </IconButton>
                                                                            </Box>
                                                                            <Collapse in={expandedTasks.includes(index)}>
                                                                                <Grid container spacing={2} sx={{mt: 3}}>
                                                                                    <Grid item xs={6}>
                                                                                        <TextField
                                                                                            label="시작일"
                                                                                            variant="outlined"
                                                                                            type="date"
                                                                                            name="startDate"
                                                                                            value={task.startDate}
                                                                                            onChange={e => handleTaskChange(index, 'startDate', e.target.value)}
                                                                                            fullWidth
                                                                                            InputProps={{
                                                                                                style: {
                                                                                                    fontSize: '14px',
                                                                                                    backgroundColor: 'transparent'
                                                                                                }
                                                                                            }}
                                                                                            InputLabelProps={{
                                                                                                style: {fontSize: '14px'},
                                                                                                shrink: true,
                                                                                            }}
                                                                                        />
                                                                                    </Grid>
                                                                                    <Grid item xs={6}>
                                                                                        <TextField
                                                                                            label="종료일"
                                                                                            variant="outlined"
                                                                                            type="date"
                                                                                            name="endDate"
                                                                                            value={task.endDate}
                                                                                            onChange={e => handleTaskChange(index, 'endDate', e.target.value)}
                                                                                            fullWidth
                                                                                            InputProps={{
                                                                                                style: {
                                                                                                    fontSize: '14px',
                                                                                                    backgroundColor: 'transparent'
                                                                                                }
                                                                                            }}
                                                                                            InputLabelProps={{
                                                                                                style: {fontSize: '14px'},
                                                                                                shrink: true,
                                                                                            }}
                                                                                        />
                                                                                    </Grid>
                                                                                </Grid>
                                                                                <TextareaAutosize
                                                                                    aria-label="업무 상세설명"
                                                                                    minRows={4}
                                                                                    name="description"
                                                                                    placeholder="업무 상세설명을 입력하세요"
                                                                                    value={task.description}
                                                                                    onChange={e => handleTaskChange(index, 'description', e.target.value)}
                                                                                    style={{
                                                                                        fontSize: '14px',
                                                                                        width: '100%',
                                                                                        padding: '10px',
                                                                                        marginTop: '10px',
                                                                                        border: '1px solid #e0e0e0',
                                                                                        borderRadius: '4px',
                                                                                        resize: 'vertical'
                                                                                    }}
                                                                                />
                                                                            </Collapse>
                                                                        </CardContent>
                                                                    </MUICard>
                                                                </Grid>
                                                            ))
                                                        }
                                                    </Grid>
                                                </Box>
                                            </Box>
                                        ) : (
                                            <Box sx={{ mt: 3 }}>
                                                <Typography variant="h6" gutterBottom>
                                                    프로젝트 업무가 없습니다
                                                </Typography>
                                            </Box>
                                        )
                                    }
                                </Box>
                            ) : (
                                <Box sx={{mt: 3}}>
                                    <Typography variant="h6" gutterBottom>
                                        프로젝트를 선택해주세요
                                    </Typography>
                                </Box>
                            )
                        }
                </Box>
            </Grid>


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

export default TemplateCopy;
