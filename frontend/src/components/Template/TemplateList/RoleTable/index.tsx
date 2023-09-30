import React, {useContext, useState} from 'react';
import {Table, TableBody, TableCell, TableHead, TableRow, Box, TextField, IconButton, Button, Collapse} from '@mui/material';
import { AddCircleOutline, DeleteOutline } from '@mui/icons-material';
import ProjectContext from "../ProjectContext";
import AddIcon from "@mui/icons-material/Add";

// props로 project id를 받아옴
type RoleTableProps = {
    projectId: number
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

const RoleTable: React.FC<RoleTableProps> = ({ projectId }) => {
    const [roleLevel, setRoleLevel] = useState<number>(1);
    const context = React.useContext(ProjectContext);
    if (!context) {
        throw new Error("Cannot find ProjectProvider1");
    }
    const { rolesList, setRolesList } = context;

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
            projectId: projectId,
            roleName: '',
            roleLevel: roleLevel,
            description: ''
        };
        setRolesList([...rolesList, newRole]);
        setRoleLevel(prevRoleLevel => prevRoleLevel + 1); // Increment roleLevel.
    };

    const handleRemoveRole = () => {
        const newList = [...rolesList];
        if(newList.length > 0) {
            newList.pop();
            setRolesList(newList);
            setRoleLevel(prevRoleLevel => prevRoleLevel - 1); // Decrement roleLevel.
        }
    };

    return (
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
                    {rolesList.map((role, index) => (
                        <TableRow key={index} sx={{ height: '30px' }}>
                            <TableCell sx={tableCellStyles} align="center" >
                                {role.roleLevel} {/* Display the role level without allowing user input */}
                            </TableCell>
                            <TableCell sx={tableCellStyles} align="center" >
                                <TextField
                                    fullWidth
                                    value={role.roleName}
                                    onChange={(e) => {
                                        const newList = [...rolesList];
                                        newList[index].roleName = e.target.value;
                                        setRolesList(newList);
                                    }}
                                    sx={textFieldStyles}
                                />
                            </TableCell>
                            <TableCell sx={tableCellStyles} align="center" >
                                <TextField
                                    fullWidth
                                    value={role.description}
                                    onChange={(e) => {
                                        const newList = [...rolesList];
                                        newList[index].description = e.target.value;
                                        setRolesList(newList);
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
            <Collapse in={rolesList.length === 0}>
                <RoleDescription />
            </Collapse>
        </Box>
    );
};

export default RoleTable;
