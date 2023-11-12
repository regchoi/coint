import React, {useEffect, useState} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tabs,
    Tab,
    Typography,
    Box,
    Grid,
    Avatar,
    Button,
    Paper,
    ListItem,
    ListItemText,
    Divider, IconButton, TextField, Tooltip, TextareaAutosize, LinearProgress,
} from '@mui/material';
import axios from "../../../redux/axiosConfig";
import { Data } from "./data";
import {getRole}  from "../../common/tokenUtils";
import CloseIcon from "@mui/icons-material/Close";
import ErrorModal from "../../common/ErrorModal";
import SuccessModal from "../../common/SuccessModal";

type Project = {
    projectName: string,
    description: string,
    startDate: string,
    endDate: string,
    status: string | null,
    regDate: string,
    regUserid: string,
    confirm: boolean | null,
}

type Task = {
    idNum: number,
    taskName: string,
    description: string,
    startDate: string,
    endDate: string,
    status: string,
    regDate: string,
    regUserid: string,
    projectName: string,
    taskGroupIdNum: number,
}

type User = {
    idNum: number,
    loginId: string,
    name: string,
    phone: string,
    email: string,
}

interface TabPanelProps {
    children: React.ReactNode;
    value: number;
    index: number;
    boxStyle?: React.CSSProperties; // 이 줄을 추가합니다.
}

interface ProjectDetailModalProps {
    open: boolean;
    onClose: () => void;
    projectIdNum: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index , boxStyle }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
        >
            {value === index && (
                <Box p={3} style={boxStyle}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
};

const ProjectInfoModal: React.FC<ProjectDetailModalProps> = ({ open, onClose, projectIdNum }) => {
    const [tabValue, setTabValue] = useState<number>(0);
    const [projectInfo, setProjectInfo] = useState<Project>();
    const [taskInfo, setTaskInfo] = useState<Task[]>([]);
    const [progress, setProgress] = useState<number>(0);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [isSuccessModalOpen, setSuccessModalOpen] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [isErrorModalOpen, setErrorModalOpen] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        event.stopPropagation();
        setTabValue(newValue);
    };

    const handleConfirm = (confirm: boolean) => {
        axios.put(`/api/project/confirm/${projectIdNum}`, confirm )
            .then((response) => {
                if (response.status === 200) {
                    if(confirm) {
                        setSuccessMessage("프로젝트의 승인절차가 완료되었습니다.");
                        setSuccessModalOpen(true);
                    } else {
                        setSuccessMessage("프로젝트의 승인요청이 거절되었습니다.");
                        setSuccessModalOpen(true);
                    }
                    setProjectInfo(response.data);
                } else {
                    setErrorMessage("프로젝트의 승인절차가 실패했습니다.");
                    setErrorModalOpen(true);
                }
            })
            .catch((error) => {
                setErrorMessage("프로젝트의 승인절차가 실패했습니다.");
                setErrorModalOpen(true);
            });
    }

    useEffect(() => {
        axios.get(`/api/user`)
            .then((response) => {
                setAllUsers(response.data);
            })
            .catch((error) => {
                setErrorMessage("사용자 정보를 가져오는데 실패했습니다.");
                setErrorModalOpen(true);
            });

    }, []);

    useEffect(() => {
        if(projectIdNum === 0) return;
        axios.get(`/api/project/${projectIdNum}`)
            .then((response) => {
                if (response.status === 200) {
                    setProjectInfo(response.data);
                } else {
                    setErrorMessage("프로젝트 정보를 가져오는데 실패했습니다.");
                    setErrorModalOpen(true);
                }
            });

        axios.get(`/api/task/${projectIdNum}`)
            .then((response) => {
                if (response.status === 200) {
                    setTaskInfo(response.data);

                    // 진행률 계산
                    response.data && setProgress(Math.round(response.data.filter((task: Task) => task.status === 'DONE').length / response.data.length * 100));

                } else {
                    setErrorMessage("프로젝트 정보를 가져오는데 실패했습니다.");
                    setErrorModalOpen(true);
                }
            })
            .catch((error) => {
                setErrorMessage("프로젝트 정보를 가져오는데 실패했습니다.");
                setErrorModalOpen(true);
            });

    }, [projectIdNum]);

    return (
        <Dialog open={open} onClose={onClose} onClick={(event) => event.stopPropagation()} fullWidth maxWidth="sm">
            <DialogTitle sx={{pb: 1, backgroundColor: '#f5f7fa', }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{marginTop: '12px'}}>
                    <Typography variant="h6" sx={{fontSize: '16px', fontWeight: 'bold'}}>프로젝트 상세정보</Typography>
                    <IconButton onClick={onClose} size="small" sx={{ padding: '0' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            {
                projectInfo && (
                    <DialogContent sx={{ backgroundColor: '#f5f7fa', paddingTop: '24px !important' }}>
                        <Paper variant="outlined" sx={{ padding: 2 }}>
                            <Box sx={{ mt: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }} gutterBottom>
                                    {projectInfo.projectName}
                                    <Typography variant="body2" ml={1} sx={{ fontSize: '12px', color: '#888888', marginTop: '5px', display: 'inline-block' }}>
                                        {projectInfo.startDate} ~ {projectInfo.endDate}
                                    </Typography>
                                </Typography>
                                <Divider />
                                <Box sx={{ mt: 2 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Typography variant="body2" sx={{ fontSize: '14px', margin: '10px 0' }}>
                                                {projectInfo.description}
                                            </Typography>
                                        </Grid>

                                        {/* 등록자 정보 */}
                                        <Grid item xs={3}>
                                            <Typography variant="body2" sx={{ fontSize: '12px', color: '#888888' }}>등록자:</Typography>
                                            <Typography variant="body2" sx={{ fontSize: '14px' }}>
                                                {
                                                    allUsers.map((user) => {
                                                        // string을 number로 변환
                                                        if(user.idNum === Number(projectInfo.regUserid)) {
                                                            return user.name;
                                                        }
                                                    })
                                                }
                                            </Typography>
                                        </Grid>

                                        {/* 승인상태 정보 */}
                                        <Grid item xs={3}>
                                            <Typography variant="body2" sx={{ fontSize: '12px', color: '#888888' }}>승인상태:</Typography>
                                            <Typography variant="body2" sx={{ fontSize: '14px' }}>
                                                {
                                                    projectInfo.confirm == null ? '승인대기' : projectInfo.confirm ? '승인완료' : '승인거절'
                                                }
                                            </Typography>
                                        </Grid>

                                        {/* 승인자 정보 */}
                                        <Grid item xs={3}>
                                            <Typography variant="body2" sx={{ fontSize: '12px', color: '#888888' }}>승인자:</Typography>
                                            <Typography variant="body2" sx={{ fontSize: '14px' }}>
                                                {
                                                    // TODO: 승인자 정보 가져오기
                                                    "유저"
                                                }
                                            </Typography>
                                        </Grid>

                                        {/* 작업현황 정보 */}
                                        <Grid item xs={3}>
                                            <Typography variant="body2" sx={{ fontSize: '12px', color: '#888888' }}>작업현황:</Typography>
                                            <Typography variant="body2" sx={{ fontSize: '14px' }}>
                                                {
                                                    projectInfo.status === 'TODO' ? '준비중'
                                                        : projectInfo.status === 'WORKING' ? '진행중'
                                                        : projectInfo.status === 'WAITING' ? '대기중'
                                                        : projectInfo.status === 'DONE' ? '완료' : '준비중'
                                                }
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} sx={{ mt: 2 }}>
                                            <Typography variant="body2" sx={{ fontSize: '12px', color: '#888888' }}>작업 진행율:</Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Box sx={{ width: '100%', mr: 1 }}>
                                                    <LinearProgress variant="determinate" value={progress} />
                                                </Box>
                                                <Box sx={{ minWidth: 35 }}>
                                                    <Typography variant="body2" sx={{ fontSize: '14px' }}>{`${progress}%`}</Typography>
                                                </Box>
                                            </Box>
                                        </Grid>

                                    </Grid>
                                </Box>
                            </Box>
                        </Paper>
                        <Tabs value={tabValue} onChange={handleChange} sx={{ marginTop: 2 }}>
                            <Tab label="권한조회" sx={{ "&.Mui-selected": { backgroundColor: 'white' } }} />
                            <Tab label="사용자조회" sx={{ "&.Mui-selected": { backgroundColor: 'white' } }} />
                            <Tab label="업무조회" sx={{ "&.Mui-selected": { backgroundColor: 'white' } }} />
                            <Tab label="업무그룹조회" sx={{ "&.Mui-selected": { backgroundColor: 'white' } }} />
                        </Tabs>
                        <TabPanel
                            value={tabValue}
                            index={0}
                            boxStyle={{ backgroundColor: tabValue === 0 ? 'white' : 'inherit' }}
                        >
                            <Typography sx={{p: 3}}>// TODO: 미구현</Typography>
                        </TabPanel>
                        <TabPanel
                            value={tabValue}
                            index={1}
                            boxStyle={{ backgroundColor: tabValue === 1 ? 'white' : 'inherit' }}
                        >
                            <Typography sx={{p: 3}}>// TODO: 미구현</Typography>
                        </TabPanel>
                        <TabPanel
                            value={tabValue}
                            index={2}
                            boxStyle={{ backgroundColor: tabValue === 2 ? 'white' : 'inherit' }}
                        >
                            <Typography sx={{p: 3}}>// TODO: 미구현</Typography>
                        </TabPanel>
                        <TabPanel
                            value={tabValue}
                            index={3}
                            boxStyle={{ backgroundColor: tabValue === 3 ? 'white' : 'inherit' }}
                        >
                            <Typography sx={{p: 3}}>// TODO: 미구현</Typography>
                        </TabPanel>

                        <Box sx={{mt: 3, display: 'flex', justifyContent: 'flex-end'}}>


                            {
                                projectInfo.confirm === null ?
                                    getRole() === 'ROLE_ADMIN' ?
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
                                            onClick={() => handleConfirm(true)}
                                        >
                                            승인
                                        </Button>
                                        : null
                                    : null
                            }


                            {
                                projectInfo.confirm === null ?
                                    getRole() === 'ROLE_ADMIN' ?
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
                                            onClick={() => handleConfirm(false)}
                                        >
                                            거절
                                        </Button>
                                        : null
                                    : null
                            }
                        </Box>

                    </DialogContent>
                )
            }

            {/*성공 Modal*/}
            <SuccessModal
                open={isSuccessModalOpen}
                onClose={() => setSuccessModalOpen(false)}
                title={""}
                description={successMessage || ""}
            />

            {/*에러 발생 Modal*/}
            <ErrorModal
                open={isErrorModalOpen}
                onClose={() => setErrorModalOpen(false)}
                title="요청 실패"
                description={errorMessage || ""}
            />

            <DialogActions sx={{backgroundColor: '#f5f7fa'}}>
            </DialogActions>
        </Dialog>
    );
};

export default ProjectInfoModal;