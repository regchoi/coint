import * as React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import {useEffect} from "react";
import axios from "../../../../../redux/axiosConfig";
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
import ProjectContext from "../../ProjectContext";

type Department = {
    idNum: number;
    departmentName: string;
    description: string;
    role: string;
};

interface DepartmentResponse {
    idNum: number;
    departmentName: string;
    description: string;
}

// props 정의
interface AddDepartmentTableProps {
    onClose: () => void;
}

function not(a: readonly number[], b: readonly number[]) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: readonly number[], b: readonly number[]) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

export default function AddDepartmentTable(props: AddDepartmentTableProps) {
    const [departments, setDepartments] = React.useState<Department[]>([]);
    const [projectUsers, setProjectUsers] = React.useState<Department[]>([]);
    const [checked, setChecked] = React.useState<readonly number[]>([]);
    const [filter, setFilter] = React.useState<string>('');
    const [selectedDepartment, setSelectedDepartment] = React.useState<string>('');
    const [roles, setRoles] = React.useState<Record<number, string>>({});
    const { onClose } = props;

    const context = React.useContext(ProjectContext);
    if (!context) {
        throw new Error("Cannot find ProjectProvider");
    }
    const { departmentsList, setDepartmentsList } = context;

    // Table Cell 공통 스타일
    const tableCellStyle = {
        width: '30px', height: '30px',
        border: "1px solid rgba(0, 0, 0, 0.12)",
        padding: "0px 10px",
        fontSize: "12px",
        textAlign: "center"
    }

    const leftChecked = intersection(checked, departments.map(dept => dept.idNum));
    const rightChecked = intersection(checked, departmentsList.map(dept => dept.idNum));

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

    const handleSave = () => {
    }

    // department, usergroup redux로 값 받아오기
    useEffect(() => {
        // 부서 목록 불러오기
        axios.get('/api/user/department')
            .then((response) => {
                const deptData = response.data.map((dept: DepartmentResponse) => ({
                    idNum: dept.idNum,
                    departmentName: dept.departmentName,
                    description: dept.description,
                }));
                setDepartments(deptData);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const filteredDepts = departments.filter
        (dept => dept.departmentName.includes(filter) && !departmentsList.some(deptList => deptList.idNum === dept.idNum));

    const handleMoveToProjectUsers = () => {
        const newDeptList = departmentsList.concat(departments.filter(departments => leftChecked.includes(departments.idNum)).map(dept => ({
            ...dept,
            role: ''
        })));
        const newDepts = departments.filter(dept => !leftChecked.includes(dept.idNum));
        setDepartmentsList(newDeptList);
        setDepartments(newDepts);
        setChecked(not(checked, leftChecked));
    };

    const handleMoveToUsers = () => {
        const newDepts = departments.concat(departmentsList.filter(dept => rightChecked.includes(dept.idNum)));
        const newDeptList = departmentsList.filter(dept => !rightChecked.includes(dept.idNum));
        setDepartments(newDepts);
        setDepartmentsList(newDeptList);
        setChecked(not(checked, rightChecked));
    };

    const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, idNum: number) => {
        const newProjectDepts = departmentsList.map(dept => {
            if (dept.idNum === idNum) {
                return {
                    ...dept,
                    role: event.target.value
                }
            }
            return dept;
        });
        setDepartmentsList(newProjectDepts);
    }

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(event.target.value);
    };

    const numberOfChecked = (items: readonly number[]) => intersection(checked, items).length;

    const customList = (title: React.ReactNode, departments: Department[]) => (
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
                    {title === 'Choices' ? "부서 조회" : "업무 참여부서"}
                    </span>
                    </Typography>
                }
                title={
                title === 'Choices' ?
                `(${numberOfChecked(departments.map((dept) => dept.idNum))}개 선택됨)` :
                    `(총 ${departments.length}개의 부서)`
            }
            />
            <Divider/>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell align="center" >부서</TableCell>
                            <TableCell align="center" >설명</TableCell>
                            {title === 'Chosen' && <TableCell align="center" >역할</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            departments.length === 0 &&
                            (
                                <TableRow>
                                    <TableCell colSpan={title === 'Chosen' ? 5 : 4} align="center">부서 정보가 없습니다.</TableCell>
                                </TableRow>
                            )

                        }
                        {departments.map((dept) => (
                            <TableRow
                                key={dept.idNum}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell padding="checkbox" align="center" >
                                    <Checkbox
                                        onClick={handleToggle(dept.idNum)}
                                        checked={checked.indexOf(dept.idNum) !== -1}
                                        inputProps={{ 'aria-labelledby': `user-${dept.idNum}` }}
                                    />
                                </TableCell>
                                <TableCell component="th" id={`user-${dept.idNum}`} scope="row" align="center" >
                                    {dept.departmentName}
                                </TableCell>
                                <TableCell align="center" >{dept.description}</TableCell>
                                {title === 'Chosen' && (
                                    <TableCell align="center" >
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            value={dept.role}
                                            sx={{
                                                '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#409aff',
                                                },
                                                '& .MuiInputBase-input': {
                                                    padding: 0,
                                                    fontSize: '14px',
                                                    height: '30px',
                                                    paddingLeft: '10px',
                                                    width: '50px',
                                                    backgroundColor: '#fff'
                                                }
                                            }}
                                            onChange={(event) => handleRoleChange(event, dept.idNum)}
                                        />
                                    </TableCell>
                                )}
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
                    <FormControl sx={{width: '100%'}}>
                        <InputLabel id="demo-simple-select-helper-label" sx={{fontSize: '14px'}}>부서검색</InputLabel>
                        <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            label="부서검색"
                            value={selectedDepartment}
                            onChange={(event) => setSelectedDepartment(event.target.value as string)}
                            sx={{ width: '100%', fontSize: '14px' }}
                        >
                            {departments.map((dept) => (
                                <MenuItem key={dept.idNum} value={dept.departmentName} sx={{ width: '100%', fontSize: '14px' }}>
                                    {dept.departmentName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                {customList('Choices', filteredDepts)}
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
                {customList('Chosen', departmentsList)}
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