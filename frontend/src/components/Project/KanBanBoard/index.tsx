import React, {SyntheticEvent, useEffect, useRef, useState} from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { CSSTransition } from 'react-transition-group';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
    Autocomplete,
    AutocompleteInputChangeReason,
    Box,
    Paper,
    Typography,
    Card as MUICard,
    Grid,
    TextField,
    Divider, Chip, Button,
    Tooltip, IconButton, CardContent
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {green, yellow, red, blue} from '@mui/material/colors';
import axios from "../../../redux/axiosConfig";
import ErrorModal from "../../common/ErrorModal";
import "../../../assets/css/common/kanban-transition.css"
import CloseIcon from "@mui/icons-material/Close";

const ItemType = {
    CARD: 'card',
};

const COLUMN_STATUSES = ['TODO', 'WORKING', 'WAITING', 'DONE'];

interface CardProps {
    text: string;
    columnIndex: number;
    index: number;
    moveCard: (fromColumn: number, fromIndex: number, toColumn: number, toIndex: number) => void;
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

type ProjectUserNum = {
    projectIdNum: number;
    projectUserNum: number;
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

const Card: React.FC<TaskResponse & CardProps> = ({
                                                      taskName,
                                                      description,
                                                      startDate,
                                                      endDate,
                                                      status,
                                                      projectName,
                                                      taskGroupIdNum,
                                                      columnIndex,
                                                      index,
                                                      moveCard,
                                                  }) => {
    const ref = useRef<HTMLDivElement>(null);

    const [, drag] = useDrag({
        type: ItemType.CARD,
        item: { columnIndex, index },
    });

    const [, drop] = useDrop({
        accept: ItemType.CARD,
        hover: (draggedItem: { columnIndex: number; index: number }) => {
            if (draggedItem.columnIndex === columnIndex && draggedItem.index === index) return;

            moveCard(draggedItem.columnIndex, draggedItem.index, columnIndex, index);
            draggedItem.index = index;
            draggedItem.columnIndex = columnIndex;
        },
    });

    drag(drop(ref));

    return (
        <MUICard ref={ref}
                 sx={{
                     m: 1,
                     mb: 2,
                     p: 2,
                     border: 'none',
                     backgroundColor: 'rgb(255, 255, 255, 0.5)',
                     boxShadow: 3,
                     position: 'relative'
                 }}
        >
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
                    label={status}
                    sx={{
                        backgroundColor: status === 'TODO' ? red[400] : status === 'WORKING' ? yellow[400] : status === 'WAITING' ? blue[400] : green[400],
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
            <Typography variant="h6" gutterBottom
                        sx={{
                                fontSize: '18px',
                                fontWeight: 'bold'
                            }}>
                {taskName}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                {projectName}
            </Typography>
            <Typography variant="body2" gutterBottom sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '100%',
            }}>
                {description}
            </Typography>
            <Typography variant="body2">
                {startDate} ~ {endDate}
            </Typography>
        </MUICard>
    );
};

const Kanban: React.FC = () => {
    const [columns, setColumns] = React.useState<string[][]>([[]]);
    const [projectResponses, setProjectResponses] = useState<ProjectResponse[]>([]);
    const [taskGroupResponses, setTaskGroupResponses] = useState<TaskGroupResponse[]>([]);
    const [taskResponses, setTaskResponses] = useState<TaskResponse[]>([]);
    const [projectUserNum, setProjectUserNum] = useState<ProjectUserNum[]>([]);
    const [options, setOptions] = useState<ProjectSelectResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProjectIdNum, setSelectedProjectIdNum] = useState<number>(0);
    const [isErrorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [projectListOpen, setProjectListOpen] = useState(false);

    const autocompleteOptions = options.map(option => option.projectName);
    const filteredOptions = searchTerm === ""
        ? autocompleteOptions.filter(option =>
            option.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : autocompleteOptions;

    const moveCard = (
        fromColumn: number,
        fromIndex: number,
        toColumn: number,
        toIndex: number
    ) => {
        const updatedTasks = [...taskResponses];
        const movedTask = updatedTasks.find((task, index) =>
            task.status === COLUMN_STATUSES[fromColumn] && index === fromIndex
        );

        if (movedTask) {
            // 작업의 상태를 업데이트합니다.
            movedTask.status = COLUMN_STATUSES[toColumn];

            // 상태 업데이트 후 상태를 바탕으로 배열을 다시 정렬할 수 있습니다.
            // (선택사항) 예를 들어, 상태 업데이트 후 `setTaskResponses(updatedTasks.sort(...))`와 같이 수행할 수 있습니다.
            setTaskResponses(updatedTasks);
        }
    };

    const handleInputChange = (
        event: SyntheticEvent<Element, Event>,
        newValue: string,
        reason: AutocompleteInputChangeReason
    ) => {
        setSearchTerm(newValue);
        setSelectedProjectIdNum(projectResponses.find(project => project.projectName === newValue)?.idNum || 0);
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

                // 조회된 project들의 idNum을 통해 taskGroup과 projectUserNum을 조회
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

                // 단위 기능을 위한 임시코드
                const updatedColumns = [taskResponse.data.map(task => task.taskName)];
                setColumns(updatedColumns);
            } catch (error) {
                setErrorModalOpen(true)
                setErrorMessage("프로젝트 목록을 불러오는데 실패했습니다.")
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
                <div className="SearchBox" style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '10px'}}>
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
                        style={{width: '15%' }}
                    />

                    <Tooltip title={projectListOpen ? "프로젝트 목록 접기" : "프로젝트 목록 보기"}>
                        <IconButton onClick={() => setProjectListOpen(!projectListOpen)}>
                            {projectListOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                    </Tooltip>
                </div>

                <CSSTransition in={projectListOpen} timeout={500} classNames="project-list" unmountOnExit>
                    <div style={{ marginTop: '10px' }}>
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
                                                style={{ marginBottom: '10px', cursor: 'pointer' }}
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
                                                        작업인원: {projectNum}명
                                                    </Typography>

                                                    <Divider style={{ margin: '10px 0' }} />
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
                                                        <Typography variant="body2" style={{ marginLeft: '8px' }}>
                                                            TODO: {todoTasks.length}개
                                                        </Typography>
                                                    </Box>

                                                    <Box display="flex" alignItems="center" mt={1}>
                                                        <Chip
                                                            label="••"
                                                            color="default"
                                                            size="small"
                                                            style={{ backgroundColor: "rgb(108, 181, 111, 0.5)",
                                                                color: "transparent" }}
                                                        />
                                                        <Typography variant="body2" style={{ marginLeft: '8px' }}>
                                                            WORKING: {workingTasks.length}개
                                                        </Typography>
                                                    </Box>

                                                    <Box display="flex" alignItems="center" mt={1}>
                                                        <Chip
                                                            label="••"
                                                            color="default"
                                                            size="small"
                                                            style={{ backgroundColor: "rgb(234, 128, 56, 0.5)",
                                                                color: "transparent" }}
                                                        />
                                                        <Typography variant="body2" style={{ marginLeft: '8px' }}>
                                                            WAITING: {waitingTasks.length}개
                                                        </Typography>
                                                    </Box>

                                                    <Box display="flex" alignItems="center" mt={1}>
                                                        <Chip
                                                            label="••"
                                                            color="default"
                                                            size="small"
                                                            style={{ backgroundColor: "rgb(50, 65, 122, 0.5)",
                                                                color: "transparent" }}
                                                        />
                                                        <Typography variant="body2" style={{ marginLeft: '8px' }}>
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

                <DndProvider backend={HTML5Backend}>
                    <Box sx={{ display: 'flex', width: '100%', backgroundColor: '#fff' }}>
                        {COLUMN_STATUSES.map(status => {
                            let bgColor = 'transparent';

                            switch (status) {
                            case 'TODO':
                                bgColor = 'rgb(101, 173, 245, 0.1)';
                                break;
                            case 'WORKING':
                                bgColor = 'rgb(108, 181, 111, 0.1)';
                                break;
                            case 'WAITING':
                                // WAITING - FEEDBACK
                                bgColor = 'rgb(234, 128, 56, 0.1)';
                                break;
                            case 'DONE':
                                bgColor = 'rgb(50, 65, 122, 0.1)';
                                break;
                            // case 'WAITING':
                            //     // WAITING - 보류
                            //     bgColor = 'rgb(174, 174, 174, 0.1)';
                            //     break;
                            // 여기서 다른 상태에 따른 색상도 추가할 수 있습니다.
                        }
                            // 선택된 프로젝트에 속한 업무들을 조회
                            let tasksForStatus: typeof taskResponses = [];

                            if (searchTerm) {
                                const tasksForProject = taskResponses.filter(task => task.projectName === searchTerm);
                                tasksForStatus = tasksForProject.filter(task => task.status === status);
                                if (status === 'TODO') {
                                    tasksForStatus.push(...tasksForProject.filter(task => task.status === null));
                                }
                            } else {
                                tasksForStatus = taskResponses.filter(task => task.status === status);
                                if (status === 'TODO') {
                                    tasksForStatus.push(...taskResponses.filter(task => task.status === null));
                                }
                            }

                            return (
                            <Grid item xs={3} key={status}
                            sx={{
                                width: '100%',
                                height: '100%',
                            }}
                            >
                                <Box component={Paper} elevation={3}
                                     sx={{
                                         m: 1,
                                         p: 1,
                                         borderRadius: '6px',
                                         backgroundColor: bgColor,
                                         textAlign: 'center',
                                         minHeight: '200px'
                                     }}>
                                    <Typography variant="h6">{status}</Typography>
                                        <Divider sx={{ my: 1 }} />
                                        {
                                            // // 업무 그룹에 속한 업무들을 조회
                                            // const GroupedTasks = taskGroupResponses.filter(taskGroup => taskGroup.status === status);
                                            // GroupedTasks.map((taskGroup, index) => (
                                            //     <Card key={taskGroup.idNum} {...taskGroup} columnIndex={index} index={index} moveCard={moveCard} />
                                            // ))
                                            tasksForStatus.length === 0 ? (
                                                <Typography variant="body1">업무가 없습니다.</Typography>
                                            ) : (
                                                tasksForStatus.map((task, index) => (
                                                    <Card key={task.idNum} {...task}
                                                          columnIndex={COLUMN_STATUSES.indexOf(status)} index={index}
                                                          moveCard={moveCard}
                                                    />
                                                ))
                                            )
                                        }
                                </Box>
                            </Grid>
                            )})}
                    </Box>
                </DndProvider>
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

export default Kanban;
