import React, {SyntheticEvent, useEffect, useState} from 'react';
import { Calendar, momentLocalizer, Event } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
    Autocomplete, AutocompleteInputChangeReason, Box,
    Card as MUICard,
    CardContent, Chip, Divider,
    Grid,
    IconButton,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {CSSTransition} from "react-transition-group";
import {blue, green, red, yellow} from "@mui/material/colors";
import ErrorModal from "../../common/ErrorModal";
import axios from "../../../redux/axiosConfig";

const localizer = momentLocalizer(moment);

interface MyEvent extends Event {
    title: string;
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

const MyCalendar: React.FC = () => {
    const [projectResponses, setProjectResponses] = useState<ProjectResponse[]>([]);
    const [taskGroupResponses, setTaskGroupResponses] = useState<TaskGroupResponse[]>([]);
    const [taskResponses, setTaskResponses] = useState<TaskResponse[]>([]);
    const [projectUserNum, setProjectUserNum] = useState<ProjectUserNum[]>([]);
    const [options, setOptions] = useState<ProjectSelectResponse[]>([]);
    const [calendarEvents, setCalendarEvents] = useState<MyEvent[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProjectIdNum, setSelectedProjectIdNum] = useState<number>(0);
    const [isErrorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [projectListOpen, setProjectListOpen] = useState(false);

    const eventStyleGetter = (event: MyEvent, start: Date, end: Date, isSelected: boolean) => {
        let backgroundColor = "rgb(174, 174, 174, 0.3)";
        let color = "rgb(174, 174, 174)";
        let fontSize = "12px";
        let fontWeight = "bold";
        switch(event.resource.status) {
            case null:
                backgroundColor = "rgb(101, 173, 245, 0.2)";
                color = "rgb(5, 77, 149)";
                break;
            case "TODO":
                backgroundColor = "rgb(101, 173, 245, 0.2)";
                color = "rgb(5, 77, 149)";
                break;
            case "WORKING":
                backgroundColor = "rgb(108, 181, 111, 0.2)";
                color = "rgb(108, 181, 111)";
                break;
            case "WAITING":
                // WAITING - FEEDBACK
                backgroundColor = "rgb(234, 128, 56, 0.2)";
                color = "rgb(234, 128, 56)";
                break;
            case 'DONE':
                backgroundColor = 'rgb(50, 65, 122, 0.2)';
                color = "rgb(10, 25, 82)";
                fontWeight = "normal";
                break;
            // case 'WAITING':
            //     // WAITING - 보류
            //     backgroundColor = 'rgb(174, 174, 174, 0.1)';
            //     break;
        }
        return {
            style: {
                backgroundColor,
                color,
                fontSize,
                fontWeight
            }
        };
    };

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

    // TODO: 라이브러리 코드 확인해보고, 타입 정의하기
    const mapTaskToEvent = (task: TaskResponse): MyEvent => ({
        start: new Date(task.startDate),
        end: new Date(task.endDate),
        title: task.taskName,
        resource: {
            status: task.status
        }
    });

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
                // 반복문으로 조회하는 것보다 한번에 조회하는 것이 더 효율적이지만, 현재는 반복문으로 조회
                const taskGroupResponses = await Promise.all(projectResponse.data.map(async (project: ProjectResponse) => {
                    const taskGroupResponse = await axios.get(`/api/task/group/${project.idNum}`);
                    return taskGroupResponse.data;
                }));
                setTaskGroupResponses(taskGroupResponses);

                // TODO: projectIdNum 예외처리
                const projectUserNum: ProjectUserNum[] = await Promise.all(projectResponse.data.map(async (project: ProjectResponse) => {
                    const projectUserNum = await axios.get(`/api/project/user/${project.idNum}`);
                    return { projectIdNum: project.idNum, projectUserNum: projectUserNum.data.length };
                }));

                setProjectUserNum(projectUserNum);

                const taskResponse = await axios.get("/api/task");
                setTaskResponses(taskResponse.data);
                setCalendarEvents(taskResponse.data.map(task => mapTaskToEvent(task)));
            } catch (error) {
                setErrorModalOpen(true);
                setErrorMessage("프로젝트 목록을 불러오는데 실패했습니다.");
            }
        };

        fetchData();

    }, []);


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
                                    transition: "transform 0.5s",
                                }}
                            >
                                <ExpandMoreIcon />
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
                                        const projectNum = projectUserNum.find(projectUserNum => projectUserNum.projectIdNum === project.idNum)?.projectUserNum || 0;
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
                                                        <Typography variant="h6" gutterBottom
                                                                    component={"div"}
                                                                    sx={{
                                                                        fontSize: '18px',
                                                                        fontWeight: 'bold',
                                                                        display: 'flex',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center'
                                                                    }}>
                                                            <Chip
                                                                label={project.status}
                                                                sx={{
                                                                    backgroundColor: project.status === 'TODO' ? red[400] : project.status === 'WORKING' ? yellow[400] : project.status === 'WAITING' ? blue[400] : green[400],
                                                                    marginRight: 'auto',
                                                                    width: '40px',
                                                                    height: '10px',
                                                                    fontSize: '0.8rem',
                                                                    padding: '2px 12px'
                                                                }}
                                                            />
                                                            <span>
                                                        &nbsp;
                                                    </span>
                                                        </Typography>
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
                    <div style={{height: '500px'}}>
                        <Calendar
                            localizer={localizer}
                            defaultDate={new Date()}
                            defaultView="month"
                            events={calendarEvents}
                            eventPropGetter={eventStyleGetter}
                            style={{height: "100%"}}
                        />
                    </div>
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

export default MyCalendar;
