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
    TextareaAutosize, TableHead, TableRow, TableCell, Collapse
} from "@mui/material";
import {useEffect, useState} from "react";
import CloseIcon from "@mui/icons-material/Close";
import * as React from "react";
import axios from "../../../redux/axiosConfig";
import ErrorModal from "../../common/ErrorModal";
import SuccessModal from "../../common/SuccessModal";
import AddIcon from "@mui/icons-material/Add";
import AddTaskUserTable from "./AddTaskUserTable";

type User = {
    templateTaskId: number;
    userId: number;
    templateRoleId: number;
}

type UserData = {
    userId: number;
    templateRoleId: number;
}

type Role = {
    roleName: string;
    roleLevel: number;
    description: string;
}

interface AllUser {
    idNum: number;
    name: string;
    department: string;
    email: string;
    role: number;
}

interface UserResponse {
    idNum: number;
    name: string | null;
    email: string | null;
    getUserDepartmentResList: {
        userDepartmentIdNum: number;
        departmentIdNum: number;
        departmentName: string;
    }[] | [];
}

interface ModalProps {
    open: boolean;
    onClose: () => void;
    userList: User[];
    setUserList: (userList: User[]) => void;
    roleList: Role[];
    setRoleList: (roleList: Role[]) => void;
    taskIdNum: number;
    userData: UserData[];
}

export default function TaskUserModal({ open, onClose, userList, setUserList, roleList, setRoleList, taskIdNum, userData }: ModalProps) {
    const [users, setUsers] = React.useState<AllUser[]>([]);
    const [taskUsers, setTaskUsers] = React.useState<User[]>(userList);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isAddUserTableOpen, setAddUserTableOpen] = useState<boolean>(false);
    const [isErrorModalOpen, setErrorModalOpen] = useState<boolean>(false);
    const [isSuccessModalOpen, setSuccessModalOpen] = useState<boolean>(false);

    const commonButtonStyles = {
        color: 'black',
        marginLeft: '10px',
        fontSize: '12px',
        fontWeight: 'bold',
        height: '30px',
        backgroundColor: 'white',
        boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12) !important',
        textTransform: 'none',
        minWidth: '75px',
        padding: '0 12px',
        '&:hover': {
            textDecoration: 'none',
            backgroundColor: 'rgb(0, 0, 0, 0.1)',
        },
    };

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

    const textFieldStyles = {
        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#409aff',
        },
        '& .MuiInputBase-input': {
            padding: 0,
            fontSize: '12px',
            height: '25px',
            paddingLeft: '10px',
            backgroundColor: '#fff'
        }
    }

    const SuccessClose = () => {
        setSuccessModalOpen(false);
        onClose();
    };

    useEffect(() => {
        // 사용자 목록 불러오기
        axios.get('/api/user')
            .then((response) => {
                const userData = response.data.map((userData: UserResponse) => ({
                    idNum: userData.idNum,
                    name: userData.name || '',  // handle the potential null value
                    department: userData.getUserDepartmentResList.length > 0 ? userData.getUserDepartmentResList[0].departmentName : '',
                    email: userData.email || '',  // handle the potential null value
                }));
                setUsers(userData);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        setTaskUsers(userList.filter(user => user.templateTaskId === taskIdNum));
    }, [userList, taskIdNum]);

    return (
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
                            업무 작업자 설정
                        </span>
                    <IconButton onClick={onClose} size="small" sx={{ padding: '0' }}>
                        <CloseIcon />
                    </IconButton>
                </Typography>

                <Box sx={{ mb: 7}} >
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '600px' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon style={{ color: 'rgb(23, 210, 23)', marginRight: '2px', fontSize: '15px' }} />}
                                sx={{ ...commonButtonStyles }}
                                onClick={() => setAddUserTableOpen(true)}
                            >
                                추가
                            </Button>
                        </Box>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={tableHeaderStyles} align="center">Seq</TableCell>
                                    <TableCell sx={tableHeaderStyles} align="center">이름</TableCell>
                                    <TableCell sx={tableHeaderStyles} align="center">역할</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    taskUsers.map((user, index) => (
                                    <TableRow key={index} sx={{ height: '30px' }}>
                                        <TableCell sx={{...tableCellStyles, width: '75px'}} align="center" >
                                            {index + 1}
                                        </TableCell>
                                        <TableCell sx={tableCellStyles} align="center" >
                                            { users.find((userData) => userData.idNum === user.userId)?.name }
                                        </TableCell>
                                        <TableCell sx={tableCellStyles} align="center" >
                                            { roleList && roleList.find((roleData) => roleData.roleLevel === user.templateRoleId)?.roleName }
                                        </TableCell>
                                    </TableRow>
                                ))
                                }
                            </TableBody>
                        </Table>
                    </Box>
                </Box>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
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
                        onClick={onClose}
                    >
                        저장
                    </Button>
                </Box>

                {/* 사용자 추가 Modal */}
                <Modal
                    open={isAddUserTableOpen}
                    onClose={() => setAddUserTableOpen(false)}
                    aria-labelledby="delete-modal-title"
                    aria-describedby="delete-modal-description"
                >
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        minWidth: 300,
                        minHeight: '50vh',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        borderRadius: '10px',
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
                            업무 작업자관리
                            </span>

                            <IconButton onClick={() => setAddUserTableOpen(false)} size="small" sx={{ padding: '0' }}>
                                <CloseIcon />
                            </IconButton>
                        </Typography>
                        <AddTaskUserTable
                            onClose={() => setAddUserTableOpen(false)}
                            userList={taskUsers}
                            setUserList={(updatedTaskUserList) => {
                                // updatedTaskUserList: taskUserList에서의 변경사항이 반영된 리스트

                                // 전체 userList에서 현재 task에 해당하지 않는 사용자들을 가져옵니다.
                                const otherUsers = userList.filter(user => user.templateTaskId !== taskIdNum);

                                // setUserList를 사용하여 userList를 업데이트합니다.
                                // 현재 task에 해당하지 않는 사용자들 + 변경사항이 반영된 사용자들
                                setUserList([...otherUsers, ...updatedTaskUserList]);
                            }}
                            rolesList={roleList}
                            taskIdNum={taskIdNum}
                            tempUser={userData}
                        />

                    </Box>
                </Modal>

                {/*성공 Modal*/}
                <SuccessModal
                    open={isSuccessModalOpen}
                    onClose={SuccessClose}
                    title={""}
                    description={"프로젝트가 성공적으로 등록되었습니다"}
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
    );
}
