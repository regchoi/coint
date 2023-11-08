import {
    Button,
    Modal,
    Box,
    TextField,
    Typography,
    Table,
    TableBody,
    IconButton,
    Grid,
    TextareaAutosize, TableHead, TableRow, TableCell, InputAdornment, Chip
} from "@mui/material";
import {useEffect, useState} from "react";
import UserTable from "./UserTable";
import DepartmentTable from "./DepartmentTable";
import CloseIcon from "@mui/icons-material/Close";
import * as React from "react";
import axios from "../../../redux/axiosConfig";
import ErrorModal from "../../common/ErrorModal";
import SuccessModal from "../../common/SuccessModal";
import ProjectContext from './ProjectContext';
import {fetchTableData} from "../../../redux/tableSlice";
import {API_LINK} from "./data";
import {AppDispatch, useAppDispatch, useAppSelector} from "../../../redux/store";
import RoleTable from "./RoleTable";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {CSSTransition} from "react-transition-group";
import {getRole} from "../../common/tokenUtils";

type Tag = {
    projectId: number;
    tagName: string;
}

type TaskTag = {
    taskId: number;
    tagName: string;
}

type Role = {
    projectId: number;
    roleName: string;
    roleLevel: number;
    description: string;
}

type Data = {
    projectName: string;
    description: string;
    startDate: string;
    endDate: string;
}

type User = {
    idNum: number;
    name: string;
    email: string;
    department: string;
    role: number;
}

type Department = {
    idNum: number;
    departmentName: string;
    description: string;
    role: string;
}

type Template = {
    idNum: number;
    templateName: string;
    description: string;
    period: number;
}

type TaskResponse = {
    idNum: number;
    taskName: string,
    description: string,
    period: number,
    offsetDay: number,
}

type TaskUserResponse = {
    templateTaskId: number;
    userId: number;
    templateRoleId: number;
}

type Task = {
    taskName: string,
    description: string,
    startDate: string,
    endDate: string,
    status: string | null,
}

interface ModalProps {
    open: boolean;
    onClose: () => void;
}


const tableHeaderStyles = {
    border: "1px solid rgba(0, 0, 0, 0.12)",
    padding: "0px 10px",
    fontWeight: "bold",
    fontSize: "12px",
    backgroundColor: "hsl(210, 7%, 89%)",
    maxWidth: "100px",
};

const tableBodyStyles = {
    height: "30px",
    border: "1px solid rgba(0, 0, 0, 0.12)",
    padding: "0px 10px",
    fontSize: "12px",
};

const tableCellStyles = {
    ...tableBodyStyles,
    height: "30px",
    verticalAlign: 'middle'
};

export default function AddModal({ open, onClose }: ModalProps) {
    const dispatch = useAppDispatch();
    // Modal의 페이지네이션 구현
    const [page, setPage] = useState(1);
    const [data, setData] = useState<Data>({} as Data);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isErrorModalOpen, setErrorModalOpen] = useState<boolean>(false);
    const [isSuccessModalOpen, setSuccessModalOpen] = useState<boolean>(false);
    const [projectIdNum, setProjectIdNum] = useState<number>(0);
    const [rolesList, setRolesList] = React.useState<Role[]>([]);
    const [usersList, setUsersList] = React.useState<User[]>([]);
    const [templateList, setTemplateList] = React.useState<Template[]>([]);
    const [departmentsList, setDepartmentsList] = React.useState<Department[]>([]);
    const [templateListOpen, setTemplateListOpen] = React.useState<boolean>(false);
    const [selectedTemplate, setSelectedTemplate] = React.useState<Template | null>(null);
    // Tag 관리
    const [tags, setTags] = useState<string[]>([]);
    const [tagSearchId, setTagSearchId] = useState<number[]>([]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setData(prevData => ({ ...prevData, [event.target.name]: event.target.value }));
    };

    const SuccessClose = () => {
        dispatch(fetchTableData(API_LINK));
        setSuccessModalOpen(false);
        onClose();
    };

    // 태그 추가 함수
    const handleTagAddition = (e: any) => {
        const input = e.currentTarget.closest('.MuiFormControl-root')?.querySelector('input') as HTMLInputElement;
        if (input && input.value) {
            addTag(input.value);
            input.value = '';
        }
    };

    const addTag = (tag: string) => {
        if (!tags.includes(tag)) {
            setTags([...tags, tag]);
        }
    };

    const removeTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag));
    }

    const handleTemplateSelect = (template: Template) => {
        setSelectedTemplate(template);
        setTemplateListOpen(false);
        // data의 값을 template의 값으로 변경
        setData({
            ...data,
            projectName: template.templateName,
            description: template.description,
            startDate: new Date().toISOString().slice(0, 10),
            endDate: new Date(new Date().getTime() + template.period * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        });
    }

    const handleProjectSave = async () => {
        try {
            if(!selectedTemplate) {
                setErrorMessage('템플릿을 선택해주세요.');
                setErrorModalOpen(true);
            } else {
                // 경영진 계정인지 검증
                // 경영진이면 자체승인, 경영진이 아니라면 승인 절차
                const isAdmin: boolean = getRole() === 'ROLE_ADMIN';
                const response = await axios.post('/api/project', {
                    projectName: data.projectName,
                    description: data.description,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    isAdmin,
                });

                if (response.data) {
                    // response.data에는 projectIdNum이 담겨있음
                    // 해당 API 요청을 통해 Tag를 등록
                    const tags: Tag[] = [];
                    const tagNames = data.projectName.split(' ').concat(data.description.split(' '));
                    // 중복되는 키워드는 제거
                    const uniqueTagNames = [...new Set(tagNames)];
                    uniqueTagNames.forEach((tagName) => {
                        tags.push({
                            projectId: response.data,
                            tagName,
                        });
                    });
                    await axios.post(`/api/project/tag/${response.data}`, tags);

                    // 해당 API 요청을 통해 Role을 등록

                    // Role을 불러오는 GET 요청
                    const rolesResponse = await axios.get(`/api/template/role/${selectedTemplate.idNum}`);

                    // 불러온 Role을 새 프로젝트에 등록하는 POST 요청
                    if (rolesResponse.data) {
                        const rolesList: Role[] = [];
                        rolesResponse.data.forEach((role: Role) => {
                            rolesList.push({
                                projectId: response.data,
                                roleName: role.roleName,
                                roleLevel: role.roleLevel,
                                description: role.description,
                            });
                        });
                        await axios.post(`/api/project/role/${response.data}`, rolesList);
                    }

                    // 해당 API 요청을 통해 User를 등록

                    // User를 불러오는 GET 요청
                    const usersResponse = await axios.get(`/api/template/user/${selectedTemplate.idNum}`);

                    // 불러온 User를 새 프로젝트에 등록하는 POST 요청
                    if (usersResponse.data) {
                        const usersList: { projectId: number, userId: number, projectRoleId: number }[] = [];
                        usersResponse.data.forEach((user: { userId: number, templateRoleId: number }) => {
                            usersList.push({
                                projectId: response.data,
                                userId: user.userId,
                                projectRoleId: user.templateRoleId,
                            });
                        });
                        await axios.post(`/api/project/user/${response.data}`, usersList);
                    }

                    // 해당 API 요청을 통해 Task를 등록


                    // Task를 불러오는 GET 요청
                    const tasksResponse = await axios.get(`/api/template/task/${selectedTemplate.idNum}`);

                    // TaskUser를 불러오는 GET 요청
                    const taskUsersResponse = await axios.get(`/api/template/task/user/${selectedTemplate.idNum}`);

                    // 불러온 Task를 새 프로젝트에 등록하는 POST 요청
                    if (tasksResponse.data) {
                        for (const task of tasksResponse.data) {
                            const responseTask = await axios.post(`/api/task/${response.data}`, {
                                taskName: task.taskName,
                                description: task.description,
                                startDate: new Date(new Date().getTime() + task.offsetDay * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
                                endDate: new Date(new Date().getTime() + task.offsetDay * 24 * 60 * 60 * 1000 + task.period * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
                                status: null
                            });

                            if (responseTask.data) {
                                // 새 TaskUser 정보 삽입
                                const taskUsersList = taskUsersResponse.data
                                    .filter((taskUser: TaskUserResponse) => taskUser.templateTaskId === task.idNum)
                                    .map((taskUser: TaskUserResponse) => ({
                                        taskId: responseTask.data, // responseTask.data가 새로 생성된 task의 정보를 담고 있다고 가정합니다.
                                        userId: taskUser.userId,
                                        taskRoleId: taskUser.templateRoleId,
                                    }));

                                await axios.post(`/api/task/user/${responseTask.data}`, taskUsersList);
                            }
                        }
                    }

                    // email 요청
                    if(getRole() !== 'ROLE_ADMIN') {
                        const emailMessage = {
                            to: 'chami0205@gmail.com',
                            subject: `프로젝트 승인 요청 - ${data.projectName}`,
                            html: `<!DOCTYPE html>
                            <html lang="ko">
                            <head>
                              <meta charset="UTF-8">
                              <meta name="viewport" content="width=device-width, initial-scale=1.0">
                              <title>프로젝트 승인요청</title>
                              <style>
                                body {
                                  font-family: Arial, sans-serif;
                                  display: flex;
                                  justify-content: center;
                                  align-items: center;
                                  height: 100vh;
                                  background-color: #f4f4f4;
                                }
                            
                                .container {
                                  width: 600px;
                                  padding: 20px;
                                  border: 1px solid #e1e1e1;
                                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                                  background-color: #ffffff;
                                }
                            
                                .project-name {
                                  font-size: 18px;
                                  font-weight: bold;
                                  margin-top: 20px;
                                }
                            
                                .project-date {
                                  color: #777;
                                }
                            
                                .project-detail {
                                  font-size: 14px;
                                  margin-top: 20px;
                                  white-space: pre-line;
                                }
                            
                                .assignment-info, .task-info {
                                  font-size: 14px;
                                  margin-top: 20px;
                                }
                            
                                .approve-button {
                                  margin-top: 40px;
                                  display: flex;
                                  justify-content: center !important;
                                  text-align: center !important;
                                }
                            
                                a {
                                  padding: 10px 20px;
                                  font-size: 16px;
                                  border: none;
                                  border-radius: 4px;
                                  background-color: #333;
                                  color: #fff !important;
                                  cursor: pointer;
                                  text-decoration: none;
                                }
                            
                                a:hover {
                                  background-color: #555;
                                }
                              </style>
                            </head>
                            <body>
                            <div class="container">
                              <h1>프로젝트 승인 요청</h1>
                              <div class="project-name">${data.projectName}</div>
                              <span class="project-date">기간(${data.startDate} ~ ${data.endDate})</span>
                            
                              <div class="project-detail">
                                ${data.description}
                              </div>
                            
                              <div class="assignment-info">배정인원 : ${usersResponse.data.length}명</div>
                              <div class="task-info">업무 : ${tasksResponse.data.length}개</div>
                            
                              <div class="approve-button">
                                <a href="http://localhost:3000/project/plan">세부 내용</a>
                              </div>
                            </div>
                            </body>
                            </html>
                            `
                        };
                        await axios.post('/api/mail/project', emailMessage);
                    }

                    setProjectIdNum(response.data);

                    setSuccessModalOpen(true);
                } else {
                    setErrorModalOpen(true);
                    setErrorMessage('성공적으로 프로젝트를 등록하지 못했습니다.');
                }
            }
        } catch (error) {
            setErrorModalOpen(true);
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage('성공적으로 프로젝트를 등록하지 못했습니다.');
            }
        }
    }

    useEffect(() => {
        axios.get('/api/template')
            .then((response) => {
                setTemplateList(response.data);
            })
            .catch((error) => {
                setErrorMessage('템플릿을 불러오는데 실패했습니다.');
                setErrorModalOpen(true);
            });
    }, []);


    // useState의 Tags를 감지하여 변경마다 axios로 데이터를 요청합니다.
    useEffect(() => {
        // 태그를 포함하는 ProjectIdNums를 가져옵니다.
        axios.get(`/api/template/tag?tags=${tags.join(',')}`)
            .then(res => {
                setTagSearchId(res.data);
            })
            .catch(err => {
                console.error(err);
            });
    }, [tags]);

    return (
        <ProjectContext.Provider value={{
            rolesList,
            setRolesList,
            usersList,
            setUsersList,
            departmentsList,
            setDepartmentsList,
        }}>
            <Modal open={open}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    minWidth: 600,
                    minHeight: '40vh',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    borderRadius: '10px',
                    transition: 'width 500ms ease-in-out, height 500ms ease-in-out', // width와 height에 대한 전환 효과를 동시에 지정
                    width: templateListOpen ? '980px' : '600px', // auto 대신 initial을 사용
                    // templateListOpen이 false 일때, selecteTemplate가 null이면 30vh, 아니면 55vh
                    height: templateListOpen ? '70vh' : selectedTemplate ? '55vh' : '20vh',
                }}>
                    <Typography variant="h6"
                                component={"div"}
                                sx={{
                                    borderBottom: '2px solid #f0f0f0',
                                    pb: 2,
                                    mb: 2,
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                        <span>
                        프로젝트 신규등록
                        </span>
                        <IconButton onClick={onClose} size="small" sx={{ padding: '0' }}>
                            <CloseIcon />
                        </IconButton>
                    </Typography>

                    <Button
                        onClick={() => setTemplateListOpen(!templateListOpen)}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            textTransform: 'none', // 대문자 변환 제거
                            fontSize: '14px',
                            color: 'rgba(0, 0, 0, .5)',
                            padding: '6px 8px', // 버튼 패딩 조정
                        }}
                        endIcon={
                            <ExpandMoreIcon
                                sx={{
                                    transform: templateListOpen ? "rotate(180deg)" : "rotate(0deg)",
                                    transition: "transform 0.5s",
                                }}
                            />
                        }
                    >
                        템플릿 목록
                    </Button>

                    <CSSTransition in={templateListOpen} timeout={500} classNames="project-list" unmountOnExit>
                    <Box sx={{ mb: 7}} >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', marginTop: '10px' }}>
                            <TextField
                                placeholder="태그 입력"
                                variant="outlined"
                                size="small"
                                sx={{
                                    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#409aff',
                                    },
                                    '& .MuiInputBase-input': {
                                        padding: 1,
                                        fontSize: '12px',
                                        height: '30px',
                                        paddingLeft: '10px',
                                        backgroundColor: '#fff',
                                    },
                                    width: '20%', // 필요하다면 여기서 폭 조절 가능
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                edge="end"
                                                color="primary"
                                                onClick={handleTagAddition}
                                            >
                                                <SearchIcon sx={{ color: 'rgb(40, 49, 66)' }} />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                // Enter 키 입력 시, 태그 추가
                                onKeyUp={(e) => { // 여기를 onKeyUp으로 변경
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleTagAddition(e);
                                    }
                                }}
                            />

                            {tags.map(tag => (
                                <Chip
                                    key={tag}
                                    label={tag}
                                    onDelete={() => removeTag(tag)}
                                    sx={{
                                        '& .MuiChip-root': {
                                            color: '#000',
                                            height: '100%',
                                        },
                                        '& .MuiChip-root:hover .MuiChip-deleteIcon': {
                                            color: '#fff',
                                        },
                                        '& .MuiChip-root .MuiChip-label': {
                                            fontSize: '12px',
                                        },
                                    }}
                                />
                            ))}
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '900px', overflowY: 'auto', height: '200px'  }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={tableHeaderStyles} align="center">템플릿명</TableCell>
                                        <TableCell sx={tableHeaderStyles} align="center">상세설명</TableCell>
                                        <TableCell sx={tableHeaderStyles} align="center">기간</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        templateList
                                            .filter(template => {
                                                if (tagSearchId.length === 0) {
                                                    if(tags.length === 0) return true;
                                                    else return false;
                                                } else {
                                                    return tagSearchId.includes(template.idNum);
                                                }
                                            })
                                            .map((template) => (
                                            <TableRow
                                                key={template.idNum}
                                                sx={{
                                                    '&:last-child td, &:last-child th': { border: 0 },
                                                    cursor: 'pointer',
                                                    // hover
                                                    '&:hover': {
                                                        backgroundColor: '#f0f0f0',
                                                    }
                                                }}
                                            onClick={() => handleTemplateSelect(template)}
                                            >
                                                <TableCell sx={tableCellStyles} align="center">{template.templateName}</TableCell>
                                                <TableCell sx={tableCellStyles} align="center">{
                                                    template.description.length > 15 ?
                                                        template.description.substring(0, 15) + '...' :
                                                        template.description
                                                }</TableCell>
                                                <TableCell sx={tableCellStyles} align="center">{template.period}</TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </Box>
                    </Box>
                    </CSSTransition>

                    {
                        selectedTemplate && (
                            <>
                                <Box>
                                    <TextField
                                        label="프로젝트명"
                                        name="projectName"
                                        variant="filled"
                                        value={data.projectName}
                                        onChange={handleInputChange}
                                        sx={{mt: 1, width: '50%'}}
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
                                        value={data.description}
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
                                                value={data.startDate}
                                                onChange={handleInputChange}
                                                fullWidth
                                                InputProps={{
                                                    style: {fontSize: '14px', backgroundColor: 'transparent'}
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
                                                value={data.endDate}
                                                onChange={handleInputChange}
                                                fullWidth
                                                InputProps={{
                                                    style: {fontSize: '14px', backgroundColor: 'transparent'}
                                                }}
                                                InputLabelProps={{
                                                    style: {fontSize: '14px'},
                                                    shrink: true,
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Box sx={{mt: 3, display: 'flex', justifyContent: 'flex-end'}}>
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
                                            '&:hover': {
                                                textDecoration: 'none',
                                                backgroundColor: 'rgb(40, 49, 66, 0.8)',
                                            },
                                        }}
                                        onClick={handleProjectSave}
                                    >
                                        저장
                                    </Button>
                                </Box>
                            </>
                        )
                    }

                    {/*성공 Modal*/}
                    <SuccessModal
                        open={isSuccessModalOpen}
                        onClose={SuccessClose}
                        title={""}
                        description={"프로젝트 간편등록이 완료되었습니다"}
                    />

                    {/*에러 발생 Modal*/}
                    <ErrorModal
                        open={isErrorModalOpen}
                        onClose={() => setErrorModalOpen(false)}
                        title="요청 실패"
                        description={errorMessage || ""}
                    />
                </Box>
            </Modal>
        </ProjectContext.Provider>
    );
}
