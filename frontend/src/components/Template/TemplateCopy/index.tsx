import React, {SyntheticEvent, useEffect, useState} from 'react';
import { Event } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
    Autocomplete, AutocompleteInputChangeReason, Box, Button,
    Card as MUICard,
    CardContent, Chip, Collapse, Divider,
    Grid,
    IconButton, TextareaAutosize,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AddIcon from '@mui/icons-material/Add';
import GroupsIcon from '@mui/icons-material/Groups';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {CSSTransition} from "react-transition-group";
import ErrorModal from "../../common/ErrorModal";
import axios from "../../../redux/axiosConfig";
import RoleModal from "./RoleModal";
import UserModal from "./UserModal";
import SuccessModal from "../../common/SuccessModal";
import TaskUserModal from "./TaskUserModal";

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
    description: string;
    startDate: string;
    endDate: string;
    status: string;
}

type TemplateRequest = {
    templateName: string;
    description: string;
    period: number;
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

type TemplateTaskRequest = {
    idNum: number;
    taskName: string;
    description: string;
    period: number;
    offsetDay: number;
}

type Role = {
    roleName: string;
    roleLevel: number;
    description: string;
}

type User = {
    userId: number;
    templateRoleId: number;
}

type TemplateTaskUser = {
    templateTaskId: number;
    userId: number;
    templateRoleId: number;
}

type Tag = {
    templateIdNum: number;
    tagName: string;
}

const TemplateCopy: React.FC = () => {
    const [projectResponses, setProjectResponses] = useState<ProjectResponse[]>([]);
    // const [taskGroupResponses, setTaskGroupResponses] = useState<TaskGroupResponse[]>([]);
    const [templateIdNum, setTemplateIdNum] = useState<number>(0);
    const [taskResponses, setTaskResponses] = useState<TaskResponse[]>([]);
    const [projectUserNum, setProjectUserNum] = useState<ProjectUserNum[]>([]);
    const [tasks, setTasks] = useState<TaskResponse[]>([]);
    const [options, setOptions] = useState<ProjectSelectResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProjectIdNum, setSelectedProjectIdNum] = useState<number>(0);
    const [isErrorModalOpen, setErrorModalOpen] = useState(false);
    const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
    const [isSavedModalOpen, setSavedModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [projectListOpen, setProjectListOpen] = useState(true);
    const [expandedTasks, setExpandedTasks] = useState<number[]>([]);
    const [templateRequest, setTemplateRequest] = useState<TemplateRequest | null>(null);
    const [templateTaskRequest, setTemplateTaskRequest] = useState<TemplateTaskRequest[]>([]);
    const [templateRoleRequest, setTemplateRoleRequest] = useState<Role[]>([]);
    const [roleListOpen, setRoleListOpen] = useState(false);
    const [templateUserRequest, setTemplateUserRequest] = useState<User[]>([]);
    const [templateTaskUserRequest, setTemplateTaskUserRequest] = useState<TemplateTaskUser[]>([]);
    const [userListOpen, setUserListOpen] = useState(false);
    const [taskUserListOpen, setTaskUserListOpen] = useState(false);
    const [selectedTaskIdNum, setSelectedTaskIdNum] = useState<number>(0);
    const [tempSave, setTempSave] = useState(true);
    const navigate = useNavigate();

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

    // ProjectResponse의 정보를 TemplateRequest형식으로 변환하는 함수
    const convertProjectResponseToTemplateRequest = (projectResponse: ProjectResponse): TemplateRequest => {
        return {
            templateName: projectResponse.projectName,
            description: projectResponse.description,
            period: getDaysDifference(projectResponse.startDate, projectResponse.endDate),
        }
    }

    // TaskResponse의 정보를 TemplateTaskRequest형식으로 변환하는 함수
    const convertTaskResponseToTemplateTaskRequest = (taskResponse: TaskResponse): TemplateTaskRequest => {
        return {
            idNum: taskResponse.idNum,
            taskName: taskResponse.taskName,
            description: taskResponse.description,
            period: getDaysDifference(taskResponse.startDate, taskResponse.endDate),
            offsetDay: getDaysDifference(projectResponses.find(project => project.projectName === taskResponse.projectName)?.startDate || "", taskResponse.startDate) || 0,
        }
    }

    // 정리된 템플릿 상세정보의 내용을 저장하는 함수
    const handleSaveTemplate = async () => {
        try {
            if (templateIdNum === 0) {
                // template 저장
                const tempReq = {
                    templateName: templateRequest?.templateName,
                    description: templateRequest?.description,
                    period: templateRequest?.period,
                    regDate: new Date().toISOString().slice(0, 10),
                }
                const response = await axios.post("/api/template", tempReq);
                const receivedTemplateIdNum = response.data;
                setTemplateIdNum(receivedTemplateIdNum);

                // templateRole 저장
                const roleReq = templateRoleRequest.map(role => {
                    return {
                        templateId: receivedTemplateIdNum,
                        roleName: role.roleName,
                        roleLevel: role.roleLevel,
                        description: role.description,
                    }
                });
                await axios.post("/api/template/role", roleReq);

                // templateUser 저장
                const userReq = templateUserRequest.map(user => {
                    return {
                        templateId: receivedTemplateIdNum,
                        userId: user.userId,
                        templateRoleId: user.templateRoleId,
                    }
                });
                await axios.post("/api/template/user", userReq);

                const idNumMap = new Map();

                // templateTask 저장
                // templateTaskRequest는 배열형태이므로 순회하며 axios.post를 실행한다.
                // templateTask 저장
                for (const task of templateTaskRequest) {
                    const taskReq = {
                        taskName: task.taskName,
                        description: task.description,
                        period: task.period,
                        offsetDay: task.offsetDay,
                    }

                    const response = await axios.post(`/api/template/task/${receivedTemplateIdNum}`, taskReq);
                    const receivedTaskIdNum = response.data;

                    // Map에 oldIdNum: newIdNum 형태로 저장
                    idNumMap.set(task.idNum, receivedTaskIdNum);

                    // 기존 항목에 idNum 추가
                    task.idNum = receivedTaskIdNum;
                }

                // templateTaskUserRequest 저장
                for (const taskUser of templateTaskUserRequest) {
                    const taskUserReq = {
                        templateTaskId: idNumMap.get(taskUser.templateTaskId),
                        userId: taskUser.userId,
                        templateRoleId: taskUser.templateRoleId,
                    }
                    await axios.post(`/api/template/task/user/${receivedTemplateIdNum}`, taskUserReq);

                    // 기존 항목에 templateTaskId 추가
                    taskUser.templateTaskId = idNumMap.get(taskUser.templateTaskId);
                }

                // 성공 메세지
                setTempSave(false);
                setSuccessModalOpen(true);
                setSuccessMessage("템플릿의 임시저장이 완료되었습니다.");

            } else {
                // template 수정
                const tempReq = {
                    idNum: templateIdNum,
                    templateName: templateRequest?.templateName,
                    description: templateRequest?.description,
                    period: templateRequest?.period,
                }
                await axios.put(`/api/template`, tempReq);

                // templateRole 수정
                const roleReq = templateRoleRequest.map(role => {
                    return {
                        templateId: templateIdNum,
                        roleName: role.roleName,
                        roleLevel: role.roleLevel,
                        description: role.description,
                    }
                });
                await axios.put(`/api/template/role/${templateIdNum}`, roleReq);

                // templateUser 수정
                const userReq = templateUserRequest.map(user => {
                    return {
                        templateId: templateIdNum,
                        userId: user.userId,
                        templateRoleId: user.templateRoleId,
                    }
                });
                await axios.put(`/api/template/user/${templateIdNum}`, userReq);

                // templateTask 수정
                await axios.put(`/api/template/task/${templateIdNum}`, templateTaskRequest)

                // templateTaskUser 수정
                // 같은 templateTaskId를 가진 항목들을 묶어서 axios.put을 실행한다.
                const taskUserReq = templateTaskUserRequest.reduce((acc, cur) => {
                    if (acc[cur.templateTaskId]) {
                        acc[cur.templateTaskId].push(cur);
                    } else {
                        acc[cur.templateTaskId] = [cur];
                    }
                    return acc;
                }, {});

                for (const [key, value] of Object.entries(taskUserReq)) {
                    await axios.put(`/api/template/task/user/${key}`, value);
                }

                // 성공 메세지
                setTempSave(false);
                setSuccessModalOpen(true);
                setSuccessMessage("템플릿의 임시저장이 완료되었습니다.");

            }
        } catch (error) {
            setErrorModalOpen(true);
            setErrorMessage("템플릿의 임시저장에 실패하였습니다.");
        }
    }

    // 템플릿의 최종저장
    const handleSave = async () => {
        try {
            if (templateIdNum === 0) {
                // template 저장
                const tempReq = {
                    templateName: templateRequest?.templateName,
                    description: templateRequest?.description,
                    period: templateRequest?.period,
                    regDate: new Date().toISOString().slice(0, 10),
                }
                const response = await axios.post("/api/template", tempReq);
                const receivedTemplateIdNum = response.data;
                setTemplateIdNum(receivedTemplateIdNum);

                // templateTag 저장
                const tags: Tag[] = [];
                const tagNames = tempReq.templateName?.split(' ').concat(tempReq.description?.split(' '));
                // 중복되는 키워드는 제거
                const uniqueTagNames = [...new Set(tagNames)];
                uniqueTagNames.forEach((tagName) => {
                    tags.push({
                        templateIdNum: receivedTemplateIdNum,
                        tagName,
                    });
                });
                await axios.post(`/api/template/tag/${receivedTemplateIdNum}`, tags);

                // templateRole 저장
                const roleReq = templateRoleRequest.map(role => {
                    return {
                        templateId: receivedTemplateIdNum,
                        roleName: role.roleName,
                        roleLevel: role.roleLevel,
                        description: role.description,
                    }
                });
                await axios.post("/api/template/role", roleReq);

                // templateUser 저장
                const userReq = templateUserRequest.map(user => {
                    return {
                        templateId: receivedTemplateIdNum,
                        userId: user.userId,
                        templateRoleId: user.templateRoleId,
                    }
                });
                await axios.post("/api/template/user", userReq);

                const idNumMap = new Map();

                // templateTask 저장
                // templateTaskRequest는 배열형태이므로 순회하며 axios.post를 실행한다.
                // templateTask 저장
                for (const task of templateTaskRequest) {
                    const taskReq = {
                        taskName: task.taskName,
                        description: task.description,
                        period: task.period,
                        offsetDay: task.offsetDay,
                    }

                    const response = await axios.post(`/api/template/task/${receivedTemplateIdNum}`, taskReq);
                    const receivedTaskIdNum = response.data;

                    // Map에 oldIdNum: newIdNum 형태로 저장
                    idNumMap.set(task.idNum, receivedTaskIdNum);

                    // 기존 항목에 idNum 추가
                    task.idNum = receivedTaskIdNum;
                }

                // templateTaskUserRequest 저장
                for (const taskUser of templateTaskUserRequest) {
                    const taskUserReq = {
                        templateTaskId: idNumMap.get(taskUser.templateTaskId),
                        userId: taskUser.userId,
                        templateRoleId: taskUser.templateRoleId,
                    }
                    await axios.post(`/api/template/task/user/${receivedTemplateIdNum}`, taskUserReq);

                    // 기존 항목에 templateTaskId 추가
                    taskUser.templateTaskId = idNumMap.get(taskUser.templateTaskId);
                }

                // 성공 메세지
                setTempSave(false);
                setSuccessModalOpen(true);
                setSuccessMessage("템플릿의 임시저장이 완료되었습니다.");

            } else {
                // template 수정
                const tempReq = {
                    idNum: templateIdNum,
                    templateName: templateRequest?.templateName,
                    description: templateRequest?.description,
                    period: templateRequest?.period,
                }
                await axios.put(`/api/template`, tempReq);

                // templateTag 저장
                const tags: Tag[] = [];
                const tagNames = tempReq.templateName?.split(' ').concat(tempReq.description?.split(' '));
                // 중복되는 키워드는 제거
                const uniqueTagNames = [...new Set(tagNames)];
                uniqueTagNames.forEach((tagName) => {
                    tags.push({
                        templateIdNum: templateIdNum,
                        tagName,
                    });
                });
                await axios.post(`/api/template/tag/${templateIdNum}`, tags);

                // templateRole 수정
                const roleReq = templateRoleRequest.map(role => {
                    return {
                        templateId: templateIdNum,
                        roleName: role.roleName,
                        roleLevel: role.roleLevel,
                        description: role.description,
                    }
                });
                await axios.put(`/api/template/role/${templateIdNum}`, roleReq);

                // templateUser 수정
                const userReq = templateUserRequest.map(user => {
                    return {
                        templateId: templateIdNum,
                        userId: user.userId,
                        templateRoleId: user.templateRoleId,
                    }
                });
                await axios.put(`/api/template/user/${templateIdNum}`, userReq);

                // templateTask 수정
                await axios.put(`/api/template/task/${templateIdNum}`, templateTaskRequest)

                // templateTaskUser 수정
                // 같은 templateTaskId를 가진 항목들을 묶어서 axios.put을 실행한다.
                const taskUserReq = templateTaskUserRequest.reduce((acc, cur) => {
                    if (acc[cur.templateTaskId]) {
                        acc[cur.templateTaskId].push(cur);
                    } else {
                        acc[cur.templateTaskId] = [cur];
                    }
                    return acc;
                }, {});

                for (const [key, value] of Object.entries(taskUserReq)) {
                    await axios.put(`/api/template/task/user/${key}`, value);
                }

                // 성공 메세지 이후 사용자가 확인버튼을 누르면 리다이렉트
                setSavedModalOpen(true);
                setSuccessMessage("템플릿의 생성이 완료되었습니다.");
            }
        } catch (error) {
            setErrorModalOpen(true);
            setErrorMessage("템플릿 생성에 실패하였습니다.");
        }
    }
    const handleConfirmSuccess = () => {
        setSavedModalOpen(false);  // 성공 메시지 모달을 닫습니다.
        navigate("/template/list");
    }

    const handleTemplateChange = (key: string, value: string | number) => {
        const updatedTemplate = {...templateRequest};
        updatedTemplate[key] = value;
        setTemplateRequest(updatedTemplate);
    }

    const handleTaskChange = (index: number, key: string, value: string | number) => {
        const updatedTasks = [...templateTaskRequest];
        updatedTasks[index][key] = value;
        setTemplateTaskRequest(updatedTasks);
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

    const handleTaskAdd = async () => {
        try {
            const taskReq = {
                taskName: "",
                description: "",
                period: 0,
                offsetDay: 0,
            }
            const response = await axios.post(`/api/template/task/${templateIdNum}`, taskReq);
            const receivedTaskIdNum = response.data;

            const newTask = {
                idNum: receivedTaskIdNum,
                taskName: "",
                description: "",
                period: 0,
                offsetDay: 0,
            }
            const updatedTasks = [...templateTaskRequest, newTask];
            setTemplateTaskRequest(updatedTasks);
        } catch (error) {
            setErrorModalOpen(true);
            setErrorMessage("템플릿 업무 추가에 실패하였습니다.");
        }
    }

    function getDaysDifference(start: string, end: string) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
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
        // TemplateRequest에 selectedProjectIdNum에 대응되는 projectResponse를 넣어줌
        const foundProject = projectResponses.find(project => project.idNum === selectedProjectIdNum);
        if (foundProject) {
            setTemplateRequest(convertProjectResponseToTemplateRequest(foundProject));
        }

        // TemplateTaskRequest에 selectedProjectIdNum에 대응되는 taskResponse를 넣어줌
        const relatedTasks = taskResponses.filter(task => task.projectName === searchTerm);
        setTemplateTaskRequest(relatedTasks.map(task => convertTaskResponseToTemplateTaskRequest(task)));

        // 권한 목록 불러오기
        axios.get(`/api/project/role/${selectedProjectIdNum}`)
            .then((response) => {
                setTemplateRoleRequest(response.data);
            })
            .catch((error) => {
                setErrorModalOpen(true)
                setErrorMessage("프로젝트 권한 목록을 불러오는데 실패했습니다.")
            });

        // 템플릿 작업자 목록 불러오기
        axios.get(`/api/project/user/${selectedProjectIdNum}`)
            .then((response) => {
                // response.data의 형태는
                // { projectIdNum: number, userId: number, projectRoleId: number 인데
                // userId는 그대로 갖오고 projectRoleId는 templateRoleId로 바꿔서 templateUserRequest에 넣어줌
                const templateUserRequest = response.data.map((user: any) => {
                    return {
                        userId: user.userId,
                        templateRoleId: user.projectRoleId,
                    }
                });
                setTemplateUserRequest(templateUserRequest);
            })
            .catch((error) => {
                setErrorModalOpen(true)
                setErrorMessage("프로젝트 작업자 목록을 불러오는데 실패했습니다.")
            });

        // 템플릿 업무 작업자 목록 불러오기
        // relatedTasks의 taskIdNum을 통해 taskUserResponses를 조회
        const taskUserResponses = relatedTasks.map(async (task: TaskResponse) => {
            // response.data의 형태는
            // { taskId: number, userId: number, taskRoleId: number 인데
            // userId는 그대로 갖오고 projectRoleId는 templateRoleId로 바꿔서 templateTaskUserRequest에 넣어줌
            const taskUserResponse = await axios.get(`/api/task/user/${task.idNum}`);
            return taskUserResponse.data.map((user: any) => {
                return {
                    templateTaskId: user.taskId,
                    userId: user.userId,
                    templateRoleId: user.taskRoleId,
                }
            });
        });
        Promise.all(taskUserResponses)
            .then((responses) => {
                const templateTaskUserRequest = responses.flat();
                setTemplateTaskUserRequest(templateTaskUserRequest);
            })
            .catch((error) => {
                setErrorModalOpen(true)
                setErrorMessage("프로젝트 작업자 목록을 불러오는데 실패했습니다.")
            });

    }, [selectedProjectIdNum]);

    // 임시저장 활성화 기능
    useEffect(() => {
        setTempSave(true);
    }, [templateRequest, templateTaskRequest, templateRoleRequest, templateUserRequest, templateTaskUserRequest]);

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
                                                            작업인원: {projectNum}명
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
                            selectedProjectIdNum !== 0 && templateRequest !== null ? (
                                <Box sx={{mt: 3}}>
                                    <Typography variant="h6" gutterBottom>
                                        템플릿 상세정보
                                    </Typography>
                                    <Divider/>
                                    <Box sx={{mt: 2}}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} key={selectedProjectIdNum}>
                                                <Box display="flex" justifyContent="space-between">
                                                    <TextField
                                                        label="템플릿명"
                                                        name="projectName"
                                                        variant="filled"
                                                        value={templateRequest.templateName}
                                                        onChange={e => handleTemplateChange('templateName', e.target.value)}
                                                        sx={{mt: 1, width: '30%'}}
                                                        InputProps={{
                                                            style: {fontSize: '14px', backgroundColor: 'transparent'}
                                                        }}
                                                        InputLabelProps={{
                                                            style: {fontSize: '14px'},
                                                        }}
                                                    />

                                                    <Box>
                                                        <Tooltip title={templateIdNum === 0 ? "임시저장 이후 선택해주세요." : ""}>
                                                            <span>
                                                                <Button variant="contained"
                                                                        startIcon={<ManageAccountsIcon style={{ color: '#888888', marginRight: '2px', fontSize: '15px' }} />}
                                                                        sx={{ color: 'black',
                                                                            marginLeft: '10px',
                                                                            fontSize: '12px',
                                                                            fontWeight: 'bold',
                                                                            height: '30px',
                                                                            backgroundColor: 'white',
                                                                            boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12) !important',
                                                                            textTransform: 'none',
                                                                            minWidth: '75px',
                                                                            padding: '0 12px',
                                                                            opacity: templateIdNum === 0 ? 0.5 : 1,
                                                                            pointerEvents: templateIdNum === 0 ? 'none' : 'all',
                                                                            '&:hover': {
                                                                                textDecoration: 'none',
                                                                                backgroundColor: 'rgb(0, 0, 0, 0.1)',
                                                                            }
                                                                        }}
                                                                        onClick={() => {setRoleListOpen(true)}}
                                                                >
                                                                    권한관리
                                                                </Button>

                                                                <Button variant="contained"
                                                                        startIcon={<GroupsIcon style={{ color: '#888888', marginRight: '2px', fontSize: '15px' }} />}
                                                                        sx={{ color: 'black',
                                                                            marginLeft: '10px',
                                                                            fontSize: '12px',
                                                                            fontWeight: 'bold',
                                                                            height: '30px',
                                                                            backgroundColor: 'white',
                                                                            boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12) !important',
                                                                            textTransform: 'none',
                                                                            minWidth: '75px',
                                                                            padding: '0 12px',
                                                                            opacity: templateIdNum === 0 ? 0.5 : 1,
                                                                            pointerEvents: templateIdNum === 0 ? 'none' : 'all',
                                                                            '&:hover': {
                                                                                textDecoration: 'none',
                                                                                backgroundColor: 'rgb(0, 0, 0, 0.1)',
                                                                            }
                                                                        }}
                                                                        onClick={() => {setUserListOpen(true)}}
                                                                >
                                                                    작업자관리
                                                                </Button>
                                                            </span>
                                                        </Tooltip>
                                                    </Box>
                                                </Box>
                                                <TextareaAutosize
                                                    aria-label="프로젝트 상세설명"
                                                    minRows={4}
                                                    name="description"
                                                    placeholder="프로젝트 상세설명을 입력하세요"
                                                    value={templateRequest.description}
                                                    onChange={e => handleTemplateChange('description', e.target.value)}
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

                                                <Grid container spacing={4} sx={{mt: 3}}>
                                                    <Grid item xs={3}>
                                                        <TextField
                                                            label="기간 (일)"
                                                            variant="outlined"
                                                            type="number"
                                                            name="period"
                                                            value={templateRequest.period}
                                                            onChange={e => handleTemplateChange('period', e.target.value)}
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

                                                    <Grid item xs={3}>
                                                        &nbsp;
                                                    </Grid>

                                                    <Grid item xs={3}>
                                                        <Tooltip title="이 날짜는 임시 시작일로, 수정할 수 없습니다.">
                                                            <span>
                                                                <TextField
                                                                    label="임시 시작일"
                                                                    variant="outlined"
                                                                    type="date"
                                                                    name="startDate"
                                                                    value={new Date().toISOString().split('T')[0]}
                                                                    fullWidth
                                                                    disabled
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
                                                            </span>
                                                        </Tooltip>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <Tooltip title="이 날짜는 임시 시작일로, 수정할 수 없습니다.">
                                                            <span>
                                                                <TextField
                                                                    label="임시 종료일"
                                                                    variant="outlined"
                                                                    type="date"
                                                                    name="endDate"
                                                                    // 종료예정일 = 오늘날짜 + period (임시)
                                                                    value={new Date(new Date().getTime() + (templateRequest.period * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]}
                                                                    fullWidth
                                                                    disabled
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
                                                            </span>
                                                        </Tooltip>
                                                    </Grid>
                                                </Grid>

                                                <Box display="flex" justifyContent="space-between" sx={{mt: 5}}>
                                                    <Box>
                                                        &nbsp;
                                                    </Box>

                                                    <Box>
                                                        <Button
                                                            variant="contained"
                                                            sx={{
                                                                marginLeft: '10px',
                                                                fontSize: '14px',
                                                                fontWeight: 'bold',
                                                                height: '35px',
                                                                backgroundColor: 'rgb(40, 49, 66)',
                                                                boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12) !important',
                                                                textTransform: 'none',
                                                                minWidth: '75px',
                                                                padding: '0 12px',
                                                                opacity: tempSave ? 1 : 0.5, pointerEvents: tempSave ? 'all' : 'none',
                                                                '&:hover': {
                                                                    textDecoration: 'none',
                                                                    backgroundColor: 'rgb(40, 49, 66, 0.8)',
                                                                },
                                                            }}
                                                            onClick={handleSaveTemplate}
                                                        >
                                                            임시저장
                                                        </Button>
                                                    </Box>
                                                </Box>

                                            </Grid>
                                        </Grid>
                                    </Box>

                                    {
                                        templateIdNum == 0 ? (
                                            <span style={{opacity: 0.5, fontSize: '12px'}}>* 템플릿 업무는 임시저장 이후에 수정가능합니다.</span>
                                        ) : ''
                                    }

                                    {
                                        templateTaskRequest.length !== 0 ? (
                                                <Box sx={{ mt: 7, opacity: templateIdNum === 0 ? 0.5 : 1, pointerEvents: templateIdNum === 0 ? 'none' : 'all' }}>
                                                    <Typography variant="h6" gutterBottom>
                                                        템플릿 업무
                                                    </Typography>
                                                    <Divider />
                                                    <Box sx={{ mt: 2 }}>
                                                        <Grid container spacing={2}>
                                                            {
                                                                templateTaskRequest.map((task, index) => (
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
                                                                                                new Date(new Date().getTime() + (task.offsetDay * 24 * 60 * 60 * 1000)).toISOString().split('T')[0] + ' ~ ' +
                                                                                                new Date(new Date().getTime() + (task.offsetDay * 24 * 60 * 60 * 1000) + (task.period * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
                                                                                            }
                                                                                        </Typography>
                                                                                    </Box>
                                                                                    <Box>
                                                                                        <Button variant="contained"
                                                                                                startIcon={<GroupsIcon style={{ color: '#888888', marginRight: '2px', fontSize: '15px' }} />}
                                                                                                sx={{ color: 'black',
                                                                                                    marginLeft: '10px',
                                                                                                    marginRight: '10px',
                                                                                                    fontSize: '12px',
                                                                                                    fontWeight: 'bold',
                                                                                                    height: '30px',
                                                                                                    backgroundColor: 'white',
                                                                                                    boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12) !important',
                                                                                                    textTransform: 'none',
                                                                                                    minWidth: '75px',
                                                                                                    padding: '0 12px',
                                                                                                    opacity: expandedTasks.includes(index) ? 1 : 0,
                                                                                                    transition: 'opacity 300ms ease-in-out',
                                                                                                    '&:hover': {
                                                                                                        textDecoration: 'none',
                                                                                                        backgroundColor: 'rgb(0, 0, 0, 0.1)',
                                                                                                    }
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    setSelectedTaskIdNum(task.idNum)
                                                                                                    setTaskUserListOpen(true)
                                                                                                }}
                                                                                        >
                                                                                            작업자관리
                                                                                        </Button>

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
                                                                                </Box>
                                                                                <Collapse in={expandedTasks.includes(index)}>
                                                                                    <Grid container spacing={4} sx={{mt: 3}}>
                                                                                        <Grid item xs={3}>
                                                                                            <TextField
                                                                                                label="기간 (일)"
                                                                                                variant="outlined"
                                                                                                type="number"
                                                                                                name="period"
                                                                                                value={task.period}
                                                                                                onChange={e => handleTaskChange(index, 'period', e.target.value)}
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

                                                                                        <Grid item xs={3}>
                                                                                            <TextField
                                                                                                label="offsetDay"
                                                                                                variant="outlined"
                                                                                                type="number"
                                                                                                name="period"
                                                                                                value={task.offsetDay}
                                                                                                onChange={e => handleTaskChange(index, 'offsetDay', e.target.value)}
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

                                                                                        <Grid item xs={3}>
                                                                                            <TextField
                                                                                                label="임시 시작일"
                                                                                                variant="outlined"
                                                                                                type="date"
                                                                                                name="startDate"
                                                                                                value={new Date(new Date().getTime() + (task.offsetDay * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]}
                                                                                                fullWidth
                                                                                                disabled
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
                                                                                        <Grid item xs={3}>
                                                                                            <TextField
                                                                                                label="임시 종료일"
                                                                                                variant="outlined"
                                                                                                type="date"
                                                                                                name="endDate"
                                                                                                // 종료예정일 = 오늘날짜 + offsetDay + period (임시)
                                                                                                value={new Date(new Date().getTime() + (task.offsetDay * 24 * 60 * 60 * 1000) + (task.period * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]}
                                                                                                fullWidth
                                                                                                disabled
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
                                                            <Grid item xs={12}>
                                                                <Tooltip title={'새 업무 추가'}>
                                                                    <MUICard
                                                                        sx={{
                                                                            ':hover': {
                                                                                backgroundColor: 'rgba(40, 49, 66, 0.1)', // 카드의 배경색을 변경합니다.
                                                                                transition: 'background-color 0.3s', // 스무스한 전환 효과를 위해 transition 추가
                                                                                pointer: 'cursor',
                                                                            }
                                                                        }}
                                                                        onClick={handleTaskAdd}
                                                                    >
                                                                        <CardContent sx={{padding: '10px !important'}}>
                                                                            <Box display="flex" alignItems="center" justifyContent="center">
                                                                                <IconButton
                                                                                    aria-label="add"
                                                                                    sx={{
                                                                                        width: '40px',
                                                                                        height: '40px',
                                                                                        color: 'rgba(40, 49, 66, 0.5)',
                                                                                    }}
                                                                                >
                                                                                    <AddIcon />
                                                                                </IconButton>
                                                                            </Box>
                                                                        </CardContent>
                                                                    </MUICard>
                                                                </Tooltip>
                                                            </Grid>
                                                        </Grid>
                                                    </Box>
                                                </Box>
                                        ) : (
                                            <Box sx={{ mt: 3, opacity: templateIdNum === 0 ? 0.5 : 1, pointerEvents: templateIdNum === 0 ? 'none' : 'all' }}>
                                                <Grid item xs={12}>
                                                    <Tooltip title={'새 업무 추가'}>
                                                        <MUICard
                                                            sx={{
                                                                ':hover': {
                                                                    backgroundColor: 'rgba(40, 49, 66, 0.1)', // 카드의 배경색을 변경합니다.
                                                                    transition: 'background-color 0.3s', // 스무스한 전환 효과를 위해 transition 추가
                                                                    pointer: 'cursor',
                                                                }
                                                            }}
                                                            onClick={handleTaskAdd}
                                                        >
                                                            <CardContent sx={{padding: '10px !important'}}>
                                                                <Box display="flex" alignItems="center" justifyContent="center">
                                                                    <IconButton
                                                                        aria-label="add"
                                                                        sx={{
                                                                            width: '40px',
                                                                            height: '40px',
                                                                            color: 'rgba(40, 49, 66, 0.5)',
                                                                        }}
                                                                    >
                                                                        <AddIcon />
                                                                    </IconButton>
                                                                </Box>
                                                            </CardContent>
                                                        </MUICard>
                                                    </Tooltip>
                                                </Grid>
                                            </Box>
                                        )
                                    }
                                    <Box display="flex" justifyContent="space-between" sx={{mt: 5}}>
                                        <Box>
                                            &nbsp;
                                        </Box>

                                        <Box>
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    marginLeft: '10px',
                                                    fontSize: '14px',
                                                    fontWeight: 'bold',
                                                    height: '35px',
                                                    backgroundColor: 'rgb(40, 49, 66)',
                                                    boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12) !important',
                                                    textTransform: 'none',
                                                    minWidth: '75px',
                                                    padding: '0 12px',
                                                    opacity: templateIdNum === 0 ? 0.5 : 1, pointerEvents: templateIdNum === 0 ? 'none' : 'all',
                                                    '&:hover': {
                                                        textDecoration: 'none',
                                                        backgroundColor: 'rgb(40, 49, 66, 0.8)',
                                                    },
                                                }}
                                                onClick={handleSave}
                                            >
                                                템플릿 생성
                                            </Button>
                                        </Box>
                                    </Box>
                                </Box>
                            ) : (
                                <Box sx={{mt: 3}}>
                                    <Typography variant="h6" gutterBottom>
                                        복사할 프로젝트를 선택해주세요
                                    </Typography>
                                </Box>
                            )
                        }
                </Box>
            </Grid>

            {
                templateRoleRequest && (
                    <RoleModal open={roleListOpen} onClose={() => setRoleListOpen(false)} roleList={templateRoleRequest} setRoleList={setTemplateRoleRequest} />
                )
            }
            {
                templateUserRequest && (
                    <UserModal open={userListOpen} onClose={() => setUserListOpen(false)} userList={templateUserRequest} setUserList={setTemplateUserRequest} roleList={templateRoleRequest} setRoleList={setTemplateRoleRequest} />
                )
            }
            {
                templateTaskUserRequest && (
                    <TaskUserModal open={taskUserListOpen} onClose={() => setTaskUserListOpen(false)} userList={templateTaskUserRequest} setUserList={setTemplateTaskUserRequest} roleList={templateRoleRequest} setRoleList={setTemplateRoleRequest} taskIdNum={selectedTaskIdNum} userData={templateUserRequest}  />
                )
            }

            {/*에러 발생 Modal*/}
            <ErrorModal
                open={isErrorModalOpen}
                onClose={() => setErrorModalOpen(false)}
                title="요청 실패"
                description={errorMessage || ""}
            />

            {/*성공 Modal*/}
            <SuccessModal
                open={isSuccessModalOpen}
                onClose={() => setSuccessModalOpen(false)}
                title="요청 성공"
                description={successMessage || ""}
            />

            {/*최종 생성 Modal*/}
            <SuccessModal
                open={isSavedModalOpen}
                onClose={handleConfirmSuccess}
                title="요청 성공"
                description={successMessage || ""}
            />

        </Grid>
    );
};

export default TemplateCopy;
