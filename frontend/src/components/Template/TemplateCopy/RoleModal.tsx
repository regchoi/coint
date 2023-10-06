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
import {DeleteOutline} from "@mui/icons-material";

type Role = {
    roleName: string;
    roleLevel: number;
    description: string;
}

interface ModalProps {
    open: boolean;
    onClose: () => void;
    roleList: Role[];
    setRoleList: (roleList: Role[]) => void;
}

const RoleDescription: React.FC = () => {
    return (
        <Box sx={{ border: '1px solid rgba(0,0,0,0.12)', width: '600px', borderRadius: '4px', padding: '16px', backgroundColor: 'hsl(210, 7%, 95%)', marginTop: '10px' }}>
            <strong>권한등급에 대한 설명(예시)</strong>
            <ul>
                <li><strong>1 - 임원:</strong> 최상위 권한을 갖으며 모든 결정에 대한 권한이 있습니다.</li>
                <li><strong>2 - PM:</strong> 프로젝트 관리에 대한 주요 권한을 갖습니다.</li>
                <li><strong>3 - PL:</strong> 프로젝트 리더로 팀을 지휘합니다.</li>
                <li><strong>4 - 팀원:</strong> 일반적인 권한을 갖습니다.</li>
            </ul>
            <p>권한등급 값에 따라 결제 처리가 진행됩니다.<br/>필요에 따라 모든 팀원이 동일한 권한을 갖도록 설정할 수 있습니다.</p>
        </Box>
    );
}

export default function RoleModal({ open, onClose, roleList, setRoleList }: ModalProps) {
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isErrorModalOpen, setErrorModalOpen] = useState<boolean>(false);
    const [isSuccessModalOpen, setSuccessModalOpen] = useState<boolean>(false);
    const [roleLevel, setRoleLevel] = useState<number>(1);

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

    const handleAddRole = () => {
        const newRole = {
            roleName: '',
            roleLevel: roleLevel,
            description: ''
        };
        setRoleList([...roleList, newRole]);
        setRoleLevel(prevRoleLevel => prevRoleLevel + 1); // Increment roleLevel.
    };

    const handleRemoveRole = () => {
        const newList = [...roleList];
        if(newList.length > 0) {
            newList.pop();
            setRoleList(newList);
            setRoleLevel(prevRoleLevel => prevRoleLevel - 1); // Decrement roleLevel.
        }
    };


    const SuccessClose = () => {
        setSuccessModalOpen(false);
        onClose();
    };

    const handleProjectSave = async () => {
    }

    useEffect(() => {
        setRoleLevel(roleList.length + 1);
    }, [roleList]);

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
                            템플릿 역할 설정
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
                                    onClick={handleAddRole}
                                >
                                    권한추가
                                </Button>
                            </Box>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={tableHeaderStyles} align="center">권한등급</TableCell>
                                        <TableCell sx={tableHeaderStyles} align="center">직책명</TableCell>
                                        <TableCell sx={tableHeaderStyles} align="center">직책설명</TableCell>
                                        <TableCell sx={tableHeaderStyles} align="center">취소</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {roleList.map((role, index) => (
                                        <TableRow key={index} sx={{ height: '30px' }}>
                                            <TableCell sx={tableCellStyles} align="center" >
                                                {role.roleLevel} {/* Display the role level without allowing user input */}
                                            </TableCell>
                                            <TableCell sx={tableCellStyles} align="center" >
                                                <TextField
                                                    fullWidth
                                                    value={role.roleName}
                                                    onChange={(e) => {
                                                        const newList = [...roleList];
                                                        newList[index].roleName = e.target.value;
                                                        setRoleList(newList);
                                                    }}
                                                    sx={textFieldStyles}
                                                />
                                            </TableCell>
                                            <TableCell sx={tableCellStyles} align="center" >
                                                <TextField
                                                    fullWidth
                                                    value={role.description}
                                                    onChange={(e) => {
                                                        const newList = [...roleList];
                                                        newList[index].description = e.target.value;
                                                        setRoleList(newList);
                                                    }}
                                                    sx={textFieldStyles}
                                                />
                                            </TableCell>
                                            <TableCell sx={tableCellStyles} align="center">
                                                <IconButton onClick={() => handleRemoveRole()}>
                                                    <DeleteOutline />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {/* TODO: Tooltip 형식으로 변경해도 괜찮을듯 */}
                            <Collapse in={roleList.length === 0}>
                                <RoleDescription />
                            </Collapse>
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
                            onClick={handleProjectSave}
                        >
                            저장
                        </Button>
                    </Box>

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
