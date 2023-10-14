import * as React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import {useEffect} from "react";
import axios from "../../../../redux/axiosConfig";
import {
    Box, FormControl,
    IconButton, InputLabel, MenuItem,
    Paper, Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';

type User = {
    templateTaskId: number;
    userId: number;
    templateRoleId: number;
}

interface AllUser {
    idNum: number;
    name: string;
    department: string;
    email: string;
    role: number;
}

type Role = {
    roleName: string;
    roleLevel: number;
    description: string;
}

type Department = {
    idNum: number;
    departmentName: string;
};

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

// props 정의
interface AddUserTableProps {
    onClose: () => void;
    userList: User[];
    setUserList: (userList: User[]) => void;
    rolesList: Role[];
    taskIdNum: number;
}

function not(a: readonly number[], b: readonly number[]) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: readonly number[], b: readonly number[]) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

export default function AddTaskUserTable(props: AddUserTableProps) {
    const [users, setUsers] = React.useState<AllUser[]>([]);
    const [usersList, setUsersList] = React.useState<AllUser[]>([]);
    const [departments, setDepartments] = React.useState<Department[]>([]);
    const [checked, setChecked] = React.useState<readonly number[]>([]);
    const [filter, setFilter] = React.useState<string>('');
    const [selectedDepartment, setSelectedDepartment] = React.useState<string>('');
    const [roles, setRoles] = React.useState<Record<number, string>>({});
    const { onClose, userList, setUserList, rolesList, taskIdNum } = props;
    
    // Table Cell 공통 스타일
    const tableCellStyle = {
        width: '30px', height: '30px',
        border: "1px solid rgba(0, 0, 0, 0.12)",
        padding: "0px 10px",
        fontSize: "12px",
        textAlign: "center"
    }

    const leftChecked = intersection(checked, users.map(user => user.idNum));
    const rightChecked = intersection(checked, usersList.map(user => user.idNum));

    const handleToggle = (value: number) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    // department, usergroup redux로 값 받아오기
    useEffect(() => {
        // 사용자 목록 불러오기
        axios.get('/api/user')
            .then((response) => {
                const userData = response.data.map((userData: UserResponse) => ({
                    idNum: userData.idNum,
                    name: userData.name || '',  // handle the potential null value
                    department: userData.getUserDepartmentResList.length > 0 ? userData.getUserDepartmentResList[0].departmentName : '부서 미배정',
                    email: userData.email || '',  // handle the potential null value
                }));

                // type User에서 AllUser 타입으로 변환
                const newUsersList = userList.map(user => ({
                    idNum: user.userId,
                    name: userData.find(userData => userData.idNum === user.userId)?.name || '',
                    department: userData.find(userData => userData.idNum === user.userId)?.department || '',
                    email: userData.find(userData => userData.idNum === user.userId)?.email || '',
                    role: user.templateRoleId
                }));
                setUsersList(newUsersList);

                // usersList에 있는 사용자는 제외하고 setUsers 구성
                userList.forEach(user => {
                    userData.splice(userData.findIndex(userData => userData.idNum === user.userId), 1);
                });

                setUsers(userData);
            })
            .catch((error) => {
                console.log(error);
            });

        // 부서 목록 불러오기
        axios.get('/api/user/department')
            .then((response) => {
                const deptData = response.data.map((dept: any) => ({
                    idNum: dept.idNum,
                    departmentName: dept.departmentName
                }));
                setDepartments(deptData);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const filteredUsers = users.filter(
        (user) =>
            (!selectedDepartment || user.department === selectedDepartment) &&
            !usersList.some(listUser => listUser.idNum === user.idNum) &&
            user.name &&
            user.name.toLowerCase().includes(filter.toLowerCase())
    );

    const handleMoveToProjectUsers = () => {
        const newUsersList = usersList.concat(users.filter(user => leftChecked.includes(user.idNum)).map(user => ({
            ...user,
            role: 1
        })));
        const newUsers = users.filter(user => !leftChecked.includes(user.idNum));
        setUsersList(newUsersList);
        setUsers(newUsers);
        setChecked(not(checked, leftChecked));
    };

    const handleMoveToUsers = () => {
        const newUsers = users.concat(usersList.filter(user => rightChecked.includes(user.idNum)));
        const newUsersList = usersList.filter(user => !rightChecked.includes(user.idNum));
        setUsers(newUsers);
        setUsersList(newUsersList);
        setChecked(not(checked, rightChecked));
    };

    useEffect(() => {
        const updatedUsers = usersList.map(user => ({
                templateTaskId: taskIdNum,
                userId: user.idNum,
                templateRoleId: user.role
            }));
        setUserList(updatedUsers);
    }, [usersList]);

    const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>, idNum: number) => {
        const newProjectUsers = usersList.map(user => {
            if (user.idNum === idNum) {
                return {
                    ...user,
                    role: event.target.value
                }
            }
            return user;
        });
        setUsersList(newProjectUsers);
    }

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(event.target.value);
    };

    const numberOfChecked = (items: readonly number[]) => intersection(checked, items).length;

    const customList = (title: React.ReactNode, users: AllUser[]) => (
        <Card>
            <CardHeader
                avatar={
                    <Typography variant="h6"
                                component={"div"}
                                sx={{
                                    mt: 2,
                                    mb: 2,
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                    <span>
                    {title === 'Choices' ? "사용자 조회" : "프로젝트 참여인원"}
                    </span>
                    </Typography>
                }
                title={
                title === 'Choices' ?
                `(${numberOfChecked(users.map((user) => user.idNum))}명 선택됨)` :
                    `(총 ${users.length}명 참여)`
            }
            />
            <Divider/>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell align="center" >이름</TableCell>
                            <TableCell align="center" >부서</TableCell>
                            {title === 'Chosen' && <TableCell align="center" >역할</TableCell>}
                            <TableCell align="center" >이메일</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            users.length === 0 &&
                            (
                                <TableRow>
                                    <TableCell colSpan={title === 'Chosen' ? 5 : 4} align="center">사용자 정보가 없습니다.</TableCell>
                                </TableRow>
                            )

                        }
                        {users.map((user) => (
                            <TableRow
                                key={user.idNum}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell padding="checkbox" align="center" >
                                    <Checkbox
                                        onClick={handleToggle(user.idNum)}
                                        checked={checked.indexOf(user.idNum) !== -1}
                                        inputProps={{ 'aria-labelledby': `user-${user.idNum}` }}
                                    />
                                </TableCell>
                                <TableCell component="th" id={`user-${user.idNum}`} scope="row" align="center" >
                                    {user.name}
                                </TableCell>
                                <TableCell align="center" >{user.department}</TableCell>
                                {title === 'Chosen' && (
                                    <TableCell align="center" >
                                        {/* rolesList에서 Select를 통해 Role을 선택하는 방식으로 변경 */}
                                        <Select
                                            fullWidth
                                            variant="outlined"
                                            value={user.role}
                                            onChange={(event) => handleRoleChange(event, user.idNum)}
                                            sx={{
                                                width: '100%',
                                                height: '30px',
                                                fontSize: '14px',
                                            }}
                                        >
                                            {rolesList && rolesList.map((role) => (
                                                <MenuItem key={role.roleLevel} value={role.roleLevel}>
                                                    {role.roleName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </TableCell>
                                )}
                                <TableCell align="center" >{user.email}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    );


    return (
        <Grid container spacing={2} justifyContent="flex-start" alignItems="center">
            <Grid container xs={8} sx={{mt: 3, pl: 2}} direction="row">
                <Grid item xs={4}>
                    <FormControl sx={{ position: 'relative', width: '100%' }}>
                        <InputLabel id="demo-simple-select-helper-label" sx={{fontSize: '14px'}}>부서검색</InputLabel>
                        <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            label="부서검색"
                            value={selectedDepartment}
                            onChange={(event) => setSelectedDepartment(event.target.value as string)}
                            sx={{
                                width: '100%',
                                fontSize: '14px',
                            }}
                        >
                            {departments.map((dept) => (
                                <MenuItem key={dept.idNum} value={dept.departmentName} sx={{ width: '100%', fontSize: '14px' }}>
                                    {dept.departmentName}
                                </MenuItem>
                            ))}
                        </Select>
                        {selectedDepartment && (
                            <IconButton
                                size="small"
                                sx={{
                                    position: 'absolute',
                                    right: '25px',
                                    top: '50%',
                                    transform: 'translateY(-50%)'
                                }}
                                onClick={() => setSelectedDepartment('')}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        )}
                    </FormControl>
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="사용자검색"
                        value={filter}
                        onChange={handleFilterChange}
                        placeholder="이름을 입력해주세요"
                        InputProps={{
                            style: { fontSize: '14px', backgroundColor: 'transparent' }
                        }}
                        InputLabelProps={{
                            style: { fontSize: '14px' },
                        }}
                    />
                </Grid>
            </Grid>
            <Grid item xs={12}>
                {customList('Choices', filteredUsers)}
            </Grid>

            {/* Middle buttons */}
            <Grid item xs={12}>
                <Grid container direction="row" alignItems="center" justifyContent="center" spacing={2}>
                    <Grid item xs={6}>
                        <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={handleMoveToProjectUsers}
                                disabled={leftChecked.length === 0}
                                aria-label="move selected right"
                            >
                                <KeyboardDoubleArrowDownIcon/>
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={handleMoveToUsers}
                                disabled={rightChecked.length === 0}
                                aria-label="move selected left"
                            >
                                <KeyboardDoubleArrowUpIcon/>
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12}>
                {customList('Chosen', usersList)}
            </Grid>

            <Grid item xs={12} container justifyContent="flex-end">
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
            </Grid>
        </Grid>
    );
}